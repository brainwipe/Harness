import ScalarSinkPropertiesView from "./scalarsinkpropertiesview.js"
import BlockViewBase from "/scripts/harness/views/block/blockviewbase.js"

export default class extends BlockViewBase {

	constructor(block) {
		super(block);
		this.Properties = new ScalarSinkPropertiesView(block);
	}

	CreateContentMarkup() {
		return `<div class="block-content">${this.Block.Data}</div>`;
	};

	Draw() {
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
}