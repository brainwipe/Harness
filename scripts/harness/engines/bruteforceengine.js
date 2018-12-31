export default class {
	Tick(keys, blocks) {
		var blocksComplete = false;
		var index = 0;
		var blockCount = keys.length;
		var completedCount = 0;

		if (blockCount === 0)
		{
			console.log("Brute Force Engine won't run, there are no blocks")
			return;
		}

		this.ResetSockets(blocks);
		this.ResetBlocks(blocks);

		while (blocksComplete === false) {
			var key = keys[index];
			var block = blocks[key];

			if (block.Completed === false)
			{
				completedCount = 0;
				var inputSocketsReady = this.AreInputSocketsReady(block);

				if (inputSocketsReady === true) {
					block.ExecuteAll();

					this.PropagateOutputs(block);
				}
			}
			else
			{
				++completedCount;
			}

			if (completedCount === blockCount) {
				blocksComplete = true;
			}

			if (index === (blockCount - 1)) {
				index = 0;
			}
			else {
				index++;
			}
		}
	}

	ResetBlocks(blocks) {
		blocks.map(b => b.Reset());
	}

	ResetSockets(blocks)
	{
		for(var i in blocks) {
			var block = blocks[i];
			for(var j in block.Inputs)
			{
				block.Inputs[j].IsReady = false;
			}
		}
	}

	AreInputSocketsReady(block) {
		for(var i in block.Inputs) {
			var input = block.Inputs[i];

			if (input.IsRequired === true) {
				if (input.IsReady === false) {
					return false;
				}
			}
		}
		return true;
	}

	PropagateOutputs(block) {
		for(var i in block.Outputs) {
			var output = block.Outputs[i];

			for(var j in output.Connectors) {
				var connector = output.Connectors[j];
				connector.To.Data = connector.From.Data;
				connector.To.IsReady = true;
			}
		}
	}
}