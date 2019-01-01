let BlockBrowserTemplate;
export default BlockBrowserTemplate = `
<div class="modal fade noselect" id="blocksModal" role="dialog">
   <div class="modal-dialog">
      <div class="modal-content">
         <div class="modal-header">
            <button class="close" data-dismiss="modal">&times;</button>
            <h3 class="modal-title">Block Browser</h3>
         </div>
         <div class="modal-body">
            <ul id="blockTypeList" class="nav nav-tabs">
               <li class="active"><a href="#sources" data-toggle="tab">Sources</a></li>
               <li><a href="#sinks" data-toggle="tab">Sinks</a></li>
               <li><a href="#functions" data-toggle="tab">Functions</a></li>
            </ul>
            <div class="tab-content">
               <div id="sources" class="chooser_blocklist tab-pane active"></div>
               <div id="sinks" class="chooser_blocklist tab-pane"></div>
               <div id="functions" class="chooser_blocklist tab-pane"></div>
            </div>
            <div class="clearfix"></div>
         </div>
         <div class="modal-footer">
            <a href="#" data-dismiss="modal" class="btn btn-default">Close</a>
         </div>
      </div>
   </div>
</div>`