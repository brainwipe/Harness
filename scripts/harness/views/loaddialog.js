define(
[
	'harness/harnessfactory',
	'harness/views/templaterender',
	'text!harness/views/templates/loaddialog.html',
	'text!harness/views/templates/savedmodels.html',
	'stringlib'
],

function(HarnessFactory, TemplateRender, LoadDialogTemplate, SavedModelsTemplate) {

	function LoadDialog() {	}

	LoadDialog.prototype.ModelNameSelector = "#loadDialog .modelNameInput"
	LoadDialog.prototype.CreateMarkup = function()
	{
		$("body").append(new TemplateRender().Render(LoadDialogTemplate));

		this.ApplySavedModelsToDialog();

		$('#loadModel').on("click", $.proxy(this.LoadModel, this));
	};

	LoadDialog.prototype.LoadModel = function ()
	{
		var chosenModelToLoad = $('#loadDialog #savedModelsChoice').val();
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