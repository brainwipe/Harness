define(
[
	'harness/harnessfactory',
	'stringlib'
],

function(HarnessFactory) {

	function LoadDialog() {	}

	LoadDialog.prototype.CreateMarkup = function()
	{
		harness.Element.append('<div class="modal hide fade" id="loadDialog">'+
				'<div class="modal-header">'+
				'<button class="close" data-dismiss="modal">×</button>'+
				'<h3>Load Model</h3>'+
			'</div>'+
			'<div class="modal-body">'+
				'<form class="form-horizontal">'+
					'<div id="loadModelsPlaceholder"></div>'+
				'</form>'+
			'</div>'+
			'<div class="modal-footer">'+
				'<button type="button" class="btn btn-primary" data-dismiss="modal" id="loadModel">Load</button>'+
				'<button type="button" class="btn" data-dismiss="modal">Cancel</button>'+
			'</div>'+
		'</div>');

		this.ApplySavedModelsToDialog();

		$('#loadModel').click(function() {
			loaddialog.LoadModel();
		});
	};

	LoadDialog.prototype.LoadModel = function ()
	{
		var chosenModelToLoad = $('#loadDialog #savedModelsChoice').val();
		if (chosenModelToLoad.length > 0)
		{
			var models = this.GetSavedModels();
			modelJSON = models[chosenModelToLoad];

			var harnessFactory = new HarnessFactory();
			console.log(modelJSON);
			harnessFactory.BuildFromJSON(harness, modelJSON);
		}
	};

	LoadDialog.prototype.GetSavedModels = function() {
		var localModels = {};
		for(var i in localStorage)
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

		var list = '<legend>Choose a model to load...</legend>'+
						'<div class="control-group savedModelChooser">'+
							'<div class="controls"><select id="savedModelsChoice">';
		var modelCount = 0;

		for (var i in models)
		{
			modelCount++;
			list += '<option>{0}</option>'.format(i);
		}

		list += '</select></div></div>';
		list += '<div class="control-group"><label class="control-label" for="newModelName">or choose a new name:</label>'+
						'<div class="controls">'+
							'<input type="text" id="newModelName" placeholder="' + harness.Name + '">'+
						'</div>'+
					'</div>';

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