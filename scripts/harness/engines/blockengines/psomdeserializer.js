define(
[
   'stringlib'
],

function() {

   function PSOMDeserializer() { }

   PSOMDeserializer.prototype.JSONToPSOM = function(psom, psomJSON) {
      psom.neurons = psomJSON.neurons;

      psom.links = this.Relink(psom.neurons, psomJSON.links);

      psom.CreateNeuronWithRandomisedWeights_WeightLength = psomJSON.CreateNeuronWithRandomisedWeights_WeightLength;
      psom.CreateNeuronFromInput_Deviation = psomJSON.CreateNeuronFromInput_Deviation;
      psom.AddFlatDistributionNoiseToWeights_Deviation = psomJSON.AddFlatDistributionNoiseToWeights_Deviation;
      psom.StandardPSOMAlgorithm_NodeBuilding = psomJSON.StandardPSOMAlgorithm_NodeBuilding;
      psom.StandardPSOMAlgorithm_ClusterThreshold = psomJSON.StandardPSOMAlgorithm_ClusterThreshold;
      psom.StandardPSOMAlgorithm_LearningRate = psomJSON.StandardPSOMAlgorithm_LearningRate;
      psom.AgeNetwork_AgeRate = psomJSON.AgeNetwork_AgeRate;
      psom.RemoveLinksAboveThreshold_AgeThreshold = psomJSON.RemoveLinksAboveThreshold_AgeThreshold;

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