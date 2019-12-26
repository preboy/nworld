const WebSocket = require('ws');

g_load_module('core', 'tcp_mgr');

// ----------------------------------------------------------------------------
// wss listener

let wss;
function wss_start() {
    wss = new WebSocket.Server({
        port: gDeploy.wss_port,
        clientTracking: true,
    });

    wss.on('connection', function (ws) {
        ws.on('message', function (message) {
            try {
                let msg = JSON.parse(message);
                gHandlerDispatcher.OnRecvWsPacket(ws, msg);
            } catch (err) {
                console.error(`JSON.parse: ${err}`);
            }
        });
    });
}

function wss_stop() {
    if (wss) {
        wss.close(null);
    }
}

// ----------------------------------------------------------------------------
// tcp listener

let mgr;
let svr;
function tcp_start() {
    mgr = new gCoreTcpMgr.Manager();
    svr = new gCoreTcpMgr.Server(mgr);

    mgr.OnRecvPacket((sess, code, body, packet) => {
        gHandlerDispatcher.OnRecvTcpPacket(sess, code, body);

        // just for test
        sess.Send(packet);
    });

    mgr.Start();
    svr.Start(gDeploy.tcp_host, gDeploy.tcp_port);
}

function tcp_stop() {
    svr.Stop();
    mgr.Stop();

    mgr = null;
    svr = null;
}

// ----------------------------------------------------------------------------

exports.Start = function () {
    wss_start();
    tcp_start();
}

exports.Stop = function () {
    wss_stop();
    tcp_stop();
}
