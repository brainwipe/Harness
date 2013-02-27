define(
[
	"harness/model/connector"
],

	function(Connector) {

	function Socket(blockId, name)
	{
		this.Id = encodeURI(name);
		this.Name = name;
		this.Connectors = [];
		this.BlockId = blockId;
	}
	Socket.prototype.Id = null;
	Socket.prototype.BlockId = null;
	Socket.prototype.QualifiedId = function() {
		if (this.IsInputSocket)
		{
			return this.BlockId + '-socket-input-' + this.Id;
		}
		return this.BlockId + '-socket-output-' + this.Id;
	}
	Socket.prototype.Name = null;
	Socket.prototype.Connectors = null;
	Socket.prototype.Data = null;
	Socket.prototype.Connect = function(inputSocket) {
	
		if (this.IsInputSocket == true) {
			throw 'You can only connect an output socket to an input socket, not the other way around'; }
	
		if (this == inputSocket) {
			throw 'You may not connect a socket to itself.'; }

		if (inputSocket.IsMultiple == false && inputSocket.HasConnectors() > 0) {
			throw 'This input socket can only accept one connector, which it already has.'; }
	
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
	Socket.prototype.IsMultiple = false;
	Socket.prototype.IsRequired = false;
	Socket.prototype.IsReady = false;
	Socket.prototype.HasConnectors = function() {
		return this.Connectors.length > 0
	}
	
	return (Socket);
});