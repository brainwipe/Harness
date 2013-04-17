function psom(learn, distanceMetric, createNeuronWithRandomisedWeights, createNeuronFromInput, initialiseNodeStructure,
			addNoiseToWeights, findFocus, updateNeuron, updateNeighbourhood, age, removeDeadLinks, removeDeadNeurons,
			createNodeGroup)
{
	this.Learn = learn;
	this.DistanceMetric = distanceMetric;
	this.CreateNeuron = createNeuronWithRandomisedWeights;
	this.CreateNeuronFromInput = createNeuronFromInput;
	this.InitialiseNodeStructure = initialiseNodeStructure;
	this.AddNoiseToWeights = addNoiseToWeights;
	this.UpdateNeuron = updateNeuron;
	this.FindFocus = findFocus;
	this.UpdateNeighbourhood = updateNeighbourhood;
	this.Age = age;
	this.AddNeuron = AddNeuron;
	this.AddLink = AddLink;
	this.RemoveDeadLinks = removeDeadLinks;
	this.RemoveDeadNeurons = removeDeadNeurons;
	this.CreateNodeGroup = createNodeGroup;
	this.RemoveNeuron = RemoveNeuron;
	
	this.neurons = new Array();
	this.links = new Array();
	this.distanceFromInput = 0;
};
psom.prototype.AddNeuron = null;
psom.prototype.Learn = null;
psom.prototype.DistanceMetric = null;
psom.prototype.CreateNeuron = null;
psom.prototype.CreateNeuronFromInput = null;
psom.prototype.InitialiseNodeStructure = null;
psom.prototype.AddNoiseToWeights = null;
psom.prototype.FindFocus = null;
psom.prototype.UpdateNeighbourhood = null;
psom.prototype.Age = null;
psom.prototype.RemoveDeadLinks = null;
psom.prototype.RemoveDeadNeurons = null;
psom.prototype.RemoveNeuron = null;
psom.prototype.CreateNodeGroup = null;

psom.prototype.neurons = null;
psom.prototype.links = null;
psom.prototype.neuronId = 0;	
psom.prototype.distanceFromInput = 0;

psom.prototype.BuildStandard = function () {
	return new psom(StandardPSOMAlgorithm, EuclideanDistance, CreateNeuronWithRandomisedWeights, CreateNeuronFromInput,
						CreateThreeNodeNeuronNetwork, AddFlatDistributionNoiseToWeights, FindFocus, UpdateNeuron, UpdateNeighbourhood,
						AgeNetwork, RemoveLinksAboveThreshold, RemoveUnlinkedNeurons, CreateThreeNodeGroup);
};

function Neuron(w) 
{
	this.weights = w;
};
Neuron.prototype.weights = null;
Neuron.prototype.id = -1;
Neuron.prototype.linkCount = 0; // This is for efficiency.

function Link(f, t, v) {
	this.from = f;
	this.to = t;
	this.value = v;
	
	this.from.linkCount++;
	this.to.linkCount++;
}
Link.prototype.from = null;
Link.prototype.to = null;
Link.prototype.value = null;

/* 


Network functions 


*/

function AddLink(neuronFrom, neuronTo, value)
{
	if (neuronFrom == null)
	{
		throw "Link not created: NeuronFrom was null.";
	}
	if (neuronTo == null)
	{
		throw "Link not created: NeuronTo was null.";
	}
	
	var link = new Link(neuronFrom, neuronTo, value);
	this.links.push(link);
	console.info("Created Link between n" + neuronFrom.id + " and n" + neuronTo.id);
	return link;
}

function AddNeuron(weights)
{
	if (typeof weights == 'undefined' || weights.length == 0)
	{
		throw 'weights must be an array of length of at least one';
	}

	var newNeuron = new Neuron(weights);
	newNeuron.id= this.neuronId;
	this.neuronId++;
	this.neurons.push(newNeuron);
	
	console.info("Created Neuron");
	return newNeuron;
}

