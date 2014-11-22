define(
[
	"jquery",
	"harness/validationexception",
	"harness/model/socketfactory"
],

function($, ValidationException, SocketFactory) {

	function Block (sequenceIdNumber, name)
	{
		this.SocketFactory = new SocketFactory();

		this.Id = name.replace(/ /g,'') + sequenceIdNumber;
		this.Name = name;
		this.Inputs = {};
		this.Outputs = {};
		this.Data = {};
		this.Completed = false;
		this.InputsCount = 0;
		this.OutputsCount = 0;
	}

	Block.prototype.Initialise = function(view) {};
	Block.prototype.Id = null;
	Block.prototype.Name = null;
	Block.prototype.Inputs = null;
	Block.prototype.Outputs = null;
	Block.prototype.Data = null;
	Block.prototype.Completed = false;
	Block.prototype.Execute = null;
	Block.prototype.Reset = null;
	Block.prototype.Validate = null;
	Block.prototype.SocketFactory = null;

	Block.prototype.AddInput = function (inputSocket) {
		if (this.Inputs.hasOwnProperty(inputSocket.Id))
		{
			throw "Cannot create input socket, it already exists.";
		}

		this.InputsCount++;
		this.Inputs[inputSocket.Id] = inputSocket;
	};

	Block.prototype.AddOutput = function (outputSocket) {
		if (this.Outputs.hasOwnProperty(outputSocket.Id))
		{
			throw "Cannot create output socket, it already exists.";
		}

		this.OutputsCount++;
		this.Outputs[outputSocket.Id] = outputSocket;
	};

	Block.prototype.ValidateRequiredInputs = function() {
		for(var i in this.Inputs) {
			var input = this.Inputs[i];

			if (input.IsRequired === true &&
				input.HasConnectors() === false)
				{
					throw new ValidationException("Block " + this.Id + " requires an input",
						"The block called '" +
						this.Id +
						"' of type '" +
						this.Name +
						"' has an input called '" +
						input.Name +
						"', which is a required input. This means it needs an input connector. Connect this input to an output of another block or remove this block altogether.");
			}
		}
		return true;
	};

	Block.prototype.ExecuteAll = function () {

		for (var i in this.Inputs)
		{
			var input = this.Inputs[i];
			if (input.IsDataSocket === true)
			{
				this.Data.configuration[input.DataSocketPropertyId] = input.Data;
			}
		}

		for (var i in this.Outputs)
		{
			var output = this.Outputs[i];
			if (output.IsDataSocket === true)
			{
				output.Data = this.Data.configuration[output.DataSocketPropertyId];
			}
		} 

		this.Execute();
	};

	Block.prototype.GetAllSockets = function() {
		return $.extend({}, this.Inputs, this.Outputs);
	};

	Block.prototype.DeleteInput = function (inputSocket) {
		this.Inputs = this.DeleteSocket(this.Inputs, inputSocket);
	};

	Block.prototype.DeleteOutput = function (outputSocket) {
		this.Outputs = this.DeleteSocket(this.Outputs, outputSocket);
	};

	Block.prototype.DeleteSocket = function (socketArray, socket) {
		if (socket == null || socket.CanBeDeleted === false)
		{
			return socketArray;
		}

		if (socket.HasConnectors() === true)
		{
			socket.DeleteConnections();
		}

		delete socketArray[socket.Id];
		return socketArray;
	};

	Block.prototype.DeleteConnections = function () {
		var sockets = this.GetAllSockets();
		for (var i in sockets)
		{
			var socket = sockets[i];
			if (socket.HasConnectors() === true)
			{
				socket.DeleteConnections();
			}
		}
	};

	Block.prototype.DataToJSON = function () {
		return JSON.stringify(this.Data);
	};

	Block.prototype.JSONToData = function(jsonData) {
      	this.Data = jsonData;
   	};

	Block.prototype.DeleteDataSocketByPropertyId = function(propertyId) {
		var sockets = this.GetAllSockets();
		for (var i in sockets)
		{
			var socket = sockets[i];
			if (socket.IsDataSocket === true && socket.DataSocketPropertyId == propertyId)
			{
				var socketQualifiedId  = socket.QualifiedId();
				if (socket.IsInputSocket)
				{
					this.DeleteInput(socket);
				}
				else
				{
					this.DeleteOutput(socket);
				}
				return socketQualifiedId;
			}
		}
		return null;
	};

   	Block.prototype.GetDataSockets = function() {
   		var dataSockets = [];

   		var sockets = this.GetAllSockets();
		for (var i in sockets)
		{
			var socket = sockets[i];
			if (socket.IsDataSocket === true)
			{
				if (socket.IsInputSocket)
				{
					dataSockets[socket.DataSocketPropertyId] = "InputSocket";
				}
				else
				{
					dataSockets[output.DataSocketPropertyId] = "OutputSocket";
				}
				
			}
		}
		return dataSockets;
   	};

	return (Block);
});