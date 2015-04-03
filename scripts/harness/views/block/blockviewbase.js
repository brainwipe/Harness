define(
[
	"harness/model/entities/block",
	"harness/model/entities/socket",
	"harness/views/templaterender",
	"text!harness/views/templates/block/blockviewbase.html",
	"stringlib"
],

function(Block, Socket, TemplateRender, BlockViewBaseTemplate) {

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

	BlockViewBase.prototype.CreateMarkup = function(element)
	{
		this.CreateGenericMarkup(element);
	};

	BlockViewBase.prototype.CreateGenericMarkup = function (containerElement) {
		var data = {
			"blockName": this.Block.Name,
			"blockClass": this.CssClass,
			"blockId": this.Block.Id,
			"defaultWidth": this.DefaultWidth,
			"defaultHeight": this.DefaultHeight,
			"contentMarkup": this.CreateContentMarkup(this.Block)
		};
		containerElement.append(new TemplateRender().Render(BlockViewBaseTemplate, data));

		this.Element = $("#" + this.Block.Id);

		this.CreateInputs();
		this.CreateOutputs();

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
				resize: function ( event, ui )
				{
					harness.Painter.Repaint();
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
	};

	BlockViewBase.prototype.CreateInputs = function()
	{
		for(var i in this.Block.Inputs)	{
			harness.Painter.CreateInputSocket(
				this.Block, 
				this.Block.Inputs[i].QualifiedId(),
				this.Block.Inputs[i].Name);
		};
	};

	BlockViewBase.prototype.CreateOutputs = function()
	{
		for(var i in this.Block.Outputs) {
			harness.Painter.CreateOutputSocket(
				this.Block, 
				this.Block.Outputs[i].QualifiedId(),
				this.Block.Outputs[i].Name);
		};
	};

	BlockViewBase.prototype.UpdateProperties = function()
	{
		this.Properties.Update();
	};

	return (BlockViewBase);
});