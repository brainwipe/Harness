define(
[
	"harness/model/entities/block",
	"harness/model/entities/socket",
	"harness/model/entities/sockettype",
	"harness/views/block/scalarsinkview"
],

function(Block, Socket, SocketType, ScalarSinkView) {

	function ScalarSinkFactory() {}
	ScalarSinkFactory.prototype.Build = function(idNumber)
	{
		var block = new Block(
							this.FriendlyName +
							idNumber,
							this.FriendlyName,
							this.FactoryName);

		block.Data = 'Empty';

		block.AddInput(new Socket(block.Id, "Value", new SocketType().BuildScalar()), true, false);

		block.Execute = function() {
			this.Data = this.Inputs.Value.Data;
			this.Completed = true;
		};

		block.Reset = function() {
			this.Inputs.Value.Data = null;
			this.Completed = false;
		};

		block.Validate = function() {
			return this.ValidateRequiredInputs();
		};

		block.DataToJSON = function() {
			return '"' + this.Data + '"';
		};

		return block;
	};
	ScalarSinkFactory.prototype.FactoryName = 'ScalarSinkFactory';
	ScalarSinkFactory.prototype.FriendlyName = 'Scalar Sink';
	ScalarSinkFactory.prototype.CssClass = 'blockscalarsink';
	ScalarSinkFactory.prototype.Type = 'Sink';
	ScalarSinkFactory.prototype.Description = 'This sink acts as a way of viewing a single number. It does not keep history, as the simulation runs, the single number will be overwritten.';

	ScalarSinkFactory.prototype.GetView = function(block)
	{
		return new ScalarSinkView(block);
	};

	return (ScalarSinkFactory);
});