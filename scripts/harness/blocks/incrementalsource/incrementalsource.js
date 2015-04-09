define(
[
   "harness/model/entities/block",
   "harness/model/entities/sockettype",
   "harness/blocks/incrementalsource/incrementalsourceview"
],

function(Block, SocketType, IncrementalSourceView) {

   function IncrementalSource(idSequenceNumber) {
      Block.call(this, idSequenceNumber, this.FriendlyName);

      this.AddOutput(
         this.SocketFactory.OutputSingleFixed(
            this,
            "Value",
            new SocketType().BuildScalar()
            ));

      this.Data = 0;
   }

   IncrementalSource.prototype = Object.create( Block.prototype );
   IncrementalSource.prototype.constructor = IncrementalSource;

   IncrementalSource.prototype.FriendlyName = 'Incremental Source';
   IncrementalSource.prototype.CssClass = 'blockincrementalsource';
   IncrementalSource.prototype.Type = 'Source';
   IncrementalSource.prototype.Description = 'This source provides a single integer, that is increased by 1 on each execution. Used for a system clock.';

   IncrementalSource.prototype.CreateView = function()
   {
      return new IncrementalSourceView(this);
   };

   IncrementalSource.prototype.Execute = function() {
      this.Data = this.Data + 1;
      this.Outputs.Value.Data = this.Data;
      this.Completed = true;
   };

   IncrementalSource.prototype.Reset = function() {
      this.Outputs.Value.Data = this.Data;
      this.Completed = false;
   };

   IncrementalSource.prototype.Validate = function() {
      return true;
   };

   return (IncrementalSource);
});
