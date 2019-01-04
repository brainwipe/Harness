import PropertiesViewBase from "/scripts/harness/views/block/properties/propertiesviewbase.js"

export default class extends PropertiesViewBase {
	constructor(block) {
		super(block);
	}

	CreateTabs() {
		return [];
	}

	BindEvents() {}
}