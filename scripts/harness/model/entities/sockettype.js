define(
[
],
function() {
   function SocketType(key, description) {
      this.Key = key;
      this.Description = description;
   }

   SocketType.prototype.Key = "";
   SocketType.prototype.Description = "";

   SocketType.prototype.BuildAny = function()
   {
      return new SocketType("Harness.Socket.Type.Any","Will allow any type of connection.");
   };

   SocketType.prototype.BuildScalar = function()
   {
      return new SocketType("Harness.Socket.Type.Scalar","A single value");
   };

   return (SocketType);
});