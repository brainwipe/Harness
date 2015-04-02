define(
[
	"harness/harness",
	"harness/views/harnesspainter",
	"harness/engines/bruteforceengine",
	"harness/engines/validationengine",
	"harness/model/blockregistry",
	"harness/engines/harnessdeserializer",
	"jsplumb"
],
function(Harness, HarnessPainter, BruteForceEngine, ValidationEngine, BlockRegistry, HarnessDeserializer, jsplumb) {

	function HarnessFactory() { }

	HarnessFactory.prototype.Build = function(containerElement)	{
		var harness = new Harness(containerElement);
		harness.BlockRegistry = new BlockRegistry();
		harness.Painter = new HarnessPainter(harness, jsplumb);
		harness.Engine = new BruteForceEngine(harness);
		harness.ValidationEngine = new ValidationEngine(
			harness,
			validationbrowser);
		return harness;
	};

	HarnessFactory.prototype.BuildFromJSON = function(harness, jsonString) {
		var deserializer = new HarnessDeserializer();
		harness = deserializer.JSONToHarness(harness, jsonString);

		return harness;
	};

	return(HarnessFactory);
});