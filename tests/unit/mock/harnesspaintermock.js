define(
[
	"jquery"
],
function($) {

	function HarnessPainterMock(harness) {
		this.Harness = harness;
		this.Context = harness.Context;
		this.Canvas = this.Context.canvas;
	}

	HarnessPainterMock.prototype.Harness = null;
	HarnessPainterMock.prototype.Context = null;
	HarnessPainterMock.prototype.Canvas = null;
	HarnessPainterMock.prototype.ConnectorBoundingBoxes = [];
	HarnessPainterMock.prototype.BoundingBoxSize = 8;
	HarnessPainterMock.prototype.HighlightedConnector = null;
	HarnessPainterMock.prototype.FindMouseOverConnector = function(mouseX, mouseY) {
		if (this.ConnectorBoundingBoxes.length > 0)
		{
			return this.ConnectorBoundingBoxes[0];
		}
		return null;
	};

	HarnessPainterMock.prototype.DrawSocketConnectors = function(socket, mouseX, mouseY) {};
	HarnessPainterMock.prototype.DrawConnector = function(from, to, highlighted) {};
	HarnessPainterMock.prototype.RebuildBoundingBoxes = function (blocks) {
		this.ConnectorBoundingBoxes = [];
	};
	HarnessPainterMock.prototype.BuildBoundingBox = function(connector)	{};
	HarnessPainterMock.prototype.DroppableHandler = function(event, ui) {};
	HarnessPainterMock.prototype.Update = function (Blocks, mouseX, mouseY) {};
	HarnessPainterMock.prototype.SwitchOffEngineControls = function(event, ui) {};
	HarnessPainterMock.prototype.SwitchOnEngineControls = function(event, ui) {};
	return (HarnessPainterMock);
});