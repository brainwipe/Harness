let Psom;
export default Psom = `
<p>The <strong>PSOM3</strong> block implements a Plastic Self Organising Map dynamic neural network. The PSOM is a graph neural network, the neurons representing a point in the input space, the links representing the similarity between the neurons. Like <a href="http://en.wikipedia.org/wiki/Self-organizing_map">Kohonen's SOM</a> but a graph of neurons rather than being fixed in a grid.</p>

<p>The PSOM's starting state is three random neurons and two links of random length. The starting state doesn't really matter, it's a substrate for more neurons to grown on. The exact positions of the neurons isn't important, that's just the graph algorithm trying to find a neat way to represent the network (using <a href="http://d3js.org/">d3js</a>).</p>

<p>The PSOM takes a vector on its input and produces the <em>last error</em> as an output. The last error is the euclidean distance between the best-match neuron and the last input pattern (the focus). As the PSOM learns, this value will decrease.</p>`