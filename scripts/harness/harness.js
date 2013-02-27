define(
[
	"jquery",
	"underscore",
	"harness/model/blockfactory",
	"harness/model/validationengine"
],
function($, _, BlockFactory, ValidationEngine) {

	function Harness (containerElement)
	{
		this.Blocks = new Object();
		this.Element = containerElement;
		this.Canvas = $("#raih_bg")[0];
		this.Context = this.Canvas.getContext("2d");
		this.BlockTypes = new Array();
		this.NextBlockIdNumber = 0;
		window.addEventListener('resize', function() {harness.ResizeCanvas();}, false);
	}
	Harness.prototype.Blocks = null;
	Harness.prototype.BlockFactory = null;
	Harness.prototype.Canvas = null;
	Harness.prototype.Context = null;
	Harness.prototype.Element = null;
	Harness.prototype.Engine = null;
	Harness.prototype.Painter = null;
	Harness.prototype.ValidationEngine = null;
	Harness.prototype.GetNextBlockId = function() {
		return ++this.NextBlockIdNumber;
	}
	Harness.prototype.GetBlockFromAnyId = function(elementId) {
		if (elementId == undefined || elementId.length == 0) { return null; }
		var parts = elementId.split('-');
		return this.Blocks[parts[0]];
	}
	Harness.prototype.AddBlock = function (block) {
		block.Painter.CreateMarkup(this.Element, block.Id);
		this.Blocks[block.Id] = block; 
		this.Update();
		this.Validate();
		return block;
	};
	Harness.prototype.ConnectSockets = function (outputSocketId, inputSocketId)	{
		var outputInfo = outputSocketId.split('-'); 
		var inputInfo = inputSocketId.split('-');
		try
		{
			connector = this.ConnectSocketAndBlock(outputInfo[0], outputInfo[3], inputInfo[0], inputInfo[3]);
		}
		catch (message)
		{
			notify.Info("Could not connect blocks", message);
		}
		
		this.Validate();
		return connector;
	}
	Harness.prototype.ConnectSocketAndBlock = function (outputBlockName, outputSocketName, inputBlockName, inputSocketName) {
		var outputSocket = this.Blocks[outputBlockName].Outputs[outputSocketName];
		var inputSocket = this.Blocks[inputBlockName].Inputs[inputSocketName];
		
		var connector = outputSocket.Connect(inputSocket);
		this.Painter.BuildBoundingBox(connector);
		
		return connector;
	}
	Harness.prototype.RemoveConnector = function(connectorToRemove) {
		connectorToRemove.From.Disconnect(connectorToRemove);
		connectorToRemove.To.Disconnect(connectorToRemove);
		connectorToRemove = null;

		this.Validate();
	}
	Harness.prototype.BlockIds = function() {
		var ids = Array();
		var blocks = this.Blocks;
		for(var id in blocks)
		{
			if(blocks.hasOwnProperty(id)) {    
				ids.push(id);
			}
		}
		return ids;
	}
	Harness.prototype.Validate = function() {
		this.ValidationEngine.Validate(this.Blocks);
	}
	Harness.prototype.Update = function () {	
		this.Painter.Update(this.Blocks);
	}
	Harness.prototype.Tick = function () {
		this.Engine.Tick(this.BlockIds(), this.Blocks);
	}
	Harness.prototype.MouseMove = function (event) {
		this.Painter.Update(harness.Blocks, event.pageX, event.pageY);
	}
	Harness.prototype.BlocksMoved = function ()	{
		this.Painter.RebuildBoundingBoxes(harness.Blocks);
		this.Painter.Update(harness.Blocks);
	}
	Harness.prototype.ResizeCanvas = function() {
		this.Canvas.width = window.innerWidth;
		this.Canvas.height = window.innerHeight;
		this.Update(this.Blocks);
	}	
	Harness.prototype.KeyDown = function(event) {
		if (event.which == 46 && 
			this.Painter.HighlightedConnector != null)
		{
			this.RemoveConnector(this.Painter.HighlightedConnector);
			this.Painter.Update(this.Blocks);
		}
	}
	
	return( Harness );

});




