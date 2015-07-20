define(
[
	'harness/views/block/blockviewbase',
	'harness/blocks/linegraphsink/linegraphsinkpropertiesview',
	'd3'
],

function(BlockViewBase, LineGraphSinkPropertiesView, d3) {

	function LineGraphSinkView(block)	{
		BlockViewBase.call(this, block);
		this.DefaultWidth = 400;
      	this.DefaultHeight = 200;
		this.Properties = new LineGraphSinkPropertiesView(block);
	}

	LineGraphSinkView.prototype = Object.create( BlockViewBase.prototype );
   	LineGraphSinkView.prototype.constructor = LineGraphSinkView;
   	LineGraphSinkView.prototype.Path = null;
   	LineGraphSinkView.prototype.Line = null;
   	LineGraphSinkView.prototype.XAxis = null;
   	LineGraphSinkView.prototype.YAxis = null;

	LineGraphSinkView.prototype.CreateContentMarkup = function ()
	{
		return '<div id="{0}-contentcontainer" class="block-content"></div>'.format(this.Block.Id);
	};

	LineGraphSinkView.prototype.CreateMarkup = function(element)
   	{
      	this.CreateGenericMarkup(element);

      	var container = $("#{0}-contentcontainer".format(this.Block.Id));

		var margin = {top: 10, right: 10, bottom: 10, left: 40},
		    width = container.width() - margin.left - margin.right,
		    height = container.height() - margin.top - margin.bottom;

		var svg = d3.select("#{0}-contentcontainer".format(this.Block.Id))
			.append("svg")
			.attr("class", "linegraphsink-svg")
		    .attr("width", width)
		    .attr("height", height)
		    .append("g")
    		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		svg.append("defs").append("clipPath")
		    .attr("id", "clip")
		  	.append("rect")
		    .attr("width", width)
		    .attr("height", height)

		this.XAxis = d3.scale.linear()
		    .domain([0, this.Block.XAxisRange - 1])
		    .range([0, width]);

		this.YAxis = d3.scale.linear()
		    .domain([-1, 1])
		    .range([height, 0]);

		this.Line = d3.svg.line()
    		.x(function(d, i, o) { 
    			var view = harness.GetBlockViewFromAnyId(this.parentElement.attributes["data-block-id"].value);
    			return view.XAxis(i); 
    			})
    		.y(function(d, i, o) { 
    			var view = harness.GetBlockViewFromAnyId(this.parentElement.attributes["data-block-id"].value);
    			return view.YAxis(d); 
    		});

		svg.append("g")
		    .attr("class", "x axis")
		    .attr("transform", "translate(0," + this.YAxis(0) + ")")
		    .call(d3.svg.axis().scale(this.XAxis).orient("bottom"));

		svg.append("g")
		    .attr("class", "y axis")
		    .call(d3.svg.axis().scale(this.YAxis).orient("left"));

		this.Path = svg.append("g")
		    .attr("clip-path", "url(#clip)")
		    .attr("data-block-id", this.Block.Id)
		  	.append("path")
		    .datum(this.Block.Data)
		    .attr("class", "line")
		    .attr("d", this.Line);
   	};

	LineGraphSinkView.prototype.Draw = function() {
		this.Path
		      .attr("d", this.Line)
		      .attr("transform", null)
		    .transition()
		      .duration(500)
		      .ease("linear")
		      .attr("transform", "translate(" + this.XAxis(1) + ",0)");
	};

	

	return (LineGraphSinkView);
});