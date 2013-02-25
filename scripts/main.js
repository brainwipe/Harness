var harness;
var blockbrowser;
var validationbrowser;

require.config({
	paths: {
		"order": "lib/requirejs/order",
		"jquery": "https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min",
		"jquery-ui": "https://ajax.googleapis.com/ajax/libs/jqueryui/1.8.18/jquery-ui.min",
		"underscore": "lib/underscore-min",
		"bootstrap": "lib/bootstrap.min",
		"exception": "harness",
		"stringlib": "lib/stringlib"
	}
});

require(
[
	"order!jquery",
	"order!jquery-ui",
	"order!underscore",
	"order!bootstrap",
	"harness/HarnessFactory",
	"harness/views/blockbrowser",
	"harness/views/validationbrowser"
],
function($, jqueryui, underscore, bootstrap, HarnessFactory, BlockBrowser, ValidationBrowser) {
	
	$(function() {
		var harnessFactory = new HarnessFactory();
		harness = harnessFactory.Build($("#harness"));
		blockbrowser = new BlockBrowser(harness);
		blockbrowser.CreateMarkup();
		blockbrowser.GetBlocks();

		validationbrowser = new ValidationBrowser(harness);
		validationbrowser.CreateMarkup();

		harness.ResizeCanvas();
	});
});
 