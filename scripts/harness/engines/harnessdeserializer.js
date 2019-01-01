import BlockRegistry from "/scripts/harness/model/blockregistry.js"

export default class {
	constructor() {
		this.BlockRegistry = new BlockRegistry();
		this.BlockIdMap = {}
	}

	JSONToHarness(harness, jsonString) {
		var jsonParsed = JSON.parse(jsonString);

		harness.Name = jsonParsed.Name;
		this.BuildBlocks(harness, jsonParsed.Blocks);
		this.BuildConnectors(harness, jsonParsed.Connectors);

		harness.Validate();
		harness.Painter.Repaint();

		return harness;
	}

	BuildBlocks(harness, blocks) {

		for (var key in blocks)
		{
			var blockJSON = blocks[key];

			var block = this.BlockRegistry.CreateBlockFromJSON(harness, blockJSON);
			this.MapBlockIds(blockJSON.Id, block.Id);
		}
	}

	MapBlockIds(oldBlockId, newBlockId) {
		this.BlockIdMap[oldBlockId] = newBlockId;
	}

	BuildConnectors(harness, connectors)
	{
		for (var i in connectors) {
			var connector = connectors[i];
			harness.Painter.ConnectSockets(connector.from, connector.to);
		}
	}
}