export default class PSOM {
	constructor()
	{
		this.Console = new PSOMConsole('fatal');
		this.neurons = [];
		this.links = [];
		this.configuration = {};
		this.configurationtext = {};
		this.events = {};
		this.distanceFromInput = 0;
		this.neuronId = 0;
	}

	static BuildStandard() {
		var newpsom = new this();

		newpsom.configuration.CreateNeuronWithRandomisedWeights_WeightLength = 3;
		newpsom.configuration.CreateNeuronFromInput_Deviation = 0.05;
		newpsom.configuration.AddFlatDistributionNoiseToWeights_Deviation = 0.2;
		newpsom.configuration.StandardPSOMAlgorithm_NodeBuilding = 0.29;
		newpsom.configuration.StandardPSOMAlgorithm_ClusterThreshold = 0.23;
		newpsom.configuration.StandardPSOMAlgorithm_LearningRate = 0.9;
		newpsom.configuration.AgeNetwork_AgeRate = 0.01;
		newpsom.configuration.RemoveLinksAboveThreshold_AgeThreshold = 0.9;

		newpsom.configurationtext.CreateNeuronWithRandomisedWeights_WeightLength = "Neuron create random weight length";
		newpsom.configurationtext.CreateNeuronFromInput_Deviation = "Neuron create deviation from input";
		newpsom.configurationtext.AddFlatDistributionNoiseToWeights_Deviation = "Add flat noise to weights deviation";
		newpsom.configurationtext.StandardPSOMAlgorithm_NodeBuilding = "Algorithm node building threshold";
		newpsom.configurationtext.StandardPSOMAlgorithm_ClusterThreshold = "Algorithm cluster threshold";
		newpsom.configurationtext.StandardPSOMAlgorithm_LearningRate = "Algorithm learning rate";
		newpsom.configurationtext.AgeNetwork_AgeRate = "Algorithm aging rate";
		newpsom.configurationtext.RemoveLinksAboveThreshold_AgeThreshold = "Remove link age threshold";

		return newpsom;
	}

	AddLink(neuronFrom, neuronTo, value) {
		if (neuronFrom == null)
		{
			throw "Link not created: NeuronFrom was null.";
		}
		if (neuronTo == null)
		{
			throw "Link not created: NeuronTo was null.";
		}

		var link = new Link(neuronFrom, neuronTo, value);
		neuronFrom.linkCount++;
		neuronTo.linkCount++;

		this.links.push(link);
		this.Console.debug("Created Link between n" + neuronFrom.id + " and n" + neuronTo.id);

		this.processEvent("AddLink", link);
		return link;
	}

	AddNeuron(weights) {
		if (typeof weights === 'undefined' || weights.length === 0)
		{
			throw 'weights must be an array of length of at least one';
		}

		var newNeuron = new Neuron(weights);
		newNeuron.id= this.neuronId;
		this.neuronId++;
		this.neurons.push(newNeuron);

		this.Console.debug("Created Neuron");

		this.processEvent("AddNeuron", newNeuron);
		return newNeuron;
	}

	RemoveNeuron(neuronToRemove) {
		if (neuronToRemove === null)
		{
			throw "Neuron is null and cannot be not removed.";
		}
		if (this.neurons.length === 0)
		{
			throw "No neurons in the network";
		}

		var j = 0;

		// Remove all the links to the neuron
		while (j < this.links.length)
		{
			if (this.links[j].from === neuronToRemove)
			{
				this.processEvent("RemoveLink", this.links[j]);
				this.links.splice(j, 1);
			}
			else if (this.links[j].to === neuronToRemove)
			{
				this.processEvent("RemoveLink", this.links[j]);
				this.links.splice(j, 1);
			}
			else
			{
				j++;
			}
		}

		// Remove the neuron from the array
		for (var i=0; i<this.neurons.length; i++)
		{
			if (this.neurons[i] === neuronToRemove)
			{
				this.processEvent("RemoveNeuron", neuronToRemove);
				this.neurons.splice(i, 1);
				break;
			}
		}

		this.Console.debug("Removed Neuron: " + neuronToRemove.id);
	}

