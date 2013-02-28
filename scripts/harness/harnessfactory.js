define(
[
	"jquery",
	"harness/Harness",
	"harness/views/harnesspainter",
	"harness/model/bruteforceengine",
	"harness/model/validationengine",
	"harness/model/blockfactory"
],
function($, Harness, HarnessPainter, BruteForceEngine, ValidationEngine, BlockFactory) {

	function HarnessFactory() {
	}
	
	HarnessFactory.prototype.Build = function(containerElement)	{
		var harness = new Harness(containerElement);
		harness.BlockFactory = new BlockFactory();
		harness.Painter = new HarnessPainter(harness);
		harness.Engine = new BruteForceEngine(harness);
		harness.ValidationEngine = new ValidationEngine();
		return harness;
	}
	
	return(HarnessFactory);

});