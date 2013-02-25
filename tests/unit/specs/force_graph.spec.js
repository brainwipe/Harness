describe("Force Graph", function() {

	var nodes;
	var links;
	var forceGraph;
	var context;

	function NodeMock() {}
	function LinkMock() {}


	beforeEach(function () {

		nodes = [];
		nodes.push(new NodeMock());
		nodes.push(new NodeMock());

		links = [];
		links.push(new LinkMock());
		links.push(new LinkMock());

		function CanvasMock() { }
		canvasMock.prototype.width = 300;
		canvasMock.prototype.height = 300;

		function ContextMock()
		{
			this.canvas = new CanvasMock();
		}

		contextMock.prototype.canvas = null;
		contextMock.prototype.beginPath = function () {};
		contextMock.prototype.moveTo = function () {};
		contextMock.prototype.lineTo = function () {};
		contextMock.prototype.stroke = function () {};
		contextMock.prototype.arc = function () {};
		contextMock.prototype.closePath = function () {};
		contextMock.prototype.fill = function () {};

		context = new ContextMock();

		forceGraph = new force_graph(context);
		forceGraph.Extend(nodes, links);
		});

	describe("Structure", function () {

		it ('can extend an array of nodes and links', function() {
			for (var i in nodes)
			{
				expect(nodes[i].Visualisation).toBeDefined();
			}

			for (var j in links)
			{
				expect(links[j].Visualisation).toBeDefined();
			}
		});

		it ('can calculate coulomb force', function() {

			forceGraph.coulomb_constant_ke = 0.9;
			nodes[0].Visualisation.Position = new Point(100,100);
			nodes[1].Visualisation.Position = new Point(101,110);

			var force = forceGraph.CoulombForce(nodes[0],nodes[1]);

			expect(force.x).toEqual(0.6407942958612118);
			expect(force.y).toEqual( 0.009032067523009654);

		});

		it ('can calculate coulomb force when nodes are superimposed', function() {

			forceGraph.coulomb_constant_ke = 0.9;
			nodes[0].Visualisation.Position = new Point(100,100);
			nodes[1].Visualisation.Position = new Point(100,100);

			var force = forceGraph.CoulombForce(nodes[0],nodes[1]);

			expect(force.x).toEqual(1);
			expect(force.y).toEqual(1);

		});

		it ('can calculate hooke attraction where nodes are correct distance apart', function() {

			forceGraph.hooke_constant = 1;
			nodes[0].Visualisation.Position = new Point(100,100);
			nodes[1].Visualisation.Position = new Point(100,145);
			var distance = 45;

			var force = forceGraph.HookeAttraction(nodes[0],nodes[1], 45);

			expect(force.x).toEqual(0);
			expect(force.y).toEqual(0);

		});

		it ('can calculate hooke attraction where nodes are too close', function() {
			forceGraph.hooke_constant = 1;
			forceGraph.link_length_to_draw_ratio = 1;
			nodes[0].Visualisation.Position = new Point(100,100);
			nodes[1].Visualisation.Position = new Point(100,120);
			var distance = 45;

			var force = forceGraph.HookeAttraction(nodes[0],nodes[1], 45);

			expect(MathTwo.Round(force.x,3)).toEqual(0);
			expect(MathTwo.Round(force.y,3)).toEqual(-11.111);
		});

		it ('can calculate hooke attraction where nodes are far apart', function() {
			forceGraph.hooke_constant = 1;
			forceGraph.link_length_to_draw_ratio = 1;
			nodes[0].Visualisation.Position = new Point(100,100);
			nodes[1].Visualisation.Position = new Point(100,180);
			var distance = 45;

			var force = forceGraph.HookeAttraction(nodes[0],nodes[1], 45);

			expect(MathTwo.Round(force.x,3)).toEqual(0);
			expect(MathTwo.Round(force.y,3)).toEqual(62.222);
		});

		it ('can ensure that it remains above the minimum bound set by the context', function () {
			nodes[0].Visualisation.CircleSize = 12;
			nodes[0].Visualisation.Position = new Point(-5,-5);

			forceGraph.RemainWithinBounds(nodes[0].Visualisation);

			expect(nodes[0].Visualisation.Position.x).toEqual(12);
			expect(nodes[0].Visualisation.Position.y).toEqual(12);
		});

		it ('can ensure that it remains below the maximum bound set by the context', function () {
			nodes[0].Visualisation.CircleSize = 12;
			nodes[0].Visualisation.Position = new Point(350, 350);

			forceGraph.RemainWithinBounds(nodes[0].Visualisation);

			expect(nodes[0].Visualisation.Position.x).toEqual(276);
			expect(nodes[0].Visualisation.Position.y).toEqual(276);
		});

	});
});