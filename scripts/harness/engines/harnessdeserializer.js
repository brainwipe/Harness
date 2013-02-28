define(
[
	'harness/model/blockfactory'
],

function(BlockFactory) {

	function HarnessDeSerializer() { 
		this.BlockFactory = new BlockFactory();
	};

	HarnessDeSerializer.prototype.BlockFactory = null;

	HarnessDeSerializer.prototype.JSONToHarness = function(harness, jsonString) {
		var jsonParsed = JSON.parse(jsonString);

		harness.Name = jsonParsed.Name;
		this.BuildBlocks(harness, jsonParsed.Blocks);

		return harness;
	};

	HarnessDeSerializer.prototype.BuildBlocks = function(harness, blocks) {

		for (var key in blocks)
		{
			var blockJSON = blocks[key];
			var blockFactory = this.BlockFactory.Factories[blockJSON.Factory];
			var block = blockFactory.Build(blockJSON.Id);
			var view = blockFactory.GetView(block);

			harness.AddBlock(block, view);

			this.SetupView(view, blockJSON.View);
		}
	};

	HarnessDeSerializer.prototype.SetupView = function(view, viewJSON) {
		view.Base.Element.offset({ top: viewJSON.Lop, left: viewJSON.Left});
		view.Base.Element.width(viewJSON.Width);
		view.Base.Element.height(viewJSON.Height);

		return view;
	};

	return (HarnessDeSerializer)
});