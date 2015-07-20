var theBootbox;
var harness;
var blockbrowser;
var validationbrowser;
var notify;
var importexportmodeldialog;

require.config({
	paths: {
		'jquery': '../vendor/jquery/jquery.min',
		'jqueryui' : '../vendor/jquery/jquery-ui-1.10.3/ui/minified/jquery-ui.min',
		'underscore': '../vendor/underscore/underscore-min',
		'bootstrap': '../vendor/bootstrap/js/bootstrap.min',
		'bootbox' : '../vendor/bootstrap/js/bootbox.min',
		'stringlib': './lib/stringlib',
		'domReady': '../vendor/requirejs/domReady',
		'text' : '../vendor/requirejs/text',
		'd3': '../vendor/d3/d3.min',
		'jsplumb': '../vendor/jsplumb/js/dom.jsPlumb-1.7.2-min',

		'exception': 'harness',
		'psom' : './lib/psom'
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

		'jsplumb' : {
			exports: 'jsplumb'
		},
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
	'harness/views/importexportmodeldialog',
	'harness/views/helpdialog',
	'harness/views/welcome'
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
	ImportExportModelDialog,
	HelpDialog,
	Welcome) {

	domReady(function() {
		theBootbox = bootbox;

		validationbrowser = new ValidationBrowser();
		
		var harnessFactory = new HarnessFactory();
		harness = harnessFactory.Build($("#harness"));

		blockbrowser = new BlockBrowser(harness);
		blockbrowser.CreateMarkup();
		blockbrowser.GetBlocks();

		validationbrowser.CreateMarkup();

		notify = new Notify();

		var loaddialog = new LoadDialog();
		loaddialog.CreateMarkup();

		var savedialog = new SaveDialog(loaddialog);
		savedialog.CreateMarkup();


		importexportmodeldialog = new ImportExportModelDialog();
		importexportmodeldialog.CreateMarkup();

		var helpdialog = new HelpDialog();
		helpdialog.CreateMarkup();

		var welcome = new Welcome(harnessFactory, helpdialog);
		welcome.CreateMarkup();
	});
});
