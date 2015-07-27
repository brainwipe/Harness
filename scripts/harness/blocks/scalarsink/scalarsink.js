define(
[
   "harness/model/entities/block",
   "harness/model/entities/sockettype",
   "harness/blocks/scalarsink/scalarsinkview"
],

function(Block, SocketType, ScalarSinkView) {

   function ScalarSink(idSequenceNumber) {
      Block.call(this, idSequenceNumber, ScalarSink.FriendlyName);

      this.AddInput(
         this.SocketFactory.InputSingleFixedRequired(
            this,
            "Value",
            new SocketType().BuildScalar()));

      this.Data = 'Empty';
   }

   ScalarSink.prototype = Object.create( Block.prototype );
   ScalarSink.prototype.constructor = ScalarSink;

   ScalarSink.FriendlyName = 'Scalar Sink';
   ScalarSink.CssClass = 'blockscalarsink';
   ScalarSink.Type = 'Sink';
   ScalarSink.prototype.Description = 'This sink acts as a way of viewing a single number. It does not keep history, as the simulation runs, the single number will be overwritten.';

   ScalarSink.prototype.Execute = function() {
      this.Data = this.Inputs.Value.Data;
      this.Completed = true;
   };

   ScalarSink.prototype.Reset = function() {
      this.Inputs.Value.Data = null;
      this.Completed = false;
   };

   ScalarSink.prototype.Validate = function() {
      return this.ValidateRequiredInputs();
   };

   ScalarSink.prototype.DataToJSON = function() {
      return '"' + this.Data + '"';
   };

   ScalarSink.prototype.CreateView = function()
   {
      return new ScalarSinkView(this);
   };

   return (ScalarSink);

});
