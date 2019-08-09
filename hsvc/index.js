const app   = require('./app');
const http  = require('http');
const debug = require('debug')('auth:server');


let server = http.createServer(app);

server.on('error',     onError);
server.on('listening', onListening);


// ----------------------------------------------------------------------------

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    // handle specific listen errors with friendly messages
    switch (error.code) {
    case 'EADDRINUSE':
        console.error(bind + ' is already in use');
        process.exit(1);
        break;  
    default:
        throw error;
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
