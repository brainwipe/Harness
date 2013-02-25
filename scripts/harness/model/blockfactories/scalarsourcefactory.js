define(
[
	"harness/model/block",
	"harness/model/socket",
	"harness/views/block/scalarsourceproperties"
],

function(Block, Socket, ScalarSourceProperties) {

	function ScalarSourceFactory() {}
	ScalarSourceFactory.prototype.Build = function(idNumber)
	{
		var block = new Block(
							this.FriendlyName +
							idNumber,
							this.FriendlyName);
		block.AddOutput(new Socket("Value"));
		block.Data = 10;
		block.Execute = function() {
			this.Outputs["Value"].Data = this.Data;
			this.Painter.Draw();
			this.Completed = true;
		};
		
		block.Reset = function() {
			this.Outputs["Value"].Data = this.Data;
			this.Completed = false;
		};
		
		block.Validate = function() {
			return true;
		};
		
		block.Painter.CreateContentMarkup = function() {
			return '<div class="block-content">' +
					this.Block.Data +
					'</div>';
		};
		
		block.Painter.Properties = new ScalarSourceProperties(block);
		
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
		}
		
		return block;
	}
	ScalarSourceFactory.prototype.FriendlyName = 'Scalar Source';
	ScalarSourceFactory.prototype.CssClass = 'blockscalarsource';
	ScalarSourceFactory.prototype.Type = 'Source';
	ScalarSourceFactory.prototype.Description = 'This source provides a single real number, such as 123.4. This useful for biases, offsets, providing paramters for functions or simple mathematics.';

	return (ScalarSourceFactory);
	
});
