import Block from "/scripts/harness/model/entities/block.js"
import ScalarSourceView from "./scalarsourceview.js"
import SocketType from "/scripts/harness/model/entities/sockettype.js"

export default class ScalarSource extends Block {

   constructor(idSequenceNumber) {
      super(idSequenceNumber, ScalarSource.Name);

      this.AddOutput(
         this.SocketFactory.OutputSingleFixed(
            this,
            "Value",
            SocketType.BuildScalar()
            ));

      this.Data = 10;
   }
   static get Name() {
      return 'scalarsource';
   }

   static get Type() {
      return 'Source'; 
   }
   
   static get FriendlyName() {
      return 'Scalar Source';
   }
   
   static get CssClass() {
      return 'blockscalarsource';
   }
    
   static get Description() {
      return 'This source provides a single real number, such as 123.4. This useful for biases, offsets, providing paramters for functions or simple mathematics.';
   }
     
   Execute() {
      this.Outputs.Value.Data = this.Data;
      this.Completed = true;
   }

   Reset() {
      this.Outputs.Value.Data = this.Data;
      this.Completed = false;
   }

   Validate() {
      return true;
   }

   CreateView()
   {
      return new ScalarSourceView(this);
   }
}