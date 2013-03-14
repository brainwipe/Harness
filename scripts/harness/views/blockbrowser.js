define(
[
	'harness/Harness',
	'harness/model/blockfactory'
],

function(Harness, BlockFactory) {

	function BlockBrowser(harness) {
		this.Harness = harness;
	}
	BlockBrowser.prototype.Harness = null;
	BlockBrowser.prototype.GetBlocks = function()
	{
		for (var i in this.Harness.BlockFactory.Factories)
		{
			var factory = this.Harness.BlockFactory.Factories[i];
			var block = "";
			if (factory.Type === "Source")
			{
				block = "#sources";
			}
			else if (factory.Type === "Sink")
			{
				block = "#sinks";
			}
			else if (factory.Type === "Function")
			{
				block = "#functions";
			}

			$(block).append(
				this.BlockListItem(i, factory));
		}

		$('.chooser_block').draggable({
								helper:'clone',
								appendTo: 'body',
								containment: 'document',
								zIndex: 1500
							});
	};

	BlockBrowser.prototype.BlockListItem = function(id, blockBuilder)
	{
		return '<li class="chooser_block ' +
			blockBuilder.CssClass +
			'" alt="' +
			blockBuilder.FriendlyName +
			'" title="' +
			blockBuilder.FriendlyName +
			'" harness-block-type="' +
			blockBuilder.Type +
			'" harness-block-id="' +
			id +
			'"></li>';
	};

	BlockBrowser.prototype.CreateMarkup = function() {
		harness.Element.append(
			'<div class="modal fade noselect" id="blocksModal">'+
				'<div class="modal-header">'+
				'<button class="close" data-dismiss="modal">×</button>'+
				'<h3>Block Browser</h3>'+
			'</div>'+
			'<div class="modal-body">'+
				'<ul id="blockTypeList" class="nav nav-tabs">'+
					'<li class="active"><a href="#sources" data-toggle="tab">Sources</a></li>'+
					'<li><a href="#sinks" data-toggle="tab">Sinks</a></li>'+
					'<li><a href="#functions" data-toggle="tab">Functions</a></li>'+
				'</ul>'+
				'<div class="tab-content">'+
					'<ul id="sources" class="chooser_blocklist tab-pane active"></ul>'+
					'<ul id="sinks" class="chooser_blocklist tab-pane"></ul>'+
					'<ul id="functions" class="chooser_blocklist tab-pane"></ul>'+
				'</div>'+
			'</div>'+
			'<div class="modal-footer">'+
				'<a href="#" data-dismiss="modal" class="btn">Close</a>'+
			'</div>'+
		'</div>');
	};

	return (BlockBrowser);

});