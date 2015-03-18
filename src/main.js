var N_NODES = process.argv[2];



var NetworkSimulator = require('../lib/netsim/src/NetworkSimulator'),
    topology = require('./topology'),
    paxos = require('./paxos');

var netsim = new NetworkSimulator(topology);

nodes = [];



for(var i = 1; i <= N_NODES; i++) {
    nodes.push('node' + i);
}

console.log(nodes);

var proposer = {uuid: 'node' + 1,
		onStart: function() {
		    this.paxos.sendPrepare.call(this);
		},
		onMessageReceived: function(id, message) {
		    console.log("\n---------RECEIVED: " + this.uuid + " SENDER: " + message.sender +
				"\n " + "type: " + message.type + "---------\n");
		    this.paxos.handle.call(this, id, message);
		},
	       };
proposer.paxos = paxos.Paxos(nodes, 'node4');
proposer.promiseSequenceNumber = 0;
proposer.oldPromiseNumber = 0;
proposer.activePromises = {};
proposer.acceptors = [];
proposer.acceptReqSeqNumber = 0;
netsim.addNode(proposer);

for(var i = 2; i <= N_NODES; i++) {
    var node = {uuid: 'node' + i,
		onStart: function() {
		},
		onMessageReceived: function(id, message) {
		    console.log("\n---------RECEIVED: " + this.uuid + " SENDER: " + message.sender +
				"\n " + "type: " + message.type + "---------\n");
		    this.paxos.handle.call(this, id, message);
		},
	       };
    node.paxos = paxos.Paxos(nodes, 'node4');
    node.promiseSequenceNumber = 0;
    node.oldPromiseNumber = 0;
    node.activePromises = {};
    node.acceptors = [];
    node.acceptReqSeqNumber = 0;
    netsim.addNode(node);
}

/*
  var node1 = {uuid: 'node1',
  onStart: function() {
  this.paxos.sendPrepare.call(this);
  },
  onMessageReceived: function(id, message) {
  console.log("\n---------RECEIVED: " + this.uuid + " SENDER: " + message.sender +
  "\n " + "type: " + message.type + "---------\n");
  this.paxos.handle.call(this, id, message);
  },
  };




  var node2 = {uuid: 'node2',
  onMessageReceived: function(id, message) {
  console.log("\n---------RECEIVED: " + this.uuid + " SENDER: " + message.sender +
  "\n " + "type: " + message.type + "---------\n");
  //		 console.log("ID: " + id + "\n " + "type: " + message.type);
  this.paxos.handle.call(this, id, message);
  }
  };

  node2.promiseSequenceNumber = 0;
  node2.oldPromiseNumber = 0;
  node2.activePromises = {};
  node2.acceptors = [];

  node2.paxos = paxos.Paxos(nodes, 'node4');
  var node3 = {uuid: 'node3',
  onMessageReceived: function(id, message) {
  console.log("\n---------RECEIVED: " + this.uuid + " SENDER: " + message.sender +
  "\n " + "type: " + message.type + "---------\n");
  //		 console.log("ID: " + id + "\n " + "type: " + message.type);
  this.paxos.handle.call(this, id, message);
  }
  };
  node3.paxos = paxos.Paxos(nodes, 'node4');

  node3.promiseSequenceNumber = 0;
  node3.oldPromiseNumber = 0;
  node3.activePromises = {};
  node3.acceptors = [];
  var node4 = {uuid: 'node4',
  onMessageReceived: function(id, message) {
  console.log("\n---------RECEIVED: " + this.uuid + " SENDER: " + message.sender +
  "\n " + "type: " + message.type + "---------\n");
  //		 console.log("ID: " + id + "\n " + "type: " + message.type);
  this.paxos.handle.call(this, id, message);
  }
  };
  node4.paxos = paxos.Paxos(nodes, 'node4');

  node4.promiseSequenceNumber = 0;
  node4.oldPromiseNumber = 0;
  node4.activePromises = {};
  node4.acceptors = [];
  var node5 = {uuid: 'node5',
  onMessageReceived: function(id, message) {
  console.log("\n---------RECEIVED: " + this.uuid + " SENDER: " + message.sender +
  "\n " + "type: " + message.type + "---------\n");
  //		 console.log("ID: " + id + "\n " + "type: " + message.type);
  this.paxos.handle.call(this, id, message);
  }
  };
  node5.paxos = paxos.Paxos(nodes, 'node4');

  node5.promiseSequenceNumber = 0;
  node5.oldPromiseNumber = 0;
  node5.activePromises = {};
  node5.acceptors = [];

  netsim.addNode(node1);
  netsim.addNode(node2);
  netsim.addNode(node3);
  netsim.addNode(node4);
  netsim.addNode(node5);
*/
netsim.simulate();

