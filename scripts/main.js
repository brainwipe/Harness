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
				var json = '{"Name": "Test Harness 1362089857292","Blocks": [{"Id" : "ScalarSource1","Name" : "Scalar Source","Factory" : "ScalarSourceFactory","View" : {"Left" : "571","Top" : "108","Width" : "145","Height" : "230"}},{"Id" : "ScalarSink2","Name" : "Scalar Sink","Factory" : "ScalarSinkFactory","View" : {"Left" : "908","Top" : "83","Width" : "204","Height" : "204"}}], "Connectors": [{ "id" : "ScalarSource1-socket-output-Value:ScalarSink2-socket-input-Value", "from" : "ScalarSource1-socket-output-Value", "to" : "ScalarSink2-socket-input-Value" }]}';
				harnessFactory.BuildFromJSON(harness, json);
			});
	});
});
