define(
[
	"harness/model/block",
	"harness/model/connector"
],

	function(Block, Connector) {

	function Socket(name)
	{
		this.Id = encodeURI(name);
		this.Name = name;
		this.Connectors = new Array();
	}
	Socket.prototype.Id = null;
	Socket.prototype.QualifiedId = function() {
		if (this.IsInputSocket)
		{
			return this.Block.Id + '-socket-input-' + this.Id;
		}
		return this.Block.Id + '-socket-output-' + this.Id;
	}
	Socket.prototype.Name = null;
	Socket.prototype.Connectors = null;
	Socket.prototype.Data = null;
	Socket.prototype.Connect = function(inputSocket) {
	
		if (this.IsInputSocket == true) {
			throw 'You can only connect an output socket to an input socket, not the other way around'; }
	
		if (this == inputSocket) {
			throw 'You may not connect a socket to itself.'; }
	
		var connector = new Connector(this, inputSocket);
		this.Connectors.push(connector);
		inputSocket.Connectors.push(connector);
		return connector;
	}
	Socket.prototype.Disconnect = function(connectorToRemove) {
		for (i in this.Connectors)
		{
			var connector = this.Connectors[i];
			if (connector == connectorToRemove)
			{
				this.Connectors.splice(i, 1);
				return true;
			}
		}
		return false;
	}
	Socket.prototype.IsInputSocket = false;
	Socket.prototype.IsRequired = false;
	Socket.prototype.Block = null;
	Socket.prototype.Element = null;
	Socket.prototype.IsReady = false;
	Socket.prototype.HasConnectors = function() {
		return this.Connectors.length > 0
	}
	
	return (Socket);
});