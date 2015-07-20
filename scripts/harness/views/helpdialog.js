define(
[
	'harness/views/templaterender',
	'text!harness/views/templates/helpdialog.html',
	'text!harness/views/templates/help/gettingstarted.html',
	'text!harness/views/templates/help/examplemodel.html',
	'text!harness/views/templates/help/psom.html',
	'text!harness/views/templates/help/firsttick.html',
	'text!harness/views/templates/help/secondtick.html',
	'text!harness/views/templates/help/letitrun.html',
	'text!harness/views/templates/help/thatsit.html'
],

function(TemplateRender, HelpDialogTemplate, GettingStartedTemplate, ExampleModelTemplate, PSOMTemplate, FirstTick, SecondTick, LetItRun, ThatsIt) {

	function HelpDialog() 
	{	
		this.Steps = [];
		this.TemplateRender = new TemplateRender();
		this.CreateStep("1. Getting Started", GettingStartedTemplate);
		this.CreateStep("2. Example Model", ExampleModelTemplate);
		this.CreateStep("3. The PSOM", PSOMTemplate);
		this.CreateStep("4. First Tick", FirstTick);
		this.CreateStep("5. Second Tick", SecondTick);
		this.CreateStep("6. Let it run", LetItRun);
		this.CreateStep("7. Thank you, that's it!", ThatsIt);
	}

	HelpDialog.prototype.TemplateRender = null;
	HelpDialog.prototype.Steps = null;
	HelpDialog.prototype.CurrentStep = 0;

	HelpDialog.prototype.CreateMarkup = function()
	{
		harness.Element.append(
			this.TemplateRender.Render(
				HelpDialogTemplate));

		this.SetContent(this.GetCurrentStep());

		$("#help-close").on("click", $.proxy(this.Hide, this));
		$("#help-next").on("click", $.proxy(this.Next, this));
		$("#help-previous").on("click", $.proxy(this.Previous, this));
		$("#help-dialog-menuitem").on("click", $.proxy(this.Show, this));
	};

	HelpDialog.prototype.GetCurrentStep = function()
	{
		return this.Steps[this.CurrentStep];
	};

	HelpDialog.prototype.CreateStep = function(title, templateBody)
	{
		this.Steps.push({
			Title : title,
			Body : templateBody
		});
	};

	HelpDialog.prototype.SetContent = function(step)
	{
		$("#help-title").html(step.Title);
		$("#help-body").html(step.Body);
		$("#help-count").html((this.CurrentStep + 1) + "/" + this.Steps.length);
	};

	HelpDialog.prototype.SetButtonStates = function()
	{
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
	};

	HelpDialog.prototype.Next = function()
	{
		if (this.CurrentStep < this.Steps.length - 1)
		{
			this.CurrentStep = this.CurrentStep + 1;
		}
		
		var step = this.GetCurrentStep();
		this.SetContent(step);
		this.SetButtonStates();
	};

	HelpDialog.prototype.Previous = function()
	{
		if (this.CurrentStep > 0)
		{
			this.CurrentStep = this.CurrentStep - 1;
		}
		var step = this.GetCurrentStep();
		this.SetContent(step);
		this.SetButtonStates();
	};

	HelpDialog.prototype.Hide = function()
	{
		$("#help-dialog").hide();
	};

	HelpDialog.prototype.Show = function()
	{
		$("#help-dialog").show();
	};

	return (HelpDialog);
});
