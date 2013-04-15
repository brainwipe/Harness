define(
[
	'harness/views/block/blockviewbase',
	'harness/views/block/properties/ArraySourcePropertiesView'
],

function(BlockViewBase, ArraySourcePropertiesView) {

	function ArraySourceView(block)	{
		this.Block = block;
		this.Base = new BlockViewBase(block);
		this.Base.Properties = new ArraySourcePropertiesView(block);
		this.Base.CreateContentMarkup = this.CreateContentMarkup;
	}

	ArraySourceView.prototype.Base = null;
	ArraySourceView.prototype.Block = null;

	ArraySourceView.prototype.CreateContentMarkup = function ()
	{
		return '<div class="block-content">' +
					this.Block.Data +
					'</div>';
	};

	ArraySourceView.prototype.Draw = function() {
		var elementContent = $("#" + this.Block.Id + "  .block-content");
		elementContent.html(this.Block.Data.CurrentIndex + ": " + JSON.stringify(this.Block.CurrentData()));
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

	ArraySourceView.prototype.CreateMarkup = function(element)
	{
		this.Base.CreateMarkup(element);
	};

	ArraySourceView.prototype.UpdateProperties = function()
	{
		this.Base.Properties.Update();
	};

	return (ArraySourceView);
});