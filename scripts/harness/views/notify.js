define(
[
    "stringlib"
],
function () {

   function Notify() {}

	Notify.prototype.Markup = '<div id="notify" class="alert alert-block {0}"><button type="button" class="close" data-dismiss="alert">&times;</button><h4>{1}</h4><span>{2}</span></div>';
	Notify.prototype.Clear = function()
	{
		$('#notify').remove();
	};

	Notify.prototype.Info = function(title, message)
	{
		this.Clear();
		harness.Element.append(
			this.Markup.format('', title, message)
			);
	};

   return (Notify);

 });