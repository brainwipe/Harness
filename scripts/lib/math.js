	/**
	* General Mathematics.
	*/
	
	/**
	* Class for representing two values in 2D cartesian space. This might be a point
	* or a speed, or acceleration.
	*/
	function Point(x,y)
	{
		this.x = x;
		this.y = y;
	}
	Point.prototype.x = 0;
	Point.prototype.y = 0;
	Point.prototype.IsNumber = function(value)
	{
		return typeof(value) == "number";
	}
	Point.prototype.IsPoint = function(value)
	{
		if (value == null)
		{
			value = this;
		}
		return value instanceof Point;
	}
	Point.prototype.Subtract = function(p)
	{
		var point = new Point();
		point.x = this.x - p.x;
		point.y = this.y - p.y;
		return point;
	};
	
	Point.prototype.Add = function(p)
	{
		var point = new Point();
		
		if (this.IsNumber(p))
		{
			point.x = this.x + p;
			point.y = this.y + p;
		}
		else if (this.IsPoint(p))
		{
			point.x = this.x + p.x;
			point.y = this.y + p.y;
		}
		else
		{
			throw "Add only operates on numbers or the Point class";
		}
		return point;
	};
	
	
	Point.prototype.Multiply = function(value)
	{
		var point = new Point();
		
		if (this.IsNumber(value))
		{
			point.x = this.x * value;
			point.y = this.y * value;
		}
		else if (this.IsPoint(value))
		{
			point.x = this.x * value.x;
			point.y = this.y * value.y;
		}
		else
		{
			throw "Multiply only operates on numbers or the Point class";
		}
		
		return point;
	};
	
	Point.prototype.Divide = function(value)
	{
		var point = new Point();
		
		if (this.IsNumber(value))
		{
			if (value == 0)
			{
				throw "Divide cannot divide by 0.";
			}
			point.x = this.x / value;
			point.y = this.y / value;
		}
		else if (this.IsPoint(value))
		{
			if (value.x == 0 || value.y == 0)
			{
				throw "Divide cannot divide by 0.";
			}
			point.x = this.x / value.x;
			point.y = this.y / value.y;
		}
		else
		{
			throw "Divide only operates on numbers or the Point class";
		}
		
		return point;
	};
	
	Point.prototype.Negative = function()
	{
		var point = new Point();
		point.x = -this.x;
		point.y = -this.y;
		return point;
	}
	
	Point.prototype.Invert = function()
	{
		var point = new Point();
		point.x = 1 / this.x;
		point.y = 1 / this.y;
		return point;
	}
	
	Point.prototype.Normalise = function()
	{
		var point = new Point();
		var vector = [this.x, this.y];
		var norm = MathTwo.Normalise(vector);
		point.x = norm[0];
		point.y = norm[1];
		return point;
	};

	Point.prototype.Length = function()
	{
		var vector = [this.x, this.y];
		return MathTwo.Length(vector);
	};
	
	Point.prototype.Squared = function()
	{
		var point = new Point();
		point.x = this.x * this.x;
		point.y = this.y * this.y;
		return point;
	};
	

	function MathTwo()	{};

	MathTwo.Length = function (vector) {
		var dist = 0;
		for (var i=0; i<vector.length; i++)
		{
			dist += vector[i] * vector[i];
		}
		return Math.sqrt(dist); 
	};

	MathTwo.Normalise = function (vector) {
		var normalised = new Array();

		var dist = this.Length(vector);
		
		for (var i=0; i<vector.length; i++)
		{
			normalised[i] = vector[i] / dist;
		}
		return normalised;
	};
	
	MathTwo.IsArray = function(obj) {
		return obj.constructor == Array;
	};

	MathTwo.Round = function(num, dec) {
		return Math.round( num * Math.pow(10,dec)) / Math.pow(10,dec);
	};
	
	MathTwo.RoundVector = function(vector, dec) {
	
		for (var i = 0; i < vector.length; i++)
		{
			vector[i] = MathTwo.Round(vector[i],dec);
		}
		return vector;
	};
	
	MathTwo.Random = function(upper) {
		return Math.floor(Math.random() * upper);
	}
	
	