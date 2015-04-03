define(
[
	"jquery",
	"mock/harnessmockfactory",
	"harness/model/entities/socket",
	"harness/blocks/scalarsink/scalarsink",
	"harness/blocks/scalarsource/scalarsource",
	"harness/validationexception",
	"harness/views/validationbrowser",
	"harness/views/notify",
	"stringlib"
],
function($,
	HarnessMockFactory,
	Socket,
	ScalarSinkBlock,
	ScalarSourceBlock,
	ValidationException,
	ValidationBrowser,
	Notify)
{
	describe("Harness", function () {

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
				scalarsink = new ScalarSinkBlock(idnumber);
				scalarsinkview = scalarsink.GetView();

				scalarsource = new ScalarSourceBlock(idnumber++);
				scalarsourceview = scalarsource.GetView();
			});

			it('can increment the block id number on each get', function() {
				expect(harness.GetNextBlockId()).toEqual(1);
			});

			it('adds a block into its array using the block\'s id as a key', function() {
				harness.AddBlock(scalarsource, scalarsourceview);

				expect(harness.Blocks.ScalarSource1).toBeDefined();
			});

			it ('can retrieve a block and socket from a fully qualified socket Id', function() {
				// Arrange
				harness.AddBlock(scalarsink);
				var block = scalarsink;
				var socket = scalarsink.Inputs["Value"];
				var fullyQualifiedSocketId = socket.QualifiedId();
				
				// Act
				var result = harness.GetBlockAndInputSocketFromId(fullyQualifiedSocketId);

				// Assert
				expect(result.Block).toEqual(block);
				expect(result.Socket).toEqual(socket);
			});

			it ('throws an exception when trying to retrieve a block that does not exist', function() {
				// Arrange
				var nonExistentBlockId = "This-Block-Id-Does-Not-Exist";

				// Act
				expect(function(){ harness.GetBlockFromAnyId(nonExistentBlockId); } ).toThrow('Block with the id \'This\' in the elementId \'This-Block-Id-Does-Not-Exist\' could not be found.');
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

				harness.RemoveConnector(connector.From.QualifiedId(), connector.To.QualifiedId());

				expect(outputSocket.Connectors.length).toEqual(0);
				expect(outputSocket.HasConnectors()).toEqual(false);

				expect(inputSocket.Connectors.length).toEqual(0);
				expect(inputSocket.HasConnectors()).toEqual(false);
			});

		});
	});
});
