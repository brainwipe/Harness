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
		tabs.push({
			'Id' : this.Id + '-datatable',
			'Name': 'Data',
			'Content': this.CreateDataTableTab()
		});
		tabs.push({
			'Id' : this.Id + '-rawdata',
			'Name': 'Raw Data',
			'Content': this.CreateRawDataTab()
		});

		return tabs;
	};
	ArraySourcePropertiesView.prototype.CreateDataTableTab = function() {

		var arraySourceTableContent = '<table id="' + this.Id + '-datatable" class="table table-bordered table-striped"><thead><tr><th>Index</th>';

		var vectorsize = this.Block.VectorSize();

		for(var i=0; i<vectorsize; i++)
		{
			arraySourceTableContent += '<th>' + i + '</th>';
		}

		arraySourceTableContent += '</tr></thead><tbody>';

		for (var rowIndex in this.Block.Data.Values)
		{
			var row = this.Block.Data.Values[rowIndex];

			var rowHighlight = '';
			if (rowIndex === this.Block.Data.CurrentIndex + "")
			{
				rowHighlight = ' class="info"';
			}

			var rowString = '<tr' + rowHighlight + '><td>' + rowIndex + '</td>';

			for (var valueIndex in row)
			{
				rowString += '<td>' + row[valueIndex] + '</td>';
			}

			rowString += '</tr>';
			arraySourceTableContent += rowString;
		}

		arraySourceTableContent += '</tbody></table>';
		return arraySourceTableContent;
	};

	ArraySourcePropertiesView.prototype.UpdateDatatableCurrentIndex = function() {
		var tableSelector = '#' + this.Id + '-datatable tbody';
		$(tableSelector).children().removeClass("info");
		$(tableSelector + ' tr:nth-child(' + (this.Block.Data.CurrentIndex + 1) + ')').addClass("info");
	};

	ArraySourcePropertiesView.prototype.CreateRawDataTab = function() {
			var rawDataContent = '<form class="form-horizontal">'+
					'<fieldset>'+
						'<div class="control-group">'+
							'<label class="control-label">'+
								'Raw Data'+
							'</label>'+
							'<div class="controls">'+
								'<textarea id="{0}-rawdata-array" rows="10">{1}</textarea>'.format(this.Id, JSON.stringify(this.Block.Data)) +
							'<div>'+
						'</div>'+
					'</fieldset>'+
				'</form>';
			return rawDataContent;
	};

	ArraySourcePropertiesView.prototype.BindEvents = function() {

		var configValue = $("#{0}-rawdata-array".format(this.Id));

		configValue.blur(function () {
			var block = harness.GetBlockFromAnyId($(this).attr("id"));
			block.Data = JSON.parse($(this).val());
			harness.Views[block.Id].Draw();
		});
	};

	ArraySourcePropertiesView.prototype.Update = function() {
		this.Base.Update(this.Id, this.Block);
		this.UpdateDatatableCurrentIndex();
	};

	return (ArraySourcePropertiesView);
});