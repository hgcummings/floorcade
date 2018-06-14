const request = require('request-promise-native');
const util = require('util');
const net = require('net');
const dnsLookup = util.promisify(require('dns').lookup);
const os = require('os');

let screen = require('./screens/loader')

module.exports.activate = async (config) => {
    console.log('Creating server...');
    const server = net.createServer();
    const listen = util.promisify(server.listen).bind(server);
    await listen();

    const host = (await dnsLookup(os.hostname())).address;
    const {port} = server.address();

    console.log(`Asking dancefloor at ${config.host}:${config.httpPort} to delegate to ${host}:${port}...`);
    await request.post(`http://${config.host}:${config.httpPort}/api/delegate`, {
        json:true,
        body: {
            host,
            port
        }
    });

    console.log('Awaiting connections...');
    server.on('connection', socket => {
        console.log('Got connection. Waiting for data...');
        socket.on('data', (data) => {    
            const [width, height] = data;

            const frameData = screen.render();
            socket.write(frameData.slice(0, width * height * 3));
        });
    });
}

module.exports.setScreen = (value) => screen = value;