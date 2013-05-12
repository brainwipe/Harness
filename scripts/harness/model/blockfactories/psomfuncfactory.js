define(
[
   "harness/model/entities/block",
   "harness/model/entities/socket",
   "harness/model/entities/sockettype",
   "harness/views/block/psomfuncview",
   "algorithm/psom",
   "lib/math"
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

      block.PSOM = psom.BuildStandard();

      block.PSOM.CreateNeuronWithRandomisedWeights_WeightLength = 3;
      block.PSOM.CreateNeuronFromInput_Deviation = 0.05;
      block.PSOM.AddFlatDistributionNoiseToWeights_Deviation = 0.2;
      block.PSOM.StandardPSOMAlgorithm_NodeBuilding = 0.29;
      block.PSOM.StandardPSOMAlgorithm_ClusterThreshold = 0.23;
      block.PSOM.StandardPSOMAlgorithm_LearningRate = 0.9;
      block.PSOM.AgeNetwork_AgeRate = 0.01;
      block.PSOM.RemoveLinksAboveThreshold_AgeThreshold = 0.9;

      block.AddInput(new Socket(block.Id, "InputPattern", new SocketType().BuildVector()), true, false);
      block.AddOutput(new Socket(block.Id, "LastError", new SocketType().BuildScalar()));

      block.Data = 1;
      block.Execute = function() {
         this.Data = this.PSOM.Learn(this.Inputs.InputPattern.Data);
         this.Outputs.LastError.Data = this.Data;
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
         return '"' + this.Data + '"';
      };

      // KILL THIS eventually
      block.RandomNeuron = function(thepsom) {
         var numNeurons = thepsom.neurons.length;
         var randNeuron = MathTwo.Random(numNeurons);
         return thepsom.neurons[randNeuron];
      };

      block.Initialise = function(view) {
         this.PSOM.InitialiseNodeStructure();
         var randomNeuron1 = this.RandomNeuron(block.PSOM);
         var randomNeuron2 = this.RandomNeuron(block.PSOM);

         var newneuron = block.PSOM.CreateNeuron();
         block.PSOM.AddLink(randomNeuron1, newneuron, Math.random());
         block.PSOM.AddLink(randomNeuron2, newneuron, Math.random());

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