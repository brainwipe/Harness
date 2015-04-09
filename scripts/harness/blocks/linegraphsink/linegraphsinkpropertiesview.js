define(
[
	'harness/views/block/properties/propertiesviewbase'
],

function(PropertiesViewBase) {

	function LineGraphSinkPropertiesView(block) {
		PropertiesViewBase.call(this, block);
	}

	LineGraphSinkPropertiesView.prototype = Object.create( PropertiesViewBase.prototype );
   LineGraphSinkPropertiesView.prototype.constructor = LineGraphSinkPropertiesView;

	return (LineGraphSinkPropertiesView);
});