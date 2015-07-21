define(
[
   'harness/engines/harnessserializer',
   'harness/harnessfactory',
   'harness/views/templaterender',
   'text!harness/views/templates/importexportdialog.html',
   'stringlib'
],

function(HarnessSerializer, HarnessFactory, TemplateRender, ImportExportDialogTemplate) {

   function ImportExportModelDialog() { }

   ImportExportModelDialog.prototype.CreateMarkup = function() {

      $("body").append(
         new TemplateRender().Render(ImportExportDialogTemplate, {}));

      $('#importExportModelDialog').on('show.bs.modal', function (e) {
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

      $('#jsonImportExport').on('change', function() {
         $('#importModel').removeAttr('disabled');
      });

      $('#importModel').click(function() {
         var harnessFactory = new HarnessFactory();
         $(this).attr('disabled','disabled');
         try {
            harnessFactory.BuildFromJSON(harness, $('#jsonImportExport').val());
         }
         catch (error) {
            $('#error-reason').html('There was an error with the JSON model you tried to import: <br/>' + error);
            $('#importError').show();

         }
      });
   };

   return (ImportExportModelDialog);

});