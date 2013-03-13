define(
[
	'harness/views/block/properties/propertiesviewbase'
],

function(PropertiesViewBase) {

	function ScalarSinkPropertiesView(block) {
		this.Block = block;
		this.Id = this.Block.Id + '-properties';
		this.Base = new PropertiesViewBase();
	}

	ScalarSinkPropertiesView.prototype.Block = null;
	ScalarSinkPropertiesView.prototype.Id = null;
	ScalarSinkPropertiesView.prototype.Base = null;
	ScalarSinkPropertiesView.prototype.Create = function() {
		this.Base.Create(this.Id, this.Block);
		this.BindEvents();
	};

	ScalarSinkPropertiesView.prototype.BindEvents = function() {

	};

	ScalarSinkPropertiesView.prototype.Update = function() {
		this.Base.Update(this.Id, this.Block);
	};

	return (ScalarSinkPropertiesView);
});