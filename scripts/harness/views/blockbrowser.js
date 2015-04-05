define(
[
	'harness/harness',
	'harness/model/blockregistry',
	'harness/views/templaterender',
	'text!harness/views/templates/blockbrowser.html',
	'text!harness/views/templates/blockbrowseritem.html'
],

function(Harness, BlockRegistry, TemplateRender, BlockBrowserTemplate, BlockBrowserItemTemplate) {

	function BlockBrowser(harness) {
		this.Harness = harness;
	}
	BlockBrowser.prototype.Harness = null;
	BlockBrowser.prototype.GetBlocks = function()
	{
		for (var i in this.Harness.BlockRegistry.BlockDefinitions)
		{
			var factory = new this.Harness.BlockRegistry.BlockDefinitions[i]();

			var block = "";
			if (factory.Type === "Source")
			{
				block = "#sources";
			}
			else if (factory.Type === "Sink")
			{
				block = "#sinks";
			}
			else if (factory.Type === "Function")
			{
				block = "#functions";
			}

			$(block).append(
				this.BlockListItem(i, factory));
		}

		$('.chooser_block').draggable({
								helper:'clone',
								appendTo: 'body',
								containment: 'document',
								zIndex: 1500
							});
	};

	BlockBrowser.prototype.BlockListItem = function(id, blockBuilder)
	{
		var iconPath = blockBuilder.GetView().GetIconPath();

		var data = {
			"CssClass": blockBuilder.CssClass,
			"FriendlyName": blockBuilder.FriendlyName,
			"BlockType": blockBuilder.Type,
			"BlockId" : id,
			"IconPath" : iconPath
		};

		return new TemplateRender().Render(BlockBrowserItemTemplate, data);
	};

	BlockBrowser.prototype.CreateMarkup = function() {
		harness.Element.append(
			new TemplateRender().Render(BlockBrowserTemplate, {}));
	};

	return (BlockBrowser);

});