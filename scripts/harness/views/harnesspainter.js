/*
	// TODO ROLA - check these previous ones, not called here, are they used?
	'harness/model/entities/connector',
	'harness/model/entities/boundingbox'
*/
import * as jquery from "/vendor/jquery/jquery-3.3.1.min.js"
import * as jqueryui from "/vendor/jquery/jquery-ui-1.12.1.min.js"
import * as jsplumb from "/vendor/jsplumb/js/jsplumb-2.2.8.min.js"
import * as bootstrap from '/vendor/bootstrap/js/bootstrap.min.js'

export default class {
	constructor(harness)
	{
		this.Harness = harness;
		this.Harness.Painter = this;
		this.HarnessElement = harness.Element;
		this.JsPlumb = jsPlumb.getInstance();
		this.BindControlEvents();
		this.BindManualEvents();
		this.BindJsPlumb();
		this.PaintBlockBin();

		this.Context = null;
		this.Canvas = null;
		this.ConnectorBoundingBoxes = [];
		this.BoundingBoxSize = 8;
		this.HighlightedConnector = null;

		this.InputSocketSettings = {
			endpoint:"Dot",
			anchor: [ 0, 0.5, -1, 0, 0, 0],
			paintStyle:{ width:25, height:21, strokeStyle:'#aaa', fillStyle:'#fff', lineWidth:6 },
			isSource:false,
			isTarget:true
		}
  
		this.OutputSocketSettings = {
			endpoint:"Dot",
			maxConnections:-1, 
			setDragAllowedWhenFull:true,
			anchor:[ 1, 0.5, 1, 0, 0, 0],
			paintStyle:{ width:25, height:21, strokeStyle:'#aaa', fillStyle:'#fff', lineWidth:6 },
			isSource:true,
			connectorStyle : { strokeStyle:"#aaa ", lineWidth:6 },
			isTarget:false
		}
	}

	Reset() {
		this.JsPlumb.deleteEveryEndpoint();
	}

	BindJsPlumb() {
		this.JsPlumb.bind("connection", function(info) {
			this.Harness.ConnectSockets(info.sourceEndpoint.getUuid(), info.targetEndpoint.getUuid());
		});
		this.JsPlumb.bind("connectionDetached", function(info) {
			this.Harness.RemoveConnector(info.sourceEndpoint.getUuid(), info.targetEndpoint.getUuid());
		});
	}

	DroppableHandler(event, ui) {
		var eventElement = event.toElement.attributes["harness-block-id"];
		if (eventElement)
		{
			var blockBuilderId = eventElement.value;
			this.Harness.BlockRegistry.CreateBlock(blockBuilderId, this.Harness, event.originalEvent.clientX, event.originalEvent.clientY);
		}
	}

	BindControlEvents()	{
		$('#harness-engine-controls-tick').on('click', this.Harness, function(event) {
			if (!$(this).hasClass("disabled"))
			{
				event.data.Tick();
			}
		});

		$('#harness-engine-controls-start').on('click', this.Harness, function(event) {
			if (!$(this).hasClass("disabled"))
			{
				$(this).addClass('disabled');
				$("#harness-engine-controls-tick").addClass('disabled');
				$("#harness-engine-controls-stop").removeClass('disabled');
				$('#harness-engine-controls-start').tooltip('hide');
				event.data.Start();
			}
		});

		$('#harness-engine-controls-stop').on('click', this.Harness, function(event) {
			if (!$(this).hasClass("disabled"))
			{
				$(this).addClass('disabled');
				$("#harness-engine-controls-tick").removeClass('disabled');
				$("#harness-engine-controls-start").removeClass('disabled');
				event.data.Stop();
			}
		});
	}

	SwitchOnEngineControls() {
		$('#harness-engine-controls').children().removeClass('disabled');
	}

	SwitchOffEngineControls() {
		$('#harness-engine-controls').children().addClass('disabled');
	}

	BindManualEvents () {
		$('#clearModel').on('click', this.Harness, function(event) {
			event.data.Reset();
		});

		this.Harness.Element.droppable({drop: function(e,u) {
			// Anti-pattern due to jquery UI restriction of data passing
			window.harness.Painter.DroppableHandler(e,u);}
		});
	}

	PaintBlockBin()	{
		this.HarnessElement.append('<div class="well block-bin"><img src="images/block-bin.png" alt="Drop block here to delete it." title="Drop block here to delete it."/></div>');
		$('.block-bin').hide();
		$('.block-bin').droppable({
			drop: function(event ,ui) {
				var blockId = ui.draggable.attr('id');
				// Anti-pattern due to jquery UI restriction of data passing
				window.harness.DeleteBlock(blockId);
				$('.block-bin').hide('slide');
		}});
	}

	ConnectSockets(fromBlockAndSocketId, toBlockAndSocketId) {
		this.JsPlumb.connect({uuids: [fromBlockAndSocketId, toBlockAndSocketId]});
	}

	DeleteConnections(inputSockets, outputSockets)
	{
		for (var i in inputSockets)
		{
			this.JsPlumb.deleteEndpoint(inputSockets[i].QualifiedId());
		}
		for (var i in outputSockets)
		{
			this.JsPlumb.deleteEndpoint(outputSockets[i].QualifiedId());
		}
	}

	DeleteSocket(qualifiedSocketId)	{
		this.JsPlumb.deleteEndpoint(qualifiedSocketId);
	}

	CreateInputSocket(block, qualifiedSocketId, socketName)	{
		this.InputSocketSettings.anchor = [0, (0.1 * block.InputsCount), -1, 0, 0, 0];
		var endPoint = this.JsPlumb.addEndpoint(
			block.Id, 
			{
				uuid: qualifiedSocketId
			},
			this.InputSocketSettings);
		endPoint.canvas.setAttribute("title",socketName);
		this.Repaint();
	}

	CreateOutputSocket(block, qualifiedSocketId, socketName) {
		this.OutputSocketSettings.anchor = [1, (0.1 * block.OutputsCount), 1, 0, 0, 0];

		var endPoint = this.JsPlumb.addEndpoint(
			block.Id, 
			{
				uuid: qualifiedSocketId
			},
			this.OutputSocketSettings);
		endPoint.canvas.setAttribute("title",socketName);
		this.Repaint();
	}

	RedrawBlocks(Blocks, Views) {
		for(var i in Blocks)
		{
			var block = Blocks[i];
			Views[block.Id].Draw();
		}
	}

	Repaint() {
		this.JsPlumb.repaintEverything();
	}

	MakeBlockDraggable(blockId) {
		this.JsPlumb.draggable(blockId);
	}
}