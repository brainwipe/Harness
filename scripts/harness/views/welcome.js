define(
[
	'harness/views/templaterender',
	'text!harness/views/templates/welcome.html'
],
	function(TemplateRender, WelcomeTemplate) {

	function Welcome(harnessFactory, helpDialog) 
	{
		this.TemplateRender = new TemplateRender();
		this.HarnessFactory = harnessFactory;
		this.HelpDialog = helpDialog;
	};

	Welcome.prototype.HarnessFactory = null;
	Welcome.prototype.TemplateRender = null;
	Welcome.prototype.HelpDialog = null;

	Welcome.prototype.IsDevelopment = function()
	{
		var hash = window.location.hash;
		return (hash === "#dev");
	};

	Welcome.prototype.CreateMarkup = function()
	{
		if (this.IsDevelopment())
		{
			this.BuildExample();
			this.HelpDialog.Hide();
		}
		else
		{
			$("body").append(this.TemplateRender.Render(
					WelcomeTemplate));

			$("#clickhere").on("click", $.proxy(this.BuildExample, this));
		}
	};

	Welcome.prototype.BuildExample = function()
	{
		$("#welcome").css("display","none");
		$("#harness").css("display","block");

		var simpleModel = '{"Name": "Test Harness 1414627257539","Blocks": [{"Id" : "ArraySource1","Name" : "Array Source","Type" : "ArraySource","Data" : {"CurrentIndex":-1,"Values":[[0,0,1],[0,1,0],[1,0,0]]},"View" : {"Left":100,"Top":68,"Width":208,"Height":208},"Sockets" : {"Outputs" : [{"Id":"Vector","Name":"Vector","BlockId":"ArraySource1","Type":{"Key":"Harness.Socket.Type.Vector","Description":"A 1 dimensional array of values"},"CanBeDeleted":false,"IsMultiple":false,"IsInputSocket":false,"IsRequired":false,"IsDataSocket":false,"DataSocketPropertyId":null}]}},{"Id" : "ScalarSink2","Name" : "Scalar Sink","Type" : "ScalarSink","Data" : "Empty","View" : {"Left":832,"Top":67,"Width":208,"Height":236},"Sockets" : {"Inputs" : [{"Id":"Value","Name":"Value","BlockId":"ScalarSink2","Type":{"Key":"Harness.Socket.Type.Scalar","Description":"A single value"},"CanBeDeleted":false,"IsMultiple":false,"IsInputSocket":true,"IsRequired":true,"IsDataSocket":false,"DataSocketPropertyId":null}]}},{"Id" : "PSOM3","Name" : "PSOM","Type" : "PSOMFunc","Data" : {"Console":{"warninglevel":"debug"},"neurons":[{"weights":[0.5672427562531084,0.10992770385928452,0.805199978640303],"id":0,"linkCount":1,"D3Node":{"neuronId":0,"index":0,"weight":1,"px":174.22309126177933,"py":187.98551959860555,"x":174.2633798960472,"y":188.1137621920917}},{"weights":[0.2865230063907802,0.6999853341840208,0.8453030081000179],"id":1,"linkCount":2,"D3Node":{"neuronId":1,"index":1,"weight":2,"px":162.36576597014115,"py":196.1384167283623,"x":161.99886412698748,"y":196.81390787985737}},{"weights":[0.2001305513549596,0.010515010915696621,0.16544968681409955],"id":2,"linkCount":1,"D3Node":{"neuronId":2,"index":2,"weight":1,"px":215.49497891465765,"py":223.69404862455588,"x":215.9701979574337,"y":223.58231556318097}}],"links":[{"from":{"weights":[0.5672427562531084,0.10992770385928452,0.805199978640303],"id":0,"linkCount":1,"D3Node":{"neuronId":0,"index":0,"weight":1,"px":174.22309126177933,"py":187.98551959860555,"x":174.2633798960472,"y":188.1137621920917}},"to":{"weights":[0.2865230063907802,0.6999853341840208,0.8453030081000179],"id":1,"linkCount":2,"D3Node":{"neuronId":1,"index":1,"weight":2,"px":162.36576597014115,"py":196.1384167283623,"x":161.99886412698748,"y":196.81390787985737}},"value":0.011151259066537023,"D3Link":{"source":{"neuronId":0,"index":0,"weight":1,"px":174.22309126177933,"py":187.98551959860555,"x":174.2633798960472,"y":188.1137621920917},"target":{"neuronId":1,"index":1,"weight":2,"px":162.36576597014115,"py":196.1384167283623,"x":161.99886412698748,"y":196.81390787985737},"value":1.1151259066537023}},{"from":{"weights":[0.2865230063907802,0.6999853341840208,0.8453030081000179],"id":1,"linkCount":2,"D3Node":{"neuronId":1,"index":1,"weight":2,"px":162.36576597014115,"py":196.1384167283623,"x":161.99886412698748,"y":196.81390787985737}},"to":{"weights":[0.2001305513549596,0.010515010915696621,0.16544968681409955],"id":2,"linkCount":1,"D3Node":{"neuronId":2,"index":2,"weight":1,"px":215.49497891465765,"py":223.69404862455588,"x":215.9701979574337,"y":223.58231556318097}},"value":0.5875436735805124,"D3Link":{"source":{"neuronId":1,"index":1,"weight":2,"px":162.36576597014115,"py":196.1384167283623,"x":161.99886412698748,"y":196.81390787985737},"target":{"neuronId":2,"index":2,"weight":1,"px":215.49497891465765,"py":223.69404862455588,"x":215.9701979574337,"y":223.58231556318097},"value":58.75436735805124}}],"configuration":{"CreateNeuronWithRandomisedWeights_WeightLength":3,"CreateNeuronFromInput_Deviation":0.05,"AddFlatDistributionNoiseToWeights_Deviation":0.2,"StandardPSOMAlgorithm_NodeBuilding":0.29,"StandardPSOMAlgorithm_ClusterThreshold":0.23,"StandardPSOMAlgorithm_LearningRate":0.9,"AgeNetwork_AgeRate":0.01,"RemoveLinksAboveThreshold_AgeThreshold":0.9},"configurationtext":{"CreateNeuronWithRandomisedWeights_WeightLength":"Neuron create random weight length","CreateNeuronFromInput_Deviation":"Neuron create deviation from input","AddFlatDistributionNoiseToWeights_Deviation":"Add flat noise to weights deviation","StandardPSOMAlgorithm_NodeBuilding":"Algorithm node building threshold","StandardPSOMAlgorithm_ClusterThreshold":"Algorithm cluster threshold","StandardPSOMAlgorithm_LearningRate":"Algorithm learning rate","AgeNetwork_AgeRate":"Algorithm aging rate","RemoveLinksAboveThreshold_AgeThreshold":"Remove link age threshold"},"distanceFromInput":0,"neuronId":3},"View" : {"Left":366,"Top":68,"Width":408,"Height":464},"Sockets" : {"Inputs" : [{"Id":"InputPattern","Name":"InputPattern","BlockId":"PSOM3","Type":{"Key":"Harness.Socket.Type.Vector","Description":"A 1 dimensional array of values"},"CanBeDeleted":false,"IsMultiple":false,"IsInputSocket":true,"IsRequired":true,"IsDataSocket":false,"DataSocketPropertyId":null}],"Outputs" : [{"Id":"LastError","Name":"LastError","BlockId":"PSOM3","Type":{"Key":"Harness.Socket.Type.Scalar","Description":"A single value"},"CanBeDeleted":false,"IsMultiple":false,"IsInputSocket":false,"IsRequired":false,"IsDataSocket":false,"DataSocketPropertyId":null}]}}], "Connectors": [{ "id" : "ArraySource1-socket-output-Vector:PSOM3-socket-input-InputPattern", "from" : "ArraySource1-socket-output-Vector", "to" : "PSOM3-socket-input-InputPattern" },{ "id" : "PSOM3-socket-output-LastError:ScalarSink2-socket-input-Value", "from" : "PSOM3-socket-output-LastError", "to" : "ScalarSink2-socket-input-Value" }]}';
        this.HarnessFactory.BuildFromJSON(harness, simpleModel);
	};

	return (Welcome);
});