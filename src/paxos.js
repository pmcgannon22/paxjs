
var Counter = (function() {
    var count = 0;

    return function() {
	count += 1;
	return count;
    };
})();


function Paxos(nodes, learnerId) {
    return {
	'handle' : function(id, message) {
	    switch(message.type) {
	    case 'PREPARE':
		//code goes here
		if(message.sequenceNumber > this.promiseSequenceNumber) {
		    this.oldPromiseNumber = this.promiseSequenceNumber;
		    this.promiseSequenceNumber = message.sequenceNumber;
		    //if(this.uuid !== 'node2') {
		    console.log("I AM " + this.uuid);
		    this.sendMessage('node2', {
			'type' : 'PROMISE',
			'sequenceNumber' : this.promiseSequenceNumber,
			'sender': this.uuid
		    });
		    if(this.promiseSequenceNumber !== this.oldPromiseNumber) {
			this.sendMessage('node2', {
			    'type': 'UNPROMISE',
			    'sequenceNumber': this.promiseSequenceNumber
			});
		    }
		//}
		}
		
		break;
	    case 'PROMISE':
		console.log("SENDER: " + message.sender);
		
		this.activePromises[id] = 1;
		var total = 0;
		
		for (var property in this.activePromises) {
		    total += this.activePromises[property];
		}
		if(total > (nodes.length/2)) {
		    for(n in nodes) { 
			if(n !== this.uuid){
			    this.sendMessage(n, {
				'type' : 'ACCEPT_REQUEST',
				'value': this.value,
				'sequenceNumber': this.promiseSequenceNumber
			    });
			}
		    }
		}
		    break;
		case 'UNPROMISE':
		    this.activePromises[id] = 0;
		    break;
		    
		case 'ACCEPT_REQUEST':
		    if(message.sequenceNumber < this.promiseSequenceNumber) {
			this.sendMessage(id, {
			    'type': 'UNPROMISE',
			    'sequenceNumber': message.sequenceNumber
			});
		    } else {
			this.value = message.value;
			this.sendMessage(id, {
			    'type': 'ACCEPT_CONFIRMED',
			});
			this.sendMessage(learnerId, {
			    'type': 'LEARN',
			    'acceptorId': id,
			    'value': this.value
			});
		    }
		    break;
		case 'ACCEPT_CONFIRMED':
		    break;
		case 'LEARN':
		    this.acceptors[message.acceptorId] = message.value;
		    var total = 0;
		    for(var key in this.acceptors) {
			if(this.acceptors[key] === message.value)
			    total += 1;
		    }
		    console.log("LEARNED: " + message.value +  " FROM " + id);
		    if(total > this.numAcceptors/2) {
			console.log("CONSENSUS: " + message.value);
		    }

		    break;
		default:
		    console.log("Unidentified message type");
		break;
	    }
	},
	'sendPrepare': function() {
	    this.promiseSequenceNumber = Counter();
	    for(var i=1; i < 5; i += 1){
		this.sendMessage(nodes[i], {
		    'type' : 'PREPARE',
		    'sequenceNumber': this.promiseSequenceNumber,
		});
	    }
	}			
    };
}

module.exports = {
    'Paxos': Paxos,
    'Counter': Counter
};

