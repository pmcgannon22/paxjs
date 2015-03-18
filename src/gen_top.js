var N_NODES = process.argv[2];

var top = "module.exports = [\n";
for(var n = 1; n <= N_NODES; n++) {
    for(var m = 1; m <= N_NODES; m++) {
	top += "\t{src: 'node" + n + "', dst: 'node" + m + "', packet_loss: 0.0},\n";
    }
    top += "\n";
}
top += "];";

var fs = require('fs');
var stream = fs.createWriteStream("topology.js");
stream.once('open', function(fd) {
    stream.write(top);
    stream.end();
});
