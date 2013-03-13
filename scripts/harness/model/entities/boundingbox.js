define(
['jquery'],

function() {

	function BoundingBox(top, right, bottom, left, connector)
	{
		this.top = Math.round(top);
		this.right = Math.round(right);
		this.bottom = Math.round(bottom);
		this.left = Math.round(left);
		this.Connector = connector;
	}
	BoundingBox.prototype.top = 0;
	BoundingBox.prototype.right = 0;
	BoundingBox.prototype.bottom = 0;
	BoundingBox.prototype.left = 0;
	BoundingBox.prototype.Connector = null;

	return (BoundingBox);
});