function RemoveNeuron(neuronToRemove)
{	
	if (neuronToRemove == null)
	{
		throw "Neuron is null and cannot be not removed.";
	}
	if (this.neurons.length == 0)
	{
		throw "No neurons in the network";
	}

	var j = 0;
	
	// Remove all the links to the neuron
	while (j < this.links.length) 
	{
		if (this.links[j].from == neuronToRemove) 
		{
			this.links.splice(j, 1);
		}
		else if (this.links[j].to == neuronToRemove)
		{
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
		if (this.neurons[i] == neuronToRemove)
		{
			this.neurons.splice(i, 1);
			break;
		}
	}
	
	console.info("Removed Neuron: " + neuronToRemove.id);
}

/* 


Mathematic functions (swappable) 


*/

/**
* Calculates the Eucliden Distance between two neurons and returns it as a value
*/
function EuclideanDistance(neuron, input)
{
	if (typeof input == 'undefined' || input.length == 0)
	{
		throw "Input to the distance metric must be a non-null array.";
	}
	if (typeof neuron.weights == 'undefined' || neuron.weights.length == 0)
	{
		throw "Euclidean distance needs the weights of neuron " +  neuron.id + " to be an array";
	}
	if (neuron.weights.length != input.length)
	{
		throw "Neuron weights are of differing length, the weights must be of the same length to calculate the euclidean distance. Neuron length: " + 
				neuron.weights.length + " of neuron " + neuron.id + 
				" and input length: " + input.length;
	}
	
	var sum = 0;
	
	for (i=0; i<neuron.weights.length; i++)
	{
		// Square of the difference
		sum = sum + ((neuron.weights[i] - input[i]) * (neuron.weights[i] - input[i]));
	}
	
	return Math.sqrt(sum);
}

/**
* This method runs through the neurons and marks each one with their similarity position compared to the input
*/
function FindFocus(input)
{
	if (typeof input == 'undefined' || input.length == 0)
	{
		throw 'Could not find focus because the input is null or length 0.';
	}
	if (this.neurons.length == 0)
	{
		throw 'Could not find focus because there are no neurons in the network.';
	}

	for (var i=0; i<this.neurons.length; i++)
	{
		this.neurons[i].distanceFromInput = this.DistanceMetric(this.neurons[i], input);
	}
	
	// Order ascending
	this.neurons.sort(
		function (a,b) {
			return a.distanceFromInput - b.distanceFromInput;
		}
	);
	
	return this.neurons[0];
}

/**
* Creates a Neuron with random weights between 0 and 1. The number of weights is set by WeightLength.
* Requires the WeightLength property to be set on the psom prototype first.
*/
function CreateNeuronWithRandomisedWeights()
{
	if (typeof this.CreateNeuronWithRandomisedWeights_WeightLength == 'undefined')
	{
		throw "To use CreateNeuronWithRandomisedWeights, ensure you set the CreateNeuronWithRandomisedWeights_WeightLength  on the PSOM class when you create it. Example: psom.CreateNeuronWithRandomisedWeights_WeightLength = 0.2;";
	}
	
	var weights = new Array();
	for(i=0; i<this.CreateNeuronWithRandomisedWeights_WeightLength; i++)
	{
		weights[i] = Math.random();
	}
	
	return this.AddNeuron(weights);
}

/**
* This method creates a new neuron from the given input. The input can be a neuron or an array of weights.
*/
function CreateNeuronFromInput(input)
{
	if (typeof this.CreateNeuronFromInput_Deviation == 'undefined')
	{
		throw "To use CreateNeuronFromInput, ensure you set the CreateNeuronFromInput_Deviation on the PSOM class when you create it. Example: psom.CreateNeuronFromInput_Deviation = 0.2;";
	}
	if (input == null)
	{
		throw "CreateNeuronFromInput was passed a null input";
	}
	
	var weights = null;
	
	if (typeof input.weights == 'undefined')
	{
		// It's an array
		weights = input;
	}
	else
	{
		// It's a neuron
		weights = input.weights;
	}
	
	weights = this.AddNoiseToWeights(weights);
	return this.AddNeuron(weights);
	
}


/**
* Returns a new set of weights that are slightly different to the last set
* Deviation is the measure of how different to the input inputweights the new neuron will be.
* TODO - lots of limit values of 0 or 1 because of the hard limits
*/
function AddFlatDistributionNoiseToWeights(inputWeights)
{
	if (typeof this.AddFlatDistributionNoiseToWeights_Deviation == 'undefined')
	{
		throw "To use AddFlatDistributionNoiseToWeights, ensure you set the AddFlatDistributionNoiseToWeights_Deviation on the PSOM class when you create it. Example: psom.AddFlatDistributionNoiseToWeights_Deviation = 0.2;";
	}
	
	var deviation = this.AddFlatDistributionNoiseToWeights_Deviation;
	
	for (i=0; i<inputWeights.length; i++)
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
function CreateThreeNodeNeuronNetwork()
{
	var n1 = this.CreateNeuron();
	var n2 = this.CreateNeuron();
	var n3 = this.CreateNeuron();
			
	this.AddLink(n1, n2, Math.random());
	this.AddLink(n2, n3, Math.random());
	
}

/**
* The standard PSOM algorithm as explained in my PhD thesis
*/
function StandardPSOMAlgorithm(input)
{
	if (typeof this.StandardPSOMAlgorithm_NodeBuilding == 'undefined')
	{
		throw "To use StandardPSOMAlgorithm, ensure you set the StandardPSOMAlgorithm_NodeBuilding on the PSOM class when you create it. Example: psom.StandardPSOMAlgorithm_NodeBuilding= 0.2;";
	}
	if (typeof this.StandardPSOMAlgorithm_ClusterThreshold == 'undefined')
	{
		throw "To use StandardPSOMAlgorithm, ensure you set the StandardPSOMAlgorithm_ClusterThreshold on the PSOM class when you create it. Example: psom.StandardPSOMAlgorithm_ClusterThreshold = 0.2;";
	}
	if (typeof this.StandardPSOMAlgorithm_LearningRate == 'undefined')
	{
		throw "To use StandardPSOMAlgorithm, ensure you set the StandardPSOMAlgorithm_LearningRate on the PSOM class when you create it. Example: psom.StandardPSOMAlgorithm_LearningRate = 0.2;";
	}
	if (typeof this.StandardPSOMAlgorithm_LearningRate == 'undefined')
	{
		throw "To use StandardPSOMAlgorithm, ensure you set the StandardPSOMAlgorithm_LearningRate on the PSOM class when you create it. Example: psom.StandardPSOMAlgorithm_LearningRate = 0.2;";
	}

	var focus = this.FindFocus(input);
	console.info("Focus was " + focus.id + " with a distance of: " + focus.distanceFromInput);
	
	if (focus.distanceFromInput > this.StandardPSOMAlgorithm_NodeBuilding)
	{
		console.info("Creating new neuron group");
		this.CreateNodeGroup(focus);
	}
	else
	{
		console.info("Updating focus and neighbourhood");
		this.UpdateNeuron(focus, input, this.StandardPSOMAlgorithm_LearningRate);
		
		this.UpdateNeighbourhood(focus, this.StandardPSOMAlgorithm_LearningRate);
	}
	
	console.info("Network aging");
	this.Age();
	
	console.info("Prune network");
	this.RemoveDeadLinks();
	this.RemoveDeadNeurons();
}

/**
* Updates the neuron to become more similar to the target
*/
function UpdateNeuron(neuronToUpdate, target, learningRate)
{
	// If a neuron was passed in, we update target to be just the weights
	if (typeof target.weights != 'undefined')
	{
		target = target.weights;
	}

	for(var i=0; i<neuronToUpdate.weights.length; i++)
	{
		neuronToUpdate.weights[i] = neuronToUpdate.weights[i] 
			+ (learningRate * (target[i] - neuronToUpdate.weights[i]));
	}
}

/**
* Updates all the neurons connected to the focus
*/
function UpdateNeighbourhood(focus, learningRate)
{

	for (var i=0; i < this.links.length; i++)
	{
		var target = null;
		if (this.links[i].from == focus)
		{
			target = this.links[i].to;
		}
		else if (this.links[i].to == focus)
		{
			target = this.links[i].from;
		}
		
		if (target != null)
		{
			// Update link length
			this.links[i].value = this.DistanceMetric(focus, target.weights);
			
			
			// Update neuron weights
			var pushOrPull = 0;
			if (this.links[i].value > this.StandardPSOMAlgorithm_ClusterThreshold)
			{
				// Push away
				pushOrPull = -1;
				console.info("Pushing neuron '" + target.id + "' away from '" + focus.id + "'");
			}
			else
			{
				// Put toward
				pushOrPull = 1;
				console.info("Pulling neuron '" + target.id + "' toward '" + focus.id + "'");
			}
			
			console.info("distance before: " + this.DistanceMetric(this.links[i].to,  this.links[i].from.weights));
			
			this.UpdateNeuron(this.links[i].to, this.links[i].from, (pushOrPull * learningRate * this.links[i].value))
			
			console.info("distance after: " + this.DistanceMetric(this.links[i].to,  this.links[i].from.weights));

			
		}
	}
}

/**
* This method increases all the link lengths by the AgeNetwork_AgeRate parameter
*/
function AgeNetwork()
{
	if (typeof this.AgeNetwork_AgeRate == 'undefined')
	{
		throw "To use AgeNetwork, ensure you set the AgeNetwork_AgeRate on the PSOM class when you create it. Example: psom.AgeNetwork_AgeRate= 0.2;";
	}
	for(var i=0; i<this.links.length; i++)
	{
		this.links[i].value += this.AgeNetwork_AgeRate;
	}
}

/**
* Used by the RemoveDeadLinks method, this method removes all the links above the link removal threshold
*/
function RemoveLinksAboveThreshold()
{
	if (typeof this.RemoveLinksAboveThreshold_AgeThreshold == 'undefined')
	{
		throw "To use RemoveLinksAboveThreshold, ensure you set the RemoveLinksAboveThreshold_AgeThreshold on the PSOM class when you create it. Example: psom.RemoveLinksAboveThreshold_AgeThreshold = 0.2;";
	}
	// Go backwards when removing multiple items so that the indexes don't keep changing
	for(var i=this.links.length-1; i >= 0; i--)
	{
		if (this.links[i].value > this.RemoveLinksAboveThreshold_AgeThreshold)
		{
			this.links[i].to.linkCount--;
			this.links[i].from.linkCount--;
			this.links.splice(i,1);
		}
		
	}
	
}

/**
* This method removes all the neurons that have no links attached to them
*/
function RemoveUnlinkedNeurons()
{
	for(var i=this.neurons.length-1; i>=0; i--)
	{
		if (this.neurons[i].linkCount == 0)
		{
			this.neurons.splice(i,1);
		}
	}
}

/**
* This method creates three new neurons based on the focus. The three new nodes are linked together
* and then the first neuron is linked to the most similar neuron in the network.
*/
function CreateThreeNodeGroup(focus)
{
	var n1 = this.CreateNeuronFromInput(focus);
	var n2 = this.CreateNeuronFromInput(focus);
	var n3 = this.CreateNeuronFromInput(focus);
	
	this.AddLink(n1, n2, this.DistanceMetric(n1, n2));
	this.AddLink(n2, n3, this.DistanceMetric(n2, n3));
	this.AddLink(n3, n1, this.DistanceMetric(n3, n1));
	
	// Rely on the fact that the neurons are sorted in order
	this.AddLink(n1, this.neurons[0], this.DistanceMetric(n1, this.neurons[0].weights));
	this.AddLink(n1, this.neurons[1], this.DistanceMetric(n1, this.neurons[1].weights));
}
