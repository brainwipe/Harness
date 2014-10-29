define(
[
	"harness/validationexception"
],

function(ValidationException) {

	function ValidationEngine() {
	}

	ValidationEngine.prototype.Validate = function(blocks) {

		validationbrowser.Clear();
		harness.Painter.SwitchOnEngineControls();

		var blockCount = 0;
		var errorCount = 0;
		for(var i in blocks) {

			try
			{
				blocks[i].Validate();
			}

			catch(errorMessage)
			{
				harness.Painter.SwitchOffEngineControls();
				validationbrowser.AddMessage(errorMessage);
				errorCount += 1;
			}

			blockCount += 1;
		}

		if (blockCount === 0)
		{
			validationbrowser.NoBlocksFound();
			harness.Painter.SwitchOffEngineControls();
			return true;
		}
		else if (errorCount === 0)
		{
			validationbrowser.NoErrorsFound();
			return true;
		}

		return false;
	};

	return(ValidationEngine);

});