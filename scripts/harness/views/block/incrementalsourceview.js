define(
[
   'harness/views/block/blockviewbase',
   'harness/views/block/properties/IncrementalSourcePropertiesView'

],

function(BlockViewBase, IncrementalSourcePropertiesView) {

   function IncrementalSourceView(block) {
      this.Block = block;
      this.Base = new BlockViewBase(block);
      this.Base.Properties = new IncrementalSourcePropertiesView(block);
      this.Base.CreateContentMarkup = this.CreateContentMarkup;
   }

   IncrementalSourceView.prototype.Base = null;
   IncrementalSourceView.prototype.Block = null;

   IncrementalSourceView.prototype.CreateContentMarkup = function ()
   {
      return '<div class="block-content">' +
               this.Block.Data +
               '</div>';
   };

   IncrementalSourceView.prototype.Draw = function() {
      var elementContent = $("#" + this.Block.Id + "  .block-content");
      elementContent.html(this.Block.Data);
      var width = elementContent.width(),
      height = elementContent.height(),
      html = '<span style="white-space:nowrap; border: 1px solid blue;"></span>',
      line = elementContent.wrapInner( html ).children()[ 0 ],
      n = 100;

      elementContent.css( 'font-size', n );

      while ( $(line).width() > width || $(line).height() > height) {
         elementContent.css( 'font-size', --n );
      }

      elementContent.text( $(line).text() );
   };

   IncrementalSourceView.prototype.CreateMarkup = function(element)
   {
      this.Base.CreateMarkup(element);
   };

   IncrementalSourceView.prototype.UpdateProperties = function()
   {
      this.Base.Properties.Update();
   };

   return (IncrementalSourceView);
});