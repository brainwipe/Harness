define(
[
	"stringlib"
],

function() {

	function PropertiesViewBase() {}

	PropertiesViewBase.prototype.Create = function(id, block, tabs) {
		harness.Element.append('<div class="modal fade" id="' + id + '">' +
				'<div class="modal-header">'+
					'<button class="close" data-dismiss="modal">×</button>'+
					'<h3>' + block.Name + ' Properties</h3>'+
				'</div>'+
				'<div class="modal-body">' + this.CreateTabPane(id, tabs, block) + '</div>' +
				'<div class="modal-footer">'+
					'<a href="#" data-dismiss="modal" class="btn">Close</a>'+
				'</div>'+
			'</div>');
		return $("#" + id);
	};

	PropertiesViewBase.prototype.CreateTabPane = function(id, tabs, block) {
		var tabPane = '<ul class="nav nav-tabs">';
		var tabContent = '<div class="tab-content">';
		var firstActive = 'active';

		for(var index in tabs)
		{
			var tab = tabs[index];
			tabPane += '<li class="{0}"><a href="#{1}" data-toggle="tab">{2}</a></li>'.format(firstActive, tab.Id, tab.Name);
			tabContent += '<div class="tab-pane {0}" id="{1}">{2}</div>'.format(firstActive, tab.Id, tab.Content);
			firstActive = '';
		}


		if (block.InputsCount > 0)
		{
			tabPane += '<li class="{0}"><a href="#{1}-inputs" data-toggle="tab">Inputs</a></li>'.format(firstActive, id);
			tabContent += '<div class="tab-pane {0}" id="{1}-inputs">{2}</div>'.format(firstActive, id, this.CreateInputs(id, block));
		}

		if (block.OutputsCount > 0)
		{
			tabPane += '<li><a href="#{0}-outputs" data-toggle="tab">Outputs</a></li>'.format(id);
			tabContent += '<div class="tab-pane" id="{0}-outputs">{1}</div>'.format(id, this.CreateOutputs(id, block));
		}

		tabPane += '</ul>';
		tabContent += '</div>';

		return tabPane + tabContent;
	};

	PropertiesViewBase.prototype.CreateInputs = function(id, block) {

		if (block.InputsCount === 0) {
			return "There are no inputs";
		}

		var out = '<form class="form-horizontal"><fieldset>';

		for(var input in block.Inputs) {
			out += '<div class="control-group">'+
							'<label class="control-label" for="">' + block.Inputs[input].Name + '</label>'+
							'<div class="controls">' +
								'<input type="text" class="input-medium uneditable-input" id="{0}-inputs-{1}" value="{2}"/>'.format(id, block.Inputs[input].Id, block.Inputs[input].Data) +
							'</div>'+
					'</div>';
		}

		out += '</fieldset></form>';
		return out;
	};

	PropertiesViewBase.prototype.CreateOutputs = function(id, block) {

		if (block.OutputsCount === 0) {
			return "There are no outputs";
		}

		var out = '<form class="form-horizontal"><fieldset>';

		for(var output in block.Outputs) {
			out += '<div class="control-group">'+
					'<label class="control-label" for="">' + block.Outputs[output].Name + '</label>' +
					'<div class="controls">'+
						'<input type="text" class="input-medium uneditable-input" id="{0}-outputs-{1}" value="{2}"/>'.format(id, block.Outputs[output].Id, block.Outputs[output].Data) +
					'</div>'+
				'</div>';
		}

		out += '</fieldset></form>';
		return out;
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