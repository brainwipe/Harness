define(
[
	"harness/model/blockfactories/ScalarSourceFactory",
	"harness/model/blockfactories/ScalarSinkFactory",
   "harness/model/blockfactories/IncrementalSourceFactory"
],

function(ScalarSourceFactory, ScalarSinkFactory, IncrementalSourceFactory) {

	function BlockFactory() {
		this.Factories = {};

		this.Factories.ScalarSourceFactory = new ScalarSourceFactory();
		this.Factories.ScalarSinkFactory = new ScalarSinkFactory();
      this.Factories.IncrementalSourceFactory = new IncrementalSourceFactory();
	}
	BlockFactory.prototype.Factories = null;

	return(BlockFactory);
});