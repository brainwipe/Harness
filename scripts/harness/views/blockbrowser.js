import TemplateRender from "./templaterender.js"
import BlockBrowserTemplate from "./templates/blockbrowsertemplate.js"
import BlockBrowserItemTemplate from "./templates/blockbrowseritemtemplate.js"

export default class {
	constructor(harness) {
		this.Harness = harness;
		this.BlocksRelativePath = "./scripts/harness/blocks/";
	}
	
	GetBlocks()	{
		console.log(this.Harness.BlockRegistry);
		for (var i in this.Harness.BlockRegistry.BlockDefinitions)
		{
			var factory = this.Harness.BlockRegistry.BlockDefinitions[i];

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
	}

	GetIconPath(block) {
		var blockFunctionName = block.name.toLowerCase();

		return this.BlocksRelativePath + blockFunctionName + "/icon.svg#" + blockFunctionName + "-icon";
	}

	BlockListItem(id, blockBuilder)	{
		var iconPath = this.GetIconPath(blockBuilder);

		return BlockBrowserItemTemplate(
			blockBuilder.CssClass, 
			blockBuilder.Type, 
			iconPath, 
			blockBuilder.FriendlyName,
			id);
	}

	CreateMarkup() {
		$("body").append(
			new TemplateRender().Render(BlockBrowserTemplate, {}));
	}
}