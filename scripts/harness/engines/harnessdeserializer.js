define(
[
	'harness/model/blockfactory'
],

function(BlockFactory) {

	function HarnessDeSerializer() {
		this.BlockFactory = new BlockFactory();
		this.BlockIdMap = {};
	}

	HarnessDeSerializer.prototype.BlockFactory = null;
	HarnessDeSerializer.prototype.BlockIdMap = null;

	HarnessDeSerializer.prototype.JSONToHarness = function(harness, jsonString) {
		var jsonParsed = JSON.parse(jsonString);

		harness.Name = jsonParsed.Name;
		this.BuildBlocks(harness, jsonParsed.Blocks);
		this.BuildConnectors(harness, jsonParsed.Connectors);

		harness.Validate();
		harness.Update();

		return harness;
	};

	HarnessDeSerializer.prototype.BuildBlocks = function(harness, blocks) {

		for (var key in blocks)
		{
			var blockJSON = blocks[key];
			var blockFactory = this.BlockFactory.Factories[blockJSON.Factory];
			var block = blockFactory.Build(harness.GetNextBlockId());
			var view = blockFactory.GetView(block);

			var newblock = harness.AddBlock(block, view);
			this.MapBlockIds(blockJSON.Id, newblock.Id);

			this.SetupView(view, blockJSON.View);
		}
	};

	HarnessDeSerializer.prototype.SetupView = function(view, viewJSON) {
		view.Base.Element.offset({ top: viewJSON.Lop, left: viewJSON.Left});
		view.Base.Element.children(".ui-resizable").width(viewJSON.Width);
		view.Base.Element.children(".ui-resizable").height(viewJSON.Height);

		return view;
	};

	HarnessDeSerializer.prototype.MapBlockIds = function(oldBlockId, newBlockId) {
		this.BlockIdMap[oldBlockId] = newBlockId;
	};

	HarnessDeSerializer.prototype.BuildConnectors = function(harness, connectors)
	{
		for (var i in connectors) {
			var connector = connectors[i];
			var fromBlockAndSocket = harness.GetBlockAndSocketFromId(connector.from);
			var toBlockAndSocket = harness.GetBlockAndSocketFromId(connector.to);

			harness.ConnectSocketAndBlock(
				this.BlockIdMap[fromBlockAndSocket.Block],
				fromBlockAndSocket.Socket,
				this.BlockIdMap[toBlockAndSocket.Block],
				toBlockAndSocket.Socket
				);
		}
	};

	return (HarnessDeSerializer);
});