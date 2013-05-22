define(
[
   "harness/model/entities/block",
   "harness/model/entities/socket",
   "harness/model/entities/sockettype",
   "harness/views/block/incrementalsourceview"
],

function(Block, Socket, SocketType, IncrementalSourceView) {

   function IncrementalSourceFactory() {}
   IncrementalSourceFactory.prototype.Build = function(idNumber)
   {
      var block = new Block(
                     this.FriendlyName +
                     idNumber,
                     this.FriendlyName,
                     this.FactoryName);
      block.AddOutput(new Socket(block.Id, "Value", new SocketType().BuildScalar()));
      block.Data = 0;
      block.Execute = function() {
         this.Data = this.Data + 1;
         this.Outputs.Value.Data = this.Data;
         this.Completed = true;
      };

      block.Reset = function() {
         this.Outputs.Value.Data = this.Data;
         this.Completed = false;
      };

      block.Validate = function() {
         return true;
      };

      return block;
   };

   IncrementalSourceFactory.prototype.FactoryName = 'IncrementalSourceFactory';
   IncrementalSourceFactory.prototype.FriendlyName = 'Incremental Source';
   IncrementalSourceFactory.prototype.CssClass = 'blockincrementalsource';
   IncrementalSourceFactory.prototype.Type = 'Source';
   IncrementalSourceFactory.prototype.Description = 'This source provides a single integer, that is increased by 1 on each execution. Used for a system clock.';

   IncrementalSourceFactory.prototype.GetView = function(block)
   {
      return new IncrementalSourceView(block);
   };
   return (IncrementalSourceFactory);

});
