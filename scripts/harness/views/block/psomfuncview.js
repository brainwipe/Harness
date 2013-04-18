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
      return '<div id="{0}-contentcontainer" class="block-content"><canvas id="{1}-psom-visualisation" width="200px" height="200px"/></div>'.format(this.Block.Id, this.Block.Id);
   };

   PSOMFuncView.prototype.Draw = function() {
      var contentContainer = $("#{0}-contentcontainer".format(this.Block.Id));
      var vis = $("#{0}-psom-visualisation".format(this.Block.Id));
      vis[0].width = contentContainer.width(); 
      vis[0].height = contentContainer.height(); 
      
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
      setTimeout(function() { harness.Views[blockId].AnimationLoop(blockId) }, 10);
   };

   return (PSOMFuncView);
});