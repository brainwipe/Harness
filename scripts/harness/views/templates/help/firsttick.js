let FirstTick;
export default FirstTick = `
<p>Let's run the simulation for a single tick. Click the step button in the top right

<a class="btn btn-default" href="#" title="Step the simulation once" >
	<i class="glyphicon glyphicon-step-forward"></i>
</a>

</p>

<p><strong>Things happened!</strong></p>

<p><strong>ArraySource1</strong> is now showing <code>0 : [0,0,1]</code>. The first number is the current array index <code>0 :</code> and the vector <code>[0,0,1]</code> is the input that has been shown to the PSOM. </p>

<p><strong>PSOM3</strong> has grown a cluster of three new neurons, connected them in a triangle and connected them to the original three neurons - probably. The random starting neurons of the PSOM may have had a neuron close enough to <code>[0,0,1]</code> that it didn't need to make new neurons.</p>

<p><strong>ScalarSink2</strong> is showing the PSOM's last error, which is always between 0 and 1. If it made neurons, it's probably larger than 0.3. That's big in PSOM terms, we want that to be less than 0.01.</p>`