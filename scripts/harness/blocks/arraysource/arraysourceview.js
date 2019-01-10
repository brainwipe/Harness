import ArraySourcePropertiesView from "./arraysourcepropertiesview.js"
import BlockViewBase from "/scripts/harness/views/block/blockviewbase.js"

export default class extends BlockViewBase {

	constructor(block)	{
		super(block);
		this.Properties = new ArraySourcePropertiesView(block);
	}

	CreateContentMarkup()
	{
		return '<div class="block-content">' +
					this.Block.Data +
					'</div>';
	};

	Draw() {
		var elementContent = $(`#${this.Block.Id} .block-content`);

		if (this.Block.Data.CurrentIndex == -1)
		{
			elementContent.html("No data sent yet");
		}
		else
		{
			elementContent.html(this.Block.Data.CurrentIndex + ": " + JSON.stringify(this.Block.CurrentData()));
		}
		
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
}