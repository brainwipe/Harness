define(
[],
function() {

	function ValidationBrowserMock() {}

	ValidationBrowserMock.prototype.Clear = function() {}
	ValidationBrowserMock.prototype.NoErrorsFound = function() {}
	ValidationBrowserMock.prototype.AddMessage = function() {}
	
	return (ValidationBrowserMock);
});