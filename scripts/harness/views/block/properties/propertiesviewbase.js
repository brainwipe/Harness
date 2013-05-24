define(
[
	"harness/views/templaterender",
	"text!harness/views/templates/block/properties/propertiesviewbase.html",
	"stringlib"
],

function(TemplateRender, PropertiesViewBaseTemplate) {

	function PropertiesViewBase() {}

	PropertiesViewBase.prototype.Create = function(id, block, tabs) {

		var data = {
			"id": id,
			"blockName": block.Name,
			"inputsCount": block.InputsCount,
			"outputsCount": block.OutputsCount,
			"Outputs" : block.Outputs,
			"Inputs": block.Inputs,
			"tabs": tabs
		}

		harness.Element.append(
			new TemplateRender().Render(PropertiesViewBaseTemplate, data)
			);
	
		return $("#" + id);
	};

	PropertiesViewBase.prototype.Update = function(painterId, block) {
		for(var input in block.Inputs) {
			$('#' + painterId + '-inputs-' + block.Inputs[input].Id).val(
				block.Inputs[input].Data
			);
		}

		for(var output in block.Outputs) {
			$('#' + painterId + '-outputs-' + block.Outputs[output].Id).val(
				block.Outputs[output].Data
			);
		}
	};

	return (PropertiesViewBase);
});