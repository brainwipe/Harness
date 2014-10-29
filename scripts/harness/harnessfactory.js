define(
[
	"harness/harness",
	"harness/views/harnesspainter",
	"harness/engines/bruteforceengine",
	"harness/engines/validationengine",
	"harness/model/blockfactory",
	"harness/engines/harnessdeserializer"
],
function(Harness, HarnessPainter, BruteForceEngine, ValidationEngine, BlockFactory, HarnessDeserializer) {

	function HarnessFactory() { }

	HarnessFactory.prototype.Build = function(containerElement)	{
		var harness = new Harness(containerElement);
		harness.BlockFactory = new BlockFactory();
		harness.Painter = new HarnessPainter(harness);
		harness.Engine = new BruteForceEngine(harness);
		harness.ValidationEngine = new ValidationEngine();
		return harness;
	};

	HarnessFactory.prototype.BuildFromJSON = function(harness, jsonString) {
		var deserializer = new HarnessDeserializer();
		harness = deserializer.JSONToHarness(harness, jsonString);

		return harness;
	};

	return(HarnessFactory);
});