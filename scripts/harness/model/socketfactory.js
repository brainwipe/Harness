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
         IsInputSocket : true,
         CanBeDeleted : false,
         IsMultiple : false,
         IsRequired : true,
         IsDataSocket : false
      };
      return exampleContext;
   };

   SocketFactory.prototype.FromContext = function (context)
   {
      return new Socket(context.BlockId,
         context.Name,
         context.Type,
         context.IsInputSocket,
         context.CanBeDeleted,
         context.IsMultiple,
         context.IsRequired,
         context.IsDataSocket);
   };

   SocketFactory.prototype.FromJSON = function(json)
   {
      var socket = this.FromContext(json);
      socket.DataSocketPropertyId = json.DataSocketPropertyId;
      return socket;
   };

   // This input socket can accept only one connection, cannot be deleted and is required
   SocketFactory.prototype.InputSingleFixedRequired = function (block, name, type)
   {
      var inputSingleFixedContext = {
         BlockId : block.Id,
         Name : name,
         Type : type,
         IsInputSocket : true,
         CanBeDeleted : false,
         IsMultiple : false,
         IsRequired : true,
         IsDataSocket : false
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
         IsInputSocket : false,
         CanBeDeleted : false,
         IsMultiple : false,
         IsRequired : false,
         IsDataSocket : false
      };

      return this.FromContext(outputSingleFixedContext);
   };

   // This input is connected to a data property
   SocketFactory.prototype.InputFromData = function(block, dataPropertyId)
   {
      var inputFromData = {
         BlockId : block.Id,
         Name : block.Data.configurationtext[dataPropertyId],
         Type : new SocketType().BuildScalar(),
         IsInputSocket : true,
         CanBeDeleted : true,
         IsMultiple : false,
         IsRequired : true,
         IsDataSocket : true
      };

      var socket = this.FromContext(inputFromData);
      socket.DataSocketPropertyId = dataPropertyId;

      return socket;
   };

   // This output is connected to a data property
   SocketFactory.prototype.OutputFromData = function(block, dataPropertyId)
   {
      var outputFromData = {
         BlockId : block.Id,
         Name : block.Data.configurationtext[dataPropertyId],
         Type : new SocketType().BuildScalar(),
         IsInputSocket : false,
         CanBeDeleted : true,
         IsMultiple : false,
         IsRequired : true,
         IsDataSocket : true
      };

      var socket = this.FromContext(outputFromData);
      socket.DataSocketPropertyId = dataPropertyId;

      return socket;
   };

   return (SocketFactory);

});
