define(
[
	"jquery",
	"harness/harness",
	"harness/engines/bruteforceengine",
	"harness/engines/validationengine",
	"harness/model/blockregistry",
	"mock/harnesspaintermock",
	"mock/validationbrowsermock"

],
function($, 
	Harness, 
	BruteForceEngine, 
	ValidationEngine, 
	BlockRegistry, 
	HarnessPainterMock, 
	ValidationBrowserMock) {

	function HarnessMockFactory() {}

	HarnessMockFactory.prototype.Build = function(container)	{
		var harness = new Harness(container);
		harness.BlockRegistry = new BlockRegistry();
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