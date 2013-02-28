var harness;
var blockbrowser;
var validationbrowser;
var notify;

require.config({
	paths: {
		"order": "lib/requirejs/order",
		"jquery": "https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min",
		"jquery-ui": "https://ajax.googleapis.com/ajax/libs/jqueryui/1.8.18/jquery-ui.min",
		"underscore": "lib/underscore-min",
		"bootstrap": "lib/bootstrap.min",
		"exception": "harness",
		"stringlib": "lib/stringlib",
		"decycle": "lib/decycle.min"
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
	"harness/views/validationbrowser",
	"harness/views/notify",
	"harness/engines/HarnessSerializer"
],
function($, jqueryui, underscore, bootstrap, HarnessFactory, BlockBrowser, ValidationBrowser, Notify, HarnessSerializer) {
	
	$(function() {
		var harnessFactory = new HarnessFactory();
		harness = harnessFactory.Build($("#harness"));
		blockbrowser = new BlockBrowser(harness);
		blockbrowser.CreateMarkup();
		blockbrowser.GetBlocks();

		validationbrowser = new ValidationBrowser(harness);
		validationbrowser.CreateMarkup();

		notify = new Notify();

		harness.ResizeCanvas();

		// TEST! BURN! - brainwipe
			$('#stringifytest').click(function() {

				var h = new HarnessSerializer();
      			console.log(h.HarnessToJSON(harness));
    		});

    		$('#loadtest').click(function() {
				var json = '{"Name": "Test Harness 1362072564892","Blocks": [{"Id" : "ScalarSource1","Name" : "Scalar Source","Factory" : "ScalarSourceFactory","View" : {"Left" : "358","Top" : "78","Width" : "574","Height" : "215"}},{"Id" : "ScalarSink2","Name" : "Scalar Sink","Factory" : "ScalarSinkFactory","View" : {"Left" : "1302","Top" : "87","Width" : "138","Height" : "95"}}]}';
				harness = harnessFactory.BuildFromJSON($("#harness"), json);
    		});
	});
});
 