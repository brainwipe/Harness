import PropertiesViewBase from "/scripts/harness/views/block/properties/propertiesviewbase.js"

export default class extends PropertiesViewBase {
	constructor(block) {
		super(block);
	}

	CreateTabs() {
		var tabs = [];
		tabs.push({
			'Id' : this.Id + '-configuration',
			'Name': 'Configuration',
			'Content': this.CreateConfigurationContent()
			});

		return tabs;
	}

	CreateConfigurationContent() {
		var scalarSourceContent = `
<form class="form-horizontal">
	<fieldset>
		<div class="form-group">
			<label class="col-sm-3 control-label">
				Value
			</label>
			<div class="col-sm-9">
				<input class="form-control" id="${this.Id}-configuration-value" type="text" value="${this.Block.Data}"/>
			<div>
		</div>
	</fieldset>
</form>`;
		return scalarSourceContent;
	}

	BindEvents() {
		var configValue = $(`#${this.Id}-configuration-value`);

		configValue.blur(function () {
			var block = harness.GetBlockFromAnyId($(this).attr("id"));
			block.Data = $(this).val();
			harness.Views[block.Id].Draw();
		});
	}
}