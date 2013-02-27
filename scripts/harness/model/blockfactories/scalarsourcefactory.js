define(
[
	"harness/model/block",
	"harness/model/socket",
	"harness/views/block/scalarsourceview"
],

function(Block, Socket, ScalarSourceView) {

	function ScalarSourceFactory() {}
	ScalarSourceFactory.prototype.Build = function(idNumber)
	{
		var block = new Block(
							this.FriendlyName +
							idNumber,
							this.FriendlyName);
		block.AddOutput(new Socket(block.Id, "Value"));
		block.Data = 10;
		block.Execute = function() {
			this.Outputs["Value"].Data = this.Data;
			this.Completed = true;
		};
		
		block.Reset = function() {
			this.Outputs["Value"].Data = this.Data;
			this.Completed = false;
		};
		
		block.Validate = function() {
			return true;
		};
		
		return block;
	}
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
