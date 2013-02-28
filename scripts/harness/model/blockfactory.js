define(
[
	"harness/model/blockfactories/ScalarSourceFactory",
	"harness/model/blockfactories/ScalarSinkFactory"
	
],

function(ScalarSourceFactory, ScalarSinkFactory) {

	function BlockFactory() {
		this.Factories = {};

		this.Factories["ScalarSourceFactory"] = new ScalarSourceFactory();
		this.Factories["ScalarSinkFactory"] = new ScalarSinkFactory();
	}
	BlockFactory.prototype.Factories = null;



	return(BlockFactory)

});