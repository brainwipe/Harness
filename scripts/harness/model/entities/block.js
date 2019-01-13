import ValidationException from "/scripts/harness/validationexception.js"
import SocketFactory from "/scripts/harness/model/socketfactory.js"

export default class {
    constructor(sequenceIdNumber, name) {
        this.SocketFactory = new SocketFactory();

        this.Id = name.replace(/ /g, '') + sequenceIdNumber;
        this.Inputs = {}
        this.Outputs = {}
        this.Data = {}
        this.Completed = false;
        this.InputsCount = 0;
        this.OutputsCount = 0;
    }

    Execute() {
        throw new Error('Not implemented!')
    }

    Reset() {
        throw new Error('Not implemented!')
    }

    Validate() {
        throw new Error('Not implemented!')
    }

    Initialise(view) {}

    AddInput(inputSocket) {
        if (this.Inputs.hasOwnProperty(inputSocket.Id)) {
            throw "Cannot create input socket, it already exists.";
        }

        this.InputsCount++;
        this.Inputs[inputSocket.Id] = inputSocket;
    }

    AddOutput(outputSocket) {
        if (this.Outputs.hasOwnProperty(outputSocket.Id)) {
            throw "Cannot create output socket, it already exists.";
        }

        this.OutputsCount++;
        this.Outputs[outputSocket.Id] = outputSocket;
    }

    ValidateRequiredInputs() {
        for (var i in this.Inputs) {
            var input = this.Inputs[i];

            if (input.IsRequired === true &&
                input.HasConnectors() === false) {
                throw new ValidationException(`Block ${this.Id} requires an input`,
                    `The block called '${this.Id}' of type '${this.Name}' has an input called '${input.Name}',
                    which is a required input. This means it needs an input connector. Connect this input to an output of another block or remove this block altogether`);
            }
        }
        return true;
    }

    ExecuteAll() {
        for (var i in this.Inputs) {
            var input = this.Inputs[i];
            if (input.IsDataSocket === true) {
                this.Data.configuration[input.DataSocketPropertyId] = input.Data;
            }
        }

        for (var i in this.Outputs) {
            var output = this.Outputs[i];
            if (output.IsDataSocket === true) {
                output.Data = this.Data.configuration[output.DataSocketPropertyId];
            }
        }

        this.Execute();
    }

    GetAllSockets() {
        return $.extend({}, this.Inputs, this.Outputs);
    }

    DeleteInput(inputSocket) {
        this.Inputs = this.DeleteSocket(this.Inputs, inputSocket);
        this.InputsCount--;
    }

    DeleteOutput(outputSocket) {
        this.Outputs = this.DeleteSocket(this.Outputs, outputSocket);
        this.OutputsCount--;
    }

    DeleteSocket(socketArray, socket) {
        if (socket == null || socket.CanBeDeleted === false) {
            return socketArray;
        }

        if (socket.HasConnectors() === true) {
            socket.DeleteConnections();
        }

        delete socketArray[socket.Id];
        return socketArray;
    }

    DeleteConnections() {
        var sockets = this.GetAllSockets();
        for (var i in sockets) {
            var socket = sockets[i];
            if (socket.HasConnectors() === true) {
                socket.DeleteConnections();
            }
        }
    }

    DataToJSON() {
        return JSON.stringify(this.Data);
    }

    JSONToData(jsonData) {
        this.Data = jsonData;
    }

    DeleteDataSocketByPropertyId(propertyId) {
        var sockets = this.GetAllSockets();
        for (var i in sockets) {
            var socket = sockets[i];
            if (socket.IsDataSocket === true && socket.DataSocketPropertyId == propertyId) {
                var socketQualifiedId = socket.QualifiedId();
                if (socket.IsInputSocket) {
                    this.DeleteInput(socket);
                } else {
                    this.DeleteOutput(socket);
                }
                return socketQualifiedId;
            }
        }
        return null;
    }

    GetDataSockets() {
        var dataSockets = [];

        var sockets = this.GetAllSockets();
        for (var i in sockets) {
            var socket = sockets[i];
            if (socket.IsDataSocket === true) {
                if (socket.IsInputSocket) {
                    dataSockets[socket.DataSocketPropertyId] = "InputSocket";
                } else {
                    dataSockets[output.DataSocketPropertyId] = "OutputSocket";
                }

            }
        }
        return dataSockets;
    }

}