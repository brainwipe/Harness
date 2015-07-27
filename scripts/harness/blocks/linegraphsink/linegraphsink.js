define(
[
   "harness/model/entities/block",
   "harness/model/entities/sockettype",
   "harness/blocks/linegraphsink/linegraphsinkview"
],

function(Block, SocketType, LineGraphSinkView) {

   function LineGraphSink(idSequenceNumber) {
      Block.call(this, idSequenceNumber, LineGraphSink.FriendlyName);

      this.AddInput(
         this.SocketFactory.InputSingleFixedRequired(
            this,
            "Value",
            new SocketType().BuildScalar()));

      this.Data = [];
   }

   LineGraphSink.prototype = Object.create( Block.prototype );
   LineGraphSink.prototype.constructor = LineGraphSink;

   LineGraphSink.FriendlyName = 'Line Graph Sink';
   LineGraphSink.CssClass = 'blocklinegraphsink';
   LineGraphSink.Type = 'Sink';
   LineGraphSink.prototype.Description = 'This block takes in a single number and shows it as a line.';
   LineGraphSink.prototype.XAxisRange = 40;

   LineGraphSink.prototype.Execute = function() {
      this.Data.push(this.Inputs.Value.Data); 
      this.Completed = true;
   };

   LineGraphSink.prototype.Reset = function() {
      this.Inputs.Value.Data = null;
      this.Completed = false;
   };

   LineGraphSink.prototype.Validate = function() {
      return this.ValidateRequiredInputs();
   };

   LineGraphSink.prototype.DataToJSON = function() {
      return '"' + this.Data + '"';
   };

   LineGraphSink.prototype.CreateView = function()
   {
      return new LineGraphSinkView(this);
   };

   return (LineGraphSink);

});
