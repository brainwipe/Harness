let SecondTick;
export default SecondTick = `
<p>Let's run the simulation for another single tick. Click the step button in the top right again:
	<a class="btn btn-default" href="#" title="Step the simulation once" >
		<i class="glyphicon glyphicon-step-forward"></i>
	</a>
</p>

<p><strong>ArraySource1</strong> has now given the next input pattern, a new class, to the PSOM: <code>1: [0,1,0]</code>.</p>

<p><strong>PSOM3</strong> has created some new neurons (probably) and then linked it to two other neurons. You <em>might see</em> that it's free floating (no links) or that it only has one. This is because the PSOM prunes links that are too long and it does this even to new neurons.</p>

<p><strong>ScalarSink2</strong> is showing a big error still. Big errors from the PSOM mean that it's seeing something for the first time.</p>`