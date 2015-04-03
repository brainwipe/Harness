define(
[
	'harness/model/blockregistry'
],

function(BlockRegistry) {

	function HarnessDeSerializer() {
		this.BlockRegistry = new BlockRegistry();
		this.BlockIdMap = {};
	}

	HarnessDeSerializer.prototype.BlockRegistry = null;
	HarnessDeSerializer.prototype.BlockIdMap = null;

	HarnessDeSerializer.prototype.JSONToHarness = function(harness, jsonString) {
		var jsonParsed = JSON.parse(jsonString);

		harness.Name = jsonParsed.Name;
		this.BuildBlocks(harness, jsonParsed.Blocks);
		this.BuildConnectors(harness, jsonParsed.Connectors);

		harness.Validate();
		harness.Painter.Repaint();

		return harness;
	};

	HarnessDeSerializer.prototype.BuildBlocks = function(harness, blocks) {

		for (var key in blocks)
		{
			var blockJSON = blocks[key];

			var block = this.BlockRegistry.CreateBlockFromJSON(harness, blockJSON);
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
			harness.Painter.ConnectSockets(connector.from, connector.to);
		}
	};

	return (HarnessDeSerializer);
});