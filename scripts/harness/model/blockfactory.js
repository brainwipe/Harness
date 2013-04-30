define(
[
	"harness/model/blockfactories/ScalarSourceFactory",
	"harness/model/blockfactories/ScalarSinkFactory",
   "harness/model/blockfactories/IncrementalSourceFactory",
   "harness/model/blockfactories/PSOMFuncFactory",
   "harness/model/blockfactories/ArraySourceFactory"

],

function(ScalarSourceFactory, ScalarSinkFactory, IncrementalSourceFactory, PSOMFuncFactory, ArraySourceFactory) {

	function BlockFactory() {
		this.Factories = {};

		this.Factories.ScalarSourceFactory = new ScalarSourceFactory();
		this.Factories.ScalarSinkFactory = new ScalarSinkFactory();
      	this.Factories.IncrementalSourceFactory = new IncrementalSourceFactory();
      	this.Factories.PSOMFuncFactory = new PSOMFuncFactory();
      	this.Factories.ArraySourceFactory = new ArraySourceFactory();
	}
	BlockFactory.prototype.Factories = null;

	BlockFactory.prototype.CreateBlock = function(blockFactoryId, harness, viewOffsetLeft, viewOffsetTop)
	{
		var blockFactory = this.Factories[blockFactoryId];

		var block = blockFactory.Build(harness.GetNextBlockId());
		var view = blockFactory.GetView(block);
		harness.AddBlock(block, view);

		view.Base.Element.offset({
			left: viewOffsetLeft,
			top: viewOffsetTop
		});

		block.Initialise();

		view.Draw();
	};
	return(BlockFactory);
});