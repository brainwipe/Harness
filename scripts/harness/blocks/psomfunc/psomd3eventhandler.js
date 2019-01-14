export default class {

	constructor(mypsom, nodes, links) {
		this.PSOM = mypsom;
		this.D3ForceNodes = nodes;
		this.D3ForceLinks = links;
		this.LongestLinkLength = 200;
		this.AttachEventsToPSOM();
	}

	AttachEventsToPSOM() {
		this.PSOM.on("AddNeuron", this, function(caller, eneuron) {
			caller.D3ForceNodes.push({"neuronId":eneuron.id, "x": 0, "y": 0});
		});

		this.PSOM.on("AddLink", this, function(caller, elink) {
			caller.D3ForceLinks.push({"source":elink.from.D3Node, "target":elink.to.D3Node, "value": elink.value * 100});
		});

		this.PSOM.on("RemoveLink", this, function(caller, elink) {
			RemoveFromArray(caller.D3ForceLinks, elink.D3Link);
		});

		this.PSOM.on("RemoveNeuron", this, function(caller, elink) {
			RemoveFromArray(caller.D3ForceNodes, elink.D3Node);
		});

		this.PSOM.on("AlgorithmIterationComplete", this, function(caller, context) {
			for (var i = 0; i < context.links.length; i++) {
				context.links[i].D3Link.value(context.links[i].value * 100);
			}
		});
	}

	Build()	{
		for (var neuronId in this.PSOM.neurons) {
			var neuron = this.PSOM.neurons[neuronId];
			neuron.D3Node = {"neuronId":neuron.id, "x": 0, "y": 0};
			this.D3ForceNodes.push(neuron.D3Node);
		}

		for (var linkId in this.PSOM.links) {
			var link = this.PSOM.links[linkId];
			this.D3ForceLinks.push({"source":link.from.D3Node, "target":link.to.D3Node, "value": link.value * 100});
		}
	}
}