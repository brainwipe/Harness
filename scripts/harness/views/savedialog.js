define(
[
	"harness/engines/harnessserializer",
	"stringlib"
],

function(HarnessSerializer) {

	function SaveDialog() {	}

	SaveDialog.prototype.CreateMarkup = function() {
		harness.Element.append(
		'<div class="modal fade" id="saveDialog">' +
				'<div class="modal-header">' +
				'<button class="close" data-dismiss="modal">×</button>' +
				'<h3>Save Model</h3>' +
			'</div>' +
			'<div class="modal-body">' +
				'<form class="form-horizontal" id="savedModelsPlaceholder">'+
					'<legend>Save a new model by typing a new name</legend>'+
					'<div class="control-group">'+
						'<label class="control-label" for="newModelName">New name:</label>'+
						'<div class="controls">'+
							'<input type="text" id="newModelName" placeholder="' + harness.Name + '">'+
						'</div>'+
					'</div>'+
				'</form>'+
			'</div>'+
			'<div class="modal-footer">'+
				'<button type="button" class="btn btn-primary" data-dismiss="modal" id="saveModel">Save</button>'+
				'<button type="button" class="btn" data-dismiss="modal">Cancel</button>'+
			'</div>'+
		'</div>');

		this.ApplySavedModelsToDialog();

		$("#saveModel").click(function() {
			savedialog.SaveModel();
			savedialog.ApplySavedModelsToDialog();
			loaddialog.ApplySavedModelsToDialog();
		});
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

		var list = '<legend>Choose a saved model to overwrite...</legend>'+
						'<div class="control-group savedModelChooser">'+
							'<div class="controls"><select id="savedModelsChoice">';
		var modelCount = 0;

		for (var i in models)
		{
			modelCount++;
			var id = i.replace(/ /g,'');
			list += '<option value="{0}">{1}</option>'.format(id, i);
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

	SaveDialog.prototype.ApplySavedModelsToDialog = function() {
		$('#savedModelsPlaceholder').html("");
		$('#savedModelsPlaceholder').append(
			this.GetSavedModelsInList()
		);

		$('#newModelName').on('change', function() {
			if ($(this).val())
			{
				$('#savedModelsChoice').attr('disabled', 'disabled');
			}
			else
			{
				$('#savedModelsChoice').removeAttr('disabled');
			}
		});

		$('#newModelName').on('focus', function() {
			$(this).val($(this).attr('placeholder'));
			$('#savedModelsChoice').attr('disabled', 'disabled');
		});
	};

	return (SaveDialog);

});