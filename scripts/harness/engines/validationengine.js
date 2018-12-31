import ValidationBrowser from "/scripts/harness/views/validationbrowser.js"

export default class {

	constructor(harness) {
		this.Harness = harness;
		this.ValidationBrowser = new ValidationBrowser(this.Harness);
		this.ValidationBrowser.CreateMarkup();
	}

	Validate(blocks) {

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
	}
}