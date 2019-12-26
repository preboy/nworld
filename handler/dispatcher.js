// ----------------------------------------------------------------------------
// var

let mod_data = g_module_data(module, {
    WsHandlers: {},
    TcpHandlers: {},
});

let WsHandlers = mod_data.WsHandlers;
let TcpHandlers = mod_data.TcpHandlers;


// ----------------------------------------------------------------------------
// ws

function OnRecvWsPacket(ws, msg) {
    if (msg.op) {
        let fn = WsHandlers[msg.op];
        if (fn) {
            fn(ws, msg);
            return;
        }
    }

    console.warn(`OnRecvWsPacket NOT found hander:`, msg);
}

function register_ws_handler(op, fn) {
    WsHandlers[op] = fn;
}

function RegisterWsHandlers(obj) {
    for (let k in obj) {
        register_ws_handler(k, obj[k]);
    }
}


// ----------------------------------------------------------------------------
// tcp

function OnRecvTcpPacket(sess, code, body) {
    let op = code;
    let fn = TcpHandlers[op];
    if (fn) {
        fn(sess, code, body);
        return;
    }

    // console.warn(`OnRecvTcpPacket NOT found hander:`, code);
}

function RegisterTcpHandler(op, fn) {
    TcpHandlers[op] = fn;
}


// ----------------------------------------------------------------------------

module.exports = {
    OnRecvWsPacket,
    RegisterWsHandlers,

    OnRecvTcpPacket,
    RegisterTcpHandler,
}
