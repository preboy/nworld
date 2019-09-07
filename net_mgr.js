const WebSocket = require('ws');

const wss = new WebSocket.Server({
        port: 8080,
        clientTracking: true,
    });


wss.on('connection', function(ws){
    ws.on('message', function(message){
        try {
            let msg = JSON.parse(message);
            gHandlerDispatcher.OnRecvPacket(msg);
        } catch(err) {
            console.error(`JSON.parse: ${err}`);
        }
    });
});


// ----------------------------------------------------------------------------

exports.Start = function() {

}

exports.Stop = function() {
    wss.close(null)
}
