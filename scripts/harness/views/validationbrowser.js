define(
[
    "jquery",
    "jquery-ui",
    "harness/Harness"

],
function ($, jqueryui, Harness) {

   function ValidationBrowser(harness) {
      this.Harness = harness;
	}

   ValidationBrowser.prototype.Harness = null;
	ValidationBrowser.prototype.MessagesElement = null;
	ValidationBrowser.prototype.CreateMarkup = function() {
		harness.Element.append('<div class="modal fade" id="validationModal">' +
            '<div class="modal-header">' +
                '<button class="close" data-dismiss="modal">×</button>' +
                '<h3>Validation Messages</h3>' +
                '</div>' +
                '<div class="modal-body">' +
				'<div id="validationMessages"></div>' +
                '</div>' +
                '<div class="modal-footer">' +
				'<a href="#" data-dismiss="modal" class="btn">Close</a>' +
			'</div>' +
		'</div>');

		this.MessagesElement = $('#validationMessages');
	};

	ValidationBrowser.prototype.Clear = function()
	{
		this.MessagesElement.html("");
	};

	ValidationBrowser.prototype.AddMessage = function(ex)
	{
		this.MessagesElement.append('<div class="message">' +
				'<h3>{0}</h3>' +
				'{1}' +
            '</div>'.format(
				ex.Name,
				ex.Element
				));
	};

	return(ValidationBrowser);
  });