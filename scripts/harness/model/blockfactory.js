define(
[
   "harness/blocks/arraysource/arraysource",
   "harness/blocks/incrementalsource/incrementalsource",
   "harness/blocks/psomfunc/psomfunc",
   "harness/blocks/scalarsource/scalarsource",
   "harness/blocks/scalarsink/scalarsink"
],

function() {

   function BlockFactory() {
      this.BlockDefinitions = FindRequireJSModulesByObjectName("harness/blocks");
   }

   BlockFactory.prototype.BlockDefinitions = {};

   BlockFactory.prototype.CreateBlock = function(blockFactoryId, harness, viewOffsetLeft, viewOffsetTop)
   {
      var block = new this.BlockDefinitions[blockFactoryId](harness.GetNextBlockId());

      var view = block.GetView();
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

   BlockFactory.prototype.CreateBlockFromJSON = function(harness, blockJSON)
   {
      var block = new this.BlockDefinitions[blockJSON.Type.toLowerCase()](harness.GetNextBlockId());

      block.Name = blockJSON.Name;
      block.JSONToData(blockJSON.Data);

      var view = block.GetView(block);
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

   return(BlockFactory);
});