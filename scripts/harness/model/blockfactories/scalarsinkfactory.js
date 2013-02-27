define(
[
	"harness/model/block",
	"harness/model/socket",
	"harness/views/block/scalarsinkview"
],

function(Block, Socket, ScalarSinkView) {

	function ScalarSinkFactory() {}
	ScalarSinkFactory.prototype.Build = function(idNumber)
	{
		var block = new Block(
							this.FriendlyName +
							idNumber,
							this.FriendlyName);

		block.Data = 'Empty';

		block.AddInput(new Socket(block.Id, "Value"), true, false);
		
		block.Execute = function() {
			this.Data = this.Inputs["Value"].Data;
			this.Completed = true;
		};
		
		block.Reset = function() {
			this.Inputs["Value"].Data = null;
			this.Completed = false;
		};
		
		block.Validate = function() {
			return this.ValidateRequiredInputs();
		};
	
		return block;
	}
	ScalarSinkFactory.prototype.FriendlyName = 'Scalar Sink';
	ScalarSinkFactory.prototype.CssClass = 'blockscalarsink';
	ScalarSinkFactory.prototype.Type = 'Sink';
	ScalarSinkFactory.prototype.Description = 'This sink acts as a way of viewing a single number. It does not keep history, as the simulation runs, the single number will be overwritten.';

	ScalarSinkFactory.prototype.GetView = function(block)
	{
		return new ScalarSinkView(block);
	}

	return (ScalarSinkFactory);
});