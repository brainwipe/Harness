define(
[
   "harness/model/entities/block",
   "harness/model/entities/sockettype",
   "harness/blocks/arraysource/arraysourceview"
],

function(Block, SocketType, ArraySourceView) {

   function ArraySource(idSequenceNumber) {
      Block.call(this, idSequenceNumber, this.FriendlyName);

      this.AddOutput(
         this.SocketFactory.OutputSingleFixed(
            this,
            "Vector",
            new SocketType().BuildVector()));

      this.Data = {
         "CurrentIndex" : -1,
         "Values" : [
                     [0,0,1],
                     [0,1,0],
                     [1,0,0]
                  ]
      };
   }

   ArraySource.prototype = Object.create( Block.prototype );
   ArraySource.prototype.constructor = ArraySource;

   ArraySource.prototype.FriendlyName = 'Array Source';
   ArraySource.prototype.CssClass = 'blockarraysource';
   ArraySource.prototype.Type = 'Source';
   ArraySource.prototype.Description = 'On each tick, this block puts a vector on its output.';

   ArraySource.prototype.Execute = function() {
      this.Data.CurrentIndex++;
      this.Outputs.Vector.Data = this.CurrentData();
      if (this.Data.CurrentIndex > this.VectorSize() - 1)
      {
         this.Data.CurrentIndex = 0;
      }
      this.Completed = true;
   };

   ArraySource.prototype.Reset = function() {
      this.Outputs.Vector.Data = this.Data;
      this.Completed = false;
   };

   ArraySource.prototype.Validate = function() {
      return true;
   };

   ArraySource.prototype.CurrentData = function() {
      return this.Data.Values[this.Data.CurrentIndex];
   };

   ArraySource.prototype.VectorSize = function() {
      return this.Data.Values.length;
   };

   ArraySource.prototype.ValidateData = function() {
      if (this.Data.CurrentIndex > this.Data.Values.length - 1)
      {
         this.Data.CurrentIndex = this.Data.Values.length - 1;
      }
   };

   ArraySource.prototype.GetView = function()
   {
      return new ArraySourceView(this);
   };

   return(ArraySource);
});