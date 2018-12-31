import Harness from "./harness.js"
import BlockRegistry from "./model/blockregistry.js"

export default class {
	static Build(containerElement)	{
		let blockregistry = new BlockRegistry();

		let harness = new Harness(containerElement, blockregistry);
		/*
		These are the piece that the harness needs, turn into ES6 one by one and add
		to harness constructor

		harness.Painter = new HarnessPainter(harness, jsplumb);
		harness.Engine = new BruteForceEngine(harness);
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