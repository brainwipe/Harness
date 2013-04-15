define(
[
	"harness/model/entities/block",
	"harness/model/entities/socket",
	"harness/model/entities/sockettype",
	"harness/views/block/arraysourceview"
],

function(Block, Socket, SocketType, ArraySourceView) {

	function ArraySourceFactory() {}
	ArraySourceFactory.prototype.Build = function(idNumber)
	{
		var block = new Block(
							this.FriendlyName +
							idNumber,
							this.FriendlyName,
							this.FactoryName);
		block.AddOutput(new Socket(block.Id, "Vector", new SocketType().BuildVector()));
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

	ArraySourceFactory.prototype.FactoryName = 'ArraySourceFactory';
	ArraySourceFactory.prototype.FriendlyName = 'Array Source';
	ArraySourceFactory.prototype.CssClass = 'blockarraysource';
	ArraySourceFactory.prototype.Type = 'Source';
	ArraySourceFactory.prototype.Description = 'On each tick, this block puts a vector on its output.';

	ArraySourceFactory.prototype.GetView = function(block)
	{
		return new ArraySourceView(block);
	}
	return (ArraySourceFactory);

});
