define(
[
	"harness/engines/harnessserializer",
	"harness/views/templaterender",
	"text!harness/views/templates/savedialog.html",
	"text!harness/views/templates/savedmodels.html",
	"stringlib"
],

function(HarnessSerializer, TemplateRender, SaveDialogTemplate, SavedModelsTemplate) {

	function SaveDialog(loadDiag) 
	{	
		this.LoadDialog = loadDiag;
	}

	SaveDialog.prototype.LoadDialog = null;
	SaveDialog.prototype.CreateMarkup = function() {

		$("body").append(
			new TemplateRender().Render(SaveDialogTemplate, {"harnessName": harness.Name}));

		this.ApplySavedModelsToDialog();

		this.Bind();
	};

	SaveDialog.prototype.SaveModel = function() {
		var saveKey = "";

		if ($(".savedModelChooser").length > 0)	{
			var chosenModelToOverwrite = $('#saveDialog #savedModelsChoice').val();
			saveKey = chosenModelToOverwrite;
		}

		if ($("#newModelName").val().length > 0) {
			saveKey = $("#newModelName").val();
			$("#newModelName").val('');
		}

		if (saveKey.length === 0) {
			saveKey = $("#newModelName").attr("placeholder");
		}

		var serializer = new HarnessSerializer();
		localStorage["model-" + saveKey] = serializer.HarnessToJSON(harness);

		this.ApplySavedModelsToDialog();
		this.LoadDialog.ApplySavedModelsToDialog();
	};

	SaveDialog.prototype.GetSavedModels = function() {
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

	SaveDialog.prototype.GetSavedModelsInList = function() {
		var models = this.GetSavedModels();

		if (models.length === 0)
		{
			return '';
		}

		var data = {
			"title": "Choose a saved model to overwrite...",
			"models": models,
			"harnessName": harness.Name
		};

		return new TemplateRender().Render(SavedModelsTemplate, data);
	};

	SaveDialog.prototype.Bind = function() {
		$("#saveModel").on("click", $.proxy(this.SaveModel, this));
		$('#newModelName').on('change', $.proxy(this.NewModelNameGiven, this));
		$('#newModelName').on('focus', $.proxy(this.UsePlaceholderValue, this));
	};

	SaveDialog.prototype.NewModelNameGiven = function() {
		if ($("#newModelName").val())
		{
			$('#saveDialog #savedModelsChoice').attr('disabled', 'disabled');
		}
		else
		{
			$('#saveDialog #savedModelsChoice').removeAttr('disabled');
		}
	};

	SaveDialog.prototype.UsePlaceholderValue = function() {
		$('#newModelName').val($('#newModelName').attr('placeholder'));
		$('#saveDialog #savedModelsChoice').attr('disabled', 'disabled');
	}

	SaveDialog.prototype.ApplySavedModelsToDialog = function() {
		$('#saveDialog .savedModelsPlaceholder').html("");
		$('#saveDialog .savedModelsPlaceholder').append(
			this.GetSavedModelsInList()
		);
	};

	return (SaveDialog);
});