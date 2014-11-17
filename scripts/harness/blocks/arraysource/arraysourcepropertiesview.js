define(
[
	'harness/views/block/properties/propertiesviewbase'
],

function(PropertiesViewBase) {

	function ArraySourcePropertiesView(block) {
		PropertiesViewBase.call(this, block);
	}

	ArraySourcePropertiesView.prototype = Object.create( PropertiesViewBase.prototype );
	ArraySourcePropertiesView.prototype.constructor = ArraySourcePropertiesView;

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

		var arraySourceTableContent = '<form class="form-horizontal">'+
           '<div class="form-group">'+
              '<label class="control-label col-sm-3">'+
                 'Current Index'+
              '</label>'+
              '<div class="col-sm-9">' + 
                 '<input class="form-control" id="{0}-datatable-currentindex" type="text" value="{1}"/>'.format(this.Id, this.Block.Data.CurrentIndex) +
               '</div>' +
           '</div>'+
        '</form>';

		arraySourceTableContent += '<div class="datatable-container"><table id="' + this.Id + '-datatable" class="table table-bordered table-striped"><thead><tr><th>Index</th>';

		var vectorsize = this.Block.VectorSize();

		for(var i=0; i<vectorsize; i++)
		{
			arraySourceTableContent += '<th>' + i + '</th>';
		}

		arraySourceTableContent += '</tr></thead><tbody id="' + this.Id + '-datatable-body" class="datatable-body">';

		arraySourceTableContent += this.DrawDataTableRow();

		arraySourceTableContent += '</tbody></table></div>';
		return arraySourceTableContent;
	};

	ArraySourcePropertiesView.prototype.DrawDataTableRow = function() {
		var content = "";

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
			content += rowString;
		}
		return content;
	};

	ArraySourcePropertiesView.prototype.Update = function() {
		this.UpdateInputsAndOutputs();
		this.UpdateRawData();
		this.UpdateDataTable();
		this.UpdateDatatableCurrentIndex();
	};

	ArraySourcePropertiesView.prototype.UpdateDatatableCurrentIndex = function() {
		var tableSelector = '#' + this.Id + '-datatable tbody';
		$(tableSelector).children().removeClass("info");
		$(tableSelector + ' tr:nth-child(' + (this.Block.Data.CurrentIndex + 1) + ')').addClass("info");

		$('#{0}-datatable-currentindex'.format(this.Id)).val(this.Block.Data.CurrentIndex);
	};

	ArraySourcePropertiesView.prototype.UpdateRawData = function() {
		var rawDataSelector = '#' + this.Id + '-rawdata-array';
		$(rawDataSelector).val(JSON.stringify(this.Block.Data));
	};

	ArraySourcePropertiesView.prototype.UpdateDataTable = function() {
		var tableRows = this.DrawDataTableRow();
		$('#{0}-datatable-body'.format(this.Id)).html(tableRows);
	};

	ArraySourcePropertiesView.prototype.CreateRawDataTab = function() {
			var rawDataContent = '<form>'+
					'<fieldset>'+
						'<div class="form-group">'+
							'<label class="control-label col-sm-12">'+
								'Raw Data'+
							'</label>'+
							'<div class="controls col-sm-12">'+
								'<textarea id="{0}-rawdata-array" class="form-control" rows="10">{1}</textarea>'.format(this.Id, JSON.stringify(this.Block.Data)) +
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
			block.ValidateData();

			var view = harness.Views[block.Id];
			view.Draw();
			view.Properties.Update();
		});

		var currentIndexOnDataTable = $('#{0}-datatable-currentindex'.format(this.Id));
		currentIndexOnDataTable.blur(function () {
			var block = harness.GetBlockFromAnyId($(this).attr("id"));

			var value = parseInt($(this).val(), 10);
			block.Data.CurrentIndex = value;
			block.ValidateData();

			var view = harness.Views[block.Id];
			view.Draw();
			view.Properties.Update();
		});
	};

	return (ArraySourcePropertiesView);
});