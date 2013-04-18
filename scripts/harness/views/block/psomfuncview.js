define(
[
   'harness/views/block/blockviewbase',
   'harness/views/block/properties/PSOMFuncPropertiesView',
   'd3'
],

function(BlockViewBase, PSOMFuncPropertiesView, d3) {

   function PSOMFuncView(block) {
      this.Block = block;
      this.Base = new BlockViewBase(block);
      this.Base.Properties = new PSOMFuncPropertiesView(block);
      this.Base.CreateContentMarkup = this.CreateContentMarkup;
      
   }

   PSOMFuncView.prototype.Base = null;
   PSOMFuncView.prototype.Block = null;
   PSOMFuncView.prototype.ForceGraph = null;
   PSOMFuncView.prototype.Force = null;

   PSOMFuncView.prototype.CreateContentMarkup = function ()
   {
      return '<div id="{0}-contentcontainer" class="block-content"></div>'.format(this.Block.Id);
   };

   PSOMFuncView.prototype.Draw = function() {
      
   }

   PSOMFuncView.prototype.CreateMarkup = function(element)
   {
      this.Base.CreateMarkup(element);
      var elementContainer = $("#{0}-contentcontainer".format(this.Block.Id));
      
      

      d3.select("#{0}-contentcontainer".format(this.Block.Id))
         .append("svg")
         .attr("width",elementContainer.width())
         .attr("height",elementContainer.height());
   
      this.Force = d3.layout.force()
         .size([elementContainer.width(), elementContainer.height()])
         .nodes([{}])
         .linkDistance(30)
         .charge(-60)
         .on("tick", this.Tick());


      this.Force.start();
      // this.ForceGraph.Extend(this.Block.PSOM.neurons, this.Block.PSOM.links);

   };

   PSOMFuncView.prototype.UpdateProperties = function()
   {
      this.Base.Properties.Update();
   };

   PSOMFuncView.prototype.Tick = function()
   {

   };

   return (PSOMFuncView);
});