import Harness from "./harness.js"

export default class {
	static Build(containerElement)	{
		let harness = new Harness(containerElement);
		/*
		These are the piece that the harness needs, turn into ES6 one by one and add
		to harness constructor

		harness.BlockRegistry = new BlockRegistry();
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