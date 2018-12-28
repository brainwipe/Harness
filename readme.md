[![Build Status](https://travis-ci.org/brainwipe/Harness.svg?branch=master)](https://travis-ci.org/brainwipe/Harness)

Harness
=======
Harness is a browser based toolbox playground for neural networks, currently in development. The user drags and drops computational blocks onto a workspace and then connects them together to move data between blocks. The simulation can be run to see data moving around the model.

How to get Harness running
------------------

- Download the source
- Open Powershell, navigate to the repository root
- `.\Start-Webserver.ps1`
- If warned about script execution, use `[R]` to run once.
- Surf to localhost:8080/index.html

If you have your own webserver then you can just point a virtual host or virtual directory at the repo root; it's only html and js.

What's here so far
-----------------

The harness is a work in progress but it is possible to do some experimentation as is.

### Sources

- Scalar Souce (puts single value onto a single output)
- Incremental Souce (puts single value onto a single output and with each step will increment that value by one. Useful for simulation timers)
- Array Source (holds an array of values, each step of the simulation, the values are )

### Functions-
Plastic Self Organising Map Neural Network

### Sinks

- Scalar Sink

### Other features

- You can load and save models against the local storage.
- You can export and import models as JSON
- You can set the simulation to run

A brief guide to using the harness
----------------------------------
A soure provides data, a sink collects it. All you can do is add simple scalar (single value) sources and sinks to the harness. A source has outputs, which are on the right hand side of the block. A sink has inputs, which are on the left hand side of the block. You join two blocks together by dragging an output onto an input. This makes a connection. You can delete the connection by hovering over it (it turns red) and pressing 'delete'. A function block has inputs and outputs. On the top right of the screen are the simulation controls, which are play, stop and step.

When the simulation is stepped, the blocks runs some code and put the result of that code onto the output. If the block has inputs then it uses those inputs to do a task and change what goes onto the output.

Running unit tests with grunt
-----------------
To run the unit test (via jasmine), ensure you have [nodejs](http://nodejs.org/) and [grunt](http://gruntjs.com/) installed then navigate to the harness root folder and type:

    grunt jasmine