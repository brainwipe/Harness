define(
[
	"harness/model/entities/block",
	"harness/model/entities/socket",
	"stringlib"
],

function(Block, Socket) {

	function BlockViewBase(block)	{
		this.Block = block;
		this.CssClass = block.Name.replace(/ /g, '');
	}
	BlockViewBase.prototype.Block = null;
	BlockViewBase.prototype.Element = null;
	BlockViewBase.prototype.ElementContent = null;
	BlockViewBase.prototype.ElementProperties = null;
	BlockViewBase.prototype.CssClass = null;
	BlockViewBase.prototype.CreateContentMarkup  = null;
	BlockViewBase.prototype.Properties = null;
	BlockViewBase.prototype.DefaultWidth = 200;
	BlockViewBase.prototype.DefaultHeight = 200;
	BlockViewBase.prototype.CreateMarkup = function (containerElement) {
		var blockMarkup = '<div title="{0}" class="block noselect {1}" id="{2}"><div class="block_resizable" style="width:{3}px; height:{4}px;">{5}</div><div class="options">{6}</div></div>'.format(
				this.Block.Name,
				this.CssClass,
				this.Block.Id,
				this.DefaultWidth,
				this.DefaultHeight,
				this.CreateContentMarkup(this.Block),
				this.Block.Id
				);
		containerElement.append(blockMarkup);

		this.Element = $("#" + this.Block.Id);

		for(var i in this.Block.Inputs)	{
			this.CreateSocketMarkup(this.Element, this.Block.Inputs[i]);
		}

		for(var j in this.Block.Outputs) {
			this.CreateSocketMarkup(this.Element, this.Block.Outputs[j]);
		}

		$("#" + this.Block.Id).draggable({
			cursor: 'move',
			start: function() {
					$(this).fadeTo(200,0.5);
					$('.block-bin').show('slide');
				},
			stop: function() {
					$(this).fadeTo(200,1);
					$('.block-bin').hide('slide');
				}
			});

		$('#harness .block_resizable').resizable({
				stop: function(event, ui) {
					var block = harness.GetBlockFromAnyId(ui.originalElement.parent().attr('id'));
					harness.Views[block.Id].Draw(block);
				}
			});

		$('#harness .block').hover(function() {
			$(this).children('.options').show( 'slide', {direction: 'up'}, 300);
		},function() {
			$(this).children('.options').hide( 'slide', {direction: 'up'}, 300);
		});

		$('#harness .block .options').click(function() {
			var blockId = $(this).parent().attr('id');
			harness.Views[blockId].UpdateProperties();
			$('#' + blockId + '-properties').modal();
		});

		$('#' + this.Block.Id).bind( 'drag', function(event, ui) {
			harness.Update();
		});
		$('#' + this.Block.Id).bind( 'dragstop', function(event, ui) {
			harness.BlocksMoved();
			harness.Update();
		});

		this.ElementProperties = this.Properties.Create();
	};

	BlockViewBase.prototype.CreateSocketMarkup = function (blockElement, socket)	{
		var qualifiedSocketId =  socket.QualifiedId();

		var socketClass = 'input';

		if (socket.IsInputSocket === false) {
			socketClass = 'output';
		}

		var socketMarkup = '<div class="socket ' + socketClass +
			'" id="' + qualifiedSocketId +
			'" title="' + socket.Name +
			' (' + socket.Type.Key + ')"></div>';
		blockElement.prepend(socketMarkup);
		element = $("#" + qualifiedSocketId);

		if (socket.IsInputSocket === true) {
			element.droppable({
				tolerance: 'touch',
				accept: '.socket',
				drop: function( event, ui ) {
					harness.ConnectSockets(ui.draggable.attr('id'), $(this).attr('id'));
					harness.Update();
				}
			});
		}
		else {
			element.draggable({
				helper:'clone',
				appendTo: 'body',
				containment: 'document',
				zIndex: 1500,
				drag: function(event, ui) {
					function Pos() {}
					Pos.prototype.left = 0;
					Pos.prototype.top = 0;

					harness.Update();

					var original = new Pos();
					original.left = ui.originalPosition.left + ui.helper.width() - 5;
					original.top = ui.originalPosition.top + (ui.helper.height() / 2);
					var dragged = new Pos();
					dragged.top = ui.position.top + (ui.helper.height() / 2);
					dragged.left = ui.position.left + 5;
					harness.Painter.DrawConnector(original, dragged);
				}
			});
		}
	};

	return (BlockViewBase);
});