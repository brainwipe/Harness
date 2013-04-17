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
		block.Data = {
			"CurrentIndex" : 0,
			"Values" : [
							[0,0,1],
							[0,1,0],
							[1,0,0]
						]
		};
		block.Execute = function() {
			this.Outputs.Vector.Data = this.CurrentData();
			this.Data.CurrentIndex++;
			if (this.Data.CurrentIndex > this.VectorSize() - 1)
			{
				this.Data.CurrentIndex = 0;
			}
			this.Completed = true;
		};

		block.Reset = function() {
			this.Outputs.Vector.Data = this.Data;
			this.Completed = false;
		};

		block.Validate = function() {
			return true;
		};

		block.DataToJSON = function() {
			return JSON.stringify(this.Data);
		};

		block.CurrentData = function() {
			return this.Data.Values[this.Data.CurrentIndex];
		};

		block.VectorSize = function() {
			return this.Data.Values.length;
		};

		block.ValidateData = function() {
			if (this.Data.CurrentIndex > this.Data.Values.length - 1)
			{
				this.Data.CurrentIndex = this.Data.Values.length - 1;
			}
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
	};
	return (ArraySourceFactory);

});
