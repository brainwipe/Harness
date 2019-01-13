import PSOMFuncPropertiesView from "./psomfuncpropertiesview.js"
import PSOMD3EventHandler from "./psomd3eventhandler.js"
import BlockViewBase from "/scripts/harness/views/block/blockviewbase.js"

export default class extends BlockViewBase {

   constructor(block) {
      super(block);

      this.DefaultWidth = 400;
      this.DefaultHeight = 400;
      this.Force = null;
      this.Links = null;
      this.Nodes = null;
      this.Node = null;
      this.Link = null;
      
      this.Properties = new PSOMFuncPropertiesView(block);
      this.SetupD3Force();
      this.PSOMD3EventHandler = new PSOMD3EventHandler(this.Block.Data, this.Force);
      
   }

   CreateContentMarkup() {
      return `<div id=${this.Block.Id}-contentcontainer" class="block-content"></div>`
   }

   Draw() {
      /*
      this.Link = this.Link.data(this.Links);

      this.Link.enter().insert("line", ".node")
         .attr("class", "link");

      this.Link.exit().remove();

      this.Node = this.Node.data(this.Nodes);

      this.Node.enter().insert("circle")
         .attr("class", "node")
         .attr("r", 5)
         .call(this.Force.drag);

      this.Node.attr("data-neuronId", function(d) { return d.neuronId; });

      this.Node.exit().remove();

      this.Force.start();
      */
   }

   Initialise(view) {
      // this.PSOMD3EventHandler.Build();
   }

   SetupD3Force() {
      var width = this.DefaultWidth; // Markup not created yet, so we can use the defaults
      var height = this.DefaultHeight;

      this.Force = d3.forceSimulation()
         .force("link", d3.forceLink().id(function(d) { return d.id; }))
         .force("charge", d3.forceManyBody())
         .force("center", d3.forceCenter(width / 2, height / 2));

      this.Nodes = this.Force.nodes();
      //this.Links = this.Force.links();
   }

   CreateMarkup(element)
   {
      this.CreateGenericMarkup(element);

      var container = $(`#${this.Block.Id}-contentcontainer`);

      var width = container.width();
      var height = container.width();

      var svg = d3.select(`#${this.Block.Id}-contentcontainer`)
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