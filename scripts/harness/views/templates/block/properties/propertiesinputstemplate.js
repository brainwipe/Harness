export default function(data) {
	return `
<form class="form-horizontal">
	<fieldset>
		${Object.keys(data.Inputs).map((key) => `
		<div class="form-group">
			<label class="control-label col-sm-3" for="">${data.Inputs[key].Name}</label>
			<div class="col-sm-9">
				<input type="text" class="form-control uneditable-input" id="${data.id}-inputs-${data.Inputs[key].Id}" value="${data.Inputs[key].Data}"/>
			</div>
		</div>
		`.trim()).join('')}
	</fieldset>
</form>`
}