define(
[
	"harness/validationexception"
],

function(ValidationException) {

	function ValidationEngine(harness, validationbrowser) {
		this.ValidationBrowser = validationbrowser;
		this.Harness = harness;
	}

	ValidationEngine.prototype.ValidationBrowser = null;
	ValidationEngine.prototype.Harness = null;

	ValidationEngine.prototype.Validate = function(blocks) {

		this.ValidationBrowser.Clear();
		this.Harness.Painter.SwitchOnEngineControls();

		var blockCount = 0;
		var errorCount = 0;
		for(var i in blocks) {

			try
			{
				blocks[i].Validate();
			}

			catch(errorMessage)
			{
				this.Harness.Painter.SwitchOffEngineControls();
				this.ValidationBrowser.AddMessage(errorMessage);
				errorCount += 1;
			}

			blockCount += 1;
		}

		if (blockCount === 0)
		{
			this.ValidationBrowser.NoBlocksFound();
			this.Harness.Painter.SwitchOffEngineControls();
			return true;
		}
		else if (errorCount === 0)
		{
			this.ValidationBrowser.NoErrorsFound();
			return true;
		}

		return false;
	};

	return(ValidationEngine);

});