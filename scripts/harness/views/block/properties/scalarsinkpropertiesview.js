define(
[
	'harness/views/block/properties/propertiesviewbase'
],

function(PropertiesViewBase) {

	function ScalarSinkPropertiesView(block) {
		PropertiesViewBase.call(this, block);
	}

	ScalarSinkPropertiesView.prototype = Object.create( PropertiesViewBase.prototype );
   ScalarSinkPropertiesView.prototype.constructor = ScalarSinkPropertiesView;

	return (ScalarSinkPropertiesView);
});