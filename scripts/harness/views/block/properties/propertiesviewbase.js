define(
[
	"harness/views/templaterender",
	"text!harness/views/templates/block/properties/propertiesviewbase.html",
	"stringlib"
],

function(TemplateRender, PropertiesViewBaseTemplate) {

	function PropertiesViewBase(block) {
		this.Block = block;
		this.Id = this.Block.Id + '-properties';
	}
	PropertiesViewBase.prototype.Block = null;
	PropertiesViewBase.prototype.Id = null;

	PropertiesViewBase.prototype.Create = function() {
		var tabs = this.CreateTabs();

		var data = {
			"id": this.Id,
			"blockName": this.Block.Name,
			"propertiesCssClass": this.Block.CssClass + '-properties',
			"inputsCount": this.Block.InputsCount,
			"outputsCount": this.Block.OutputsCount,
			"Outputs" : this.Block.Outputs,
			"Inputs": this.Block.Inputs,
			"tabs": tabs
		};

		harness.Element.append(
			new TemplateRender().Render(PropertiesViewBaseTemplate, data)
			);

		this.BindEvents();
	};

	PropertiesViewBase.prototype.BindEvents = function() {};
	PropertiesViewBase.prototype.CreateTabs = function() {};

	PropertiesViewBase.prototype.Update = function() {
		// When deriving your own properties view, you MUST call update inputs or outputs
		this.UpdateInputsAndOuputs();
	};

	PropertiesViewBase.prototype.UpdateInputsAndOuputs = function() {
		for(var input in this.Block.Inputs) {
			$('#' + this.Id + '-inputs-' + this.Block.Inputs[input].Id).val(
				this.Block.Inputs[input].Data
			);
		}

		for(var output in this.Block.Outputs) {
			$('#' + this.Id + '-outputs-' + this.Block.Outputs[output].Id).val(
				this.Block.Outputs[output].Data
			);
		}
	};


	return (PropertiesViewBase);
});