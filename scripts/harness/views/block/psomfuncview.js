define(
[
   'harness/views/block/blockviewbase',
   'harness/views/block/properties/PSOMFuncPropertiesView',
   'visualisations/force_graph'
],

function(BlockViewBase, PSOMFuncPropertiesView) {

   function PSOMFuncView(block) {
      this.Block = block;
      this.Base = new BlockViewBase(block);
      this.Base.Properties = new PSOMFuncPropertiesView(block);
      this.Base.CreateContentMarkup = this.CreateContentMarkup;
   }

   PSOMFuncView.prototype.Base = null;
   PSOMFuncView.prototype.Block = null;
   PSOMFuncView.prototype.ForceGraph = null;
   PSOMFuncView.prototype.VisualisationContext = null;

   PSOMFuncView.prototype.CreateContentMarkup = function ()
   {
      return '<canvas class="block-content" id="{0}-psom-visualisation" width="100%" height="100%"/>'.format(this.Block.Id);
   };

   PSOMFuncView.prototype.Draw = function() {
     // redraw still needed?
   }

   PSOMFuncView.prototype.CreateMarkup = function(element)
   {
      this.Base.CreateMarkup(element);
      var elementContent = $("#{0}-psom-visualisation".format(this.Block.Id));
      this.VisualisationContext = elementContent[0].getContext('2d');
      this.ForceGraph = new force_graph(this.VisualisationContext);
      this.ForceGraph.Extend(this.Block.PSOM.neurons, this.Block.PSOM.links);
      this.AnimationLoop(this.Block.Id);
   };

   PSOMFuncView.prototype.UpdateProperties = function()
   {
      this.Base.Properties.Update();
   };

   PSOMFuncView.prototype.AnimationLoop = function(blockId)
   {
      this.VisualisationContext.clearRect(0, 0, this.VisualisationContext.canvas.width, this.VisualisationContext.canvas.height);
      this.ForceGraph.Update(this.Block.PSOM.neurons, this.Block.PSOM.links);
      this.ForceGraph.Draw(this.Block.PSOM.neurons, this.Block.PSOM.links);
      setInterval(function() { harness.Views[blockId].AnimationLoop(blockId) }, 1000);
   };

   return (PSOMFuncView);
});