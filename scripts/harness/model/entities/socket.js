import Connector from "./connector.js"

export default class {
	constructor(blockId, name, type, isInput, canBeDeleted, isMultiple, isRequired, isDataSocket)
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
		this.IsReady = false;
		this.DataSocketPropertyId = null;
		this.Data = null;
	}

	QualifiedId() {
		if (this.IsInputSocket)	{
			return this.BlockId + '-socket-input-' + this.Id;
		}
		return this.BlockId + '-socket-output-' + this.Id;
	}

	ToJSON() {
		var jsonItems = 
		{
			Id : this.Id,
			Name : this.Id,
			BlockId : this.BlockId,
			Type : this.Type,
			CanBeDeleted : this.CanBeDeleted,
			IsMultiple : this.IsMultiple,
			IsInputSocket : this.IsInputSocket,
			IsRequired : this.IsRequired,
			IsDataSocket : this.IsDataSocket,
			DataSocketPropertyId : this.DataSocketPropertyId
		}

		return JSON.stringify(jsonItems);
	}

	Connect(inputSocket) {
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
	}

	Disconnect(otherSocketId) {
		var connectorIndex = -1;

		for (var i in this.Connectors)
		{
			if (this.Connectors[i].To.Id == otherSocketId || this.Connectors[i].From.Id == otherSocketId)
			{
				connectorIndex = i;
			}
		}
		
		if (connectorIndex === -1) {
			throw 'This connector is not connected to this socket and cannot be disconnected';
		}
		this.Connectors.splice(connectorIndex,1);
		return true;
	}

	HasConnectors() {
		return this.Connectors.length > 0;
	}

	DeleteConnections() {
		for(var i in this.Connectors)
		{
			var connector = this.Connectors[i];
			if (this.IsInputSocket === true) {
				connector.From.Disconnect(connector.To.Id);
			}
			else
			{
				connector.To.Disconnect(connector.From.Id);
			}
		}
		this.Connectors = [];
	}
}