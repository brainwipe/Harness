define(
[
	'harness/HarnessFactory',
	'harness/views/TemplateRender',
	'text!harness/views/templates/LoadDialog.html',
	'text!harness/views/templates/SavedModels.html',
	'stringlib'
],

function(HarnessFactory, TemplateRender, LoadDialogTemplate, SavedModelsTemplate) {

	function LoadDialog() {	}

	LoadDialog.prototype.CreateMarkup = function()
	{
		harness.Element.append(new TemplateRender().Render(LoadDialogTemplate));

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

		if (models.length === 0)
		{
			return '';
		}

		var data = {
			"title": "Choose a model to load...",
			"models": models,
			"harnessName": harness.Name
		};

		return new TemplateRender().Render(SavedModelsTemplate, data);
	};

	LoadDialog.prototype.ApplySavedModelsToDialog = function() {
		$('#loadDialog #loadModelsPlaceholder').html("");
		$('#loadDialog #loadModelsPlaceholder').append(
			this.GetSavedModelsInList()
		);
	};

	return (LoadDialog);

});