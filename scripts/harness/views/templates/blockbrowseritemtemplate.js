export default function(cssClass, blockType, iconPath, friendlyName, blockId) {
	return `
<svg class="chooser_block block_browser_icon_source ${cssClass}" harness-block-type="${blockType}">
  	<use xlink:href="${iconPath}" title="${friendlyName}" harness-block-id="${blockId}">
  		<title>${friendlyName}</title>
  	</use>
</svg>`
}