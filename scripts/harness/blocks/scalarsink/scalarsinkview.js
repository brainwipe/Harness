define(
[
	'harness/views/block/BlockViewBase',
	'harness/blocks/scalarsink/ScalarSinkPropertiesView'

],

function(BlockViewBase, ScalarSinkPropertiesView) {

	function ScalarSinkView(block)	{
		BlockViewBase.call(this, block);
		this.Properties = new ScalarSinkPropertiesView(block);
	}

	ScalarSinkView.prototype = Object.create( BlockViewBase.prototype );
   ScalarSinkView.prototype.constructor = ScalarSinkView;

	ScalarSinkView.prototype.CreateContentMarkup = function ()
	{
		return '<div class="block-content">' +
					this.Block.Data +
					'</div>';
	};

	ScalarSinkView.prototype.Draw = function() {
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

	return (ScalarSinkView);
});