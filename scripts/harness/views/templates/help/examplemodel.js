let ExampleModel;
export default ExampleModel = `
<p>On the left, you see an example model made up of three blocks. A block is either a <em>source</em> of data (has only outputs), a <em>sink</em> of data (has only an input) or a <em>function</em> (has inputs and outputs). With each tick of the simulation, data flows from left to right along the grey lines that connect the outputs and inputs. The simulation has not run yet, so we are looking at initial values.</p>

<p>The example model's three blocks (from left to right) are an Array Source, Plastic Self Organising Map (PSOM) Function and a Scalar Sink. We'll start with the Array Source and Scalar Sink.</p>

<p>In this example, the <strong>ArraySource1</strong> contains a three dimensional data set with three classes. <em>Click ArraySource1's title</em> to see the properties window and data. On each tick, the ArraySource will increment the Current Index and give the associated three dimensional vector to the Plastic Self Organising Map (PSOM). There are only three rows in the array, each representing a point in the input space.</p>

<p><strong>ScalarSink2</strong> displays the numbers it is given. When the simulation runs, it will show the last error for the PSOM.`