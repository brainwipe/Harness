define(
[
    "harness/harness",
    "harness/views/templaterender",
    "text!harness/views/templates/validationbrowser.html",
    "stringlib"
],
function (Harness, TemplateRender, ValidationBrowserTemplate) {

   function ValidationBrowser() {
	}

	ValidationBrowser.prototype.MessagesElement = null;
	ValidationBrowser.prototype.MenuItemElement = null;
	ValidationBrowser.prototype.MessageCount = 0;
	ValidationBrowser.prototype.CreateMarkup = function() {

		harness.Element.append(new TemplateRender().Render(ValidationBrowserTemplate, {}));

		this.MessagesElement = $('#validationMessages');
		this.MenuItemElement = $('#validationMenuItem');
	};

	ValidationBrowser.prototype.Clear = function()
	{
		this.MessagesElement.html("");
		this.MessageCount = 0;
		this.MenuItemElement.html('Validation');
		this.MenuItemElement.removeClass('navbar-warning');
	};

	ValidationBrowser.prototype.AddMessage = function(ex)
	{
		var template = '<div class="message">' +
							'<h3>{0}</h3>' +
							'{1}' +
                     '</div>';
		this.MessagesElement.append(
			template.format(
					ex.Name,
					ex.Message
				));

		this.MessageCount++;
		this.MenuItemElement.html('Validation ({0})'.format(this.MessageCount));
		this.MenuItemElement.addClass('navbar-warning');
	};

	ValidationBrowser.prototype.NoErrorsFound = function()
	{
		this.MessagesElement.html("<h3>Validated OK!</h3>The model is valid, you can now run the simulation.");
	};

   ValidationBrowser.prototype.NoBlocksFound = function()
   {
      this.MessagesElement.html("<h3>No blocks</h3> There are no blocks in the model. The simulation needs blocks to run. Use the Blocks menu item to start adding blocks.");
   };

	return(ValidationBrowser);
  });