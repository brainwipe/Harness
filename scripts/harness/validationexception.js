define(
[],

function() {

	function ValidationException(name, message) {
		this.Name = name;
		this.Message = message;
	}
	ValidationException.prototype.Name = "";
	ValidationException.prototype.Message = "";
	
	return (ValidationException);
	
});