const request = require('request-promise-native');
const util = require('util');
const net = require('net');

module.exports.activate = async (config, game) => {
    console.log('Creating server...');
    const server = net.createServer();
    console.log('Listening...');
    const listen = util.promisify(server.listen).bind(server);
    await listen();
    const {port} = server.address();

    console.log('Asking dancefloor to delegate...');
    await request.post(`http://${config.host}:${config.httpPort}/api/delegate`, {
        json:true,
        body: {
            host: require('os').hostname(),
            port: port
        }
    });

    console.log('Awaiting connections...');
    server.on('connection', socket => {
        console.log('Got connection. Waiting for data...');
        socket.on('data', (data) => {    
            const [width, height] = data;

            const frameData = game.render();

            console.log('Got data. Sending frame data...');
            socket.write(frameData);
        });
    });
}