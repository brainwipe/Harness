import Block from "/scripts/harness/model/entities/block.js"
import PSOMFuncView from "./psomfuncview.js"
import SocketType from "/scripts/harness/model/entities/sockettype.js"
import PSOM from "/scripts/lib/psom.js"
import PSOMSerializer from "./helper/psomserializer.js"
import PSOMDeserializer from "./helper/psomdeserializer.js"

/*define(
[
   "harness/model/entities/block",
   "harness/blocks/psomfunc/psomfuncview",
   "harness/blocks/psomfunc/helper/psomserializer",
   "harness/blocks/psomfunc/helper/psomdeserializer",
   "lib/psom",
   "lib/math"
],

*/
export default class PSOMFunc extends Block {

   constructor(idSequenceNumber) {
      super(idSequenceNumber, PSOMFunc.Name);

      this.Data = PSOM.BuildStandard();
      this.Data.CreateThreeNodeNeuronNetwork();

      this.AddInput(
         this.SocketFactory.InputSingleFixedRequired(
            this,
            "InputPattern",
            SocketType.BuildVector()));

      this.AddOutput(
         this.SocketFactory.OutputSingleFixed(
            this,
            "LastError",
            SocketType.BuildScalar()));
   }
   
   static get Name() {
      return 'psomfunc';
   }

   static get Type() {
      return 'Function'; 
   }
   
   static get FriendlyName() {
      return 'PSOM';
   }
   
   static get CssClass() {
      return 'blockpsomfunc';
   }
    
   static get Description() {
      return 'This is the plastic self organising map neural network function block.';
   }

   Execute() {
      this.Outputs.LastError.Data = this.Data.Learn(this.Inputs.InputPattern.Data);
      this.Completed = true;
   }

   Reset() {
      this.Outputs.LastError.Data = this.Data;
      this.Completed = false;
   }

   Validate() {
      return this.ValidateRequiredInputs();
   }

   DataToJSON() {
      var serializer = new PSOMSerializer();
      return serializer.PSOMToJSON(this.Data);
   }

   JSONToData(jsonData) {
      var deserializer = new PSOMDeserializer();
      this.Data = deserializer.JSONToPSOM(this.Data, jsonData);
   }

   Initialise(view) {
      view.Initialise();
   }

   CreateView() {
      return new PSOMFuncView(this);
   }
}