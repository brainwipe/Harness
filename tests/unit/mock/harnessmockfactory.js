define(
[
	"jquery",
	"harness/harness",
	"harness/engines/bruteforceengine",
	"harness/engines/validationengine",
	"harness/model/blockfactory",
	"mock/harnesspaintermock",
	"mock/validationbrowsermock"

],
function($, 
	Harness, 
	BruteForceEngine, 
	ValidationEngine, 
	BlockFactory, 
	HarnessPainterMock, 
	ValidationBrowserMock) {

	function HarnessMockFactory() {}

	HarnessMockFactory.prototype.Build = function(container)	{
		var harness = new Harness(container);
		harness.BlockFactory = new BlockFactory();
		harness.Painter = new HarnessPainterMock(harness);
		harness.Engine = new BruteForceEngine(harness);
		harness.ValidationEngine = 
			new ValidationEngine(
				harness,
				new ValidationBrowserMock());
		return harness;
	};

	return(HarnessMockFactory);
});