import Block from "/scripts/harness/model/entities/block.js"
import ArraySourceView from "./arraysourceview.js"
import SocketType from "/scripts/harness/model/entities/sockettype.js"

export default class extends Block {

   constructor(idSequenceNumber) {
      super(idSequenceNumber);

      this.AddOutput(
         this.SocketFactory.OutputSingleFixed(
            this,
            "Vector",
            SocketType.BuildVector()));

      this.Data = {
         "CurrentIndex" : -1,
         "Values" : [
                     [0,0,1],
                     [0,1,0],
                     [1,0,0]
                  ]
      }
   }

   static get Name() {
      return 'arraysource';
   }

   static get Type() {
      return 'Source'; 
   }
   
   static get FriendlyName() {
      return 'Array Source';
   }
   
   static get CssClass() {
      return 'blockarraysource';
   }
    
   static get Description() {
      return 'On each tick, this block puts a vector on its output.';
   }
     
   Execute() {
      this.Data.CurrentIndex++;
      if (this.Data.CurrentIndex > this.VectorSize() - 1)
      {
         this.Data.CurrentIndex = 0;
      }
      this.Outputs.Vector.Data = this.CurrentData();
      this.Completed = true;
   }

   Reset() {
      this.Outputs.Vector.Data = this.Data;
      this.Completed = false;
   }

   Validate() {
      return true;
   }

   CurrentData() {
      return this.Data.Values[this.Data.CurrentIndex];
   }

   VectorSize() {
      return this.Data.Values.length;
   }

   ValidateData() {
      if (this.Data.CurrentIndex > this.Data.Values.length - 1)
      {
         this.Data.CurrentIndex = this.Data.Values.length - 1;
      }
   }

   CreateView()
   {
      return new ArraySourceView(this);
   }
}