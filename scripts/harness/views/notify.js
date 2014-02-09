define(
[
	"harness/views/templaterender",
	"text!harness/views/templates/notify.html"
],
function (TemplateRender, NotifyTemplate) {

   function Notify() {}

	Notify.prototype.Markup = '';
	Notify.prototype.Clear = function()
	{
		$('#notify').remove();
	};

	Notify.prototype.Info = function(title, message)
	{
		this.Clear();

		harness.Element.append(
			new TemplateRender().Render(NotifyTemplate, {"title": title, "message": message})
			);
	};

   return (Notify);

 });