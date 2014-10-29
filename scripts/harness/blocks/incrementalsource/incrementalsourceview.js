define(
[
   'harness/views/block/BlockViewBase',
   'harness/blocks/incrementalsource/IncrementalSourcePropertiesView'
],

function(BlockViewBase, IncrementalSourcePropertiesView) {

   function IncrementalSourceView(block) {
      BlockViewBase.call(this, block);
      this.Properties = new IncrementalSourcePropertiesView(block);
   }

   IncrementalSourceView.prototype = Object.create( BlockViewBase.prototype );
   IncrementalSourceView.prototype.constructor = IncrementalSourceView;

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

   return (IncrementalSourceView);
});