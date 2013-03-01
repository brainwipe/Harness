define(
[
	"jquery",
	"jquery-ui",
	"harness/harnessfactory",
	"stringlib"
],

function($, jqueryui, HarnessFactory) {

	function LoadDialog() {	}

	LoadDialog.prototype.CreateMarkup = function()
	{
		harness.Element.append(
		'<div class="modal fade" id="loadDialog">\
				<div class="modal-header">\
				<button class="close" data-dismiss="modal">×</button>\
				<h3>Load Model</h3>\
			</div>\
			<div class="modal-body">\
				<form class="form-horizontal">\
					<div id="loadModelsPlaceholder"></div>\
				</form>\
			</div>\
			<div class="modal-footer">\
				<button type="button" class="btn btn-primary" data-dismiss="modal" id="loadModel">Load</button>\
  				<button type="button" class="btn" data-dismiss="modal">Cancel</button>\
			</div>\
		</div>');

		this.ApplySavedModelsToDialog();

		$('#loadModel').click(function() {
			loaddialog.LoadModel();
		});
	};

	LoadDialog.prototype.LoadModel = function ()
	{
		var chosenModelToLoad = $('#loadDialog input:radio[name=savedModelsChoice]:checked').val();
		if (chosenModelToLoad.length > 0)
		{
			var models = this.GetSavedModels();
			modelJSON = models[chosenModelToLoad];
			
			var harnessFactory = new HarnessFactory();
			harnessFactory.BuildFromJSON(harness, modelJSON);
		}
	};

	LoadDialog.prototype.GetSavedModels = function() {
		var localModels = {};
		for(i in localStorage) 
		{
			var keyparts = i.split("-");
			if (keyparts[0] === 'model')
			{
				localModels[keyparts[1]] = localStorage[i];
			}
		}
		return localModels;
	};

	LoadDialog.prototype.GetSavedModelsInList = function() {
		var models = this.GetSavedModels();

		var list = '<div class="control-group savedModelChooser"><h4>Choose a saved model to load<h4><div class="controls">';
		var modelCount = 0;

		for (var i in models)
		{
			modelCount++;
			var id = i.replace(/ /g,'');
			list += '<label class="radio"><input type="radio" name="savedModelsChoice" id="{0}" value="{1}"/>{2}</label>'.format(id, i, i);
		}

		list += '</div></div>';

		if (modelCount === 0)
		{
			return '';
		}

		return list;
	};

	LoadDialog.prototype.ApplySavedModelsToDialog = function() {		
		$('#loadDialog #loadModelsPlaceholder').html("");
		$('#loadDialog #loadModelsPlaceholder').append(
			this.GetSavedModelsInList()
		);
	};

	return (LoadDialog);

});