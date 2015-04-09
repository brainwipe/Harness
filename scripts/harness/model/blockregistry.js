define(
[
   "harness/blocks/arraysource/arraysource",
   "harness/blocks/incrementalsource/incrementalsource",
   "harness/blocks/psomfunc/psomfunc",
   "harness/blocks/scalarsource/scalarsource",
   "harness/blocks/scalarsink/scalarsink"
],

function() {

   function BlockRegistry() {
      this.BlockDefinitions = FindRequireJSModulesByObjectName("harness/blocks");
   }

   BlockRegistry.prototype.BlockDefinitions = {};

   BlockRegistry.prototype.CreateBlock = function(blockFactoryId, harness, viewOffsetLeft, viewOffsetTop)
   {
      var block = new this.BlockDefinitions[blockFactoryId](harness.GetNextBlockId());

      var view = block.CreateView();
      view.CreateMarkup(harness.Element);
      view.Element.offset({
         left: viewOffsetLeft,
         top: viewOffsetTop
      });

      block.Initialise(view);

      harness.AddBlock(block, view);

      view.Draw();

      return {"NewBlock": block, "NewView": view};
   };

   BlockRegistry.prototype.CreateBlockFromJSON = function(harness, blockJSON)
   {
      var fullyQualifiedBlockName = "harness/blocks/" + blockJSON.Type.toLowerCase() + "/" + blockJSON.Type.toLowerCase();

      var block = new this.BlockDefinitions[fullyQualifiedBlockName](harness.GetNextBlockId());

      block.Name = blockJSON.Name;
      block.JSONToData(blockJSON.Data);
      this.CreateInputsFromJSON(block, blockJSON.Sockets.Inputs);
      this.CreateOutputsFromJSON(block, blockJSON.Sockets.Outputs);

      var view = block.CreateView(block);
      view.CreateMarkup(harness.Element);
      view.Element.offset({
         left: blockJSON.View.Left,
         top: blockJSON.View.Top
      });

      view.Element.children(".ui-resizable").width(blockJSON.View.Width);
      view.Element.children(".ui-resizable").height(blockJSON.View.Height);

      block.Initialise(view);

      harness.AddBlock(block, view);

      view.Draw();

      return block;
   };

   BlockRegistry.prototype.CreateInputsFromJSON = function(block, inputs)
   {
      block.InputsCount = 0;
      block.Inputs = {};

      for(var i in inputs)
      {
         var jsonSocket = inputs[i];
         block.AddInput(block.SocketFactory.FromJSON(jsonSocket));
      }
   };

   BlockRegistry.prototype.CreateOutputsFromJSON = function(block, outputs)
   {
      block.OutputsCount = 0;
      block.Outputs = {};

      for(var i in outputs)
      {
         var jsonSocket = outputs[i];
         block.AddOutput(block.SocketFactory.FromJSON(jsonSocket));
      }
   };

   return(BlockRegistry);
});