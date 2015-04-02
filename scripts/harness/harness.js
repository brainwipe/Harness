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
		if (elementId === undefined || elementId.length === 0) { return null; }
		var parts = elementId.split('-');
		return this.Blocks[parts[0]];
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
		return block;
	};
	Harness.prototype.DeleteBlock = function(blockId) {
		this.Views[blockId].Element.remove();
		delete this.Views[blockId];
		this.Blocks[blockId].DeleteConnections();
		delete this.Blocks[blockId];
		this.Validate();
	};
	Harness.prototype.ConnectSockets = function (outputSocketId, inputSocketId)	{
		var outputInfo = this.GetBlockAndSocketFromId(outputSocketId);
		var inputInfo = this.GetBlockAndSocketFromId(inputSocketId);
		var connector = null;
		try
		{
			connector = this.ConnectSocketAndBlock(outputInfo.Block, outputInfo.Socket, inputInfo.Block, inputInfo.Socket);
		}
		catch (message)
		{
			notify.Info("Could not connect blocks", message);
		}

		this.Validate();
		return connector;
	};
	Harness.prototype.ConnectSocketAndBlock = function (outputBlockName, outputSocketName, inputBlockName, inputSocketName) {
		var outputSocket = this.Blocks[outputBlockName].Outputs[outputSocketName];
		var inputSocket = this.Blocks[inputBlockName].Inputs[inputSocketName];

		var connector = outputSocket.Connect(inputSocket);
		return connector;
	};
	Harness.prototype.GetBlockAndSocketFromId = function(socketId) {
		var parts = socketId.split('-');
		return { "Block" : parts[0], "Socket" : parts[3] };
	};

	Harness.prototype.RemoveConnector = function(connectorToRemove) {
		connectorToRemove.From.Disconnect(connectorToRemove);
		connectorToRemove.To.Disconnect(connectorToRemove);
		connectorToRemove = null;

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




