import PropertiesViewBase from "/scripts/harness/views/block/properties/propertiesviewbase.js"

export default class extends PropertiesViewBase {
	constructor(block) {
		super(block);
	}

	CreateTabs() {
		var tabs = [];
		tabs.push({
			Id : `${this.Id}-datatable`,
			Name: 'Data',
			Content: this.CreateDataTableTab()
		});
		tabs.push({
			Id : `${this.Id}-rawdata`,
			Name: 'Raw Data',
			Content: this.CreateRawDataTab()
		});

		return tabs;
	}

	CreateDataTableTab() {

		var arraySourceTableContent = `
<form class="form-horizontal">
	<div class="form-group">
		<label class="control-label col-sm-3">
			Current Index
		</label>
		<div class="col-sm-9">
			<input class="form-control" id="${this.Id}-datatable-currentindex" type="text" value="${this.Block.Data.CurrentIndex}"/>
		</div> 
	</div>
</form>;

<div class="datatable-container"><table id="${this.Id}-datatable" class="table table-bordered table-striped"><thead><tr><th>Index</th>
`
		var vectorsize = this.Block.VectorSize();

		for(var i=0; i<vectorsize; i++)
		{
			arraySourceTableContent += `<th>${i}</th>`;
		}

		arraySourceTableContent += `</tr></thead><tbody class="datatable-body">`;

		arraySourceTableContent += this.DrawDataTableRows();

		arraySourceTableContent += '</tbody></table></div>';
		return arraySourceTableContent;
	}

	DrawDataTableRows() {
		var content = "";

		for (var rowIndex in this.Block.Data.Values)
		{
			var row = this.Block.Data.Values[rowIndex];

			var rowHighlight = "";
			if (rowIndex === this.Block.Data.CurrentIndex + "")
			{
				rowHighlight = 'class="info"';
			}

			var rowString = `<tr ${rowHighlight}><td>${rowIndex}</td>`;

			for (var valueIndex in row)
			{
				rowString += `<td>${row[valueIndex]}</td>`;
			}

			rowString += '</tr>';
			content += rowString;
		}
		return content;
	}

	Update() {
		this.UpdateInputsAndOutputs();
		this.UpdateRawData();
		this.UpdateDataTable();
		this.UpdateDatatableCurrentIndex();
	}

	UpdateDatatableCurrentIndex() {
		var tableSelector = `#${this.Id}-datatable tbody`;
		$(tableSelector).children().removeClass("info");
		$(`${tableSelector} tr:nth-child(${this.Block.Data.CurrentIndex + 1})`).addClass("info");

		$(`#${this.Id}-datatable-currentindex`).val(this.Block.Data.CurrentIndex);
	}

	UpdateRawData() {
		var rawDataSelector = `#${ this.Id}-rawdata-array`;
		$(rawDataSelector).val(JSON.stringify(this.Block.Data));
	}

	UpdateDataTable() {
		var tableRows = this.DrawDataTableRows();
		$(`#${this.Id}-datatable tbody`).html(tableRows);
	}

	CreateRawDataTab() {
			var rawDataContent = `
<form>
	<fieldset>
		<div class="form-group">
			<label class="control-label col-sm-12">
				Raw Data
			</label>
			<div class="controls col-sm-12">
				<textarea id="${this.Id}-rawdata-array" class="form-control" rows="10">${JSON.stringify(this.Block.Data)}</textarea>
			<div>
		</div>
	</fieldset>
</form>`;
			return rawDataContent;
	}

	BindEvents() {

		var configValue = $(`#${this.Id}-rawdata-array`);

		// TODO ROLA - the view must be accessible via the block because it's weird that it's not!
		configValue.blur(this, function (event) {
			var block = window.harness.GetBlockFromAnyId($(this).attr("id"));
			block.Data = JSON.parse($(this).val());
			block.ValidateData();

			var view = window.harness.Views[block.Id];
			view.Draw();
			view.Properties.Update();
		});

		// TODO ROLA - the view must be accessible via the block because it's weird that it's not!
		var currentIndexOnDataTable = $(`#${this.Id}-datatable-currentindex`);
		currentIndexOnDataTable.blur(this, function (event) {
			var block = window.harness.GetBlockFromAnyId($(this).attr("id"));

			var value = parseInt($(this).val(), 10);
			block.Data.CurrentIndex = value;
			block.ValidateData();

			var view = window.harness.Views[block.Id];
			view.Draw();
			view.Properties.Update();
		});
	}
}