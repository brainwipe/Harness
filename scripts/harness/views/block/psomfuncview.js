define(
[
   'harness/views/block/blockviewbase',
   'harness/views/block/properties/PSOMFuncPropertiesView',
   'd3',
   'visualisations/PSOMD3EventHandler'
],

function(BlockViewBase, PSOMFuncPropertiesView, d3) {

   function PSOMFuncView(block) {
      this.Block = block;
      this.Base = new BlockViewBase(block);
      this.Base.Properties = new PSOMFuncPropertiesView(block);
      this.Base.CreateContentMarkup = this.CreateContentMarkup;
      this.SetupD3Force();
      this.PSOMD3EventHandler = new PSOMD3EventHandler(this.Block.PSOM, this.Force);
   }

   PSOMFuncView.prototype.Base = null;
   PSOMFuncView.prototype.Block = null;
   PSOMFuncView.prototype.Force = null;
   PSOMFuncView.prototype.PSOMD3EventHandler = null;
   PSOMFuncView.prototype.Links = null;
   PSOMFuncView.prototype.Nodes = null;
   PSOMFuncView.prototype.Node = null;
   PSOMFuncView.prototype.Link = null;
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

      var width = 200;
      var height = 200;

      var svg = d3.select("{0}-contentcontainer".format(this.Block.Id))
         .append("svg")
         .attr("class", "d3psom")
         .attr("width", width)
         .attr("height", height);

      svg.append("rect")
         .attr("width", width)
         .attr("height", height);

      this.Node = svg.selectAll(".node");
      this.Link = svg.selectAll(".link");

      this.Force.start();
   };

   PSOMFuncView.prototype.UpdateProperties = function()
   {
      this.Base.Properties.Update();
   };

   PSOMFuncView.prototype.Tick = function()
   {
      this.Link.attr("x1", function(d) { return d.source.x; })
         .attr("y1", function(d) { return d.source.y; })
         .attr("x2", function(d) { return d.target.x; })
         .attr("y2", function(d) { return d.target.y; });

      this.Node.attr("cx", function(d) { return d.x; })
         .attr("cy", function(d) { return d.y; });
      };

   PSOMFuncView.prototype.SetupD3Force = function()
   {

      var width = 200;
      var height = 200;

      this.Force = d3.layout.force()
         .size([width, height])
         .nodes([])
         .charge(-120)
         .linkDistance(function(d) { 
             return d.value;
         })
         .on("tick", this.Tick);

      this.Nodes = this.Force.nodes();
      this.Links = this.Force.links();
   };

   PSOMFuncView.prototype.RestartD3JS = function() 
   {
      var link = this.Link.data(links);

      link.enter().insert("line", ".node")
         .attr("class", "link");

      link.exit().remove();

      var node = this.Node.data(nodes);

      node.enter().insert("circle")
         .attr("class", "node")
         .attr("r", 5)
         .call(this.Force.drag);

      node.exit().remove();

      this.Force.start();
   };

   return (PSOMFuncView);
});