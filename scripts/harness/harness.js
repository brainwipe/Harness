define(
[],
function() {

	function Harness (containerElement)
	{
		this.Name = "Test Harness " + new Date().getTime();
		this.Blocks = {};
		this.Views = {};
		this.Element = containerElement;
		this.NextBlockIdNumber = 0;
		this.TickRunWait = 10;
	}

	Harness.prototype.Name = null;
	Harness.prototype.Blocks = null;
	Harness.prototype.View = null;
	Harness.prototype.BlockRegistry = null;
	Harness.prototype.Element = null;
	Harness.prototype.Engine = null;
	Harness.prototype.Painter = null;
	Harness.prototype.ValidationEngine = null;
	Harness.prototype.IsRunning = false;
	Harness.prototype.TickRunWait = 0;
	Harness.prototype.GetNextBlockId = function() {
		return ++this.NextBlockIdNumber;
	};
	Harness.prototype.GetBlockFromAnyId = function(elementId) {
		var parts = elementId.split('-');
		var blockId = parts[0];

		if (!this.Blocks.hasOwnProperty(blockId))
		{
			throw "Block with the id '" + blockId + "' in the elementId '" + elementId + "' could not be found.";
		}

		return this.Blocks[blockId];
	};
	Harness.prototype.GetBlockViewFromAnyId = function(elementId) {
		var block = this.GetBlockFromAnyId(elementId);
		if (block === null) { return null; }
		return this.Views[block.Id];
	};
	Harness.prototype.Reset = function() {
		for (var block in this.Blocks)
		{
			this.DeleteBlock(block);
		}
		this.NextBlockIdNumber = 0;
		this.Name = "Test Harness " + new Date().getTime();
	};
	Harness.prototype.AddBlock = function (block, view) {
		this.Views[block.Id] = view;
		this.Blocks[block.Id] = block;
		this.Validate();
		harness.Painter.JsPlumb.repaintEverything();
		return block;
	};
	Harness.prototype.DeleteBlock = function(blockId) {
		this.Views[blockId].Element.remove();
		delete this.Views[blockId];

		this.Painter.DeleteConnections(this.Blocks[blockId].Inputs, this.Blocks[blockId].Outputs);
		this.Blocks[blockId].DeleteConnections();
		delete this.Blocks[blockId];
		this.Validate();
	};
	Harness.prototype.ConnectSockets = function (outputSocketId, inputSocketId)	{
		var outputInfo = this.GetBlockAndOutputSocketFromId(outputSocketId);
		var inputInfo = this.GetBlockAndInputSocketFromId(inputSocketId);
		var connector = null;
		try
		{
			connector = outputInfo.Socket.Connect(inputInfo.Socket);
		}
		catch (message)
		{
			notify.Info("Could not connect blocks", message);
		}

		this.Validate();
		return connector;
	};
	
	Harness.prototype.GetBlockAndInputSocketFromId = function(fullyQualifiedSocketId) {
		var block = this.GetBlockFromAnyId(fullyQualifiedSocketId);
		var parts = fullyQualifiedSocketId.split('-');
		return { "Block" : block, "Socket" : block.Inputs[parts[3]] };
	};

	Harness.prototype.GetBlockAndOutputSocketFromId = function(fullyQualifiedSocketId) {
		var block = this.GetBlockFromAnyId(fullyQualifiedSocketId);
		var parts = fullyQualifiedSocketId.split('-');
		return { "Block" : block, "Socket" : block.Outputs[parts[3]] };
	};

	Harness.prototype.RemoveConnector = function(outputSocketId, inputSocketId) {

		var outputInfo = this.GetBlockAndOutputSocketFromId(outputSocketId);
		var inputInfo = this.GetBlockAndInputSocketFromId(inputSocketId);

		outputInfo.Socket.Disconnect(inputInfo.Socket.Id);
		inputInfo.Socket.Disconnect(outputInfo.Socket.Id);
		
		this.Validate();
	};
	Harness.prototype.BlockIds = function() {
		var ids = [];
		var blocks = this.Blocks;
		for(var id in blocks)
		{
			if(blocks.hasOwnProperty(id)) {
				ids.push(id);
			}
		}
		return ids;
	};
	Harness.prototype.Validate = function() {
		return this.ValidationEngine.Validate(this.Blocks);
	};
	Harness.prototype.Tick = function () {
		this.Engine.Tick(this.BlockIds(), this.Blocks);
		this.Painter.RedrawBlocks(this.Blocks, this.Views);
	};
	Harness.prototype.TickAndContinue = function ()	{
		harness.Tick();
		if (harness.IsRunning) {
			setTimeout(harness.TickAndContinue,	harness.TickRunWait);
		}
	};
	Harness.prototype.Start = function() {
		this.IsRunning = true;
		this.TickAndContinue();
	};
	Harness.prototype.Stop = function() {
		this.IsRunning = false;
	};

	return (Harness);
});




