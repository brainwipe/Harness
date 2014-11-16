define(
[
	'jquery',
	'jqueryui',
	'harness/model/blockfactory',
	'harness/model/entities/connector',
	'harness/model/entities/boundingbox'
],

function($, jqueryui, BlockFactory, Connector, BoundingBox) {

	function HarnessPainter(harness)
	{
		this.Canvas = $("#raih_bg")[0];
		this.Context = this.Canvas.getContext("2d");
		this.HarnessElement = harness.Element;
		this.BindControlEvents();
		this.BindManualEvents();
		this.PaintBlockBin();
	}
	HarnessPainter.prototype.HarnessElement = null;
	HarnessPainter.prototype.Context = null;
	HarnessPainter.prototype.Canvas = null;
	HarnessPainter.prototype.ConnectorBoundingBoxes = [];
	HarnessPainter.prototype.BoundingBoxSize = 8;
	HarnessPainter.prototype.HighlightedConnector = null;
	HarnessPainter.prototype.SetWorkspaceSizeToWindow = function(width, height) {
		this.Canvas.width = window.innerWidth;
		this.Canvas.height = window.innerHeight;
	};
	HarnessPainter.prototype.FindMouseOverConnector = function(mouseX, mouseY) {
		this.HighlightedConnector = null;
		for (var i in this.ConnectorBoundingBoxes) {
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
	};

	HarnessPainter.prototype.DrawSocketConnectors = function(socket, mouseX, mouseY) {
		if (socket.IsInputSocket === false)
		{
			var mouseOverConnector = this.FindMouseOverConnector(mouseX, mouseY);

			var fromElement = $('#' + socket.QualifiedId());

			var fromSocketLocation = fromElement.offset();
			fromSocketLocation.left += fromElement.width() - 5;
			fromSocketLocation.top += (fromElement.height() / 2);

			for(var i in socket.Connectors)
			{
				var connector = socket.Connectors[i];
				var highlighted = false;

				if (mouseOverConnector != null &&
					connector === mouseOverConnector)
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
	};

	HarnessPainter.prototype.DrawConnector = function(from, to, highlighted) {

		if (highlighted === true) {
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
	};

	HarnessPainter.prototype.RebuildBoundingBoxes = function (blocks) {
		harness.Painter.ConnectorBoundingBoxes = [];

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
	};

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
	};

	HarnessPainter.prototype.DroppableHandler = function(event, ui) {
		var eventElement = event.toElement.attributes["harness-block-id"];
		if (eventElement)
		{
			var blockBuilderId = eventElement.value;
			harness.BlockFactory.CreateBlock(blockBuilderId, harness, event.toElement.offsetLeft, event.toElement.offsetTop);
		}
	};

	HarnessPainter.prototype.RedrawBlocks = function (Blocks, Views) {
		for(var i in Blocks)
		{
			var block = Blocks[i];
			Views[block.Id].Draw();
		}
	};

	HarnessPainter.prototype.Update = function (Views, Blocks, mouseX, mouseY) {
		this.Context.clearRect(0,0,this.Canvas.width, this.Canvas.height);

		for(var i in Blocks)
		{
			var block = Blocks[i];
			Views[block.Id].Draw();

			for (var j in block.Outputs)
			{
				var outSocket = block.Outputs[j];
				this.DrawSocketConnectors(outSocket, mouseX, mouseY);
			}

			for (var k in block.Inputs)
			{
				var inSocket = block.Inputs[k];
				this.DrawSocketConnectors(inSocket, mouseX, mouseY);
			}
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

	HarnessPainter.prototype.BindManualEvents = function ()
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

		$("#raih_bg").mousemove(function(e) {harness.MouseMove(e);});

		$(document).keydown(function(e) {harness.KeyDown(e);});

		$("#raih_bg").droppable({drop: function(e,u) {
			harness.Painter.DroppableHandler(e,u);}
		});

		window.addEventListener('resize',
			function() {harness.ResizeCanvas();}, false);
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

	return(HarnessPainter);
});