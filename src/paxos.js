
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

		if(message.sequenceNumber > this.promiseSequenceNumber) {
		    this.oldPromiseNumber = this.promiseSequenceNumber;
		    this.promiseSequenceNumber = message.sequenceNumber;
		    this.sendMessage(message.sender, {
			'type' : 'PROMISE',
			'value' : message.value,
			'sequenceNumber' : this.promiseSequenceNumber,
			'sender': this.uuid
		    });

		    if(this.promiseSequenceNumber !== this.oldPromiseNumber) {
			this.sendMessage(id, {
			    'type': 'UNPROMISE',
			    'sequenceNumber': this.promiseSequenceNumber
			});
		    }
		}
		
		break;
	    case 'PROMISE':
		this.activePromises[message.sender] = 1;
		var total = 0;
		
		for (var property in this.activePromises) {
		    total += this.activePromises[property];
		}
		if(total > (nodes.length/2) && this.acceptReqSeqNumber < this.promiseSequenceNumber) {
		    for(n in nodes) {
			if(nodes[n] !== this.uuid){
			    console.log(nodes[n] + " " + this.uuid);
			    this.sendMessage(nodes[n], {
				'type' : 'ACCEPT_REQUEST',
				'value': message.value,
				'sequenceNumber': this.promiseSequenceNumber,
				'sender' : this.uuid
			    });
			}
		    }
		    this.acceptReqSeqNumber = this.promiseSequenceNumber;
		}
		    break;
		case 'UNPROMISE':
		    this.activePromises[id] = 0;
		    break;
		    
		case 'ACCEPT_REQUEST':
		    if(message.sequenceNumber < this.promiseSequenceNumber) {
			this.sendMessage(message.sender, {
			    'type': 'UNPROMISE',
			    'sequenceNumber': message.sequenceNumber,
			    'sender' : this.uuid
			});
		    } else {
			this.value = message.value;
			this.sendMessage(message.sender, {
			    'type': 'ACCEPT_CONFIRMED',
			    'sender' : this.uuid,
			    'value' : message.value
			});
			this.sendMessage(learnerId, {
			    'type': 'LEARN',
			    'acceptorId': id,
			    'value': message.value,
			    'sender' : this.uuid
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
		    if(total > nodes.length/2) {
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
	    for(var i=1; i < nodes.length; i += 1){
		this.sendMessage(nodes[i], {
		    'sender' : this.uuid,
		    'type' : 'PREPARE',
		    'value' : 123456,
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

