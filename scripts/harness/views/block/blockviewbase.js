import BlockViewBaseTemplate from "/scripts/harness/views/templates/block/blockviewbasetemplate.js"

export default class {
/*
// TODO ROLA still needed?
	"stringlib"
*/
	constructor(block)	{
		this.Block = block;
		this.CssClass = block.constructor.CssClass;
		this.Element = null;
		this.ElementContent = null;
		this.ElementProperties = null;
		this.Properties = null;
		this.DefaultWidth = 200;
		this.DefaultHeight = 200;
		this.BlocksRelativePath = "./scripts/harness/blocks/";

	}
	CreateMarkup(element) {
		this.CreateGenericMarkup(element);
	}

	CreateGenericMarkup (containerElement) {
		var data = {
			"blockName": this.Block.Name,
			"blockClass": this.CssClass,
			"blockId": this.Block.Id,
			"defaultWidth": this.DefaultWidth,
			"defaultHeight": this.DefaultHeight,
			"contentMarkup": this.CreateContentMarkup(this.Block)
		};
		containerElement.append(BlockViewBaseTemplate(data));

		this.Element = $("#" + this.Block.Id);

		this.CreateInputs();
		this.CreateOutputs();

		this.LoadCSS();

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

		harness.Painter.MakeBlockDraggable(this.Block.Id);

		$('#harness .block_resizable').resizable({
				handles: "se",
				resize: function ( event, ui )
				{
					harness.Painter.Repaint();
					event.stopImmediatePropagation();
				},
				stop: function(event, ui) {
					var block = harness.GetBlockFromAnyId(ui.originalElement.parent().attr('id'));
					harness.Views[block.Id].Draw(block);
					harness.Painter.Repaint();
				}
			});

		$('#harness .block .options').click(function() {
			var blockId = $(this).parent().attr('id');
			harness.Views[blockId].UpdateProperties();
			$('#' + blockId + '-properties').modal();
		});

		this.ElementProperties = this.Properties.Create();
	}

	LoadCSS()
	{
		var blockFunctionName = this.Block.constructor.Name.toLowerCase();

		$("<link/>", {
   			rel: "stylesheet",
   			type: "text/css",
   			href: `${this.BlocksRelativePath}${blockFunctionName}/style.css`
			}).appendTo("head");
	}

	CreateInputs()
	{
		for(var i in this.Block.Inputs)	{
			harness.Painter.CreateInputSocket(
				this.Block, 
				this.Block.Inputs[i].QualifiedId(),
				this.Block.Inputs[i].Name);
		};
	}

	CreateOutputs()
	{
		for(var i in this.Block.Outputs) {
			harness.Painter.CreateOutputSocket(
				this.Block, 
				this.Block.Outputs[i].QualifiedId(),
				this.Block.Outputs[i].Name);
		};
	}

	UpdateProperties()
	{
		this.Properties.Update();
	}

	Remove()
	{
		this.Element.remove();
		$(`#${this.Properties.Id}`).remove();
	}
}