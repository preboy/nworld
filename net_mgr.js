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
            let msg;

            try {
                msg = JSON.parse(message);
            } catch (err) {
                console.error('JSON.parse:', message, err);
            }

            try {
                gHandlerDispatcher.OnRecvWsPacket(ws, msg);
            } catch (err) {
                console.error('OnRecvWsPacket error:', msg, err);
            }
        });

        ws.on('close', function (code, reason) {
            ws.plr.offline();
            console.log(`wss_show websocket closed:  ${code}, ${reason}`);
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
