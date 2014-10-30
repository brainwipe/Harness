define(
[
	'stringlib'
],

function() {

	function HarnessSerializer() { }

	HarnessSerializer.prototype.HarnessToJSON = function(harness) {
		var idKeys = harness.BlockIds();

		return '{"Name": "' + harness.Name + '",' +
			'"Blocks": ' + this.BlocksToJSON(idKeys, harness.Blocks, harness.Views) + ', ' +
			'"Connectors": ' + this.ConnectorsToJSON(harness.Blocks) +
			'}';
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
		// TODO Convert to a model and then JSON.stringify
		return '{' +
				'"Id" : "' + block.Id + '",' +
				'"Name" : "' + block.Name + '",' +
				'"Type" : "' + block.constructor.name + '",' +
				'"Data" : ' + block.DataToJSON() + ',' +
				'"View" : ' + this.ViewToJSON(view) + ',' +
				'"Sockets" : ' + this.SocketsToJSON(block) +
			'}';
	};

	HarnessSerializer.prototype.ViewToJSON = function(view) {
		var location = view.Element.offset();
		var jsonViewModel = {
			Left : location.left,
			Top : location.top,
			Width : view.Element.width(),
			Height : view.Element.height()
		};

		return JSON.stringify(jsonViewModel);
	};

	HarnessSerializer.prototype.ConnectorsToJSON = function(blocks) {
		var serialized = '[';

		for (var i in blocks)
		{
			var block = blocks[i];
			for (var j in block.Outputs)
			{
				var output = block.Outputs[j];
				for (var k in output.Connectors)
				{
					var connector = output.Connectors[k];
					serialized += '{ "id" : "{0}", "from" : "{1}", "to" : "{2}" },'.format(connector.Id, connector.From.QualifiedId(), connector.To.QualifiedId());
				}
			}
		}
		// Strip off last comma
		serialized = serialized.substring(0, serialized.length - 1);

		serialized.replace(/, $/, "");
		serialized += ']';
		return serialized;
	};

	HarnessSerializer.prototype.SocketsToJSON = function(block) {

		var serialized = '{';
		var blockHasInputs = false;

		if (!this.isEmpty(block.Inputs))
		{
			serialized += '"Inputs" : ' + this.SocketListToJSON(block.Inputs);
			blockHasInputs = true;
		}

		if (!this.isEmpty(block.Outputs))
		{
			if (blockHasInputs)
			{
				serialized += ',';
			}
			serialized += '"Outputs" : ' + this.SocketListToJSON(block.Outputs);
		}

		serialized += '}';

		return serialized;
	};

	HarnessSerializer.prototype.SocketListToJSON = function(sockets) {

		var serialized = '[';

		for(var i in sockets)
		{
			serialized += sockets[i].ToJSON() + ',';
		}

		serialized = serialized.substring(0, serialized.length - 1) + ']';
		return serialized;
	}

	HarnessSerializer.prototype.isEmpty = function (obj) {
	    for(var prop in obj) {
	        if(obj.hasOwnProperty(prop))
	            return false;
	    }

	    return true;
	}

	return (HarnessSerializer);
});