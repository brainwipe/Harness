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