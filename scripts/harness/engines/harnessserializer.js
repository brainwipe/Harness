define(
[
],

function() {

	function HarnessSerializer() { };

	HarnessSerializer.prototype.HarnessToJSON = function(harness) {
		var idKeys = harness.BlockIds();

		var serialized = 
			'{"Name": "' + harness.Name + '",' +
			'"Blocks": ' + this.BlocksToJSON(idKeys, harness.Blocks, harness.Views) +
			'}';

		return serialized;
	};

	HarnessSerializer.prototype.BlocksToJSON = function(idKeys, blocks, views) {
		var serialized = '[';
		var length = idKeys.length;
		var count = 0;

		for (var i in blocks)
		{
			serialized += this.BlockToJSON(blocks[i], views[i]);
			
			if (count < length - 1)
			{
				serialized += ',';
			}

			count++;
		}

		serialized += ']';
		return serialized;
	};

	HarnessSerializer.prototype.BlockToJSON = function(block, view) {
		var serialized = 
			'{' +
				'"Id" : "' + block.Id + '",' +
				'"Name" : "' + block.Name + '",' +
				'"Factory" : "' + block.FactoryName + '",' +
				'"View" : ' + this.ViewToJSON(view) +
			'}';
		return serialized;
	};

	HarnessSerializer.prototype.ViewToJSON = function(view) {
		var location = view.Base.Element.offset();
		var serialized = '{' +
			'"Left" : "' + location.left + '",' +
			'"Top" : "' +  location.top + '",' +
			'"Width" : "' + view.Base.Element.width() + '",' +
			'"Height" : "' + view.Base.Element.height() + '"' +
		'}'
		return serialized;
	};

	return (HarnessSerializer)
});