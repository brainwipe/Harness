define(
[
	"jquery",
	"harness/Harness",
	"harness/views/HarnessPainter",
	"harness/model/BruteForceEngine"
],
function($, Harness, HarnessPainter, BruteForceEngine) {

	function HarnessFactory() {
	}
	
	HarnessFactory.prototype.Build = function(containerElement)	{
		var harness = new Harness(containerElement);
		harness.Painter = new HarnessPainter(harness);
		harness.Engine = new BruteForceEngine(harness);
		return harness;
	}
	
	return(HarnessFactory);

});