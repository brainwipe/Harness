define(
[
	"harness/model/blockfactories/ScalarSourceFactory",
	"harness/model/blockfactories/ScalarSinkFactory"
	
],

function(ScalarSourceFactory, ScalarSinkFactory) {

	function BlockFactory() {
		this.Factories = new Array();

		this.Factories.push(new ScalarSourceFactory);
		this.Factories.push(new ScalarSinkFactory);
	}
	BlockFactory.prototype.Factories = null;

	return(BlockFactory)

});