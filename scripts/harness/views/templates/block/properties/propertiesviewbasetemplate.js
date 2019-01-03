export default function(data) {
	return `
<div class="modal fade ${data.propertiesCssClass}" id="${data.id}">
   	<div class="modal-dialog">
      	<div class="modal-content">
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal">×</button>
				<h3>${data.blockName} Properties</h3>
			</div>
			<div class="modal-body">
				<ul class="nav nav-tabs">
					${data.tabs.map((tab, i) => `
						<li class="${i === 0 ? `active` : ''}">
					 		<a href="#${tab.Id}" data-toggle="tab">${tab.Name}</a>
						 </li>`.trim()).join('')
					}
						 
					${(data.inputsCount > 0) ? `<li><a href="#${data.id}-inputs" data-toggle="tab">Inputs</a></li>` : ``}
					${(data.outputsCount > 0) ? `<li><a href="#${data.id}-outputs" data-toggle="tab">Outputs</a></li>` : ``}
				</ul>

				<div class="tab-content" style="padding-top:15px;">
					${data.tabs.map((tab, i) => `
						<div class="tab-pane" id="${tab.Id}">${tab.Content}</div>
						`.trim()).join('')
					}
					${data.inputsCount > 0 ? `<div class="tab-pane" id="${data.id}-inputs"></div>` : ``}
					${data.outputsCount > 0 ? `<div class="tab-pane" id="${data.id}-outputs"></div>` : ``}
				</div>
			</div>
			<div class="modal-footer">
				<a href="#" data-dismiss="modal" class="btn btn-default">Close</a>
			</div>
		</div>
	</div>
</div>`
}