define(
[
	"jquery",
	"harness/model/block",
	"harness/model/socket",
	"stringlib"
],

function($, Block, Socket) {

	function BlockPainter(ownerBlock, name)	{
		this.Block = ownerBlock;
		this.CssClass = name.replace(/ /g, '');
	}
	BlockPainter.prototype.Block = null;
	BlockPainter.prototype.Element = null;
	BlockPainter.prototype.CssClass = null;
	BlockPainter.prototype.CreateContentMarkup  = null;
	BlockPainter.prototype.ElementContent = null;
	BlockPainter.prototype.ElementProperties = null;
	BlockPainter.prototype.Draw = null;
	BlockPainter.prototype.Properties = null;
	BlockPainter.prototype.CreateMarkup = function (containerElement) {
		var blockMarkup = '\
			<div class="block {0}" id="{1}">\
				<div class="block_resizable" style="width:200px; height:200px;">\
					{2}\
				</div>\
				<div class="options">\
					{3}\
				</div>\
			</div>\
			'.format(
				this.CssClass,
				this.Block.Id,
				this.CreateContentMarkup(),
				this.Block.Name
				);
		containerElement.append(blockMarkup);

		this.Element = $("#" + this.Block.Id);
		this.ElementContent = $("#" + this.Block.Id + "  .block-content");
		
		for(i in this.Block.Inputs)	{
			this.CreateSocketMarkup(this.Element, this.Block.Inputs[i]);
		}
		
		for(i in this.Block.Outputs) {
			this.CreateSocketMarkup(this.Element, this.Block.Outputs[i]);
		}
		
		$("#" + this.Block.Id).draggable();
		$("#harness .block_resizable").resizable({
				stop: function(event, ui) { 
					harness.Blocks[ui.originalElement.parent().attr("id")].Painter.Draw(); 
				}
			});
		$("#harness .block").hover(function() {
			$(this).children(".options").show( "slide", {direction: "up"}, 300);
		},function() {
			$(this).children(".options").hide( "slide", {direction: "up"}, 300);
		});
		$("#harness .block .options").click(function() {
			var blockId = $(this).parent().attr("id");
			harness.Blocks[blockId].Painter.Properties.Update();
			$("#" + blockId + '-properties').modal();
		});
		
		$("#" + this.Block.Id).bind( "drag", function(event, ui) {
			harness.Update();
		});
		$("#" + this.Block.Id).bind( "dragstop", function(event, ui) {
			harness.BlocksMoved();
			harness.Update();
		});
		
		this.ElementProperties = this.Properties.Create();
	}

	BlockPainter.prototype.CreateSocketMarkup = function (blockElement, socket)	{
		var qualifiedSocketId =  socket.QualifiedId();
		
		var socketClass = "input";
		
		if (socket.IsInputSocket == false) {
			socketClass = "output";
		}
		
		var socketMarkup = '<div class="socket ' + socketClass + '" id="' + qualifiedSocketId + '"></div>';
		blockElement.prepend(socketMarkup);
		socket.Element = $("#" + qualifiedSocketId);
		
		
		if (socket.IsInputSocket == true) {
			socket.Element.droppable({
				tolerance: "touch",
				accept: ".socket",
				drop: function( event, ui ) {
					harness.ConnectSockets(ui.draggable.attr("id"), $(this).attr("id"));
					harness.Update();
				}
			});
		}
		else {	
			socket.Element.draggable({
				helper:'clone',
				appendTo: 'body',
				containment: 'document',
				zIndex: 1500,
				drag: function(event, ui) { 
					function pos() {}; pos.prototype.left = 0; pos.prototype.top = 0;
					
					harness.Update();
					
					var original = new pos();
					original.left = ui.originalPosition.left + ui.helper.width() - 5;
					original.top = ui.originalPosition.top + (ui.helper.height() / 2);
					var dragged = new pos();
					dragged.top = ui.position.top + (ui.helper.height() / 2);
					dragged.left = ui.position.left + 5;
					harness.Painter.DrawConnector(original, dragged);
				}
			});
		}
	}

	return (BlockPainter);
});