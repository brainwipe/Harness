export default class {
	constructor(from, to) {
		this.From = from;
		this.To = to;
		this.Id = from.QualifiedId() + ':' + to.QualifiedId();
	}

	Description() {
		return `Connects ${this.From.Block.Id} (${this.From.Name}) to ${this.To.Block.Id} (${this.To.Name})`;
	}
}