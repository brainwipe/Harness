define(
[
   "harness/model/entities/socket",
   "harness/model/entities/sockettype"
],
function(Socket, SocketType) {

   function SocketFactory() {}

   SocketFactory.prototype.GetExampleContext = function ()
   {
      var exampleContext = {
         BlockId : "ExampleBlockId",
         Name : "Example Socket Name",
         Type : new SocketType().BuildAny(),
         IsInput : true,
         CanBeDeleted : false,
         IsMultiple : false,
         IsRequired : true
      };
      return exampleContext;
   };

   SocketFactory.prototype.FromContext = function (context)
   {
      return new Socket(context.BlockId,
         context.Name,
         context.Type,
         context.IsInput,
         context.CanBeDeleted,
         context.IsMultiple,
         context.IsRequired);
   };

   // This input socket can accept only one connection, cannot be deleted and is required
   SocketFactory.prototype.InputSingleFixedRequired = function (block, name, type)
   {
      var inputSingleFixedContext = {
         BlockId : block.Id,
         Name : name,
         Type : type,
         IsInput : true,
         CanBeDeleted : false,
         IsMultiple : false,
         IsRequired : true
      };

      return this.FromContext(inputSingleFixedContext);
   };

   // This output socket can accept only one connection and cannot be deleted
   SocketFactory.prototype.OutputSingleFixed = function (block, name, type)
   {
      var outputSingleFixedContext = {
         BlockId : block.Id,
         Name : name,
         Type : type,
         IsInput : false,
         CanBeDeleted : false,
         IsMultiple : false,
         IsRequired : false
      };

      return this.FromContext(outputSingleFixedContext);
   };

   return (SocketFactory);

});
