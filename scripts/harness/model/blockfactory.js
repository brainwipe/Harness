define(
[
	"harness/model/blockfactories/ScalarSourceFactory",
	"harness/model/blockfactories/ScalarSinkFactory",
   "harness/model/blockfactories/IncrementalSourceFactory",
   "harness/model/blockfactories/PSOMFuncFactory"

],

function(ScalarSourceFactory, ScalarSinkFactory, IncrementalSourceFactory, PSOMFuncFactory) {

	function BlockFactory() {
		this.Factories = {};

		this.Factories.ScalarSourceFactory = new ScalarSourceFactory();
		this.Factories.ScalarSinkFactory = new ScalarSinkFactory();
      this.Factories.IncrementalSourceFactory = new IncrementalSourceFactory();
      this.Factories.PSOMFuncFactory = new PSOMFuncFactory();
	}
	BlockFactory.prototype.Factories = null;

	return(BlockFactory);
});