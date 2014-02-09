define(
[
   'stringlib'
],

function() {

   function PSOMSerializer() { }

   PSOMSerializer.prototype.PSOMToJSON = function(psom) {
      return JSON.stringify(psom);
   };

   return PSOMSerializer;

});