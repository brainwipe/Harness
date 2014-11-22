define(
[
   "jquery",
   "mock/harnessmockfactory",
   "harness/model/socketfactory",
   "harness/model/entities/socket",
   "harness/model/entities/sockettype",
   "harness/blocks/arraysource/arraysource",
   "harness/blocks/scalarsink/scalarsink",
   "harness/blocks/scalarsource/scalarsource",
   "harness/validationexception",
   "harness/views/validationbrowser",
   "harness/views/notify",
   "stringlib"
],
function($,
   HarnessMockFactory,
   SocketFactory,
   Socket,
   SocketType,
   ArraySourceBlock,
   ScalarSinkBlock,
   ScalarSourceBlock,
   ValidationException,
   ValidationBrowser,
   Notify)
{
   describe("Blocks, Sockets and Connections", function () {
      var harness = null;
      var scalarsink = null;
      var scalarsinktwo = null;
      var scalarsinkviewtwo = null;
      var scalarsource = null;
      var scalarsourcetwo = null;
      var scalarsourceviewtwo = null;
      var socketFactory = new SocketFactory();

      beforeEach(function () {
         var harnessFactory = new HarnessMockFactory();

         harness = harnessFactory.Build($("#harnessContainer"));
         scalarsink = new ScalarSinkBlock(1);
         scalarsinkview = scalarsink.GetView();

         scalarsinktwo = new ScalarSinkBlock(2);
         scalarsinkviewtwo = scalarsink.GetView();

         scalarsource = new ScalarSourceBlock(3);
         scalarsourceview = scalarsource.GetView();

         scalarsourcetwo = new ScalarSourceBlock(4);
         scalarsourceviewtwo = scalarsource.GetView();
      });

      it('can create a scalar sink builder', function() {
         expect(scalarsink).toBeDefined();
      });

      it('has a block id that is a shortened version of the block friendly name', function() {
         expect(scalarsink.Id).toEqual("ScalarSink1");
      });

      it('can create an input socket that is required', function() {
         var inputSocket = scalarsink.Inputs.Value;
         expect(inputSocket.IsInputSocket).toEqual(true);
         expect(inputSocket.IsRequired).toEqual(true);
      });

      it('can create an input socket that is not required', function() {

         var context = socketFactory.GetExampleContext();
         context.BlockId = scalarsink.Id;
         context.Name = "TestSocket";
         context.IsRequired = false;

         var newSocket = socketFactory.FromContext(context);
         scalarsink.AddInput(newSocket);
         newSocket = scalarsink.Inputs.TestSocket;

         expect(newSocket.IsInputSocket).toEqual(true);
         expect(newSocket.IsRequired).toEqual(false);
      });

      it('can create an output socket', function() {
         var outputSocket = scalarsource.Outputs.Value;
         expect(outputSocket).toBeDefined();
         expect(outputSocket.Name).toEqual('Value');
      });

      it('can create a new output socket, even on an sink block', function() {

         // Arrange
         var newSocketContext = {
            BlockId : scalarsink.Id,
            Name : "MyNewSocket",
            Type : new SocketType().BuildAny(),
            IsInputSocket : false,
            CanBeDeleted : true,
            IsMultiple : false,
            IsRequired : false
         };

         var newSocket = socketFactory.FromContext(newSocketContext);

         // Act
         scalarsink.AddOutput(newSocket);

         // Assert
         expect(scalarsink.Outputs["MyNewSocket"]).toBeDefined();
      });

      it('can identify that there are no connections on a socket', function () {
         var outputSocket = scalarsource.Outputs.Value;
         expect(outputSocket.HasConnectors()).toEqual(false);
      });

      it('can connect two sockets together without using the harness (at low level)', function() {
         // Arrange
         var outputSocket = scalarsource.Outputs.Value;
         var inputSocket = scalarsink.Inputs.Value;

         // Act
         var connector = outputSocket.Connect(inputSocket);

         // Assert
         expect(outputSocket.Connectors[0]).toEqual(connector);
         expect(inputSocket.Connectors[0]).toEqual(connector);
      });

      it('throws an exception if you try and connect a input to an output. connections may only go from outputs to inputs.', function() {
         var outputSocket = scalarsource.Outputs.Value;
         var inputSocket = scalarsink.Inputs.Value;

         expect(function(){inputSocket.Connect(outputSocket);}).toThrow('You can only connect an output socket to an input socket, not the other way around');
      });

      it('throws an exception if you try and connect an output to itself', function() {
         var outputSocket = scalarsource.Outputs.Value;
         expect(function() {outputSocket.Connect(outputSocket);}).toThrow('You may not connect a socket to itself.');
      });

      it('can disconnect a socket', function() {
         // Arrange
         var outputSocket = scalarsource.Outputs.Value;
         var inputSocket = scalarsink.Inputs.Value;

         var connector = outputSocket.Connect(inputSocket);

         expect(outputSocket.Connectors[0]).toEqual(connector);
         expect(inputSocket.Connectors[0]).toEqual(connector);

         // Act
         expect(inputSocket.Disconnect(connector)).toEqual(true);

         // Assert
         expect(outputSocket.Connectors[0]).toEqual(connector);
         expect(inputSocket.Connectors.length).toEqual(0);
      });

      it('will throw an exception if you try and disconnect a connector that does not exist', function() {

         // Arrange
         var outputSocket = scalarsource.Outputs.Value;
         var inputSocket = scalarsink.Inputs.Value;
         var connector = outputSocket.Connect(inputSocket);

         expect(outputSocket.Connectors[0]).toEqual(connector);
         expect(inputSocket.Connectors[0]).toEqual(connector);
         expect(inputSocket.Disconnect(connector)).toEqual(true);

         // Act and Assert
         expect(function() {inputSocket.Disconnect(connector);}).toThrow('This connector is not connected to this socket and cannot be disconnected');
      });

      it('can tell you that it has connections', function() {
         // Arrange
         var outputSocket = scalarsource.Outputs.Value;
         var inputSocket = scalarsink.Inputs.Value;

         var connector = outputSocket.Connect(inputSocket);

         // Act and Assert
         expect(outputSocket.HasConnectors()).toEqual(true);
      });

      it('can delete all connections on a socket, removing the connectors from other sockets too', function() {
         // Arrange
         var outputSocket = scalarsource.Outputs.Value;
         var inputSocket = scalarsink.Inputs.Value;
         var inputSocketTwo = scalarsinktwo.Inputs.Value;

         outputSocket.Connect(inputSocket);
         outputSocket.Connect(inputSocketTwo);

         // Act
         outputSocket.DeleteConnections();

         // Assert
         expect(outputSocket.HasConnectors()).toEqual(false);
         expect(inputSocket.HasConnectors()).toEqual(false);
         expect(inputSocketTwo.HasConnectors()).toEqual(false);
      });

      it('will validate correctly if a required input has a connection', function() {
         // Arrange
         var outputSocket = scalarsource.Outputs.Value;
         var inputSocket = scalarsink.Inputs.Value;

         var connector = outputSocket.Connect(inputSocket);

         // Act
         var isValid = scalarsink.ValidateRequiredInputs();

         // Assert
         expect(isValid).toEqual(true);
      });

      it('will get a block given the long id of a sub control', function() {
         // Arrange
         var scalarSinkView = scalarsink.GetView()
         harness.AddBlock(scalarsink, scalarSinkView);

         // Act
         var sinkBlock = harness.GetBlockFromAnyId("ScalarSink1-properties-some-property");

         // Assert
         expect(sinkBlock.Id).toEqual("ScalarSink1");
      });

      it('will throw an exception if you try to connect sockets with different types', function() {
         // Arrange
         var arraySource = new ArraySourceBlock(5);

         var outputSocket = arraySource.Outputs.Vector;
         var inputSocket = scalarsink.Inputs.Value;

         // Act and Assert
         expect(function() {outputSocket.Connect(inputSocket);}).toThrow('You are trying to connect a socket of type Harness.Socket.Type.Scalar to a socket of type Harness.Socket.Type.Vector. Socket types must be compatible.');
      });

      it('will throw an exception if you try and connect an non-multiple input to more than one output', function() {
         // Arrange
         var outputSocketOne = scalarsource.Outputs.Value;
         var outputSocketTwo = scalarsourcetwo.Outputs.Value;
         var inputSocket = scalarsink.Inputs.Value;

         outputSocketOne.Connect(inputSocket);

         // Act and Assert
         expect(function() {outputSocketTwo.Connect(inputSocket);}).toThrow('This input socket can only accept one connector, which it already has.');
      });

      it('can delete all connections on a block, removing the connectors from other sockets too', function() {
         // Arrange
         var outputSocket = scalarsource.Outputs.Value;
         var inputSocket = scalarsink.Inputs.Value;
         var inputSocketTwo = scalarsinktwo.Inputs.Value;

         outputSocket.Connect(inputSocket);
         outputSocket.Connect(inputSocketTwo);

         // Act
         scalarsource.DeleteConnections();

         // Assert
         expect(outputSocket.HasConnectors()).toEqual(false);
         expect(inputSocket.HasConnectors()).toEqual(false);
         expect(inputSocketTwo.HasConnectors()).toEqual(false);
      });

      it ('cannot delete a socket that is marked as CannotDelete', function () {
         // Act
         scalarsink.DeleteInput(scalarsink.Inputs.Value);

         // Assert
         expect(scalarsink.Inputs.Value).toBeDefined();
      });

      it ('can delete a socket added post-build', function () {
         // Arrange
         var newSocketContext = {
            BlockId : scalarsink.Id,
            Name : "DeleteThisSocket",
            Type : new SocketType().BuildAny(),
            IsInputSocket : true,
            CanBeDeleted : true,
            IsMultiple : false,
            IsRequired : true
         };

         var newSocket = socketFactory.FromContext(newSocketContext);
         scalarsink.AddInput(newSocket);

         // Act
         scalarsink.DeleteInput(scalarsink.Inputs.DeleteThisSocket);

         // Assert
         expect(scalarsink.Inputs.DeleteThisSocket).toBeUndefined();
      });

      it ('can delete all connections when a socket is deleted', function () {

         // Arrange
         var newSocketContext = {
            BlockId : scalarsink.Id,
            Name : "DeleteThisSocket",
            Type : new SocketType().BuildScalar(),
            IsInputSocket : true,
            CanBeDeleted : true,
            IsMultiple : false,
            IsRequired : true
         };

         var newSocket = socketFactory.FromContext(newSocketContext);
         scalarsink.AddInput(newSocket);

         var outputSocket = scalarsource.Outputs.Value;
         var inputSocket = scalarsink.Inputs.Value;
         var inputSocketTwo = scalarsink.Inputs.DeleteThisSocket;

         outputSocket.Connect(inputSocket);
         outputSocket.Connect(inputSocketTwo);

         // Act
         scalarsink.DeleteInput(scalarsink.Inputs.DeleteThisSocket);

         // Assert
         expect(outputSocket.HasConnectors()).toEqual(true);
         expect(inputSocket.HasConnectors()).toEqual(true);
         expect(outputSocket.Connectors.length).toEqual(1);
      });

      it ('can get all input and output sockets together in one list', function() {

         // Arrange
         var newSocketContext = {
            BlockId : scalarsink.Id,
            Name : "NewOutputSocket",
            Type : new SocketType().BuildScalar(),
            IsInputSocket : false,
            CanBeDeleted : true,
            IsMultiple : false,
            IsRequired : false
         };

         var newSocket = socketFactory.FromContext(newSocketContext);
         scalarsink.AddOutput(newSocket);

         // Act
         var allSockets = scalarsink.GetAllSockets();

         // Assert
         expect(allSockets["NewOutputSocket"]).toBeDefined();
         expect(allSockets["Value"]).toBeDefined();
      });

      it ('can delete an input data socket by its property id', function() {

         // Arrange
         scalarsink.Data = {
            configurationtext : [] };
         scalarsink.Data.configurationtext["TheDataPropertyId"] = "TheDataProperty Text";

         var newDataSocket = socketFactory.InputFromData(scalarsink, "TheDataPropertyId");
         scalarsink.AddInput(newDataSocket);
         var originalQualifiedId = newDataSocket.QualifiedId();

         // Act
         var qualifiedId = scalarsink.DeleteDataSocketByPropertyId("TheDataPropertyId");

         // Assert
         expect(scalarsink.Inputs["TheDataPropertyId"]).not.toBeDefined();
         expect(qualifiedId).toEqual(originalQualifiedId);
      });

      it ('can delete an output data socket by its property id', function() {

         // Arrange
         scalarsink.Data = {
            configurationtext : [] };
         scalarsink.Data.configurationtext["TheDataPropertyId"] = "TheDataProperty Text";

         var newDataSocket = socketFactory.OutputFromData(scalarsink, "TheDataPropertyId");
         scalarsink.AddOutput(newDataSocket);
         var originalQualifiedId = newDataSocket.QualifiedId();

         // Act
         var qualifiedId = scalarsink.DeleteDataSocketByPropertyId("TheDataPropertyId");

         // Assert
         expect(scalarsink.Inputs["TheDataPropertyId"]).not.toBeDefined();
         expect(qualifiedId).toEqual(originalQualifiedId);
      });

      it ('can give a list of the data sockets', function() {
         
         // Arrange 
         scalarsink.Data = {
            configurationtext : [] };
         scalarsink.Data.configurationtext["TheDataPropertyId"] = "TheDataProperty Text";

         var newDataSocket = socketFactory.InputFromData(scalarsink, "TheDataPropertyId");
         scalarsink.AddInput(newDataSocket);

         // Act
         var dataSocketsOnly = scalarsink.GetDataSockets();

         // Assert
         expect(dataSocketsOnly["TheDataPropertyId"]).toBeDefined();
      });

   });
});