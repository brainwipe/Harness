define(
[
   'harness/views/block/properties/PropertiesViewBase',
   'harness/views/TemplateRender',
   'text!harness/views/templates/block/properties/generictabcontent.html'
],

function(PropertiesViewBase, TemplateRender, GenericTabContent) {

   function PSOMFuncPropertiesView(block) {
      PropertiesViewBase.call(this, block);
   }

   PSOMFuncPropertiesView.prototype = Object.create( PropertiesViewBase.prototype );
   PSOMFuncPropertiesView.prototype.constructor = PSOMFuncPropertiesView;

   PSOMFuncPropertiesView.prototype.CreateTabs = function() {
      var tabs = [];
      tabs.push({
         'Id' : this.Id + '-configuration',
         'Name': 'Configuration',
         'Content': this.CreateConfigurationContent(this.Id + '-configuration')
         });

      return tabs;
   };
   PSOMFuncPropertiesView.prototype.CreateConfigurationContent = function(propid) {

      var data = {
         "propertiesid" : propid,
         "properties" : this.GetProperties(this.Block.Data.configuration, this.Block.Data.configurationtext)
      };

      return new TemplateRender().Render(GenericTabContent, data);
   };

   PSOMFuncPropertiesView.prototype.GetProperties = function(psomConfiguration, psomConfigurationText)
   {
      var properties = {};
      for(var config in psomConfiguration)
      {
         properties[config] = {};
         properties[config].value = psomConfiguration[config];
         properties[config].text = psomConfigurationText[config];
      }

      return properties;
   };

   PSOMFuncPropertiesView.prototype.BindEvents = function() {

      for(var property in this.Block.Data.configuration)
      {
         var propertyValueId = "#" + this.Id + '-configuration-' + property + '-value';
         var propertyValue = $(propertyValueId);

         propertyValue.blur(this.onPropertyValueBlur);
      }
   };

   PSOMFuncPropertiesView.prototype.onPropertyValueBlur = function()
   {
      // NB: In the scope of the property value being changed, not the scope of the view's object.
      // $(this) will be the jquery object, not PSOMFuncPropertiesView
      var controlId = $(this).attr("id");

      var block = harness.GetBlockFromAnyId(controlId);

      var configurationId = block.Id + '-properties-configuration-';
      var propertyId = controlId.replace(configurationId,'');
      propertyId = propertyId.replace('-value','');

      block.Data.configuration[propertyId] = $(this).val();
      harness.Views[block.Id].Draw();
   };

   PSOMFuncPropertiesView.prototype.Update = function() {
      this.UpdateInputsAndOutputs();

      for(var i in this.Block.Data.configuration)
      {
         var configValue = this.Block.Data.configuration[i];
         var propertyValueId = "#" + this.Id + '-configuration-' + i + '-value';
         $(propertyValueId).val(configValue);
      }

   };

   return (PSOMFuncPropertiesView);
});