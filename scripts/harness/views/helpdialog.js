import HelpDialogTemplate from "/scripts/harness/views/templates/helpdialog.js"
import GettingStartedTemplate from "/scripts/harness/views/templates/help/gettingstarted.js"
import ExampleModelTemplate from "/scripts/harness/views/templates/help/examplemodel.js"
import PSOMTemplate from "/scripts/harness/views/templates/help/psom.js"
import FirstTick from "/scripts/harness/views/templates/help/firsttick.js"
import SecondTick from "/scripts/harness/views/templates/help/secondtick.js"
import LetItRun from "/scripts/harness/views/templates/help/letitrun.js"
import ThatsIt from "/scripts/harness/views/templates/help/thatsit.js"

export default class {
	constructor(harness) {	
		this.Harness = harness;
		this.Steps = [];
		this.CurrentStep = 0;
		this.CreateStep("1. Getting Started", GettingStartedTemplate);
		this.CreateStep("2. Example Model", ExampleModelTemplate);
		this.CreateStep("3. The PSOM", PSOMTemplate);
		this.CreateStep("4. First Tick", FirstTick);
		this.CreateStep("5. Second Tick", SecondTick);
		this.CreateStep("6. Let it run", LetItRun);
		this.CreateStep("7. Thank you, that's it!", ThatsIt);
	}

	CreateMarkup() {
		this.Harness.Element.append(HelpDialogTemplate);
		this.SetContent(this.GetCurrentStep());

		$("#help-close").on("click", $.proxy(this.Hide, this));
		$("#help-next").on("click", $.proxy(this.Next, this));
		$("#help-previous").on("click", $.proxy(this.Previous, this));
		$("#help-dialog-menuitem").on("click", $.proxy(this.Show, this));
	}

	GetCurrentStep() {
		return this.Steps[this.CurrentStep];
	}

	CreateStep(title, templateBody) {
		this.Steps.push({
			Title : title,
			Body : templateBody
		});
	}

	SetContent(step) {
		$("#help-title").html(step.Title);
		$("#help-body").html(step.Body);
		$("#help-count").html((this.CurrentStep + 1) + "/" + this.Steps.length);
	}

	SetButtonStates() {
		if (this.CurrentStep == 0)
		{
			$("#help-next").removeAttr("disabled");
			$("#help-previous").attr("disabled", "disabled");
		}
		else if (this.CurrentStep == this.Steps.length - 1)
		{
			$("#help-next").attr("disabled", "disabled");
			$("#help-previous").removeAttr("disabled");
		}
		else
		{
			$("#help-next").removeAttr("disabled");
			$("#help-previous").removeAttr("disabled");
		}
	}

	Next()	{
		if (this.CurrentStep < this.Steps.length - 1)
		{
			this.CurrentStep = this.CurrentStep + 1;
		}
		
		var step = this.GetCurrentStep();
		this.SetContent(step);
		this.SetButtonStates();
	}

	Previous() {
		if (this.CurrentStep > 0)
		{
			this.CurrentStep = this.CurrentStep - 1;
		}
		var step = this.GetCurrentStep();
		this.SetContent(step);
		this.SetButtonStates();
	}

	Hide() {
		$("#help-dialog").hide();
	}

	Show() {
		$("#help-dialog").show();
	}
}