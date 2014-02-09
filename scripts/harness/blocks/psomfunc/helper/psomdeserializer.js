define(
[
   'stringlib'
],

function() {

   function PSOMDeserializer() { }

   PSOMDeserializer.prototype.JSONToPSOM = function(psom, psomJSON) {
      psom.neurons = psomJSON.neurons;

      psom.links = this.Relink(psom.neurons, psomJSON.links);

      psom.configuration = psomJSON.configuration;

      return psom;
   };

   PSOMDeserializer.prototype.Relink = function(neurons, links) {
      var reLinkedLinks = [];

      for (var linkId in links)
      {
         var link = links[linkId];
         var neuronFrom = neurons[link.from.id];
         var neuronTo = neurons[link.to.id];
         var value = link.value;

         var newLink = new Link(neuronFrom, neuronTo, value);

         reLinkedLinks.push(newLink);
      }

      return reLinkedLinks;
   };

   return PSOMDeserializer;

});