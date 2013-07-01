define(
[
   "harness/model/blocks/arraysource",
   "harness/model/blocks/incrementalsource",
   "harness/model/blocks/psomfunc",
	"harness/model/blocks/scalarsource",
   "harness/model/blocks/scalarsink"
],

function() {

	function BlockFactory() {
      this.BlockDefinitions = FindRequireJSModulesByObjectName("harness/model/blocks");
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