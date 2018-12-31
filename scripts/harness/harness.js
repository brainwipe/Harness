export default class {
	constructor(containerElement, blockRegistry, engine)
	{
		this.Name = "Model " + new Date().getTime();
		this.Element = containerElement;

		this.Blocks = []
		this.Views = []
		// TODO ROLA - Extract, Harness doesn't need the registry, only blocks once created
		this.BlockRegistry = blockRegistry;
		this.Engine = engine;
		this.ValidationEngine = {}

		this.IsRunning = false;
		this.NextBlockIdNumber = 0;
		this.TickRunWait = 10;
	}

	GetNextBlockId() {
		return ++this.NextBlockIdNumber;
	}

	GetBlockFromAnyId(elementId) {
		var parts = elementId.split('-');
		var blockId = parts[0];

		if (!this.Blocks.hasOwnProperty(blockId))
		{
			throw "Block with the id '" + blockId + "' in the elementId '" + elementId + "' could not be found.";
		}

		return this.Blocks[blockId];
	}

	GetBlockViewFromAnyId(elementId) {
		var block = this.GetBlockFromAnyId(elementId);
		if (block === null) { return null; }
		return this.Views[block.Id];
	}

	Reset() {
		this.Painter.Reset();
		this.Blocks = this.Blocks.map(b => this.DeleteBlock(b));
		this.NextBlockIdNumber = 0;
		this.Name = "Model " + new Date().getTime();
	}

	AddBlock(block, view) {
		this.Views[block.Id] = view;
		this.Blocks[block.Id] = block;
		this.Validate();
		this.Painter.Repaint();
		return block;
	}

	DeleteBlock(blockId) {
		this.Views[blockId].Remove();
		delete this.Views[blockId];

		this.Painter.DeleteConnections(this.Blocks[blockId].Inputs, this.Blocks[blockId].Outputs);
		this.Blocks[blockId].DeleteConnections();
		delete this.Blocks[blockId];
		this.Validate();
	}

	ConnectSockets (outputSocketId, inputSocketId)	{
		var outputInfo = this.GetBlockAndOutputSocketFromId(outputSocketId);
		var inputInfo = this.GetBlockAndInputSocketFromId(inputSocketId);
		var connector;
		try
		{
			connector = outputInfo.Socket.Connect(inputInfo.Socket);
		}
		catch (message)
		{
			notify.Info("Could not connect blocks", message);
		}

		this.Validate();
		return connector;
	}

	GetBlockAndInputSocketFromId(fullyQualifiedSocketId) {
		var block = this.GetBlockFromAnyId(fullyQualifiedSocketId);
		var parts = fullyQualifiedSocketId.split('-');
		return { "Block" : block, "Socket" : block.Inputs[parts[3]] }
	}

	GetBlockAndOutputSocketFromId(fullyQualifiedSocketId) {
		var block = this.GetBlockFromAnyId(fullyQualifiedSocketId);
		var parts = fullyQualifiedSocketId.split('-');
		return { "Block" : block, "Socket" : block.Outputs[parts[3]] }
	}

	RemoveConnector(outputSocketId, inputSocketId) {

		var outputInfo = this.GetBlockAndOutputSocketFromId(outputSocketId);
		var inputInfo = this.GetBlockAndInputSocketFromId(inputSocketId);

		outputInfo.Socket.Disconnect(inputInfo.Socket.Id);
		inputInfo.Socket.Disconnect(outputInfo.Socket.Id);
		
		this.Validate();
	}

	BlockIds() {
		var ids = [];
		var blocks = this.Blocks;
		for(var id in blocks)
		{
			if(blocks.hasOwnProperty(id)) {
				ids.push(id);
			}
		}
		return ids;
	}

	Validate() {
		return this.ValidationEngine.Validate(this.Blocks);
	}

	Tick() {
		this.Engine.Tick(this.BlockIds(), this.Blocks);
		this.Painter.RedrawBlocks(this.Blocks, this.Views);
	}

	TickAndContinue ()	{
		this.Tick();
		if (this.IsRunning) {
			setTimeout(this.TickAndContinue.bind(this),	this.TickRunWait);
		}
	}

	Start() {
		this.IsRunning = true;
		this.TickAndContinue();
	}
	
	Stop() {
		this.IsRunning = false;
	}

}
