define(
[
   "harness/model/entities/block",
   "harness/model/entities/socket",
   "harness/model/entities/sockettype",
   "harness/views/block/psomfuncview",
   "harness/engines/blockengines/psomserializer",
   "harness/engines/blockengines/psomdeserializer",
   "algorithm/psom",
   "lib/math"
],

function(Block, Socket, SocketType, PSOMFuncView, PSOMSerializer, PSOMDeserializer) {

   function PSOMFuncFactory() {

   }

   PSOMFuncFactory.prototype.Build = function(idNumber)
   {
      var block = new Block(
                     this.FriendlyName +
                     idNumber,
                     this.FriendlyName,
                     this.FactoryName);

      block.Data = psom.BuildStandard();

      block.Data.CreateNeuronWithRandomisedWeights_WeightLength = 3;
      block.Data.CreateNeuronFromInput_Deviation = 0.05;
      block.Data.AddFlatDistributionNoiseToWeights_Deviation = 0.2;
      block.Data.StandardPSOMAlgorithm_NodeBuilding = 0.29;
      block.Data.StandardPSOMAlgorithm_ClusterThreshold = 0.23;
      block.Data.StandardPSOMAlgorithm_LearningRate = 0.9;
      block.Data.AgeNetwork_AgeRate = 0.01;
      block.Data.RemoveLinksAboveThreshold_AgeThreshold = 0.9;

      block.Data.InitialiseNodeStructure();

      block.AddInput(new Socket(block.Id, "InputPattern", new SocketType().BuildVector()), true, false);
      block.AddOutput(new Socket(block.Id, "LastError", new SocketType().BuildScalar()));

      block.Execute = function() {
         this.Outputs.LastError.Data = this.Data.Learn(this.Inputs.InputPattern.Data);
         this.Completed = true;
      };

      block.Reset = function() {
         this.Outputs.LastError.Data = this.Data;
         this.Completed = false;
      };

      block.Validate = function() {
         return this.ValidateRequiredInputs();
      };

      block.DataToJSON = function() {
         var serializer = new PSOMSerializer();
         return serializer.PSOMToJSON(this.Data);
      };

      block.JSONToData = function(jsonData) {
         var deserializer = new PSOMDeserializer();
         this.Data = deserializer.JSONToPSOM(this.Data, jsonData);
      };

      block.Initialise = function(view) {
         view.Initialise();
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