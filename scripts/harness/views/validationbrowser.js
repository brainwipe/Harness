/*
TODO ROLA - Dependencies to sort out
"harness/harness",
    "harness/views/templaterender",
    "text!harness/views/templates/validationbrowser.html",
    "stringlib"
],
*/
import TemplateRender from "./templaterender.js"
import ValidationBrowserTemplate from "./templates/ValidationBrowserTemplate.js"

export default class {

	constructor() {
		this.MessagesElement = {};
		this.MenuItemElement = {};
		this.MessageCount = 0;
	}
	
	CreateMarkup() {
		$("body").append(new TemplateRender().Render(ValidationBrowserTemplate, {}));
		this.MessagesElement = $('#validationMessages');
		this.MenuItemElement = $('#validationMenuItem');
	}

	Clear() {
		this.MessagesElement.html("");
		this.MessageCount = 0;
		this.MenuItemElement.html('Validation');
		this.MenuItemElement.removeClass('navbar-warning');
	}

	AddMessage(ex) {
		this.MessagesElement.append(`<div class="message"><h3>${ex.Name}</h3>${ex.Message}</div>`);
		this.MessageCount++;
		this.MenuItemElement.html(`Validation (${this.MessageCount})`);
		this.MenuItemElement.addClass('navbar-warning');
	}

	NoErrorsFound() {
		this.MessagesElement.html("<h3>Validated OK!</h3>The model is valid, you can now run the simulation.");
	}

   NoBlocksFound() {
      this.MessagesElement.html("<h3>No blocks</h3> There are no blocks in the model. The simulation needs blocks to run. Use the Blocks menu item to start adding blocks.");
   }
}