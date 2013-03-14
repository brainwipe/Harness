define(
[
   "harness/engines/harnessserializer",
   "stringlib"
],

function(HarnessSerializer) {

   function ImportExportModelDialog() { }

   ImportExportModelDialog.prototype.CreateMarkup = function() {

      harness.Element.append(
      '<div class="modal fade" id="importExportModelDialog">' +
            '<div class="modal-header">' +
            '<button class="close" data-dismiss="modal">×</button>' +
            '<h3>Import / Export Model</h3>' +
         '</div>' +
         '<div class="modal-body">' +
            '<p>Below is the Model in JSON format. Copy the contents into your favourite text editor to export.</p><p>To import some blocks, click empty below and paste in a JSON model. The new blocks will be imported on top of your existing model, so you might want to clear that first.</p>'+
            '<form><fieldset><textarea rows="8" class="input-block-level" id="jsonImportExport">' +
             '</textarea></fieldset></form>' +
         '</div>'+
         '<div class="modal-footer">'+
            '<button type="button" class="btn btn-primary" data-dismiss="modal" id="importModel" disabled="disabled">Import</button>'+
            '<button type="button" class="btn" data-dismiss="modal">Cancel</button>'+
         '</div>'+
      '</div>');

      $('#importExportModelDialog').on('show', function (e) {
         var serializer = new HarnessSerializer();
         $('#jsonImportExport').val(serializer.HarnessToJSON(harness));
      });

      $('#jsonImportExport').on('focus', function() {
         $(this).select();
         // Work around Chrome's little problem
         $(this).mouseup(function() {
            // Prevent further mouseup intervention
            $(this).unbind("mouseup");
            return false;
         });
      });

      $("#importModel").click(function() {

      });
   };



   return (ImportExportModelDialog);

});