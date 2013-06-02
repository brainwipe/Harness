define(
[
	"jquery",
	"HarnessMockFactory",
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
	});
});
