define(
[
	"harness/validationexception"
],

function(ValidationException) {

	function Block (id, name, factory) 
	{	
		this.Id = id.replace(/ /g,'');
		this.Name = name;
		this.FactoryName = factory;
		this.Inputs = {};
		this.Outputs = {};
		this.Data = {};
		this.Completed = false;
		this.InputsCount = 0;
		this.OutputsCount = 0;
	};
	Block.prototype.Id = null;
	Block.prototype.Name = null;
	Block.prototype.FactoryName = null; 
	Block.prototype.Inputs = null;
	Block.prototype.Outputs = null;
	Block.prototype.Data = null;
	Block.prototype.Completed = false;
	Block.prototype.Execute = null;
	Block.prototype.Reset = null;
	Block.prototype.Validate = null;
	Block.prototype.AddInput = function (inputSocket, isRequired, isMultiple) {
		inputSocket.IsInputSocket = true;
		inputSocket.IsRequired = isRequired;
		this.InputsCount++;
		this.Inputs[inputSocket.Name] = inputSocket;
	};			
	Block.prototype.AddOutput = function (outputSocket) {
		outputSocket.IsInputSocket = false;
		outputSocket.IsRequired = false; 
		this.OutputsCount++;
		this.Outputs[outputSocket.Name] = outputSocket; 
	};
	Block.prototype.ValidateRequiredInputs = function() {
		for(i in this.Inputs) {
			var input = this.Inputs[i];
			
			if (input.IsRequired == true &&
				input.HasConnectors() == false) 
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

	return (Block);
});	