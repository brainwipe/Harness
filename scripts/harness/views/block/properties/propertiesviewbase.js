import PropertiesViewBaseTemplate from "/scripts/harness/views/templates/block/properties/propertiesviewbasetemplate.js"
import PropertiesInputsTemplate from "/scripts/harness/views/templates/block/properties/propertiesinputstemplate.js"
import PropertiesOutputsTemplate from "/scripts/harness/views/templates/block/properties/propertiesoutputstemplate.js"

/*
// TODO ROLA - is this still used?
	"stringlib"
*/
export default class {

	constructor(block) {
		this.Block = block;
		this.Id = this.Block.Id + '-properties';
		this.CssClass = block.constructor.CssClass + '-properties';
	}
	
	Create() {
		var tabs = this.CreateTabs();

		var data = {
			"id": this.Id,
			"blockName": this.Block.constructor.FriendlyName,
			"propertiesCssClass": this.CssClass,
			"inputsCount": this.Block.InputsCount,
			"outputsCount": this.Block.OutputsCount,
			"tabs": tabs
		};

		harness.Element.append(PropertiesViewBaseTemplate(data));
			
		$("#" + this.Id + "-inputs").append(this.BuildInputs());
		$("#" + this.Id + "-outputs").append(this.BuildOutputs());

		this.BindEvents();
		this.BindMakeDataSocketEvents();
		return $("#" + this.Id);
	}

	BuildInputs() {
		return PropertiesInputsTemplate({
			"id" : this.Id,
			"Inputs": this.Block.Inputs
		});
	}

	BuildOutputs() {
		return PropertiesOutputsTemplate({
			"id" : this.Id,
			"Outputs": this.Block.Outputs
		});
	}

	ReBuildInputs()
	{
		var inputsContent = $(`#${this.Id}-inputs`);
		inputsContent.html("");
		inputsContent.append(this.BuildInputs());
		this.BindEvents();
	}

	ReBuildOutputs()
	{
		var outputsContent = $(`#${this.Id}-outputs`);
		outputsContent.html("");
		outputsContent.append(this.BuildOutputs());
		this.BindEvents();
	}

	BindMakeDataSocketEvents() {

		$(`#${this.Id} .make-input-socket`).click(function () {
			var propertiesControlId = $(this).attr("data-properties-id");
			var view = harness.GetBlockViewFromAnyId(propertiesControlId);

			view.Properties.ToggleDataSocket(true, $(this), propertiesControlId);
      	});

	  	$(`#${this.Id} .make-output-socket`).click(function () {
			var propertiesControlId = $(this).attr("data-properties-id");
			var view = harness.GetBlockViewFromAnyId(propertiesControlId);

			view.Properties.ToggleDataSocket(false, $(this), propertiesControlId);
      	});
	}

	ToggleDataSocket(isInput, makeDataSocketControl, propertiesControlId) {

		var inputBoxId = `#${propertiesControlId}-${configurationPropertyId}-value`;
		var configurationPropertyId = makeDataSocketControl.attr("data-property-id");

		var removedSocketQualifiedId = this.Block.DeleteDataSocketByPropertyId(configurationPropertyId);
		if (removedSocketQualifiedId !== null)
		{
			harness.Painter.DeleteSocket(removedSocketQualifiedId);
			$(this).children(".glyphicon").remove();
			$(inputBoxId).next(".glyphicon").remove();
			return;
		}

		makeDataSocketControl.append('<span class="glyphicon glyphicon-ok"></span>');

		if (isInput)
		{
			$(inputBoxId).after('<i class="glyphicon glyphicon-log-in form-control-feedback"></i>');
			var socket = this.Block.SocketFactory.InputFromData(this.Block, configurationPropertyId);
			this.Block.AddInput(socket);
			harness.Painter.CreateInputSocket(this.Block, socket.QualifiedId(), socket.Name);
		}
		else
		{
			$(inputBoxId).after('<i class="glyphicon glyphicon-log-out form-control-feedback"></i>');
			var socket = this.Block.SocketFactory.OutputFromData(this.Block, configurationPropertyId);
			this.Block.AddOutput(socket);	
			harness.Painter.CreateOutputSocket(this.Block, socket.QualifiedId(), socket.Name);
		}
			
		this.ReBuildInputs();
	}

	BindEvents() {};
	CreateTabs() {};

	Update() {
		// When deriving your own properties view, you MUST call update inputs or outputs
		this.UpdateInputsAndOutputs();
	}

	UpdateInputsAndOutputs() {
		for(var input in this.Block.Inputs) {
			$(`#${this.Id}-inputs-${this.Block.Inputs[input].Id}`).val(
				this.Block.Inputs[input].Data
			);
		}

		for(var output in this.Block.Outputs) {
			$(`#${this.Id}-outputs-${this.Block.Outputs[output].Id}`).val(
				this.Block.Outputs[output].Data
			);
		}
	}
}