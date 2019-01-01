import Harness from "./harness.js"
import BlockRegistry from "./model/blockregistry.js"
import HarnessPainter from "./views/harnesspainter.js"
import BruteForceEngine from "./engines/bruteforceengine.js"
import ValidationEngine from "./engines/validationengine.js"

export default class {
	static Build(containerElement)	{
		let blockRegistry = new BlockRegistry();
		let engine = new BruteForceEngine();
		let harness = new Harness(containerElement, blockRegistry, engine);

		// TODO ROLA - nasty circular references here, Harness is aggregate and should
		// own its children
		let harnessPainter = new HarnessPainter(harness);
		harness.ValidationEngine = new ValidationEngine(harness);
		
		return harness;
	}

	static BuildFromJSON(harness, jsonString) {
		var deserializer = new HarnessDeserializer();
		harness = deserializer.JSONToHarness(harness, jsonString);

		return harness;
	}
}