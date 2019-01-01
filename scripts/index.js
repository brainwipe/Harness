import HarnessFactory from "./harness/harnessfactory.js"
import BlockBrowser from "./harness/views/blockbrowser.js"
import Welcome from "./harness/views/welcome.js"
import HelpDialog from "./harness/views/helpdialog.js"
import * as jQuery from "/vendor/jquery/jquery-3.3.1.min.js"

// TODO ROLA - this is a workaround for jquery's droppable event handler being unable
// to accept data like any other event
window.harness = HarnessFactory.Build($("#harness"));

let blockbrowser = new BlockBrowser(window.harness);
blockbrowser.CreateMarkup();
blockbrowser.GetBlocks();

var helpdialog = new HelpDialog(window.harness);
helpdialog.CreateMarkup();

var welcome = new Welcome(helpdialog);
welcome.CreateMarkup();