	/**
	* Calculates the Eucliden Distance between two neurons and returns it as a value
	*/
	EuclideanDistance(neuron, input) {
		if (typeof input === 'undefined' || input.length === 0)
		{
			throw "Input to the distance metric must be a non-null array.";
		}
		if (typeof neuron.weights === 'undefined' || neuron.weights.length === 0)
		{
			throw "Euclidean distance needs the weights of neuron " +  neuron.id + " to be an array";
		}
		if (neuron.weights.length !== input.length)
		{
			throw "Neuron weights are of differing length, the weights must be of the same length to calculate the euclidean distance. Neuron length: " +
					neuron.weights.length + " of neuron " + neuron.id +
					" and input length: " + input.length;
		}

		var sum = 0;

		for (var i=0; i<neuron.weights.length; i++)
		{
			// Square of the difference
			sum = sum + ((neuron.weights[i] - input[i]) * (neuron.weights[i] - input[i]));
		}

		return Math.sqrt(sum);
	}

	/**
	* This method runs through the neurons and marks each one with their similarity position compared to the input
	*/
	FindFocus(input) {
		if (typeof input === 'undefined' || input.length === 0)
		{
			throw 'Could not find focus because the input is null or length 0.';
		}
		if (this.neurons.length === 0)
		{
			throw 'Could not find focus because there are no neurons in the network.';
		}

		for (var i=0; i<this.neurons.length; i++)
		{
			this.neurons[i].distanceFromInput = this.EuclideanDistance(this.neurons[i], input);
		}

		// Order ascending
		this.neurons.sort(
			(a,b) => {
				return a.distanceFromInput - b.distanceFromInput;
			}
		);

		return this.neurons[0];
	}

	/**
	* Creates a Neuron with random weights between 0 and 1. The number of weights is set by WeightLength.
	* Requires the WeightLength property to be set on the psom prototype first.
	*/
	CreateNeuronWithRandomisedWeights() {
		if (typeof this.configuration.CreateNeuronWithRandomisedWeights_WeightLength === 'undefined')
		{
			throw "To use CreateNeuronWithRandomisedWeights, ensure you set the CreateNeuronWithRandomisedWeights_WeightLength  on the PSOM class when you create it. Example: psom.CreateNeuronWithRandomisedWeights_WeightLength = 0.2;";
		}

		var weights = [];
		for(var i=0; i<this.configuration.CreateNeuronWithRandomisedWeights_WeightLength; i++)
		{
			weights[i] = Math.random();
		}

		return this.AddNeuron(weights);
	}

	/**
	* This method creates a new neuron from the given input. The input can be a neuron or an array of weights.
	*/
	CreateNeuronFromInput(input) {
		if (typeof this.configuration.CreateNeuronFromInput_Deviation === 'undefined')
		{
			throw "To use CreateNeuronFromInput, ensure you set the CreateNeuronFromInput_Deviation on the PSOM class when you create it. Example: psom.CreateNeuronFromInput_Deviation = 0.2;";
		}
		if (input == null)
		{
			throw "CreateNeuronFromInput was passed a null input";
		}

		var weights = [];

		if (typeof input.weights === 'undefined')
		{
			// It's an array
			weights = this.DeepCopy(input);
		}
		else
		{
			// It's a neuron
			weights = this.DeepCopy(input.weights);
		}

		weights = this.AddFlatDistributionNoiseToWeights(weights);
		return this.AddNeuron(weights);
	}

	/**
	* Returns a new set of weights that are slightly different to the last set
	* Deviation is the measure of how different to the input inputweights the new neuron will be.
	* TODO - lots of limit values of 0 or 1 because of the hard limits
	*/
	AddFlatDistributionNoiseToWeights(inputWeights) {
		if (typeof this.configuration.AddFlatDistributionNoiseToWeights_Deviation === 'undefined')
		{
			throw "To use AddFlatDistributionNoiseToWeights, ensure you set the AddFlatDistributionNoiseToWeights_Deviation on the PSOM class when you create it. Example: psom.AddFlatDistributionNoiseToWeights_Deviation = 0.2;";
		}

		var deviation = this.configuration.AddFlatDistributionNoiseToWeights_Deviation;

		for (var i=0; i<inputWeights.length; i++)
		{
			// random number between -(deviation) and +(deviation)
			var delta = (Math.random() * 2 * deviation) - deviation;
			inputWeights[i] = inputWeights[i] + delta;
			if (inputWeights[i] > 1)
			{
				inputWeights[i] = 1;
			}
			else if (inputWeights[i] < 0)
			{
				inputWeights[i] = 0;
			}
		}
		return inputWeights;
	}


