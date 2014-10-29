define(
[
	'harness/model/BlockFactory'
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

			var block = this.BlockFactory.CreateBlockFromJSON(harness, blockJSON);
			this.MapBlockIds(blockJSON.Id, block.Id);
		}
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