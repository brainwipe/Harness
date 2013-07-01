define(
[
	"harness/model/socketfactory",
	"harness/model/entities/block",
	"harness/model/entities/socket",
	"harness/model/entities/sockettype",
	"harness/views/block/scalarsourceview"
],

function(SocketFactory, Block, Socket, SocketType, ScalarSourceView) {

	function ScalarSourceFactory() {}
	ScalarSourceFactory.prototype.Build = function(idNumber)
	{
		var block = new Block(
							this.FriendlyName +
							idNumber,
							this.FriendlyName,
							this.FactoryName);

		var socketFactory = new SocketFactory();

		block.AddOutput(
			socketFactory.OutputSingleFixed(
				block,
				"Value",
				new SocketType().BuildScalar()
				));

		block.Data = 10;
		block.Execute = function() {
			this.Outputs.Value.Data = this.Data;
			this.Completed = true;
		};

		block.Reset = function() {
			this.Outputs.Value.Data = this.Data;
			this.Completed = false;
		};

		block.Validate = function() {
			return true;
		};

		block.DataToJSON = function() {
			return '"' + this.Data + '"';
		};

		return block;
	};

	ScalarSourceFactory.prototype.FactoryName = 'ScalarSourceFactory';
	ScalarSourceFactory.prototype.FriendlyName = 'Scalar Source';
	ScalarSourceFactory.prototype.CssClass = 'blockscalarsource';
	ScalarSourceFactory.prototype.Type = 'Source';
	ScalarSourceFactory.prototype.Description = 'This source provides a single real number, such as 123.4. This useful for biases, offsets, providing paramters for functions or simple mathematics.';

	ScalarSourceFactory.prototype.GetView = function(block)
	{
		return new ScalarSourceView(block);
	}
	return (ScalarSourceFactory);

});
