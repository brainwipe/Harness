describe("Plastic Self Organising Map", function () {

	describe("Structure", function () {
		var standard;

		beforeEach(function () {
			standard = psom.BuildStandard();
		});

		it('can build a standard PSOM', function() {
			expect(standard.Learn).toEqual(StandardPSOMAlgorithm);
			expect(standard.DistanceMetric).toEqual(EuclideanDistance);
			expect(standard.CreateNeuron).toEqual(CreateNeuronWithRandomisedWeights);
			expect(standard.CreateNeuronFromInput).toEqual(CreateNeuronFromInput);
			expect(standard.InitialiseNodeStructure).toEqual(CreateThreeNodeNeuronNetwork);
			expect(standard.AddNoiseToWeights).toEqual(AddFlatDistributionNoiseToWeights);
			expect(standard.FindFocus).toEqual(FindFocus);
			expect(standard.UpdateNeuron).toEqual(UpdateNeuron);
			expect(standard.UpdateNeighbourhood).toEqual(UpdateNeighbourhood);
			expect(standard.Age).toEqual(AgeNetwork);
			expect(standard.RemoveDeadLinks).toEqual(RemoveLinksAboveThreshold);
			expect(standard.RemoveDeadNeurons).toEqual(RemoveUnlinkedNeurons);
			expect(standard.CreateNodeGroup).toEqual(CreateThreeNodeGroup);
		});

		it('it can add a neuron with a new id', function() {
			var weights = [0.1, 0.2, 0.3];
			var neuron = standard.AddNeuron(weights);

			expect(standard.neurons.length).toEqual(1);
			expect(standard.neurons).toContain(neuron);
			expect(standard.neurons[0].id).toEqual(0);
			expect(standard.neurons[0].weights[0]).toEqual(0.1);
		});

		it ('throws an error when creating a neuron with null weights', function() {
			expect(function () {
				standard.AddNeuron();}
				).toThrow();
		});

		it ('can add a link between two neurons', function() {
			var n1 = standard.AddNeuron(['0.1', '0.2', '0.3']);
			var n2 = standard.AddNeuron(['0.2', '0.4', '0.6']);

			var link = standard.AddLink(n1, n2, 0.5);
			expect(standard.links).toContain(link);
			expect(standard.links[0].value).toEqual(0.5);
			expect(standard.links[0].from).toEqual(n1);
			expect(standard.links[0].to).toEqual(n2);
		});

		it ('throws an error if you try and create a link with a null neuron', function() {
			var n1 = standard.AddNeuron([0.1, 0.2, 0.3]);

			expect(function () {
				standard.AddLink(n1, null, 0.5);}
				).toThrow();
			expect(function () {
				standard.AddLink(null, n1, 0.5);}
				).toThrow();
		});

		it ('can remove a neuron and all its links', function() {
			var n1 = standard.AddNeuron([0.1, 0.2, 0.3]);
			var n2 = standard.AddNeuron([0.2, 0.4, 0.6]);
			var n3 = standard.AddNeuron([0.6, 0.8, 0.9]);

			var link1 = standard.AddLink(n1, n2, 0.5);
			var link2 = standard.AddLink(n1, n3, 0.2);
			var link3 = standard.AddLink(n2, n3, 0.2);

			standard.RemoveNeuron(n1);

			expect(standard.neurons).not.toContain(n1);
			expect(standard.links).not.toContain(link1);
			expect(standard.links).not.toContain(link2);
			expect(standard.neurons).toContain(n2);
			expect(standard.neurons).toContain(n3);
			expect(standard.links).toContain(link3);
		});

		it ('throws an error if you try to remove a null neuron', function () {
			expect(function () {
				standard.RemoveNeuron();
				}).toThrow();
		});

		it ('throws an error if you try and remove a neuron from an empty network', function () {
			var n = new Neuron([0.1]);
			expect(function () {
				standard.RemoveNeuron(n);
				}).toThrow();
		});

	});

	describe("Standard Algorithm", function () {
		var standard;
		beforeEach(function () {
			standard = psom.BuildStandard();
		});

		it('can calculate euclidean distance', function() {
			var neuron = new Neuron([1,2]);
			var input = [2,3];

			var eucDistRounded = MathTwo.Round(EuclideanDistance(neuron, input),4);

			expect(eucDistRounded).toEqual(1.4142);
		});

		it ('throws an error if you try and calculate euclidean distance of a null neuron', function () {
			var input = [2,3];

			expect(function () {
				EuclideanDistance(null, input);
				}).toThrow();
		});

		it ('throws an error if you try and calculate euclidean distance of a neuron with no weights', function () {
			var input = [2,3];
			var neuron = new Neuron();

			expect(function () {
				EuclideanDistance(neuron, input);
				}).toThrow();
		});

		it ('throws an error if you try and calculate euclidean distance of an input with no weights', function () {
			var neuron = new Neuron([2,3]);

			expect(function () {
				EuclideanDistance(neuron, null);
				}).toThrow();
		});

		it ('throws an error if you try and calculate euclidean distance when input and neuron have differnet numbers of weights', function () {
			var input = [2,3];
			var neuron = new Neuron([2,3,4]);

			expect(function () {
				EuclideanDistance(neuron, input);
				}).toThrow();
		});

		it ('can find the focus and sort neurons', function() {
			var w1 = [0,0,0];
			var w2 = [1,1,1];
			var w3 = [0.2,0.2,0.2];

			var n1 = standard.AddNeuron(w1);
			var n2 = standard.AddNeuron(w2);
			var n3 = standard.AddNeuron(w3);

			var focus = standard.FindFocus(w1);
			expect(focus.id).toEqual(n1.id);
			expect(standard.neurons[0].id).toEqual(n1.id);
			expect(standard.neurons[1].id).toEqual(n3.id);
			expect(standard.neurons[2].id).toEqual(n2.id);
		});

		it ('throws an error when trying to find the focus with an empty input', function() {
			var w1 = [0,0,0];
			var n1 = standard.AddNeuron(w1);
			expect(function () {
				standard.FindFocus();
				}).toThrow();
		});

		it ('throws an error when trying to find the focus with an empty input', function() {
			var w1 = [0,0,0];
			expect(function () {
				standard.FindFocus(w1);
				}).toThrow();
		});

	});

});