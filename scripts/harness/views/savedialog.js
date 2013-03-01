define(
[
	"jquery",
	"jquery-ui",
	"harness/engines/harnessserializer",
	"stringlib"
],

function($, jqueryui, HarnessSerializer) {

	function SaveDialog() {	}

	SaveDialog.prototype.CreateMarkup = function() {
		harness.Element.append(
		'<div class="modal fade" id="saveDialog">\
				<div class="modal-header">\
				<button class="close" data-dismiss="modal">×</button>\
				<h3>Save Model</h3>\
			</div>\
			<div class="modal-body">\
				<form class="form-horizontal"><div id="savedModelsPlaceholder"></div>\
  					<div class="control-group">\
  						<h4>Save a new model by typing a new name</h4>\
    					<label class="control-label" for="newModelName">New name:</label>\
    					<div class="controls">\
      						<input type="text" id="newModelName" placeholder="' + harness.Name + '">\
    					</div>\
  					</div>\
				</form>\
			</div>\
			<div class="modal-footer">\
				<button type="button" class="btn btn-primary" data-dismiss="modal" id="saveModel">Save</button>\
  				<button type="button" class="btn" data-dismiss="modal">Cancel</button>\
			</div>\
		</div>');

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
			var chosenModelToOverwrite = $('#saveDialog input:radio[name=savedModelsChoice]:checked').val();
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

	SaveDialog.prototype.GetSavedModelsInList = function() {
		var models = this.GetSavedModels();

		var list = '<div class="control-group savedModelChooser"><h4>Choose a saved model to overwrite...</h4><div class="controls">';
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

	SaveDialog.prototype.ApplySavedModelsToDialog = function() {		
		$('#savedModelsPlaceholder').html("");
		$('#savedModelsPlaceholder').append(
			this.GetSavedModelsInList()
		);
	};

	return (SaveDialog);

});