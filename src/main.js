var NetworkSimulator = require('../lib/netsim/src/NetworkSimulator'),
    topology = require('./topology'),
    paxos = require('./paxos');

var netsim = new NetworkSimulator(topology);

nodes = ['node1','node2', 'node3', 'node4', 'node5'];

var node1 = {uuid: 'node1',
	     onStart: function() {
		 console.log("STARTING");
		 this.paxos.sendPrepare.call(this)
	     },
	     onMessageReceived: function(id, message) {
		 console.log("ID: " + id + "\n MESSAGE: " + message);
		 this.paxos.handle.call(this, id, message);
	     }
	    };
node1.paxos = paxos.Paxos(nodes);
var node2 = {uuid: 'node2',
	     onMessageReceived: function(id, message) {
		 console.log("ID: " + id + "\n MESSAGE: " + message);
		 this.paxos.handle.call(this, id, message);
	     }
	    };

node2.paxos = paxos.Paxos(nodes);
var node3 = {uuid: 'node3',
	     onMessageReceived: function(id, message) {
		 console.log("ID: " + id + "\n MESSAGE: " + message);
		 this.paxos.handle.call(this, id, message);
	     }
	    };
node3.paxos = paxos.Paxos(nodes);
var node4 = {uuid: 'node4',
	     onMessageReceived: function(id, message) {
		 console.log("ID: " + id + "\n MESSAGE: " + message);
		 this.paxos.handle(id, message);
	     }
	    };
node4.paxos = paxos.Paxos(nodes);
var node5 = {uuid: 'node5',
	     onMessageReceived: function(id, message) {
		 this.paxos.handle(id, message);
		 console.log("ID: " + id + "\n MESSAGE: " + message);
	     }
	    };
node5.paxos = paxos.Paxos(nodes);



netsim.addNode(node1);
netsim.addNode(node2);
netsim.addNode(node3);
netsim.addNode(node4);
netsim.addNode(node5);

netsim.simulate();
