let LetItRun;
export default LetItRun = `
<p>Let's run the simulation on automatic by pressing the play button:
	<a class="btn btn-primary" href="#" title="Start the simulation" >
		<i class="glyphicon glyphicon-play"></i>
	</a>
	You can stop at any time with the stop button.
</p>


<p><strong>ArraySource1</strong> will loop round its three classes, presenting each to the PSOM in turn.</p>

<p><strong>PSOM3</strong> will initially grow to accept the last new class it hasn't seen yet. Over time it will push dissimilar neurons apart and break long links. Neurons without any links are removed. Eventually, you should have three tight neuron clusters floating in the middle.</p>

<p><strong>ScalarSink2</strong> will still be showing the last error, probably below 0.01.</p>`