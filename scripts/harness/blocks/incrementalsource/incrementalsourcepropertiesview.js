define(
[
   'harness/views/block/properties/propertiesviewbase'
],

function(PropertiesViewBase) {

   function IncrementalSourcePropertiesView(block) {
      PropertiesViewBase.call(this, block);
   }

   IncrementalSourcePropertiesView.prototype = Object.create( PropertiesViewBase.prototype );
   IncrementalSourcePropertiesView.prototype.constructor = IncrementalSourcePropertiesView;

   IncrementalSourcePropertiesView.prototype.CreateTabs = function() {
      var tabs = [];
      tabs.push({
         'Id' : this.Id + '-configuration',
         'Name': 'Configuration',
         'Content': this.CreateConfigurationContent()
         });

      return tabs;
   };
   IncrementalSourcePropertiesView.prototype.CreateConfigurationContent = function() {

      var scalarSourceContent = '<form class="form-horizontal">'+
            '<fieldset>'+
               '<div class="form-group">'+
                  '<label class="col-sm-3 control-label">'+
                     'Value'+
                  '</label>'+
                  '<div class="col-sm-9">'+
                     '<input class="form-control" id="{0}-configuration-value" type="text" value="{1}"/>'.format(this.Id, this.Block.Data) +
                  '<div>'+
               '</div>'+
            '</fieldset>'+
         '</form>';
      return scalarSourceContent;
   };

   IncrementalSourcePropertiesView.prototype.BindEvents = function() {

      var configValue = $("#{0}-configuration-value".format(this.Id));

      configValue.blur(function () {
         var block = harness.GetBlockFromAnyId($(this).attr("id"));
         block.Data = $(this).val();
         harness.Views[block.Id].Draw();
      });
   };

   IncrementalSourcePropertiesView.prototype.Update = function() {
      this.UpdateInputsAndOutputs();

      $("#" + this.Id + "-configuration-value").val(this.Block.Data);
   };

   return (IncrementalSourcePropertiesView);
});