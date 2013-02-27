define(
[
	"jquery",
	"jquery-ui",
	"underscore",
	"harness/model/block",
	"harness/model/socket",
	"harness/model/connector",
	"harness/model/blockfactory",
	"harness/model/boundingbox"
],

function($, jqueryui, _, Block, Socket, Connector, BlockFactory, BoundingBox) {

	function HarnessPainter(harness)
	{
		this.Context = harness.Context;
		this.Canvas = this.Context.canvas;
		this.BindControlEvents();

		$("#raih_bg").mousemove(function(e) {harness.MouseMove(e);});
		
		$(document).keydown(function(e) {harness.KeyDown(e);});
		
		$("#raih_bg").droppable({drop: function(e,u) {
			harness.Painter.DroppableHandler(e,u);}
		});
	}
	HarnessPainter.prototype.Context = null;
	HarnessPainter.prototype.Canvas = null;
	HarnessPainter.prototype.ConnectorBoundingBoxes = new Array();
	HarnessPainter.prototype.BoundingBoxSize = 8;
	HarnessPainter.prototype.HighlightedConnector = null;
	HarnessPainter.prototype.FindMouseOverConnector = function(mouseX, mouseY) {
		this.HighlightedConnector = null;
		for (i in this.ConnectorBoundingBoxes) {
			var boundingBox = this.ConnectorBoundingBoxes[i];

			if (boundingBox.bottom > boundingBox.top) {
				if (mouseX > boundingBox.left &&
					mouseX < boundingBox.right &&
					mouseY > boundingBox.top &&
					mouseY < boundingBox.bottom)
					{
						this.HighlightedConnector = boundingBox.Connector;
					}
			}
			else {
				if (mouseX > boundingBox.left &&
					mouseX < boundingBox.right &&
					mouseY < boundingBox.top &&
					mouseY > boundingBox.bottom)
					{
						this.HighlightedConnector = boundingBox.Connector;
					}
			}
		}
		return this.HighlightedConnector;
	}
	HarnessPainter.prototype.DrawSocketConnectors = function(socket, mouseX, mouseY) {
		if (socket.IsInputSocket == false)
		{
			var mouseOverConnector = this.FindMouseOverConnector(mouseX, mouseY);
			
			var fromElement = $('#' + socket.QualifiedId());

			var fromSocketLocation = fromElement.offset();
			fromSocketLocation.left += fromElement.width() - 5;
			fromSocketLocation.top += (fromElement.height() / 2);
			
			for(i in socket.Connectors)
			{
				var connector = socket.Connectors[i];
				var highlighted = false;
				
				if (mouseOverConnector != null && 
					connector == mouseOverConnector)
				{
					highlighted = true;
				}
				
				var toElement = $('#' + connector.To.QualifiedId());

				var toSocketLocation = toElement.offset();
				toSocketLocation.top += (fromElement.height() / 2);
				toSocketLocation.left += 5;
				
				this.DrawConnector(fromSocketLocation, toSocketLocation, highlighted);
			}
		}
	}
	HarnessPainter.prototype.DrawConnector = function(from, to, highlighted) {
		
		if (highlighted == true) {
			this.Context.strokeStyle = "rgb(255,0,0)";
		}
		else {
			this.Context.strokeStyle = "rgb(144,144,144)";
		}
		
		this.Context.beginPath();

		if (to.left > from.left + 40)
		{
			this.Context.moveTo(from.left, from.top);
			this.Context.lineTo( from.left + ((to.left - from.left) / 2) , from.top);
			this.Context.lineTo( from.left + ((to.left - from.left) / 2) , to.top);
			this.Context.lineTo( to.left , to.top);
		}
		else
		{
			this.Context.moveTo(from.left, from.top);
			this.Context.lineTo( from.left + 20 , from.top);
			
			this.Context.lineTo( from.left + 20 , from.top - ((from.top - to.top) / 2));
			this.Context.lineTo( to.left - 20 , from.top - ((from.top - to.top) / 2));
			this.Context.lineTo( to.left - 20 , to.top);
			this.Context.lineTo( to.left, to.top);
		}
		this.Context.lineWidth = 3;
		this.Context.stroke(); 
	}
	HarnessPainter.prototype.RebuildBoundingBoxes = function (blocks) {
		harness.Painter.ConnectorBoundingBoxes = new Array();
		
		for(var i in blocks) {
			var block = blocks[i];
			for(var j in block.Outputs) {
				var output = block.Outputs[j];
				for (var k in output.Connectors)
				{
					var connector = output.Connectors[k];
					harness.Painter.BuildBoundingBox(connector);
				}
			}
		}
		
	}
	HarnessPainter.prototype.BuildBoundingBox = function(connector)	{
		var fromElement =$('#' + connector.From.QualifiedId());
		var toElement =$('#' + connector.To.QualifiedId());

		var from = fromElement.offset();
		from.left += fromElement.width() - 5;
		from.top += (fromElement.height() / 2);
		
		var to = toElement.offset();
		to.left += 5;
		to.top += (toElement.height() / 2);
		
		var boxSize = this.BoundingBoxSize;
		
		if (to.left > from.left + 40)
		{
			this.ConnectorBoundingBoxes.push(
				new BoundingBox(from.top - boxSize,
							  from.left + ((to.left - from.left) / 2) + boxSize,
							  from.top + boxSize,
							  from.left - boxSize,
							  connector));
			this.ConnectorBoundingBoxes.push(
				new BoundingBox(to.top - boxSize,
							  from.left + ((to.left - from.left) / 2) + boxSize,
							  from.top + boxSize,
							  from.left + ((to.left - from.left) / 2) - boxSize,
							  connector));
			this.ConnectorBoundingBoxes.push(
				new BoundingBox(to.top - boxSize,
							  to.left + boxSize,
							  to.top + boxSize,
							  from.left + ((to.left - from.left) / 2) - boxSize,
							  connector));
		}
		else
		{	
			this.ConnectorBoundingBoxes.push(
				new BoundingBox(from.top - boxSize,
							  from.left + 20 + boxSize,
							  from.top + boxSize,
							  from.left - boxSize,
							  connector));
			this.ConnectorBoundingBoxes.push(
				new BoundingBox(from.top - ((from.top - to.top) / 2) - boxSize,
							  from.left + 20 + boxSize,
							  from.top + boxSize,
							  from.left + 20 - boxSize,
							  connector));
			this.ConnectorBoundingBoxes.push(
				new BoundingBox(from.top - ((from.top - to.top) / 2) - boxSize,
							  from.left + 20 + boxSize,
							  from.top - ((from.top - to.top) / 2) + boxSize,
							  to.left - 20 - boxSize,
							  connector));
			this.ConnectorBoundingBoxes.push(
				new BoundingBox(to.top - boxSize,
							  to.left - 20 + boxSize,
							  from.top - ((from.top - to.top) / 2) + boxSize,
							  to.left - 20 - boxSize,
							  connector));
			this.ConnectorBoundingBoxes.push(	
				new BoundingBox(to.top - boxSize,
							  to.left + boxSize,
							  to.top + boxSize,
							  to.left - 20 - boxSize,
							  connector));
		}
	}
	HarnessPainter.prototype.DroppableHandler = function(event, ui) {
		var eventElement = event.srcElement.attributes["harness-block-id"];
		if (_.isUndefined(eventElement) == false)
		{
			var blockBuilderId = event.srcElement.attributes["harness-block-id"].value;
			var blockFactory = harness.BlockFactory.Factories[blockBuilderId];
			
			var block = blockFactory.Build(harness.GetNextBlockId());
			var view = blockFactory.GetView(block);
			harness.AddBlock(block, view);
			
			view.Base.Element.offset({
				left: event.srcElement.offsetLeft, 
				top: event.srcElement.offsetTop
				});
				
			view.Draw();
		}
	}
	
	HarnessPainter.prototype.Update = function (Views, Blocks, mouseX, mouseY) {
		this.Context.clearRect(0,0,this.Canvas.width, this.Canvas.height);  

		for(i in Blocks)
		{
			var block = Blocks[i];
			Views[block.Id].Draw();

			for (j in block.Outputs)
			{
				var socket = block.Outputs[j];
				this.DrawSocketConnectors(socket, mouseX, mouseY);
			}
			
			for (j in block.Inputs)
			{
				var socket = block.Inputs[j];
				this.DrawSocketConnectors(socket, mouseX, mouseY);
			}
		}
	};

	HarnessPainter.prototype.BindControlEvents = function()
	{
		$("#harness-engine-controls-tick").on("click", function () { harness.Tick(); });
	}

	HarnessPainter.prototype.SwitchOnEngineControls = function()
	{
		$("#harness-engine-controls").children().removeClass("disabled");
		this.BindControlEvents();
	}

	HarnessPainter.prototype.SwitchOffEngineControls = function()
	{
		$("#harness-engine-controls").children().addClass("disabled");
		$("#harness-engine-controls").children().off("click");
	}
	
	return(HarnessPainter);
});