	/**
	* The default stating network, 3 neurons connected together with random links
	*/
	CreateThreeNodeNeuronNetwork() {
		this.Console.beginGroup("Network Initalise - Create Three Neuron Network");
		var n1 = this.CreateNeuronWithRandomisedWeights();
		var n2 = this.CreateNeuronWithRandomisedWeights();
		var n3 = this.CreateNeuronWithRandomisedWeights();

		this.AddLink(n1, n2, Math.random());
		this.AddLink(n2, n3, Math.random());
		this.Console.endGroup();
	}

	/**
	* The standard PSOM algorithm as explained in my PhD thesis
	*/
	StandardPSOMAlgorithm(input) {
		this.Console.beginGroup("Algorithm Increment - StandardPSOMAlgorithm");
		if (typeof this.configuration.StandardPSOMAlgorithm_NodeBuilding === 'undefined')
		{
			throw "To use StandardPSOMAlgorithm, ensure you set the StandardPSOMAlgorithm_NodeBuilding on the PSOM class when you create it. Example: psom.StandardPSOMAlgorithm_NodeBuilding= 0.2;";
		}
		if (typeof this.configuration.StandardPSOMAlgorithm_ClusterThreshold === 'undefined')
		{
			throw "To use StandardPSOMAlgorithm, ensure you set the StandardPSOMAlgorithm_ClusterThreshold on the PSOM class when you create it. Example: psom.StandardPSOMAlgorithm_ClusterThreshold = 0.2;";
		}
		if (typeof this.configuration.StandardPSOMAlgorithm_LearningRate === 'undefined')
		{
			throw "To use StandardPSOMAlgorithm, ensure you set the StandardPSOMAlgorithm_LearningRate on the PSOM class when you create it. Example: psom.StandardPSOMAlgorithm_LearningRate = 0.2;";
		}

		var focus = this.FindFocus(input);
		this.Console.debug("Focus was " + focus.id + " with a distance of: " + focus.distanceFromInput);

		if (focus.distanceFromInput > this.configuration.StandardPSOMAlgorithm_NodeBuilding)
		{
			this.Console.debug("Creating new neuron group");
			this.CreateThreeNodeGroup(input);
		}
		else
		{
			this.Console.debug("Updating focus and neighbourhood");
			this.UpdateNeuron(focus, input, this.configuration.StandardPSOMAlgorithm_LearningRate);
			this.UpdateNeighbourhood(focus, this.configuration.StandardPSOMAlgorithm_LearningRate);
		}

		this.Console.debug("Network aging");
		this.AgeNetwork();

		this.Console.debug("Prune network");
		this.RemoveLinksAboveThreshold();
		this.RemoveUnlinkedNeurons();

		this.processEvent("AlgorithmIterationComplete", {
			"focus" : focus,
			"neurons" : this.neurons,
			"links" : this.links
		});

		this.Console.endGroup();
		return focus.distanceFromInput; // This is the last error
	}

	/**
	* Updates the neuron to become more similar to the target
	*/
	UpdateNeuron(neuronToUpdate, target, learningRate) {
		// If a neuron was passed in, we update target to be just the weights
		if (typeof target.weights !== 'undefined')
		{
			target = target.weights;
		}

		for(var i=0; i<neuronToUpdate.weights.length; i++)
		{
			neuronToUpdate.weights[i] = neuronToUpdate.weights[i] +
				(learningRate * (target[i] - neuronToUpdate.weights[i]));
		}
	}

	/**
	* Updates all the neurons connected to the focus
	*/
	UpdateNeighbourhood(focus, learningRate) {

		for (var i=0; i < this.links.length; i++)
		{
			var target = null;
			if (this.links[i].from === focus)
			{
				target = this.links[i].to;
			}
			else if (this.links[i].to === focus)
			{
				target = this.links[i].from;
			}

			if (target != null)
			{
				// Update link length
				this.links[i].value = this.EuclideanDistance(focus, target.weights);


				// Update neuron weights
				var pushOrPull = 0;
				if (this.links[i].value > this.configuration.StandardPSOMAlgorithm_ClusterThreshold)
				{
					// Push away
					pushOrPull = -1;
					this.Console.debug("Pushing neuron '" + target.id + "' away from '" + focus.id + "'");
				}
				else
				{
					// Put toward
					pushOrPull = 1;
					this.Console.debug("Pulling neuron '" + target.id + "' toward '" + focus.id + "'");
				}

				this.Console.debug("distance before: " + this.EuclideanDistance(this.links[i].to,  this.links[i].from.weights));

				this.UpdateNeuron(this.links[i].to, this.links[i].from, (pushOrPull * learningRate * this.links[i].value));

				this.Console.debug("distance after: " + this.EuclideanDistance(this.links[i].to,  this.links[i].from.weights));
			}
		}
	}

