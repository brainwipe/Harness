export default function(data) {
	return `
<form class="form-horizontal">
	<fieldset>
		${data.Inputs.map((input, i) => `
		<div class="form-group">
			<label class="control-label col-sm-3" for="">${input.Name}</label>
			<div class="col-sm-9">
				<input type="text" class="form-control uneditable-input" id="${data.id}-inputs-${input.Id}" value="${input.Data}"/>
			</div>
		</div>
		`.trim()).join('')}
	</fieldset>
</form>`
}