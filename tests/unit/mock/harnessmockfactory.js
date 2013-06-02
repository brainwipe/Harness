define(
[
	"jquery",
	"harness/Harness",
	"harness/engines/BruteForceEngine",
	"harness/engines/validationengine",
	"harness/model/blockfactory",
	"HarnessPainterMock"

],
function($, Harness, BruteForceEngine, ValidationEngine, BlockFactory, HarnessPainterMock) {

	function HarnessMockFactory() {}

	HarnessMockFactory.prototype.Build = function(container)	{
		var harness = new Harness(container);
		harness.BlockFactory = new BlockFactory();
		harness.Painter = new HarnessPainterMock(harness);
		harness.Engine = new BruteForceEngine(harness);
		harness.ValidationEngine = new ValidationEngine();
		return harness;
	};

	return(HarnessMockFactory);
});