	/**
	* This method increases all the link lengths by the AgeNetwork_AgeRate parameter
	*/
	AgeNetwork() {
		if (typeof this.configuration.AgeNetwork_AgeRate === 'undefined')
		{
			throw "To use AgeNetwork, ensure you set the AgeNetwork_AgeRate on the PSOM class when you create it. Example: psom.AgeNetwork_AgeRate= 0.2;";
		}
		for(var i=0; i<this.links.length; i++)
		{
			this.links[i].value += this.configuration.AgeNetwork_AgeRate;
		}
	}

	/**
	* Used by the RemoveDeadLinks method, this method removes all the links above the link removal threshold
	*/
	RemoveLinksAboveThreshold() {
		if (typeof this.configuration.RemoveLinksAboveThreshold_AgeThreshold === 'undefined')
		{
			throw "To use RemoveLinksAboveThreshold, ensure you set the RemoveLinksAboveThreshold_AgeThreshold on the PSOM class when you create it. Example: psom.RemoveLinksAboveThreshold_AgeThreshold = 0.2;";
		}
		// Go backwards when removing multiple items so that the indexes don't keep changing
		for(var i=this.links.length-1; i >= 0; i--)
		{
			if (this.links[i].value > this.configuration.RemoveLinksAboveThreshold_AgeThreshold)
			{
				this.processEvent("RemoveLink", this.links[i]);
				this.links[i].to.linkCount--;
				this.links[i].from.linkCount--;
				this.links.splice(i,1);
			}
		}
	}

	/**
	* This method removes all the neurons that have no links attached to them
	*/
	RemoveUnlinkedNeurons() {
		for(var i=this.neurons.length-1; i>=0; i--)
		{
			if (this.neurons[i].linkCount < 1)
			{
				this.processEvent("RemoveNeuron", this.neurons[i]);
				this.neurons.splice(i,1);
			}
		}
	}

	/**
	* This method creates three new neurons based on the focus. The three new nodes are linked together
	* and then the first neuron is linked to the most similar neuron in the network.
	*/
	CreateThreeNodeGroup(input) {
		var n1 = this.CreateNeuronFromInput(input);
		var n2 = this.CreateNeuronFromInput(input);
		var n3 = this.CreateNeuronFromInput(input);

		this.AddLink(n1, n2, this.EuclideanDistance(n1, n2.weights));
		this.AddLink(n2, n3, this.EuclideanDistance(n2, n3.weights));
		this.AddLink(n3, n1, this.EuclideanDistance(n3, n1.weights));

		// Rely on the fact that the neurons are sorted in order
		this.AddLink(n1, this.neurons[0], this.neurons[0].distanceFromInput);
		this.AddLink(n1, this.neurons[1], this.neurons[1].distanceFromInput);
	}

	DeepCopy(obj) {
		return JSON.parse(JSON.stringify(obj));
	}

	
	on(event, caller, func) {
		if (this.events[event] == null)
		{
			this.events[event] = [];
		}
		if (this.events[event][caller] == null)
		{
			this.events[event][caller] =
				{
					"caller": caller,
					"func": func
				};
		}
	}

	processEvent(event, args) {
		if (this.events[event] == null)
		{
			return;
		}
		for(var eventId in this.events[event])
		{
			var theevent = this.events[event][eventId];
			theevent.func(theevent.caller, args);
		}
	}
}

export class Neuron
{
	constructor(w)
	{
		this.weights = w;
		this.id = -1;
		this.linkCount = 0;
	}
}

export class Link {
	constructor(f, t, v) {
		this.from = f;
		this.to = t;
		this.value = v;
	}
}

export class PSOMConsole
{
	constructor(level)
	{
		this.warninglevel = level ? level : 'debug';
	}

	IsDebugMode() {
		return this.warninglevel === 'debug';
	}
	
	debug(message) {
		if (this.IsDebugMode())
		{
			console.info(message);
		}
	}	

	error(message) { 
		console.error(message);
	}

	beginGroup(groupname) {
		if (this.IsDebugMode())
		{
			console.group(groupname);
		}
	}

	endGroup() {
		if (this.IsDebugMode())
		{
			console.groupEnd();
		}
	}
}

