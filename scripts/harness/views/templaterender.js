import * as underscore from "/vendor/underscore/underscore-min.js"

export default class 
{
   constructor() {
      _.templateSettings = {
         evaluate:    /\{\{#([\s\S]+?)\}\}/g,            // {{# console.log("blah") }}
         escape:      /\{\{\{(\s*(\w|\.)+?\s*)\}\}\}/g,         // {{{ title }}}
         interpolate: /\{\{(\s*(\w|\.)+?\s*)\}\}(?!\})/g  // {{ title }}
      };
   }

   Render(template, data) {
      return _.template(template, data);
   }
}