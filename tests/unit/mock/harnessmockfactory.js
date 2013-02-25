define(
[
	"jquery",
	"harness/Harness",
	"harness/model/BruteForceEngine",
	"../mock/HarnessPainterMock"

],
function($, Harness, BruteForceEngine, HarnessPainterMock) {

	function HarnessMockFactory() {}

	HarnessMockFactory.prototype.Build = function(container)	{
		var harness = new Harness(container);
		harness.Painter = new HarnessPainterMock(harness);
		harness.Engine = new BruteForceEngine(harness);
		return harness;
	};

	return(HarnessMockFactory);
});