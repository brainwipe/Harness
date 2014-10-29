define(
[
   "harness/model/entities/Block",
   "harness/model/entities/SocketType",
   "harness/blocks/scalarsource/ScalarSourceView"
],

function(Block, SocketType, ScalarSourceView) {

   function ScalarSource(idSequenceNumber) {
      Block.call(this, idSequenceNumber, this.FriendlyName);

      this.AddOutput(
         this.SocketFactory.OutputSingleFixed(
            this,
            "Value",
            new SocketType().BuildScalar()
            ));

      this.Data = 10;
   }

   ScalarSource.prototype = Object.create( Block.prototype );
   ScalarSource.prototype.constructor = ScalarSource;

   ScalarSource.prototype.FriendlyName = 'Scalar Source';
   ScalarSource.prototype.CssClass = 'blockscalarsource';
   ScalarSource.prototype.Type = 'Source';
   ScalarSource.prototype.Description = 'This source provides a single real number, such as 123.4. This useful for biases, offsets, providing paramters for functions or simple mathematics.';

   ScalarSource.prototype.Execute = function() {
      this.Outputs.Value.Data = this.Data;
      this.Completed = true;
   };

   ScalarSource.prototype.Reset = function() {
      this.Outputs.Value.Data = this.Data;
      this.Completed = false;
   };

   ScalarSource.prototype.Validate = function() {
      return true;
   };

   ScalarSource.prototype.DataToJSON = function() {
      return '"' + this.Data + '"';
   };

   ScalarSource.prototype.GetView = function()
   {
      return new ScalarSourceView(this);
   };

   return (ScalarSource);
});