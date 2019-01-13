import Block from "/scripts/harness/model/entities/block.js"
import ScalarSinkView from "./scalarsinkview.js"
import SocketType from "/scripts/harness/model/entities/sockettype.js"

export default class ScalarSink extends Block {
   constructor(idSequenceNumber) {
      super(idSequenceNumber, ScalarSink.Name);

      this.AddInput(
         this.SocketFactory.InputSingleFixedRequired(
            this,
            "Value",
            SocketType.BuildScalar()));

      this.Data = 'Empty';
   }

   static get Name() {
      return 'scalarsink';
   }

   static get Type() {
      return 'Sink'; 
   }
   
   static get FriendlyName() {
      return 'Scalar Sink';
   }
   
   static get CssClass() {
      return 'blockscalarsink';
   }
    
   static get Description() {
      return 'This sink acts as a way of viewing a single number. It does not keep history, as the simulation runs, the single number will be overwritten.';
   }

   Execute() {
      this.Data = this.Inputs.Value.Data;
      this.Completed = true;
   }

   Reset() {
      this.Inputs.Value.Data = null;
      this.Completed = false;
   }

   Validate() {
      return this.ValidateRequiredInputs();
   }

   DataToJSON() {
      return `"${this.Data}"`;
   }

   CreateView()
   {
      return new ScalarSinkView(this);
   }
}