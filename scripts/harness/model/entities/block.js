define(
[
	"harness/validationexception",
	"harness/model/socketfactory"
],

function(ValidationException, SocketFactory) {

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
		this.InputsCount++;
		this.Inputs[inputSocket.Id] = inputSocket;
	};

	Block.prototype.AddOutput = function (outputSocket) {
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

		this.Execute();
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
		for (var i in this.Inputs)
		{
			var input = this.Inputs[i];
			if (input.HasConnectors() === true)
			{
				input.DeleteConnections();
			}
		}

		for (var j in this.Outputs)
		{
			var output = this.Outputs[j];
			if (output.HasConnectors() === true)
			{
				output.DeleteConnections();
			}
		}
	};

	Block.prototype.DataToJSON = function () {
		return JSON.stringify(this.Data);
	};

	Block.prototype.JSONToData = function(jsonData) {
      this.Data = jsonData;
   };

	return (Block);
});