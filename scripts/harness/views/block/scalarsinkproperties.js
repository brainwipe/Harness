define(
[
	"jquery",
	"jquery-ui",
	"underscore",
	"harness/views/block/propertiespainter"
],

function($, jqueryui, _, PropertiesPainter) {

	function ScalarSinkProperties(block) {
		this.Block = block;
		this.Id = this.Block.Id + '-properties';
		this.Painter = new PropertiesPainter();
	};
		
	ScalarSinkProperties.prototype.Block = null;
	ScalarSinkProperties.prototype.Id = null;
	ScalarSinkProperties.prototype.Painter = null;
	ScalarSinkProperties.prototype.Create = function() {
		this.Painter.Create(this.Id, this.Block, this.CreateTabs());
	}
	ScalarSinkProperties.prototype.CreateTabs = function() {
		var tabs = new Array()
		tabs.push({
			'Id' : this.Id + '-configuration',
			'Name': 'Configuration',
			'Content': this.CreateConfigurationContent()
			});
			
		return tabs;
	};
	ScalarSinkProperties.prototype.CreateConfigurationContent = function() {
		return "Sink content";
	};
	
	ScalarSinkProperties.prototype.Update = function() {
		this.Painter.Update(this.Id, this.Block);
	};
	
	return (ScalarSinkProperties);
});