define(
[
	"harness/model/entities/Block",
	"harness/model/entities/Socket"
],

function(Block, Socket) {

	function BruteForceEngine() {}

	BruteForceEngine.prototype.Tick = function(keys, blocks) {
		var blocksComplete = false;
		var index = 0;
		var blockCount = keys.length;
		var completedCount = 0;

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
	};

	BruteForceEngine.prototype.ResetBlocks = function(blocks) {
		for(var i in blocks) {
			blocks[i].Reset();
		}
	};

	BruteForceEngine.prototype.ResetSockets = function(blocks)
	{
		for(var i in blocks) {
			var block = blocks[i];
			for(var j in block.Inputs)
			{
				block.Inputs[j].IsReady = false;
			}
		}
	}

	BruteForceEngine.prototype.AreInputSocketsReady = function(block) {
		for(var i in block.Inputs) {
			var input = block.Inputs[i];

			if (input.IsRequired === true) {
				if (input.IsReady === false) {
					return false;
				}
			}
		}
		return true;
	};

	BruteForceEngine.prototype.PropagateOutputs = function(block) {
		for(var i in block.Outputs) {
			var output = block.Outputs[i];

			for(var j in output.Connectors) {
				var connector = output.Connectors[j];
				connector.To.Data = connector.From.Data;
				connector.To.IsReady = true;
			}
		}
	};

	return (BruteForceEngine);

});