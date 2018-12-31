import HarnessFactory from "./harness/harnessfactory.js"
import * as jQuery from "/vendor/jquery/jquery-3.3.1.min.js"

console.log($("#harness"));

let harness = HarnessFactory.Build($("#harness"));
console.log(harness.Name);