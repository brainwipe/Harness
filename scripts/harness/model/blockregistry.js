import ScalarSource from "/scripts/harness/blocks/scalarsource/scalarsource.js"
import ArraySource from "/scripts/harness/blocks/arraysource/arraysource.js"
import ScalarSink from "/scripts/harness/blocks/scalarsink/scalarsink.js"
import PSOMFunc from "/scripts/harness/blocks/psomfunc/psomfunc.js"

export default class {
   constructor()
   {
      this.BlockDefinitions = {
         // TODO ROLA - Put blocks in here
         ArraySource,
         // IncrementalSource,
         PSOMFunc,
         ScalarSource,
         ScalarSink,
         // LineGraphSink,
      }
   }

   CreateBlock(blockFactoryId, harness, viewOffsetLeft, viewOffsetTop) {
      var block = new this.BlockDefinitions[blockFactoryId](harness.GetNextBlockId());

      // TODO ROLA - these lines are factory methods, not a registry concern
      var view = block.CreateView();
      view.CreateMarkup(harness.Element);
      view.Element.offset({
         left: viewOffsetLeft,
         top: viewOffsetTop
      });

      block.Initialise(view);

      harness.AddBlock(block, view);

      view.Draw();

      return {"NewBlock": block, "NewView": view};
   };

   CreateBlockFromJSON(harness, blockJSON) {
      console.log(harness);
      var block = new this.BlockDefinitions[blockJSON.Type.toLowerCase()](harness.GetNextBlockId());

      block.Name = blockJSON.Name;
      block.JSONToData(blockJSON.Data);
      this.CreateInputsFromJSON(block, blockJSON.Sockets.Inputs);
      this.CreateOutputsFromJSON(block, blockJSON.Sockets.Outputs);

      var view = block.CreateView(block);
      view.CreateMarkup(harness.Element);
      view.Element.offset({
         left: blockJSON.View.Left,
         top: blockJSON.View.Top
      });

      view.Element.children(".ui-resizable").width(blockJSON.View.Width);
      view.Element.children(".ui-resizable").height(blockJSON.View.Height);

      block.Initialise(view);

      harness.AddBlock(block, view);

      view.Draw();

      return block;
   }

   CreateInputsFromJSON(block, inputs)
   {
      block.InputsCount = 0;
      block.Inputs = {};

      for(var i in inputs)
      {
         var jsonSocket = inputs[i];
         block.AddInput(block.SocketFactory.FromJSON(jsonSocket));
      }
   }

   CreateOutputsFromJSON(block, outputs)
   {
      block.OutputsCount = 0;
      block.Outputs = {};

      for(var i in outputs)
      {
         var jsonSocket = outputs[i];
         block.AddOutput(block.SocketFactory.FromJSON(jsonSocket));
      }
   }
}