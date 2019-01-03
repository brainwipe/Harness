export default function(data) {
	return `
<form class="form-horizontal">
	<fieldset>
		${Object.keys(data.Outputs).map((key) => `
		<div class="form-group">
			<label class="control-label col-sm-3" for="">${data.Outputs[key].Name}</label>
			<div class="col-sm-9">
				<input type="text" class="form-control" readonly id="${data.id}-outputs-${data.Outputs[key].Id}" value="${data.Outputs[key].Data}"/>
			</div>
		</div>	
		`.trim()).join('')}
	</fieldset>
</form>`}