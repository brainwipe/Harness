define(
[
	"jquery",
	"underscore"
],
function($, _) {

	function Harness (containerElement)
	{
		this.Name = "Test Harness " + new Date().getTime();
		this.Blocks = {};
		this.Views = {};
		this.Element = containerElement;
		this.Canvas = $("#raih_bg")[0];
		this.Context = this.Canvas.getContext("2d");
		this.NextBlockIdNumber = 0;
		window.addEventListener('resize', function() {harness.ResizeCanvas();}, false);

	}
	Harness.prototype.Name = null;
	Harness.prototype.Blocks = null;
	Harness.prototype.View = null;
	Harness.prototype.BlockFactory = null;
	Harness.prototype.Canvas = null;
	Harness.prototype.Context = null;
	Harness.prototype.Element = null;
	Harness.prototype.Engine = null;
	Harness.prototype.Painter = null;
	Harness.prototype.ValidationEngine = null;
	Harness.prototype.GetNextBlockId = function() {
		return ++this.NextBlockIdNumber;
	};
	Harness.prototype.GetBlockFromAnyId = function(elementId) {
		if (elementId === undefined || elementId.length === 0) { return null; }
		var parts = elementId.split('-');
		return this.Blocks[parts[0]];
	};
	Harness.prototype.AddBlock = function (block, view) {
		this.Views[block.Id] = view;
		view.CreateMarkup(this.Element);
		this.Blocks[block.Id] = block;
		this.Update();
		this.Validate();
		return block;
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
		this.Update();
		return connector;
	};
	Harness.prototype.ConnectSocketAndBlock = function (outputBlockName, outputSocketName, inputBlockName, inputSocketName) {
		var outputSocket = this.Blocks[outputBlockName].Outputs[outputSocketName];
		var inputSocket = this.Blocks[inputBlockName].Inputs[inputSocketName];

		var connector = outputSocket.Connect(inputSocket);
		this.Painter.BuildBoundingBox(connector);
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
	Harness.prototype.Update = function () {
		this.Painter.Update(this.Views, this.Blocks);
	};
	Harness.prototype.Tick = function () {
		this.Engine.Tick(this.BlockIds(), this.Blocks);
	};
	Harness.prototype.MouseMove = function (event) {
		this.Painter.Update(harness.Views, harness.Blocks, event.pageX, event.pageY);
	};
	Harness.prototype.BlocksMoved = function ()	{
		this.Painter.RebuildBoundingBoxes(harness.Blocks);
		this.Update();
	};
	Harness.prototype.ResizeCanvas = function() {
		this.Canvas.width = window.innerWidth;
		this.Canvas.height = window.innerHeight;
		this.Update();
	};
	Harness.prototype.KeyDown = function(event) {
		if (event.which === 46 &&
			this.Painter.HighlightedConnector != null)
		{
			this.RemoveConnector(this.Painter.HighlightedConnector);
			this.Update();
		}
	};

	return (Harness);

});




