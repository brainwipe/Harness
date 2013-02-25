define(
[
	"harness/model/block",
	"harness/model/socket",
	"exception/ValidationException",
	"harness/views/block/scalarsinkproperties"
],

function(Block, Socket, ValidationException, ScalarSinkProperties) {

	function ScalarSinkFactory() {}
	ScalarSinkFactory.prototype.Build = function(idNumber)
	{
		var block = new Block(
							this.FriendlyName +
							idNumber,
							this.FriendlyName);

		block.Data = 'Empty';

		block.AddInput(new Socket("Value"), true);
		
		block.Execute = function() {
			this.Data = this.Inputs["Value"].Data;
			this.Painter.Draw();
			this.Completed = true;
		};
		
		block.Reset = function() {
			this.Inputs["Value"].Data = null;
			this.Completed = false;
		};
		
		block.Validate = function() {
			return this.ValidateRequiredInputs();
		};
		
		block.Painter.CreateContentMarkup = function() {
			return '<div class="block-content">No data</div>';
		};
		
		block.Painter.Properties = new ScalarSinkProperties(block);
		
		block.Painter.Draw = function() {
			this.ElementContent.html(this.Block.Data);
			var width = this.ElementContent.width(),
			height = this.ElementContent.height(),
			html = '<span style="white-space:nowrap; border: 1px solid blue;"></span>',
			line = this.ElementContent.wrapInner( html ).children()[ 0 ],
			n = 100;
			
			this.ElementContent.css( 'font-size', n );

			while ( $(line).width() > width || $(line).height() > height) {
				this.ElementContent.css( 'font-size', --n );
			}

			this.ElementContent.text( $(line).text() );
		};
		
		return block;
	}
	ScalarSinkFactory.prototype.FriendlyName = 'Scalar Sink';
	ScalarSinkFactory.prototype.CssClass = 'blockscalarsink';
	ScalarSinkFactory.prototype.Type = 'Sink';
	ScalarSinkFactory.prototype.Description = 'This sink acts as a way of viewing a single number. It does not keep history, as the simulation runs, the single number will be overwritten.';

	return (ScalarSinkFactory);
});