var theBootbox;
var harness;
var blockbrowser;
var validationbrowser;
var notify;
var savedialog;
var loaddialog;
var importexportmodeldialog;

require.config({
	paths: {
		'jquery': '../vendor/jquery/jquery.min',
		'jqueryui' : '../vendor/jquery/jquery-ui-1.10.3/ui/minified/jquery-ui.min',
		'underscore': '../vendor/underscore/underscore-min',
		'bootstrap': '../vendor/bootstrap/js/bootstrap.min',
		'bootbox' : '../vendor/bootstrap/js/bootbox.min',
		'stringlib': 'lib/stringlib',
		'domReady': '../vendor/requirejs/domReady',
		'text' : '../vendor/requirejs/text',
		'd3': '../vendor/d3/d3.min',

		'exception': 'harness',
		'psom' : 'algorithm/psom',
		'psomd3eventhandler' : 'visualisations/psomd3eventhandler'

	},
	shim: {
		'jquery': {
			exports: '$'
		},

      'jqueryui': {
			deps: ['jquery'],
			exports: 'jqueryui'
		},

		'bootstrap': {
			deps: ['jquery', 'jqueryui']
		},

		'bootbox': {
			deps: ['bootstrap']
		},

		'underscore': {
			exports: '_'
		},

		'psom' : {
			exports: 'psom'
		},

		'd3' : {
			exports: 'd3'
		},

		'psomd3eventhandler' : {
			exports: 'psomd3eventhandler'
		}
	}
});

