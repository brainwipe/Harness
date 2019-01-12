export class D3Node {
    constructor(myNeuronId) {
        this.neuronId = myNeuronId;
        this.x = null;
        this.y = null;
        this.neuronId = -1;
    }
}

export class D3Link {
    constructor(mysource, mytarget, myweight) {
        this.source = mysource;
        this.target = mytarget;
        this.SetLength(myweight);
        this.LongestLinkLength = 100;
    }

    SetLength (newLength) {
        this.value = newLength * this.LongestLinkLength;
        return this.value;
    }
}