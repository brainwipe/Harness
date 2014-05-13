define(
[
	"harness/model/entities/connector"
],

function(Connector) {

	function Socket(blockId, name, type, isInput, canBeDeleted, isMultiple, isRequired, isDataSocket)
	{
		this.Id = name.replace(/ /g, '');
		this.Name = name;
		this.Connectors = [];
		this.BlockId = blockId;
		this.Type = type;
		this.CanBeDeleted = canBeDeleted;
		this.IsMultiple = isMultiple;
		this.IsInputSocket = isInput;
		this.IsRequired = isRequired;
		this.IsDataSocket = isDataSocket;
	}

	Socket.prototype.Id = null;
	Socket.prototype.BlockId = null;
	Socket.prototype.QualifiedId = function() {
		if (this.IsInputSocket)	{
			return this.BlockId + '-socket-input-' + this.Id;
		}
		return this.BlockId + '-socket-output-' + this.Id;
	};
	Socket.prototype.Name = null;
	Socket.prototype.Connectors = null;
	Socket.prototype.Data = null;
	Socket.prototype.IsInputSocket = false;
	Socket.prototype.IsMultiple = false;
	Socket.prototype.IsRequired = false;
	Socket.prototype.IsReady = false;
	Socket.prototype.CanBeDeleted = false;
	Socket.prototype.IsDataSocket = false;
	Socket.prototype.DataSocketPropertyId = null;
	Socket.prototype.Type = {};

	Socket.prototype.ToJSON = function() {
		return '{ "Id" : "' + this.Id + '", ' +
		'"Name" : "' + this.Name + '", ' +
		'"BlockId" : "' + this.BlockId + '", ' +
		'"Type" : ' + JSON.stringify(this.Type) + ', ' +
		'"CanBeDeleted" : "' + this.CanBeDeleted + '", ' +
		'"IsMultiple" : "' + this.IsMultiple + '", ' +		
		'"IsInputSocket" : "' + this.IsInputSocket + '", ' +
		'"IsRequired" : "' + this.IsRequired + '", ' +
		'"IsDataSocket" : "' + this.isDataSocket + '", ' + 
		'"DataSocketPropertyId" : "' + this.DataSocketPropertyId + '" } ';
	};

	Socket.prototype.Connect = function(inputSocket) {
		if (inputSocket.Type.Key !== this.Type.Key && this.Type.Key !== "Harness.Socket.Type.Any")
		{
			throw 'You are trying to connect a socket of type {0} to a socket of type {1}. Socket types must be compatible.'.format(inputSocket.Type.Key, this.Type.Key);
		}

		if (this.IsInputSocket === true) {
			throw 'You can only connect an output socket to an input socket, not the other way around'; }

		if (this === inputSocket) {
			throw 'You may not connect a socket to itself.'; }

		if (inputSocket.IsMultiple === false && inputSocket.HasConnectors() > 0) {
			throw 'This input socket can only accept one connector, which it already has.'; }

		var connector = new Connector(this, inputSocket);
		this.Connectors.push(connector);
		inputSocket.Connectors.push(connector);
		return connector;
	};

	Socket.prototype.Disconnect = function(connectorToRemove) {
		var connectorIndex = this.Connectors.indexOf(connectorToRemove);
		if (connectorIndex === -1) {
			throw 'This connector is not connected to this socket and cannot be disconnected';
		}

		this.Connectors.splice(connectorIndex,1);
		return true;
	};

	Socket.prototype.HasConnectors = function() {
		return this.Connectors.length > 0;
	};

	Socket.prototype.DeleteConnections = function() {
		for(var i in this.Connectors)
		{
			var connector = this.Connectors[i];
			if (this.IsInputSocket === true) {
				connector.From.Disconnect(connector);

			}
			else
			{
				connector.To.Disconnect(connector);
			}
		}
		this.Connectors = [];
	};

	return (Socket);
});