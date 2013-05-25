define(
[
   'harness/views/block/properties/propertiesviewbase',
   'harness/views/templaterender',
   'text!harness/views/templates/block/properties/generictabcontent.html'
],

function(PropertiesViewBase, TemplateRender, GenericTabContent) {

   function PSOMFuncPropertiesView(block) {
      this.Block = block;
      this.Id = this.Block.Id + '-properties';
      this.Base = new PropertiesViewBase();
   }

   PSOMFuncPropertiesView.prototype.Block = null;
   PSOMFuncPropertiesView.prototype.Id = null;
   PSOMFuncPropertiesView.prototype.Base = null;
   PSOMFuncPropertiesView.prototype.Create = function() {
      this.Base.Create(this.Id, this.Block, this.CreateTabs());
      this.BindEvents();
   };
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
      this.Base.Update(this.Id, this.Block);
      $("#" + this.Id + "-configuration-value").val(this.Block.Data);
   };

   return (PSOMFuncPropertiesView);
});