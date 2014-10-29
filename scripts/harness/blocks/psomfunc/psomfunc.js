define(
[
   "harness/model/entities/Block",
   "harness/model/entities/SocketType",
   "harness/blocks/psomfunc/PsomFuncView",
   "harness/blocks/psomfunc/helper/PsomSerializer",
   "harness/blocks/psomfunc/helper/PsomDeserializer",
   "algorithm/psom",
   "lib/math"
],

function(Block, SocketType, PSOMFuncView, PSOMSerializer, PSOMDeserializer) {

   function PSOMFunc(idSequenceNumber) {
      Block.call(this, idSequenceNumber, this.FriendlyName);

      this.Data = psom.BuildStandard();
      this.Data.InitialiseNodeStructure();

      this.AddInput(
         this.SocketFactory.InputSingleFixedRequired(
            this,
            "InputPattern",
            new SocketType().BuildVector()));

      this.AddOutput(
         this.SocketFactory.OutputSingleFixed(
            this,
            "LastError",
            new SocketType().BuildScalar()));
   }

   PSOMFunc.prototype = Object.create( Block.prototype );
   PSOMFunc.prototype.constructor = PSOMFunc;

   PSOMFunc.prototype.FriendlyName = 'PSOM';
   PSOMFunc.prototype.CssClass = 'blockpsomfunc';
   PSOMFunc.prototype.Type = 'Function';
   PSOMFunc.prototype.Description = 'This is the plastic self organising map neural network function block.';

   PSOMFunc.prototype.Execute = function() {
      this.Outputs.LastError.Data = this.Data.Learn(this.Inputs.InputPattern.Data);
      this.Completed = true;
   };

   PSOMFunc.prototype.Reset = function() {
      this.Outputs.LastError.Data = this.Data;
      this.Completed = false;
   };

   PSOMFunc.prototype.Validate = function() {
      return this.ValidateRequiredInputs();
   };

   PSOMFunc.prototype.DataToJSON = function() {
      var serializer = new PSOMSerializer();
      return serializer.PSOMToJSON(this.Data);
   };

   PSOMFunc.prototype.JSONToData = function(jsonData) {
      var deserializer = new PSOMDeserializer();
      this.Data = deserializer.JSONToPSOM(this.Data, jsonData);
   };

   PSOMFunc.prototype.Initialise = function(view) {
      view.Initialise();
   };

   PSOMFunc.prototype.GetView = function()
   {
      return new PSOMFuncView(this);
   };

   return (PSOMFunc);
});
