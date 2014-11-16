define(
[],
function() {

	function PSOMD3EventHandler(mypsom, myd3force) {
		this.PSOM = mypsom;
		this.D3Force = myd3force;
		this.D3ForceNodes = myd3force.nodes();
		this.D3ForceLinks = myd3force.links();

		this.AttachEventsToPSOM();
	}

	PSOMD3EventHandler.prototype.LongestLinkLength = 200;
	PSOMD3EventHandler.prototype.PSOM = null;
	PSOMD3EventHandler.prototype.D3Force = null;
	PSOMD3EventHandler.prototype.D3ForceNodes = null;
	PSOMD3EventHandler.prototype.D3ForceLinks = null;

	PSOMD3EventHandler.prototype.AttachEventsToPSOM = function()
	{
		this.PSOM.on("AddNeuron", this, function(caller, eneuron) {
			eneuron.D3Node = new D3Node(eneuron.id);
			caller.D3ForceNodes.push(eneuron.D3Node);
		});

		this.PSOM.on("AddLink", this, function(caller, elink) {
			elink.D3Link = new D3Link(elink.from.D3Node, elink.to.D3Node, elink.value);
			caller.D3ForceLinks.push(elink.D3Link);
		});

		this.PSOM.on("RemoveLink", this, function(caller, elink) {
			RemoveFromArray(caller.D3ForceLinks, elink.D3Link);
		});

		this.PSOM.on("RemoveNeuron", this, function(caller, elink) {
			RemoveFromArray(caller.D3ForceNodes, elink.D3Node);
		});

		this.PSOM.on("AlgorithmIterationComplete", this, function(caller, context) {
			for (var i = 0; i < context.links.length; i++) {
				context.links[i].D3Link.SetLength(context.links[i].value);
			}
		});
	};

	PSOMD3EventHandler.prototype.Build = function()
	{
		for (var neuronId in this.PSOM.neurons)
		{
			var neuron = this.PSOM.neurons[neuronId];
			neuron.D3Node = new D3Node(neuron.id);
			this.D3ForceNodes.push(neuron.D3Node);
		}

		for (var linkId in this.PSOM.links)
		{
			var link = this.PSOM.links[linkId];
			link.D3Link = new D3Link(link.from.D3Node, link.to.D3Node, link.value);
			this.D3ForceLinks.push(link.D3Link);
		}
	};

	function D3Node(myNeuronId) {
		this.neuronId = myNeuronId;
	};
	D3Node.prototype.x = null;
	D3Node.prototype.y = null;
	D3Node.prototype.neuronId = -1;

	function D3Link(mysource, mytarget, myweight) {
		this.source = mysource;
		this.target = mytarget;
		this.SetLength(myweight);
	};
	D3Link.prototype.LongestLinkLength = 100;
	D3Link.prototype.SetLength = function (newLength)
	{
		this.value = newLength * this.LongestLinkLength;
		return this.value;
	};

	return (PSOMD3EventHandler);
});