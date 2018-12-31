import Harness from "./harness.js"
import BlockRegistry from "./model/blockregistry.js"
import HarnessPainter from "./views/harnesspainter.js"
import BruteForceEngine from "./engines/bruteforceengine.js"

export default class {
	static Build(containerElement)	{
		let blockRegistry = new BlockRegistry();
		let engine = new BruteForceEngine();
		
		let harness = new Harness(containerElement, blockRegistry, engine);
		let harnessPainter = new HarnessPainter(harness);
		
		/*
		These are the piece that the harness needs, turn into ES6 one by one and add
		to harness constructor
		
		harness.ValidationEngine = new ValidationEngine(
			harness,
			validationbrowser);
			*/
		return harness;
	}

	static BuildFromJSON(harness, jsonString) {
		var deserializer = new HarnessDeserializer();
		harness = deserializer.JSONToHarness(harness, jsonString);

		return harness;
	}
}