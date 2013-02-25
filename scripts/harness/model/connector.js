define(
[
	"harness/model/block"
],

function() {

	function Connector(from, to) {
		this.From = from;
		this.To = to;
	}
	Connector.prototype.From = null;
	Connector.prototype.To = null;
	Connector.prototype.Description = function ()
	{
		return "Connects " + this.From.Block.Id + 
						  " (" + this.From.Name + 
						  ") to " + this.To.Block.Id + 
						  " (" + this.To.Name + ")";
	}

	return (Connector);

});