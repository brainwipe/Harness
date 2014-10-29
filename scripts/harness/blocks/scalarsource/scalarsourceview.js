define(
[
	'harness/views/block/blockviewbase',
	'harness/blocks/scalarsource/scalarsourcepropertiesview'
],

function(BlockViewBase, ScalarSourcePropertiesView) {

	function ScalarSourceView(block)	{
		BlockViewBase.call(this, block);
		this.Properties = new ScalarSourcePropertiesView(block);
	}

	ScalarSourceView.prototype = Object.create( BlockViewBase.prototype );
   ScalarSourceView.prototype.constructor = ScalarSourceView;

	ScalarSourceView.prototype.CreateContentMarkup = function ()
	{
		return '<div class="block-content">' +
					this.Block.Data +
					'</div>';
	};

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
	};

	return (ScalarSourceView);
});