function force_graph(ctx)
{
	this.coulomb_constant_ke = 1.5;
	this.hooke_constant = 0.3;
	this.acceleration_speed = 0.1;
	this.resting_link_length = 200;
	this.context = ctx;

	this.Extend = function(nodes, links)
	{
		if (nodes != null)
		{
			for(index in nodes)
			{
				if (nodes[index].Visualisation == null)
				{
					nodes[index].Visualisation = new force_graph_node(this.context);
				}
			}
		}
		
		if (links != null)
		{
			for(index in links)
			{
				if (links[index].Visualisation == null)
				{
					links[index].Visualisation = new force_graph_link(this.context, links[index]);
				}
			}
		}
	}

	this.Draw = function(nodes, links)
	{
		for(index in links)
		{
			links[index].Visualisation.Draw();
		}
	
		for(index in nodes)
		{
			if (typeof nodes[index].Visualisation === 'undefined' || nodes[index].Visualisation == null)
			{
				nodes[index].Visualisation = new force_graph_node(this.context);
			}
			nodes[index].Visualisation.Draw();
		}
	}
	
	this.CoulombForce = function(node1, node2)
	{
		var distanceBetweenPoints = node1.Visualisation.Position.Subtract(node2.Visualisation.Position);
		
		var force;

		if (distanceBetweenPoints.x == 0 && distanceBetweenPoints.y == 0)
		{
			force = new Point(1,1);
		}
		else
		{
			var normalised = distanceBetweenPoints.Normalise();
			force = normalised.Add(this.coulomb_constant_ke).Squared();
		}

		return force;
		
	}
	
	this.HookeAttraction = function(node1, node2, length)
	{
		var distance = node1.Visualisation.Position.Subtract(node2.Visualisation.Position);
		
		var changeScalar = (((length - distance.Length()) * this.hooke_constant) / length);
		
		return distance.Multiply(changeScalar);
	}
	
	this.RemainWithinBounds = function(node)
	{
		var circleSize = node.CircleSize;
		var lowerBound = circleSize;
		var upperBoundWidth = this.context.canvas.width - (2 * circleSize);
		var upperBoundHeight = this.context.canvas.height - (2 * circleSize);
		
		if (node.Position.x < lowerBound) { node.Position.x = lowerBound; }
		if (node.Position.y < lowerBound) { node.Position.y = lowerBound; }
		if (node.Position.x > upperBoundWidth) { node.Position.x = upperBoundWidth; }
		if (node.Position.y > upperBoundHeight) { node.Position.y = upperBoundHeight; }
	}
	
	this.Update = function(nodes, links)
	{
		
		// Coulomb repulsion
		for (var i in nodes)
		{
			if (typeof nodes[i].Visualisation === "undefined" || nodes[i].Visualisation == null)
			{
				nodes[i].Visualisation = new force_graph_node(this.context, nodes[i]);
			}
		
			for (var j in nodes)
			{
				if (i == j) continue;
				
				if (typeof nodes[j].Visualisation === "undefined" || nodes[j].Visualisation == null)
				{
					nodes[j].Visualisation = new force_graph_node(this.context, nodes[j]);
				}
				
				var coulombForce = this.CoulombForce( nodes[i], nodes[j]);
				
				nodes[i].Visualisation.Acceleration = nodes[i].Visualisation.Acceleration.Add(coulombForce);
				nodes[j].Visualisation.Acceleration = nodes[j].Visualisation.Acceleration.Subtract(coulombForce);
			}
		}
		
		
		// Hooke Attraction
		for (var i in links)
		{
			
			var link = links[i];
			if (typeof link.Visualisation === "undefined" || link.Visualisation == null)
			{
				link.Visualisation = new force_graph_link(this.context, link);
			}
		
			var hookeForce = this.HookeAttraction(link.to, link.from, link.value * this.resting_link_length);
			
			link.to.Visualisation.Acceleration = link.to.Visualisation.Acceleration.Add(hookeForce );
			link.from.Visualisation.Acceleration = link.from.Visualisation.Acceleration.Subtract(hookeForce );
		}
		
		// Apply acceleration
		for (var i in nodes)
		{
			var node = nodes[i];

			var acceleration_effect = node.Visualisation.Acceleration.Multiply(this.acceleration_speed);
			node.Visualisation.Position = node.Visualisation.Position.Add(acceleration_effect);
			
			this.RemainWithinBounds(node.Visualisation);
			node.Visualisation.Acceleration = new Point(0,0);
		}
	}
	
	
}
force_graph.prototype.coulomb_constant_ke = null;
force_graph.prototype.hooke_constant = null;
force_graph.prototype.link_length_to_draw_ratio = null;
force_graph.prototype.Draw = null;
force_graph.prototype.Extend = null;
force_graph.prototype.Update = null;
force_graph.prototype.CoulombForce = null;
force_graph.prototype.HookeAttraction = null;
force_graph.prototype.RemainWithinBounds = null;

function force_graph_node(context)
{
	this.Context = context;
	
	this.CircleSize = 12;
	this.Position = new Point(	(Math.random() * (context.canvas.width - (2 * this.CircleSize))) + this.CircleSize,
								(Math.random() * (context.canvas.height - (2 * this.CircleSize))) + this.CircleSize);
	this.Velocity = new Point(0,0);
	this.Acceleration = new Point(0,0);
	this.Draw = function ()
		{
			this.Context.beginPath();
			this.Context.arc(this.Position.x, 
						this.Position.y,
						this.CircleSize,
						0,
						Math.PI * 2,
						false);
			this.Context.closePath();
			this.Context.fill();
			this.Context.stroke();
		}
}

force_graph_node.prototype.Position = null;
force_graph_node.prototype.CircleSize = null;
force_graph_node.prototype.Velocity = null;
force_graph_node.prototype.Acceleration = null;
force_graph_node.prototype.Draw = null;

function force_graph_link(context, parent)
{
	this.Context = context;
	this.Parent = parent;
	this.Draw = function()
		{
			this.Context.beginPath();
			this.Context.moveTo(this.Parent.from.Visualisation.Position.x, 
								this.Parent.from.Visualisation.Position.y);
			this.Context.lineTo(this.Parent.to.Visualisation.Position.x, 
								this.Parent.to.Visualisation.Position.y);
			this.Context.stroke();
		}
}
force_graph_link.prototype.Draw = null;