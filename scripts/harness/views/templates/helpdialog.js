let HelpDialog;
export default HelpDialog = `
<div class="col-sm-3 col-sm-offset-9" id="help-dialog" role="dialog">
	<div class="panel panel-info" style="margin-top:80px;">
	  <div class="panel-heading">
	  	<div class="col-sm-1 pull-right">
	  		<span id="help-close" style="cursor:pointer" class="glyphicon glyphicon-remove"></span>
	  	</div>
	 	<h3 class="panel-title pull-right" id="help-count"></h3>
	    <h3 class="panel-title" id="help-title"></h3>
	  </div>
	  <div class="panel-body" id="help-body">
	  </div>
	  <div class="panel-footer" id="help-footer">
	  <div class="btn-group pull-left">
	  		<button id="help-previous" type="button" class="btn btn-default" disabled="disabled">Previous</button>
	  	</div>

	  	<div class="btn-group pull-right">
	  		<button id="help-next" type="button" class="btn btn-default">Next</button>
	  	</div>
	  	<div class="clearfix"></div>	
	  </div>
	</div>
</div>`