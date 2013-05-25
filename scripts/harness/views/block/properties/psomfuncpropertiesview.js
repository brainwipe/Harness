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
         'Content': this.CreateConfigurationContent()
         });

      return tabs;
   };
   PSOMFuncPropertiesView.prototype.CreateConfigurationContent = function() {

      var data = {
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



      var configValue = $("#{0}-configuration-value".format(this.Id));

      configValue.blur(function () {
         var block = harness.GetBlockFromAnyId($(this).attr("id"));
         //block.Data = $(this).val();
         harness.Views[block.Id].Draw();
      });
   };

   PSOMFuncPropertiesView.prototype.Update = function() {
      this.Base.Update(this.Id, this.Block);
      $("#" + this.Id + "-configuration-value").val(this.Block.Data);
   };

   return (PSOMFuncPropertiesView);
});