define(
[
	'harness/views/block/properties/propertiesviewbase'
],

function(PropertiesViewBase) {

	function ArraySourcePropertiesView(block) {
		this.Block = block;
		this.Id = this.Block.Id + '-properties';
		this.Base = new PropertiesViewBase();
	}

	ArraySourcePropertiesView.prototype.Block = null;
	ArraySourcePropertiesView.prototype.Id = null;
	ArraySourcePropertiesView.prototype.Base = null;
	ArraySourcePropertiesView.prototype.Create = function() {
		this.Base.Create(this.Id, this.Block, this.CreateTabs());
		this.BindEvents();
	};
	ArraySourcePropertiesView.prototype.CreateTabs = function() {
		var tabs = [];
		// tabs.push({
		// 	'Id' : this.Id + '-configuration',
		// 	'Name': 'Configuration',
		// 	'Content': this.CreateConfigurationContent()
		// 	});
		tabs.push({
			'Id' : this.Id + '-rawdata',
			'Name': 'Raw Data',
			'Content': this.CreateRawDataTab()
			});

		return tabs;
	};
	ArraySourcePropertiesView.prototype.CreateConfigurationContent = function() {

		var scalarSourceContent = '<form class="form-horizontal">Nothing here yet!'+
				'<fieldset>'+
					'<div class="control-group">'+
						'<label class="control-label">'+
							//'Value'+
						'</label>'+
						'<div class="controls">'+
							//'<input class="input-medium" id="{0}-configuration-value" type="text" value="{1}"/>'.format(this.Id, this.Block.Data) +
						'<div>'+
					'</div>'+
				'</fieldset>'+
			'</form>';
		return scalarSourceContent;
	};

	ArraySourcePropertiesView.prototype.CreateRawDataTab = function() {
			var scalarSourceContent = '<form class="form-horizontal">'+
					'<fieldset>'+
						'<div class="control-group">'+
							'<label class="control-label">'+
								'Raw Data'+
							'</label>'+
							'<div class="controls">'+
								'<textarea id="{0}-rawdata-array" rows="10">{1}</textarea>'.format(this.Id, this.Block.Data) +
							'<div>'+
						'</div>'+
					'</fieldset>'+
				'</form>';
			return scalarSourceContent;
	}


	ArraySourcePropertiesView.prototype.BindEvents = function() {

		var configValue = $("#{0}-rawdata-array".format(this.Id));

		configValue.blur(function () {
			var block = harness.GetBlockFromAnyId($(this).attr("id"));
			block.Data = $(this).val();
			harness.Views[block.Id].Draw();
		});
	};

	ArraySourcePropertiesView.prototype.Update = function() {
		this.Base.Update(this.Id, this.Block);
	};

	return (ArraySourcePropertiesView);
});