define(
[
   "harness/model/entities/block",
   "harness/model/entities/sockettype",
   "harness/blocks/scalarsource/scalarsourceview"
],

function(Block, SocketType, ScalarSourceView) {

   function ScalarSource(idSequenceNumber) {
      Block.call(this, idSequenceNumber, ScalarSource.FriendlyName);

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

   ScalarSource.FriendlyName = 'Scalar Source';
   ScalarSource.CssClass = 'blockscalarsource';
   ScalarSource.Type = 'Source';
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

   ScalarSource.prototype.CreateView = function()
   {
      return new ScalarSourceView(this);
   };

   return (ScalarSource);
});