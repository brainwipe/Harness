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

	return(BlockFactory);
});