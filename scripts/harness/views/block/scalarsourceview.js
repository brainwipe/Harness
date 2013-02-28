define(
[
	"jquery",
	"harness/views/block/blockviewbase",
	"harness/views/block/properties/ScalarSourcePropertiesView"

],

function($, BlockViewBase, ScalarSourcePropertiesView) {

	function ScalarSourceView(block)	{
		this.Block = block;
		this.Base = new BlockViewBase(block);
		this.Base.Properties = new ScalarSourcePropertiesView(block);
		this.Base.CreateContentMarkup = this.CreateContentMarkup;
	}

	ScalarSourceView.prototype.Base = null;
	ScalarSourceView.prototype.Block = null;

	ScalarSourceView.prototype.CreateContentMarkup = function ()
	{
		return '<div class="block-content">' +
					this.Block.Data +
					'</div>';
	}

	ScalarSourceView.prototype.Draw = function() {
		var elementContent = $("#" + this.Block.Id + "  .block-content");
		elementContent.html(this.Block.Data);
		var width = elementContent.width(),
		height = elementContent.height(),
		html = '<span style="white-space:nowrap; border: 1px solid blue;"></span>',
		line = elementContent.wrapInner( html ).children()[ 0 ],
		n = 100;
		
		elementContent.css( 'font-size', n );

		while ( $(line).width() > width || $(line).height() > height) {
			elementContent.css( 'font-size', --n );
		}

		elementContent.text( $(line).text() );
	}

	ScalarSourceView.prototype.CreateMarkup = function(element) 
	{
		this.Base.CreateMarkup(element);
	}

	ScalarSourceView.prototype.UpdateProperties = function()
	{
		this.Base.Properties.Update();
	}

	return (ScalarSourceView)
});