import PropertiesViewBase from "/scripts/harness/views/block/properties/propertiesviewbase.js"
import GenericTabContent from "/scripts/harness/views/templates/block/properties/generictabcontent.js"

export default class extends PropertiesViewBase {
   constructor(block) {
      super(block);
   }

   CreateTabs() {
      var tabs = [];
      tabs.push({
         'Id' : `${this.Id}-configuration`,
         'Name': 'Configuration',
         'Content': this.CreateConfigurationContent(this.Id)
         });

      return tabs;
   }

   CreateConfigurationContent(id) {
      var propid = `${id}-configuration`;
      return GenericTabContent(propid, this.GetProperties(this.Block.Data.configuration, this.Block.Data.configurationtext));
   }

   GetProperties(psomConfiguration, psomConfigurationText) {
      var properties = {}
      var dataSockets = this.Block.GetDataSockets();

      for(var config in psomConfiguration)
      {
         properties[config] = {}
         properties[config].value = psomConfiguration[config];
         properties[config].text = psomConfigurationText[config];
         properties[config].socket = dataSockets[config];
      }

      return properties;
   }

   SetDataSocketsOnConfiguration()
   {
      var dataSockets = this.Block.GetDataSockets();
   }

   BindEvents() {
      for(var property in this.Block.Data.configuration)
      {
         var propertyValueId = `#${this.Id}-configuration-${property}-value`;
         var propertyValue = $(propertyValueId);

         propertyValue.blur(this.onPropertyValueBlur);
      }
   }

   onPropertyValueBlur() {
      // NB: In the scope of the property value being changed, not the scope of the view's object.
      // $(this) will be the jquery object, not PSOMFuncPropertiesView
      var controlId = $(this).attr("id");

      var block = harness.GetBlockFromAnyId(controlId);

      var configurationId = `${block.Id}-properties-configuration-`;
      var propertyId = controlId.replace(configurationId,'');
      propertyId = propertyId.replace('-value','');

      block.Data.configuration[propertyId] = $(this).val();
      harness.Views[block.Id].Draw();
   }

   Update() {
      this.UpdateInputsAndOutputs();

      for(var i in this.Block.Data.configuration)
      {
         var configValue = this.Block.Data.configuration[i];
         var propertyValueId = `#${this.Id}-configuration-${i}-value`;
         $(propertyValueId).val(configValue);
      }

   }
}