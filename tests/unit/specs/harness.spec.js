define(
[
	"jquery",
	"../mock/HarnessMockFactory",
	"harness/model/entities/socket",
	"harness/model/blockfactories/scalarsourcefactory",
	"harness/model/blockfactories/arraysourcefactory",
	"harness/model/blockfactories/scalarsinkfactory",
	"harness/views/block/scalarsinkview",
	"harness/views/block/scalarsourceview",
	"harness/validationexception",
	"harness/views/validationbrowser",
	"harness/views/notify",
	"stringlib"
],
function($,
	HarnessMockFactory,
	Socket,
	ScalarSourceFactory,
	ArraySourceFactory,
	ScalarSinkFactory,
	ScalarSinkView,
	ScalarSourceView,
	ValidationException,
	ValidationBrowser,
	Notify)
{

	describe("Harness", function () {

		describe("Blocks, Sockets and Connections", function () {
			var harness = null;
			var scalarsink = null;
			var scalarsinktwo = null;
			var scalarsource = null;
			var scalarsourcetwo = null;

			beforeEach(function () {
				var harnessFactory = new HarnessMockFactory();
				harness = harnessFactory.Build($("#harnessContainer"));
				var idnumber = 1;
				var scalarSinkFactory = new ScalarSinkFactory();
				scalarsink = scalarSinkFactory.Build(idnumber);
				scalarsinktwo = scalarSinkFactory.Build(idnumber + 1);

				var scalarSourceFactory = new ScalarSourceFactory();
				scalarsource = scalarSourceFactory.Build(idnumber + 2);
				scalarsourcetwo = scalarSourceFactory.Build(idnumber + 3);
			});

			it('can create a scalar sink builder', function() {
				expect(scalarsink).toBeDefined();
			});

			it('has a block id that is a shortened version of the block friendly name', function() {
				expect(scalarsink.Id).toEqual("ScalarSink1");
			});

			it('can create an input socket that is required', function() {
				var inputSocket = scalarsink.Inputs.Value;
				expect(inputSocket.IsInputSocket).toEqual(true);
				expect(inputSocket.IsRequired).toEqual(true);
			});

			it('can create an input socket that is not required', function() {
				var newSocket = new Socket(scalarsink.Id,'TestSocket');
				scalarsink.AddInput(newSocket, false);
				newSocket = scalarsink.Inputs.TestSocket;

				expect(newSocket.IsInputSocket).toEqual(true);
				expect(newSocket.IsRequired).toEqual(false);
			});

			it('can create an output socket', function() {
				var outputSocket = scalarsource.Outputs.Value;
				expect(outputSocket).toBeDefined();
				expect(outputSocket.Name).toEqual('Value');
			});

			it('can identify that there are no connections on a socket', function () {
				var outputSocket = scalarsource.Outputs.Value;
				expect(outputSocket.HasConnectors()).toEqual(false);
			});

			it('can connect two sockets together without using the harness (at low level)', function() {
				// Arrange
				var outputSocket = scalarsource.Outputs.Value;
				var inputSocket = scalarsink.Inputs.Value;

				// Act
				var connector = outputSocket.Connect(inputSocket);

				// Assert
				expect(outputSocket.Connectors[0]).toEqual(connector);
				expect(inputSocket.Connectors[0]).toEqual(connector);
			});

			it('throws an exception if you try and connect a input to an output. connections may only go from outputs to inputs.', function() {
				var outputSocket = scalarsource.Outputs.Value;
				var inputSocket = scalarsink.Inputs.Value;

				expect(function(){inputSocket.Connect(outputSocket);}).toThrow('You can only connect an output socket to an input socket, not the other way around');
			});

			it('throws an exception if you try and connect an output to itself', function() {
				var outputSocket = scalarsource.Outputs.Value;
				expect(function() {outputSocket.Connect(outputSocket);}).toThrow('You may not connect a socket to itself.');
			});

			it('can disconnect a socket', function() {
				// Arrange
				var outputSocket = scalarsource.Outputs.Value;
				var inputSocket = scalarsink.Inputs.Value;

				var connector = outputSocket.Connect(inputSocket);

				expect(outputSocket.Connectors[0]).toEqual(connector);
				expect(inputSocket.Connectors[0]).toEqual(connector);

				// Act
				expect(inputSocket.Disconnect(connector)).toEqual(true);

				// Assert
				expect(outputSocket.Connectors[0]).toEqual(connector);
				expect(inputSocket.Connectors.length).toEqual(0);
			});

			it('will throw an exception if you try and disconnect a connector that does not exist', function() {

				// Arrange
				var outputSocket = scalarsource.Outputs.Value;
				var inputSocket = scalarsink.Inputs.Value;
				var connector = outputSocket.Connect(inputSocket);

				expect(outputSocket.Connectors[0]).toEqual(connector);
				expect(inputSocket.Connectors[0]).toEqual(connector);
				expect(inputSocket.Disconnect(connector)).toEqual(true);

				// Act and Assert
				expect(function() {inputSocket.Disconnect(connector);}).toThrow('This connector is not connected to this socket and cannot be disconnected');
			});

			it('can tell you that it has connections', function() {
				// Arrange
				var outputSocket = scalarsource.Outputs.Value;
				var inputSocket = scalarsink.Inputs.Value;

				var connector = outputSocket.Connect(inputSocket);

				// Act and Assert
				expect(outputSocket.HasConnectors()).toEqual(true);
			});

			it('will throw an exception on validation if a required input does not have a connection', function() {
				var exception = new ValidationException(
					"Block ScalarSink1 requires an input",
					"The block called 'ScalarSink1' of type 'Scalar Sink' has an input called 'Value', which is a required input. This means it needs an input connector. Connect this input to an output of another block or remove this block altogether.");

				expect(function() {scalarsink.ValidateRequiredInputs(); } ).toThrow(exception);
			});

			it('can delete all connections on a socket, removing the connectors from other sockets too', function() {
				// Arrange
				var outputSocket = scalarsource.Outputs.Value;
				var inputSocket = scalarsink.Inputs.Value;
				var inputSocketTwo = scalarsinktwo.Inputs.Value;

				outputSocket.Connect(inputSocket);
				outputSocket.Connect(inputSocketTwo);

				// Act
				outputSocket.DeleteConnections();

				// Assert
				expect(outputSocket.HasConnectors()).toEqual(false);
				expect(inputSocket.HasConnectors()).toEqual(false);
				expect(inputSocketTwo.HasConnectors()).toEqual(false);
			});

			it('will validate correctly if a required input has a connection', function() {
				// Arrange
				var outputSocket = scalarsource.Outputs.Value;
				var inputSocket = scalarsink.Inputs.Value;

				var connector = outputSocket.Connect(inputSocket);

				// Act
				var isValid = scalarsink.ValidateRequiredInputs();

				// Assert
				expect(isValid).toEqual(true);
			});

			it('will get a block given the long id of a sub control', function() {
				// Arrange
				var scalarSinkView = new ScalarSinkView(scalarsink);
				harness.AddBlock(scalarsink, scalarSinkView);

				// Act
				var sinkBlock = harness.GetBlockFromAnyId("ScalarSink1-properties-some-property");

				// Assert
				expect(sinkBlock.Id).toEqual("ScalarSink1");
			});

			it('will throw an exception if you try to connect sockets with different types', function() {
				// Arrange
				var arraySourceFactory = new ArraySourceFactory();
				var idnumber = 1;
				var arraySource = arraySourceFactory.Build(idnumber);

				var outputSocket = arraySource.Outputs.Vector;
				var inputSocket = scalarsink.Inputs.Value;

				// Act and Assert
				expect(function() {outputSocket.Connect(inputSocket);}).toThrow('You are trying to connect a socket of type Harness.Socket.Type.Scalar to a socket of type Harness.Socket.Type.Vector. Socket types must be compatible.');
			});

			it('will throw an exception if you try and connect an non-multiple input to more than one output', function() {
				// Arrange
				var outputSocketOne = scalarsource.Outputs.Value;
				var outputSocketTwo = scalarsourcetwo.Outputs.Value;
				var inputSocket = scalarsink.Inputs.Value;

				outputSocketOne.Connect(inputSocket);

				// Act and Assert
				expect(function() {outputSocketTwo.Connect(inputSocket);}).toThrow('This input socket can only accept one connector, which it already has.');
			});

			it('can delete all connections on a block, removing the connectors from other sockets too', function() {
				// Arrange
				var outputSocket = scalarsource.Outputs.Value;
				var inputSocket = scalarsink.Inputs.Value;
				var inputSocketTwo = scalarsinktwo.Inputs.Value;

				outputSocket.Connect(inputSocket);
				outputSocket.Connect(inputSocketTwo);

				// Act
				scalarsource.DeleteConnections();

				// Assert
				expect(outputSocket.HasConnectors()).toEqual(false);
				expect(inputSocket.HasConnectors()).toEqual(false);
				expect(inputSocketTwo.HasConnectors()).toEqual(false);
			});

		});

		describe("Harness non-gui functions", function() {

			var harness = null;
			var scalarsink = null;
			var scalarsinkview = null;
			var scalarsource = null;
			var scalarsourceview = null;

			beforeEach(function () {
				var harnessFactory = new HarnessMockFactory();
				harness = harnessFactory.Build($("#harnessContainer"));
				var idnumber = 1;
				var scalarSinkFactory = new ScalarSinkFactory();
				scalarsink = scalarSinkFactory.Build(idnumber);
				scalarsinkview = new ScalarSinkView(scalarsink);

				var scalarSourceFactory = new ScalarSourceFactory();
				scalarsource = scalarSourceFactory.Build(idnumber);
				scalarsourceview = new ScalarSourceView(scalarsource);
			});

			it('can increment the block id number on each get', function() {
				expect(harness.GetNextBlockId()).toEqual(1);
			});

			it('adds a block into its array using the block\'s id as a key', function() {
				harness.AddBlock(scalarsource, scalarsourceview);

				expect(harness.Blocks.ScalarSource1).toBeDefined();
			});

			it('can connect two blocks together by names', function() {
				// Arrange
				harness.AddBlock(scalarsource, scalarsourceview);
				harness.AddBlock(scalarsink, scalarsinkview);

				var outputSocket = scalarsource.Outputs.Value;
				var inputSocket = scalarsink.Inputs.Value;

				// Act
				harness.ConnectSockets(outputSocket.QualifiedId(),
								inputSocket.QualifiedId());

				// Assert
				expect(outputSocket.Connectors[0].To).toEqual(inputSocket);
				expect(outputSocket.Connectors.length).toEqual(1);
				expect(inputSocket.Connectors[0].From).toEqual(outputSocket);
				expect(inputSocket.Connectors.length).toEqual(1);
			});

			it('can connect two blocks together by name and then remove the connection', function() {
				harness.AddBlock(scalarsource, scalarsourceview);
				harness.AddBlock(scalarsink, scalarsinkview);

				var outputSocket = scalarsource.Outputs.Value;
				var inputSocket = scalarsink.Inputs.Value;

				var connector = harness.ConnectSockets(outputSocket.QualifiedId(),
								inputSocket.QualifiedId());

				harness.RemoveConnector(connector);

				expect(outputSocket.Connectors.length).toEqual(0);
				expect(outputSocket.HasConnectors()).toEqual(false);

				expect(inputSocket.Connectors.length).toEqual(0);
				expect(inputSocket.HasConnectors()).toEqual(false);
			});

		});

		describe("Brute Force Engine tests", function() {

			var harness = null;
			var scalarsink = null;
			var scalarsource = null;
			var scalarSinkFactory = null;
			var scalarSourceFactory = null;

			beforeEach(function () {
				var harnessFactory = new HarnessMockFactory();
				harness = harnessFactory.Build($("#harnessContainer"));
				var idnumber = 1;

				scalarSinkFactory = new ScalarSinkFactory();
				scalarsink = scalarSinkFactory.Build(idnumber);
				scalarsinkview = new ScalarSinkView(scalarsink);

				scalarSourceFactory = new ScalarSourceFactory();
				scalarsource = scalarSourceFactory.Build(idnumber);
				scalarsourceview = new ScalarSourceView(scalarsource);
			});

			it('can tell if inputs are ready on a scalar source block (they always are)', function() {
				expect(harness.Engine.AreInputSocketsReady(scalarsource)).toEqual(true);
			});

			it('can tell if inputs are ready on a scalar sink block (never ready without execute)', function() {
				expect(harness.Engine.AreInputSocketsReady(scalarsink)).toEqual(false);
			});

			it('can validate a valid model', function() {
				harness.AddBlock(scalarsource, scalarsourceview);
				harness.AddBlock(scalarsink, scalarsinkview);

				var outputSocket = scalarsource.Outputs.Value;
				var inputSocket = scalarsink.Inputs.Value;

				harness.ConnectSockets(outputSocket.QualifiedId(),
								inputSocket.QualifiedId());

				harness.Validate();
			});

			it('will return false if you validate and invalid model', function() {
				harness.AddBlock(scalarsource, scalarsourceview);
				harness.AddBlock(scalarsink, scalarsinkview);

				var outputSocket = scalarsource.Outputs.Value;
				var inputSocket = scalarsink.Inputs.Value;

				expect(harness.Validate()).toEqual(false);
			});

			it('can propagate outputs to inputs of connected blocks', function () {
				harness.AddBlock(scalarsource, scalarsourceview);
				harness.AddBlock(scalarsink, scalarsinkview);
				scalarsource.Outputs.Value.Data = 123456;

				var outputSocket = scalarsource.Outputs.Value;
				var inputSocket = scalarsink.Inputs.Value;

				harness.ConnectSockets(outputSocket.QualifiedId(),
					inputSocket.QualifiedId());

				harness.Engine.PropagateOutputs(scalarsource);

				expect(scalarsink.Inputs.Value.Data).toEqual(123456);
			});

			it('can propagate outputs on a single tick', function () {
				harness.AddBlock(scalarsource, scalarsourceview);
				harness.AddBlock(scalarsink, scalarsinkview);
				scalarsource.Data = 123456;

				var outputSocket = scalarsource.Outputs.Value;
				var inputSocket = scalarsink.Inputs.Value;

				harness.ConnectSockets(outputSocket.QualifiedId(),
					inputSocket.QualifiedId());

				harness.Engine.Tick(harness.BlockIds(), harness.Blocks);

				expect(scalarsink.Inputs.Value.Data).toEqual(123456);
			});

			it('can propagate outputs on a single tick, regardless of block order', function () {
				harness.AddBlock(scalarsource, scalarsourceview);
				harness.AddBlock(scalarsink, scalarsinkview);
				scalarsource.Data = 123456;

				var outputSocket = scalarsource.Outputs.Value;
				var inputSocket = scalarsink.Inputs.Value;

				harness.ConnectSockets(outputSocket.QualifiedId(),
					inputSocket.QualifiedId());

				harness.Engine.Tick(harness.BlockIds(), harness.Blocks);

				expect(scalarsink.Inputs.Value.Data).toEqual(123456);
			});

			it('can propagate multiple outputs to different sinks on a single tick', function () {

				var scalarsink2 = scalarSinkFactory.Build(3);
				var scalarsource2 = scalarSourceFactory.Build(4);
				var scalarsinkview2 = new ScalarSinkView(scalarsink2);
				var scalarsourceview2 = new ScalarSourceView(scalarsource2);

				harness.AddBlock(scalarsource, scalarsourceview);
				harness.AddBlock(scalarsink, scalarsinkview);

				harness.AddBlock(scalarsource2, scalarsourceview2);
				harness.AddBlock(scalarsink2, scalarsinkview2);

				scalarsource.Data = 123456;
				scalarsource2.Data = 7890;

				var outputSocket = scalarsource.Outputs.Value;
				var inputSocket = scalarsink.Inputs.Value;

				harness.ConnectSockets(outputSocket.QualifiedId(),
					inputSocket.QualifiedId());

				var outputSocket2 = scalarsource2.Outputs.Value;
				var inputSocket2 = scalarsink2.Inputs.Value;

				harness.ConnectSockets(outputSocket2.QualifiedId(),
					inputSocket2.QualifiedId());

				harness.Engine.Tick(harness.BlockIds(), harness.Blocks);

				expect(scalarsink.Inputs.Value.Data).toEqual(123456);
				expect(scalarsink2.Inputs.Value.Data).toEqual(7890);
			});

		});

	});

});
