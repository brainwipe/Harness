define(
[
	"harness/model/block",
	"harness/validationexception"
],

function(Block, ValidationException) {

	function ValidationEngine() {
		this.ValidationBrowser = validationbrowser;
	};
	ValidationEngine.prototype.HarnessPainter = null;
	ValidationEngine.prototype.ValidationBrowser = null;

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

		if (blockCount == 0)
		{
			validationbrowser.AddMessage(new ValidationException("No blocks", "There are no blocks in the model. The simulation needs blocks to run. Use the Blocks menu item to start adding blocks."));
		}

		if (errorCount == 0)
		{
			validationbrowser.NoErrorsFound();
		}
			
	};

	return(ValidationEngine);

});