define(
[
   "jquery",
   "mock/harnessmockfactory",
   "harness/model/socketfactory",
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
   SocketFactory,
   Socket,
   ScalarSinkBlock,
   ScalarSourceBlock,
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
      var socketFactory = null;

      beforeEach(function () {
         var harnessFactory = new HarnessMockFactory();
         var socketFactory = new SocketFactory();

         harness = harnessFactory.Build($("#harnessContainer"));
         var idnumber = 1;

         scalarsink = new ScalarSinkBlock(idnumber);
         scalarsinkview = scalarsink.CreateView();

         scalarsource = new ScalarSourceBlock(idnumber++);
         scalarsourceview = scalarsource.CreateView();
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

         var scalarsink2 = new ScalarSinkBlock(3);
         var scalarsource2 = new ScalarSourceBlock(4);
         var scalarsinkview2 = scalarsink2.CreateView();
         var scalarsourceview2 = scalarsource2.CreateView();

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