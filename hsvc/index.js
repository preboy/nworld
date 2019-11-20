const app = require('./app');
const http = require('http');
const debug = require('debug')('auth:server');


let server = http.createServer(app);

server.on('error', onError);
server.on('listening', onListening);


// ----------------------------------------------------------------------------

function onError(err) {
    if (err.syscall !== 'listen') {
        throw err;
    }

    // handle specific listen errors with friendly messages
    let addr = server.address();
    switch (err.code) {
        case 'EADDRINUSE':
            console.error(`port ${addr.port} is already in use`);
            process.exit(1);
            break;
        default:
            throw err;
    }
}

function onListening() {
    let addr = server.address();
    console.info('HTTP SVR Listening on port ' + addr.port);
}


// ----------------------------------------------------------------------------

exports.Start = () => {
    server.listen(gDeploy.hsvc_port);
}

exports.Stop = () => {
}
