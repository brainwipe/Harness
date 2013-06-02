define(
[
   "harness/model/socketfactory",
   "harness/model/entities/block",
   "harness/model/entities/socket",
   "harness/model/entities/sockettype",
   "harness/views/block/psomfuncview",
   "harness/engines/blockengines/psomserializer",
   "harness/engines/blockengines/psomdeserializer",
   "algorithm/psom",
   "lib/math"
],

function(SocketFactory, Block, Socket, SocketType, PSOMFuncView, PSOMSerializer, PSOMDeserializer) {

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

      block.Data.InitialiseNodeStructure();

      var socketFactory = new SocketFactory();
      block.AddInput(
         socketFactory.InputSingleFixedRequired(
            block,
            "InputPattern",
            new SocketType().BuildVector()));

      block.AddOutput(
         socketFactory.OutputSingleFixed(
            block,
            "LastError",
            new SocketType().BuildScalar()));

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