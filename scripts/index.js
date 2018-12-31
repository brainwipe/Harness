import HarnessFactory from "./harness/harnessfactory.js"

let container = document.getElementById("harness");
let harness = HarnessFactory.Build(container);
console.log(harness.Name);