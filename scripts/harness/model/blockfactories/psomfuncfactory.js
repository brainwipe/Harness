define(
[
   "harness/model/entities/block",
   "harness/model/entities/socket",
   "harness/model/entities/sockettype",
   "harness/views/block/psomfuncview"
],

function(Block, Socket, SocketType, PSOMFuncView) {

   function PSOMFuncFactory() {

   }

   PSOMFuncFactory.prototype.Build = function(idNumber)
   {
      var block = new Block(
                     this.FriendlyName +
                     idNumber,
                     this.FriendlyName,
                     this.FactoryName);

      block.AddInput(new Socket(block.Id, "InputPattern", new SocketType().BuildVector()), true, false);
      block.AddOutput(new Socket(block.Id, "LastError", new SocketType().BuildScalar()));

      block.Data = 1;
      block.Execute = function() {
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

      block.DataToJSON = function() {
         return '"' + this.Data + '"';
      };

      return block;
   };

   PSOMFuncFactory.prototype.FactoryName = 'PSOMFuncFactory';
   PSOMFuncFactory.prototype.FriendlyName = 'PSOM';
   PSOMFuncFactory.prototype.CssClass = 'blockpsomfunc';
   PSOMFuncFactory.prototype.Type = 'Function';
   PSOMFuncFactory.prototype.Description = 'This is the plastic self organising map neural network function block.';

   PSOMFuncFactory.prototype.GetView = function(block)
   {
      return new PSOMFuncView(block);
   };

   return (PSOMFuncFactory);
});