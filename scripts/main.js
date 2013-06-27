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
		'bootstrap': '../vendor/bootstrap/scripts/bootstrap.min',
		'bootbox' : '../vendor/bootstrap/scripts/bootbox.min',
		'stringlib': 'lib/stringlib',
		'domReady': '../vendor/requirejs/domReady',
		'text' : '../vendor/requirejs/text',
		'd3': '../vendor/d3/d3.min',

		'exception': 'harness',
		'psom' : 'algorithm/psom',
		'PSOMD3EventHandler' : 'visualisations/PSOMD3EventHandler'

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
			deps: ['jquery']
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

		'PSOMD3EventHandler' : {
			exports: 'PSOMD3EventHandler'
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
	'harness/HarnessFactory',
	'harness/views/blockbrowser',
	'harness/views/validationbrowser',
	'harness/views/notify',
	'harness/engines/HarnessSerializer',
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
	});
});
