export default function(propertiesid, properties) {
	return `
<form class="form-horizontal properties-generic">
   ${Object.keys(properties).map((key) => `
      <div class="form-group has-feedback">
         <label class="control-label col-sm-6">
            ${properties[key].text}
         </label>
         <div class="col-sm-6">
            <div class="input-group">
               <div style="position:relative">
                  <input class="form-control" id="${propertiesid}-${key}-value" type="text" value="${properties[key].value}"/>
               </div>
               <div class="input-group-btn">
                  <button class="btn btn-default dropdown-toggle" data-toggle="dropdown">
                     <span class="caret"></span>
                  </button>
                  <ul class="dropdown-menu">
                     <li><a href="#" class="make-input-socket" data-properties-id="${propertiesid}" data-property-id="${key}">Make input socket
                     ${(properties[key].socket == "InputSocket") ? `<span class="glyphicon glyphicon-ok"></span>` : ``}
                     </a></li>
                     <li><a href="#" class="make-output-socket" data-properties-id="${propertiesid}" data-property-id="${key}">Make output socket
                     ${(properties[key].socket == "OutputSocket") ? `<span class="glyphicon glyphicon-ok"></span>` : ``}
                     </a></li>
                  </ul>
               </div>
            </div>
         </div>
      </div>`.trim()).join('')}
</form>`
}