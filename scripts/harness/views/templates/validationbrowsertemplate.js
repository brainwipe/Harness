let ValidationBrowserTemplate;
export default ValidationBrowserTemplate = `
<div class="modal fade" id="validationModal" role="dialog">
   <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
            <button class="close" data-dismiss="modal">×</button>
                <h3>Validation Messages</h3>
        </div>
        <div class="modal-body">
            <div id="validationMessages">
                <h3>No blocks</h3> There are no blocks in the model. The simulation needs blocks to run. Use the Blocks menu item to start adding blocks.
            </div>
        </div>
        <div class="modal-footer">
            <a href="#" data-dismiss="modal" class="btn btn-default">Close</a>
        </div>
    </div>
    </div>
</div>
`;