require(
[
	'jquery',
	'jqueryui',
	'domReady',
	'bootstrap',
	'bootbox',
	'harness/harnessfactory',
	'harness/views/blockbrowser',
	'harness/views/validationbrowser',
	'harness/views/notify',
	'harness/engines/harnessserializer',
	'harness/views/savedialog',
	'harness/views/loaddialog',
	'harness/views/importexportmodeldialog'
],
function($,
	jqueryui,
	domReady,
	bootstrap,
	bootbox,
	HarnessFactory,
	BlockBrowser,
	ValidationBrowser,
	Notify,
	HarnessSerializer,
	SaveDialog,
	LoadDialog,
	ImportExportModelDialog) {

	domReady(function() {
		var harnessFactory = new HarnessFactory();
		harness = harnessFactory.Build($("#harness"));

		blockbrowser = new BlockBrowser(harness);
		blockbrowser.CreateMarkup();
		blockbrowser.GetBlocks();

		validationbrowser = new ValidationBrowser(harness);
		validationbrowser.CreateMarkup();

		notify = new Notify();

		savedialog = new SaveDialog();
		savedialog.CreateMarkup();

		loaddialog = new LoadDialog();
		loaddialog.CreateMarkup();

		importexportmodeldialog = new ImportExportModelDialog();
		importexportmodeldialog.CreateMarkup();

		harness.ResizeCanvas();

		theBootbox = bootbox;

		/* Temporary welcome stuff for DeepMind below here */
		$("#welcome > div").append('<button id="clickhere" type="button" class="btn btn-primary btn-large">Give it a go!</button>');

		$("#clickhere").click(function() {
			$("#welcome").css("display","none");
			$("#harness").css("display","block");

			var simpleModel = '{"Name":"Test Harness 1414627257539","Blocks":[{"Id":"ArraySource1","Name":"Array Source","Type":"ArraySource","Data":{"CurrentIndex":-1,"Values":[[0,0,1],[0,1,0],[1,0,0]]},"View":{"Left":276,"Top":77,"Width":204,"Height":204},"Sockets":{"Outputs":[{"Id":"Vector","Name":"Vector","BlockId":"ArraySource1","Type":{"Key":"Harness.Socket.Type.Vector","Description":"A 1 dimensional array of values"},"CanBeDeleted":false,"IsMultiple":false,"IsInputSocket":false,"IsRequired":false,"IsDataSocket":false,"DataSocketPropertyId":null}]}},{"Id":"ScalarSink2","Name":"Scalar Sink","Type":"ScalarSink","Data":"Empty","View":{"Left":1121,"Top":72,"Width":204,"Height":232},"Sockets":{"Inputs":[{"Id":"Value","Name":"Value","BlockId":"ScalarSink2","Type":{"Key":"Harness.Socket.Type.Scalar","Description":"A single value"},"CanBeDeleted":false,"IsMultiple":false,"IsInputSocket":true,"IsRequired":true,"IsDataSocket":false,"DataSocketPropertyId":null}]}},{"Id":"PSOM3","Name":"PSOM","Type":"PSOMFunc","Data":{"Console":{"warninglevel":"debug"},"neurons":[{"weights":[0.5672427562531084,0.10992770385928452,0.805199978640303],"id":0,"linkCount":1,"D3Node":{"neuronId":0,"index":0,"weight":1,"px":174.65865789208334,"py":209.88547348421582,"x":174.66659424808597,"y":209.8579412522266}},{"weights":[0.2865230063907802,0.6999853341840208,0.8453030081000179],"id":1,"linkCount":2,"D3Node":{"neuronId":1,"index":1,"weight":2,"px":163.6574850515836,"py":200.20627341175972,"x":163.59170918636687,"y":200.0431032094345}},{"weights":[0.2001305513549596,0.010515010915696621,0.16544968681409955],"id":2,"linkCount":1,"D3Node":{"neuronId":2,"index":2,"weight":1,"px":218.51227877141608,"py":176.7483130424016,"x":218.6213316758797,"y":176.78944998823877}}],"links":[{"from":{"weights":[0.5672427562531084,0.10992770385928452,0.805199978640303],"id":0,"linkCount":1,"D3Node":{"neuronId":0,"index":0,"weight":1,"px":174.65865789208334,"py":209.88547348421582,"x":174.66659424808597,"y":209.8579412522266}},"to":{"weights":[0.2865230063907802,0.6999853341840208,0.8453030081000179],"id":1,"linkCount":2,"D3Node":{"neuronId":1,"index":1,"weight":2,"px":163.6574850515836,"py":200.20627341175972,"x":163.59170918636687,"y":200.0431032094345}},"value":0.011151259066537023,"D3Link":{"source":{"neuronId":0,"index":0,"weight":1,"px":174.65865789208334,"py":209.88547348421582,"x":174.66659424808597,"y":209.8579412522266},"target":{"neuronId":1,"index":1,"weight":2,"px":163.6574850515836,"py":200.20627341175972,"x":163.59170918636687,"y":200.0431032094345},"value":1.1151259066537023}},{"from":{"weights":[0.2865230063907802,0.6999853341840208,0.8453030081000179],"id":1,"linkCount":2,"D3Node":{"neuronId":1,"index":1,"weight":2,"px":163.6574850515836,"py":200.20627341175972,"x":163.59170918636687,"y":200.0431032094345}},"to":{"weights":[0.2001305513549596,0.010515010915696621,0.16544968681409955],"id":2,"linkCount":1,"D3Node":{"neuronId":2,"index":2,"weight":1,"px":218.51227877141608,"py":176.7483130424016,"x":218.6213316758797,"y":176.78944998823877}},"value":0.5875436735805124,"D3Link":{"source":{"neuronId":1,"index":1,"weight":2,"px":163.6574850515836,"py":200.20627341175972,"x":163.59170918636687,"y":200.0431032094345},"target":{"neuronId":2,"index":2,"weight":1,"px":218.51227877141608,"py":176.7483130424016,"x":218.6213316758797,"y":176.78944998823877},"value":58.75436735805124}}],"configuration":{"CreateNeuronWithRandomisedWeights_WeightLength":3,"CreateNeuronFromInput_Deviation":0.05,"AddFlatDistributionNoiseToWeights_Deviation":0.2,"StandardPSOMAlgorithm_NodeBuilding":0.29,"StandardPSOMAlgorithm_ClusterThreshold":0.23,"StandardPSOMAlgorithm_LearningRate":0.9,"AgeNetwork_AgeRate":0.01,"RemoveLinksAboveThreshold_AgeThreshold":0.9},"configurationtext":{"CreateNeuronWithRandomisedWeights_WeightLength":"Neuron create random weight length","CreateNeuronFromInput_Deviation":"Neuron create deviation from input","AddFlatDistributionNoiseToWeights_Deviation":"Add flat noise to weights deviation","StandardPSOMAlgorithm_NodeBuilding":"Algorithm node building threshold","StandardPSOMAlgorithm_ClusterThreshold":"Algorithm cluster threshold","StandardPSOMAlgorithm_LearningRate":"Algorithm learning rate","AgeNetwork_AgeRate":"Algorithm aging rate","RemoveLinksAboveThreshold_AgeThreshold":"Remove link age threshold"},"distanceFromInput":0,"neuronId":3},"View":{"Left":567,"Top":67,"Width":404,"Height":432},"Sockets":{"Inputs":[{"Id":"InputPattern","Name":"InputPattern","BlockId":"PSOM3","Type":{"Key":"Harness.Socket.Type.Vector","Description":"A 1 dimensional array of values"},"CanBeDeleted":false,"IsMultiple":false,"IsInputSocket":true,"IsRequired":true,"IsDataSocket":false,"DataSocketPropertyId":null}],"Outputs":[{"Id":"LastError","Name":"LastError","BlockId":"PSOM3","Type":{"Key":"Harness.Socket.Type.Scalar","Description":"A single value"},"CanBeDeleted":false,"IsMultiple":false,"IsInputSocket":false,"IsRequired":false,"IsDataSocket":false,"DataSocketPropertyId":null}]}}],"Connectors":[{"id":"ArraySource1-socket-output-Vector:PSOM3-socket-input-InputPattern","from":"ArraySource1-socket-output-Vector","to":"PSOM3-socket-input-InputPattern"},{"id":"PSOM3-socket-output-LastError:ScalarSink2-socket-input-Value","from":"PSOM3-socket-output-LastError","to":"ScalarSink2-socket-input-Value"}]}';
			var harnessFactory = new HarnessFactory();
            harnessFactory.BuildFromJSON(harness, simpleModel);

            $("#harness-engine-controls-start").tooltip(
            	{'placement' : 'bottom',
            	'trigger' : 'manual',
            	'title' : 'Click here to start training!'});

            $('#harness-engine-controls-start').tooltip('show');
		});

		/* End temporary */
	});
});
