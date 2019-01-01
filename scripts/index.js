import HarnessFactory from "./harness/harnessfactory.js"
import BlockBrowser from "./harness/views/blockbrowser.js"
import * as jQuery from "/vendor/jquery/jquery-3.3.1.min.js"

let harness = HarnessFactory.Build($("#harness"));
console.log(harness.Name);

let blockbrowser = new BlockBrowser(harness);
blockbrowser.CreateMarkup();
blockbrowser.GetBlocks();