var NetworkSimulator = require('../lib/netsim/src/NetworkSimulator'),
    topology = require('./topology'),
    paxos = require('./paxos');

var netsim = new NetworkSimulator(topology);

nodes = ['node1','node2', 'node3', 'node4', 'node5'];

var node1 = {uuid: 'node1',
	     onStart: function() {
		 console.log("STARTING");
		 this.paxos.sendPrepare.call(this);
	     },
	     onMessageReceived: function(id, message) {
		 console.log("ID: " + id + "\n " + "type: " + message.type);
		 this.paxos.handle.call(this, id, message);
	     }
	    };


node1.paxos = paxos.Paxos(nodes, 'node1');
node1.promiseSequenceNumber = 0;
node1.oldPromiseNumber = 0;
node1.activePromises = {};
node1.acceptors = [];


var node2 = {uuid: 'node2',
	     onMessageReceived: function(id, message) {
		 console.log("ID: " + id + "\n " + "type: " + message.type);
		 this.paxos.handle.call(this, id, message);
	     }
	    };

node2.promiseSequenceNumber = 0;
node2.oldPromiseNumber = 0;
node2.activePromises = {};
node2.acceptors = [];

node2.paxos = paxos.Paxos(nodes, 'node1');
var node3 = {uuid: 'node3',
	     onMessageReceived: function(id, message) {
		 console.log("ID: " + id + "\n " + "type: " + message.type);
		 this.paxos.handle.call(this, id, message);
	     }
	    };
node3.paxos = paxos.Paxos(nodes, 'node1');

node3.promiseSequenceNumber = 0;
node3.oldPromiseNumber = 0;
node3.activePromises = {};
node3.acceptors = [];
var node4 = {uuid: 'node4',
	     onMessageReceived: function(id, message) {
		 console.log(message);
		 console.log("ID: " + id + "\n " + "type: " + message.type);
		 this.paxos.handle.call(this, id, message);
	     }
	    };
node4.paxos = paxos.Paxos(nodes, 'node1');

node4.promiseSequenceNumber = 0;
node4.oldPromiseNumber = 0;
node4.activePromises = {};
node4.acceptors = [];
var node5 = {uuid: 'node5',
	     onMessageReceived: function(id, message) {
		 console.log("ID: " + id + "\n " + "type: " + message.type);
		 this.paxos.handle.call(this, id, message);
	     }
	    };
node5.paxos = paxos.Paxos(nodes, 'node1');

node5.promiseSequenceNumber = 0;
node5.oldPromiseNumber = 0;
node5.activePromises = {};
node5.acceptors = [];

netsim.addNode(node1);
netsim.addNode(node2);
netsim.addNode(node3);
netsim.addNode(node4);
netsim.addNode(node5);

netsim.simulate();
