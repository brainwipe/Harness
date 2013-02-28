define(
[
	"jquery",
	"harness/Harness",
	"harness/model/BruteForceEngine",
	"harness/model/validationengine",
	"harness/model/blockfactory",
	"../mock/HarnessPainterMock"

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