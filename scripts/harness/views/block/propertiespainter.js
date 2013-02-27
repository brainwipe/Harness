define(
[
	"jquery",
	"jquery-ui",
	"underscore",
	"stringlib"
],

function($, jqueryui, _) {

	function PropertiesPainter() {
		
	};
	PropertiesPainter.prototype.Create = function(id, block, tabs) {
		var painterPropertiesId = block.Painter.Properties.Id;

		harness.Element.append('\
			<div class="modal fade" id="{0}">\
				<div class="modal-header">\
					<button class="close" data-dismiss="modal">×</button>\
					<h3>{1} Properties</h3>\
				</div> \
				<div class="modal-body">\
					{2}\
				</div>\
				<div class="modal-footer">\
					<a href="#" data-dismiss="modal" class="btn">Close</a>\
				</div>\
			</div>\
			'.format(
				id, 
				block.Name,
				this.CreateTabPane(id, tabs, block, painterPropertiesId)
			));
		return $("#" + id);
	};
	
	PropertiesPainter.prototype.CreateTabPane = function(id, tabs, block, painterPropertiesId) {
		var tabPane = '<ul class="nav nav-tabs">';
		var tabContent = '<div class="tab-content">';
		var firstActive = 'active';
		
		for(var index in tabs)
		{
			var tab = tabs[index];
			tabPane += 	'<li class="{0}"><a href="#{1}" data-toggle="tab">{2}</a></li>'.format(firstActive, tab.Id, tab.Name);
			tabContent += '<div class="tab-pane {0}" id="{1}">{2}</div>'.format(firstActive, tab.Id, tab.Content);
			firstActive = '';
		}

		
		if (block.InputsCount > 0)
		{
			tabPane += '<li class="{0}"><a href="#{1}-inputs" data-toggle="tab">Inputs</a></li>'.format(firstActive, painterPropertiesId);
			tabContent += '<div class="tab-pane {0}" id="{1}-inputs">{2}</div>'.format(firstActive, painterPropertiesId, this.CreateInputs(id, block));
		}
		
		if (block.OutputsCount > 0)
		{
			tabPane += '<li><a href="#{0}-outputs" data-toggle="tab">Outputs</a></li>'.format(painterPropertiesId);
			tabContent += '<div class="tab-pane" id="{0}-outputs">{1}</div>'.format(painterPropertiesId, this.CreateOutputs(id, block));
		}
		
		tabPane += '</ul>';
		tabContent += '</div>';
		
		return tabPane + tabContent;
	};

	PropertiesPainter.prototype.CreateInputs = function(id, block) {
		
		if (block.InputsCount == 0) {
			return "There are no inputs";
		}
		
		var out = '<form class="form-horizontal"><fieldset>';
		
		for(var input in block.Inputs) {
			out += '<div class="control-group"> \
					<label class="control-label" for=""> \
						{0} \
					</label> \
					<div class="controls"> \
						<input type="text" class="input-medium uneditable-input" id="{1}-inputs-{2}" value="{3}"/> \
					</div> \
				</div> \
				'.format(
					block.Inputs[input].Name,
					id,
					block.Inputs[input].Id,
					block.Inputs[input].Data
					);
		}
		
		out += '</fieldset></form>';
		return out;
	}; 

	PropertiesPainter.prototype.CreateOutputs = function(id, block) {
		
		if (block.OutputsCount == 0) {
			return "There are no outputs";
		}
		
		var out = '<form class="form-horizontal"><fieldset>';
		
		for(var output in block.Outputs) {
			out += '<div class="control-group"> \
					<label class="control-label" for=""> \
						{0} \
					</label> \
					<div class="controls"> \
						<input type="text" class="input-medium uneditable-input" id="{1}-outputs-{2}" value="{3}"/> \
					</div> \
				</div> \
				'.format(
					block.Outputs[output].Name,
					id,
					block.Outputs[output].Id,
					block.Outputs[output].Data
					);
		}
		
		out += '</fieldset></form>';
		return out;
	}; 
	
	PropertiesPainter.prototype.Update = function(painterId, block) {
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
	
	PropertiesPainter.prototype.Set = function (id, value) {
		
	};


	return (PropertiesPainter);
});