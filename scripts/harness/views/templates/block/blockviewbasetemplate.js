export default function(data) {
return `
<div title="${data.blockName}" class="block noselect ${data.blockClass}" id="${data.blockId}">
	<div class="block_resizable" style="width:${data.defaultWidth}px; height:${data.defaultHeight}px;">${data.contentMarkup}</div>
	<div class="options bg-info">${data.blockId}</div>
</div>`
}