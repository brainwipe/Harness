define(
[
	'jquery',
	'jqueryui',
	'harness/model/blockregistry',
	'harness/model/entities/connector',
	'harness/model/entities/boundingbox'
],

function($, jqueryui, BlockRegistry, Connector, BoundingBox) {

	function HarnessPainter(harness, jsplumb)
	{
		this.HarnessElement = harness.Element;
		this.JsPlumb = jsplumb;
		this.BindControlEvents();
		this.BindManualEvents(harness);
		this.BindJsPlumb();
		this.PaintBlockBin();
	}
	HarnessPainter.prototype.HarnessElement = null;
	HarnessPainter.prototype.Context = null;
	HarnessPainter.prototype.Canvas = null;
	HarnessPainter.prototype.ConnectorBoundingBoxes = [];
	HarnessPainter.prototype.BoundingBoxSize = 8;
	HarnessPainter.prototype.HighlightedConnector = null;
	HarnessPainter.prototype.JsPlumb = null;
	HarnessPainter.prototype.InputSocketSettings = {
		  endpoint:"Dot",
		  anchor: [ 0, 0.5, -1, 0, 0, 0],
		  paintStyle:{ width:25, height:21, strokeStyle:'#aaa', fillStyle:'#fff', lineWidth:6 },
		  isSource:false,
		  isTarget:true
		};

	HarnessPainter.prototype.OutputSocketSettings = {
		  endpoint:"Dot",
		  anchor:[ 1, 0.5, 1, 0, 0, 0],
		  paintStyle:{ width:25, height:21, strokeStyle:'#aaa', fillStyle:'#fff', lineWidth:6 },
		  isSource:true,
		  connectorStyle : { strokeStyle:"#aaa ", lineWidth:6 },
		  isTarget:false
		};

	HarnessPainter.prototype.BindJsPlumb = function()
	{
		this.JsPlumb.bind("connection", function(info) {
			harness.ConnectSockets(info.sourceEndpoint.getUuid(), info.targetEndpoint.getUuid());
		});
		this.JsPlumb.bind("connectionDetached", function(info) {
			harness.RemoveConnector(info.sourceEndpoint.getUuid(), info.targetEndpoint.getUuid());
		});
	}

	HarnessPainter.prototype.DroppableHandler = function(event, ui) {
		var eventElement = event.toElement.attributes["harness-block-id"];
		if (eventElement)
		{
			var blockBuilderId = eventElement.value;
			harness.BlockRegistry.CreateBlock(blockBuilderId, harness, event.toElement.offsetLeft, event.toElement.offsetTop);
		}
	};

	HarnessPainter.prototype.RedrawBlocks = function (Blocks, Views) {
		for(var i in Blocks)
		{
			var block = Blocks[i];
			Views[block.Id].Draw();
		}
	};

	HarnessPainter.prototype.BindControlEvents = function()
	{
		$('#harness-engine-controls-tick').on('click', function () {
			if (!$(this).hasClass("disabled"))
			{
				harness.Tick();
			}
		});

		$('#harness-engine-controls-start').on('click', function () {
			if (!$(this).hasClass("disabled"))
			{
				$(this).addClass('disabled');
				$("#harness-engine-controls-tick").addClass('disabled');
				$("#harness-engine-controls-stop").removeClass('disabled');
				$('#harness-engine-controls-start').tooltip('hide');
				harness.Start();
			}
		});

		$('#harness-engine-controls-stop').on('click', function () {
			if (!$(this).hasClass("disabled"))
			{
				$(this).addClass('disabled');
				$("#harness-engine-controls-tick").removeClass('disabled');
				$("#harness-engine-controls-start").removeClass('disabled');
				harness.Stop();
			}
		});
	};

	HarnessPainter.prototype.SwitchOnEngineControls = function()
	{
		$('#harness-engine-controls').children().removeClass('disabled');
	};

	HarnessPainter.prototype.SwitchOffEngineControls = function()
	{
		$('#harness-engine-controls').children().addClass('disabled');
	};

	HarnessPainter.prototype.BindManualEvents = function (harness)
	{
		$('#clearModel').on('click', function() {
			theBootbox.dialog({
				message : "Are you sure you want to clear the model? This cannot be undone",
				title : "Confirm clear",
				buttons : {
					cancel : {
						label : "Cancel",
						className : "btn-default"
					},
					clear : {
						label : "Yes, Clear it",
						className : "btn-danger",
						callback: function() {
							harness.Reset();
					
						}
					}
				}
			});
		});

		harness.Element.droppable({drop: function(e,u) {
			harness.Painter.DroppableHandler(e,u);}
		});
	};

	HarnessPainter.prototype.PaintBlockBin = function()
	{
		var element = this.HarnessElement.append('<div class="well block-bin"><img src="images/block-bin.png" alt="Drop block here to delete it." title="Drop block here to delete it."/></div>');
		$('.block-bin').hide();
		$('.block-bin').droppable({
			drop: function(event ,ui) {
				var blockId = ui.draggable.attr('id');
				harness.DeleteBlock(blockId);
				$('.block-bin').hide('slide');
		}});
	};

	HarnessPainter.prototype.ConnectSockets = function(fromBlockAndSocketId, toBlockAndSocketId)
	{
		this.JsPlumb.connect({uuids: [fromBlockAndSocketId, toBlockAndSocketId]});
	};

	HarnessPainter.prototype.DeleteConnections = function(inputSockets, outputSockets)
	{
		for (var i in inputSockets)
		{
			this.JsPlumb.deleteEndpoint(inputSockets[i].QualifiedId());
		}
		for (var i in outputSockets)
		{
			this.JsPlumb.deleteEndpoint(outputSockets[i].QualifiedId());
		}
	};

	HarnessPainter.prototype.DeleteSocket = function(qualifiedSocketId)
	{
		this.JsPlumb.deleteEndpoint(qualifiedSocketId);
	};

	HarnessPainter.prototype.CreateInputSocket = function(block, qualifiedSocketId)
	{
		this.InputSocketSettings.anchor = [0, (0.1 * block.InputsCount), -1, 0, 0, 0];
		this.JsPlumb.addEndpoint(
			block.Id, 
			{
				uuid: qualifiedSocketId
			},
			this.InputSocketSettings);
		harness.Painter.JsPlumb.repaintEverything();
	};

	HarnessPainter.prototype.CreateOutputSocket = function(block, qualifiedSocketId)
	{
		this.OutputSocketSettings.anchor = [1, (0.1 * block.OutputsCount), 1, 0, 0, 0];

		this.JsPlumb.addEndpoint(
			block.Id, 
			{
				uuid: qualifiedSocketId
			},
			this.OutputSocketSettings);
		harness.Painter.JsPlumb.repaintEverything();
	};

	return(HarnessPainter);
});