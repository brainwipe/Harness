import PSOMFuncPropertiesView from "./psomfuncpropertiesview.js"
import PSOMD3EventHandler from "./psomd3eventhandler.js"
import BlockViewBase from "/scripts/harness/views/block/blockviewbase.js"

export default class extends BlockViewBase {

   constructor(block) {
      super(block);

      this.DefaultWidth = 400;
      this.DefaultHeight = 400;
      this.Force = null;
      this.Links = [];
      this.Nodes = [];
      this.Node = null;
      this.Link = null;
      
      this.Properties = new PSOMFuncPropertiesView(block);
      
      this.Force = d3.forceSimulation()
         .force("x", d3.forceX())
         .force("y", d3.forceY())
         .force("link", d3.forceLink())
         .force("charge", d3.forceManyBody().strength(-10))
         .force("center_force", d3.forceCenter(this.DefaultWidth / 2, this.DefaultHeight / 2))
         .alphaTarget(1)
         .on("tick", this.Tick.bind(this));

      this.PSOMD3EventHandler = new PSOMD3EventHandler(this.Block.Data, this.Nodes, this.Links);
      
   }

   CreateContentMarkup() {
      return `<div id="${this.Block.Id}-contentcontainer" class="block-content"></div>`
   }

   Draw() {
      this.Link = this.Link
         .data(this.Links)
         .attr("class", "link");
      this.Link.exit().remove();
      this.Link = this.Link
         .enter()
         .append("line")
         .attr("stroke", "#000")
         .attr("stroke-width", 1.5)
         .merge(this.Link);

      this.Node = this.Node
         .data(this.Nodes, function(d) { return d.neuronId;})
         .attr("data-neuronId", function(d) { return d.neuronId; });
      this.Node.exit().remove();
      this.Node = this.Node.enter().append("circle").attr("r", 5).attr("class", "node").merge(this.Node);

      this.Force.nodes(this.Nodes);
      this.Force.force("link").links(this.Links);
      this.Force.alpha(1).restart();
   }

   Initialise(view) {
      this.PSOMD3EventHandler.Build();
   }

   CreateMarkup(element)
   {
      this.CreateGenericMarkup(element);

      let svg = d3.select(`#${this.Block.Id}-contentcontainer`)
         .append("svg")
         .attr("class", "d3psom")
         .attr("width", "100%")
         .attr("height", "100%")
         .attr("viewBox", "0 0 " + this.DefaultWidth + " " + this.DefaultHeight )
         .attr("preserveAspectRatio", "xMidYMid meet");

      svg.append("rect")
         .attr("width", this.DefaultWidth)
         .attr("height", this.DefaultHeight);

      this.Link = svg.selectAll(".link");
      this.Node = svg.selectAll(".node");
   }

   Tick() {
      this.Link.attr("x1", function(d) { return d.source.x; })
         .attr("y1", function(d) { return d.source.y; })
         .attr("x2", function(d) { return d.target.x; })
         .attr("y2", function(d) { return d.target.y; });

      this.Node.attr("cx", function(d) { return d.x; })
         .attr("cy", function(d) { return d.y; });
   }

   Remove() {
      BlockViewBase.prototype.Remove.call(this);
      delete this.PSOMD3EventHandler;
   }
}