describe("Mathematics", function() {
	describe("Core", function () {

		it ('can round a scalar to 3 decimal places down', function() {
			expect(MathTwo.Round(0.1234, 3)).toEqual(0.123);
		});

		it ('can round a scalar to 3 decimal places up', function() {
			expect(MathTwo.Round(0.1235, 3)).toEqual(0.124);
		});

		it ('can round a vector', function () {
			var vector = [1.23456, 1.2333, 1.55555];
			var roundedVector = MathTwo.RoundVector(vector,3);

			expect(roundedVector[0]).toEqual(1.235);
			expect(roundedVector[1]).toEqual(1.233);
			expect(roundedVector[2]).toEqual(1.556);
		});


		it ('can detect array vector correctly', function () {
			var vector = [1,2,3];
			expect(MathTwo.IsArray(vector)).toEqual(true);

			var scalar = 10;
			expect(MathTwo.IsArray(scalar)).toEqual(false);
		});

		it ('can normalise a vector', function() {
			var vector = [2,3];
			var norm = MathTwo.Normalise(vector,4);
			var normRounded = MathTwo.RoundVector(norm,3);

			expect(normRounded[0]).toEqual(0.555);
			expect(normRounded[1]).toEqual(0.832);
		});

		it ('can find vector length', function() {
			var vector = [100,100];
			var distance = MathTwo.Length(vector);
			var distanceRounded = MathTwo.Round(distance, 4);
			expect(distanceRounded).toEqual(141.4214);
		});
	});

	describe("Point", function() {
		it('has a point class with X and Y', function() {
			var point = new Point(10,20);
			expect(point.x).toEqual(10);
			expect(point.y).toEqual(20);
		});

		it('can add two points together', function() {
			var p1 = new Point(1,2);
			var p2 = new Point(3,4);
			var sum = p1.Add(p2);
			var sum2 = p2.Add(p1);

			expect(sum.x).toEqual(4);
			expect(sum.y).toEqual(6);
			expect(sum2.x).toEqual(4);
			expect(sum2.y).toEqual(6);
		});

		it('can add a scalar to a point', function() {
			var p1 = new Point(1,2);
			var sum = p1.Add(5);

			expect(sum.x).toEqual(6);
			expect(sum.y).toEqual(7);
		});

		it('throws an error if you try and add a non-number', function() {
			var point = new Point(2,3);
			var notANumber = "Hello";

			expect(function(){ point.Add(notANumber); }).toThrow("Add only operates on numbers or the Point class");
		});

		it('can subtract one point from another', function() {
			var p1 = new Point(4,6);
			var p2 = new Point(3,4);
			var sub = p1.Subtract(p2);
			var sub2 = p2.Subtract(p1);

			expect(sub.x).toEqual(1);
			expect(sub.y).toEqual(2);
			expect(sub2.x).toEqual(-1);
			expect(sub2.y).toEqual(-2);
		});

		it('can multiply by a value', function() {
			var p1 = new Point(4,6);
			var mult = p1.Multiply(4);

			expect(mult.x).toEqual(16);
			expect(mult.y).toEqual(24);
		});

		it('can multiply two vectors together', function() {
			var p1 = new Point(2,3);
			var p2 = new Point(4,5);
			var mult = p1.Multiply(p2);

			expect(mult.x).toEqual(8);
			expect(mult.y).toEqual(15);
		});

		it('can divide by a value', function() {
			var p1 = new Point(4,6);
			var divide = p1.Divide(2);

			expect(divide.x).toEqual(2);
			expect(divide.y).toEqual(3);
		});

		it('can divide one vector by another', function() {
			var p1 = new Point(16,25);
			var p2 = new Point(2,5);
			var mult = p1.Divide(p2);

			expect(mult.x).toEqual(8);
			expect(mult.y).toEqual(5);
		});

		it('throws an error if you mulitply by a non-number', function() {
			var point = new Point(2,3);
			var notANumber = "Hello";

			expect(function(){ point.Multiply(notANumber); }).toThrow("Multiply only operates on numbers or the Point class");
		});

		it('throws an error if you divide by a non-number', function() {
			var point = new Point(2,3);
			var notANumber = "Hello";

			expect(function(){ point.Divide(notANumber); }).toThrow("Divide only operates on numbers or the Point class");
		});

		it('throws an error if you divide by zero', function() {
			var point = new Point(2,3);

			expect(function(){ point.Divide(0); }).toThrow("Divide cannot divide by 0.");
		});

		it('throws an error if you divide by zero in a vector', function() {
			var p1 = new Point(2,3);
			var p2 = new Point(0,3);

			expect(function(){ p1.Divide(p2); }).toThrow("Divide cannot divide by 0.");
		});

		it('can normalise a vector', function() {
			var p1 = new Point(2,3);
			var norm = p1.Normalise(4);

			var roundedX = MathTwo.Round(norm.x,3);
			var roundedY = MathTwo.Round(norm.y,3);

			expect(roundedX).toEqual(0.555);
			expect(roundedY).toEqual(0.832);
		});

		it('can square a vector', function() {
			var p1 = new Point(2,3);
			var squaredP1 = p1.Squared();

			expect(squaredP1.x).toEqual(4);
			expect(squaredP1.y).toEqual(9);
		});

		it('can tell you it is a Point', function() {
			var point = new Point(1,1);

			expect(point.IsPoint()).toBeTruthy();
		});

		it('can invert a point\'s value', function() {
			var point = new Point(10,20);
			var inverted = point.Invert();

			expect(inverted.x).toEqual(0.1);
			expect(inverted.y).toEqual(0.05);
		});

		it('can negate a point\'s value', function() {
			var point = new Point(10,20);
			var inverted = point.Negative();

			expect(inverted.x).toEqual(-10);
			expect(inverted.y).toEqual(-20);
		});
	});
});