define(
[
	"jquery",
	"jquery-ui",
	"underscore",
	"harness/views/block/propertiespainter"
],

function($, jqueryui, _, PropertiesPainter) {

	function ScalarSourceProperties(block) {
		this.Block = block;
		this.Id = this.Block.Id + '-properties';
		this.Painter = new PropertiesPainter();
	};
		
	ScalarSourceProperties.prototype.Block = null;
	ScalarSourceProperties.prototype.Id = null;
	ScalarSourceProperties.prototype.Painter = null;
	ScalarSourceProperties.prototype.Create = function() {
		this.Painter.Create(this.Id, this.Block, this.CreateTabs());
		this.BindEvents();
	};
	ScalarSourceProperties.prototype.CreateTabs = function() {
		var tabs = new Array()
		tabs.push({
			'Id' : this.Id + '-configuration',
			'Name': 'Configuration',
			'Content': this.CreateConfigurationContent()
			});
			
		return tabs;
	};
	ScalarSourceProperties.prototype.CreateConfigurationContent = function() {

		var scalarSourceContent = '\
			<form class="form-horizontal">\
				<fieldset>\
					<div class="control-group">\
						<label class="control-label">\
							Value\
						</label>\
						<div class="controls">\
							<input class="input-medium" id="{0}-configuration-value" type="text" value="{1}"/>\
						<div>\
					</div>\
				</fieldset>\
			</form>\
		'.format(
			this.Id,
			this.Block.Data
			);

		return scalarSourceContent;
	};

	ScalarSourceProperties.prototype.BindEvents = function() {

		var configValue = $("#{0}-configuration-value".format(this.Id));

		configValue.blur(function () {
			var block = harness.GetBlockFromAnyId($(this).attr("id"));
			block.Data = $(this).val();
			block.Painter.Draw();
		});
	}
	
	ScalarSourceProperties.prototype.Update = function() {
		this.Painter.Update(this.Id, this.Block);
	};
	
	return (ScalarSourceProperties);
});