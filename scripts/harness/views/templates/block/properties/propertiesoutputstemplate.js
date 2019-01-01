export default function(data) {
	return `
<form class="form-horizontal">
	<fieldset>
		${data.Outputs.map((output, i) => `
		<div class="form-group">
			<label class="control-label col-sm-3" for="">${output.Name}</label>
			<div class="col-sm-9">
				<input type="text" class="form-control" readonly id="${data.id}-outputs-${output.Id}" value="${output.Data}"/>
			</div>
		</div>	
		`.trim()).join('')}
	</fieldset>
</form>`
}