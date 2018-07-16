const fs = require('fs');

module.exports = (msg) => {
	// Uncomment to spew logs into a file.
	// Warning: may cause game to crash in horrible ways, as we're
	// using a lame sync write here
	// fs.appendFileSync('log.txt', JSON.stringify(msg) + '\n');
}