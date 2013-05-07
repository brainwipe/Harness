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
      this.Base.DefaultWidth = 400;
      this.Base.DefaultHeight = 400;
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

   PSOMFuncView.prototype.Draw = function()
   {
      this.Link = this.Link.data(this.Links);

      this.Link.enter().insert("line", ".node")
         .attr("class", "link");

      this.Link.exit().remove();

      this.Node = this.Node.data(this.Nodes);

      this.Node.enter().insert("circle")
         .attr("class", "node")
         .attr("r", 5)
         .call(this.Force.drag);

      this.Node.exit().remove();

      this.Force.start();
   };

   PSOMFuncView.prototype.Initialise = function(view)
   {

   };

   PSOMFuncView.prototype.SetupD3Force = function()
   {
      var width = this.Base.DefaultWidth; // Markup not created yet, so we can use the defaults
      var height = this.Base.DefaultHeight;

      this.Force = d3.layout.force()
         .size([width, height])
         .nodes([])
         .charge(-120)
         .linkDistance(function(d) {
             return d.value;
         })
         .on("tick", this.Tick.bind(this));

      this.Nodes = this.Force.nodes();
      this.Links = this.Force.links();

   };

   PSOMFuncView.prototype.CreateMarkup = function(element)
   {
      this.Base.CreateMarkup(element);

      var container = $("#{0}-contentcontainer".format(this.Block.Id));

      var width = container.width();
      var height = container.width();

      var svg = d3.select("#{0}-contentcontainer".format(this.Block.Id))
         .append("svg")
         .attr("class", "d3psom")
         .attr("width", "100%")
         .attr("height", "100%")
         .attr("viewBox", "0 0 " + width + " " + height )
         .attr("preserveAspectRatio", "xMidYMid meet");

      svg.append("rect")
         .attr("width", width)
         .attr("height", height);


      this.Link = svg.selectAll(".link");
      this.Node = svg.selectAll(".node");
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

   return (PSOMFuncView);
});