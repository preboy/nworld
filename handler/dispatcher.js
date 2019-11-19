// ----------------------------------------------------------------------------
// var

global.gvarHandlers = global.gvarHandlers || {};
let gvarHandlers = global.gvarHandlers;

global.gvarTcpHandlers = global.gvarTcpHandlers || new Map();
let gvarTcpHandlers = global.gvarTcpHandlers;


// ----------------------------------------------------------------------------
// wss

function OnRecvPacket(ws, msg) {
    if (msg.op) {
        let fn = gvarHandlers[msg.op];
        if (fn) {
            fn(ws, msg);
            return;
        }
    }

    console.warn(`OnRecvPacket NOT found hander:`, msg);
}

function register_handler(op, fn) {
    gvarHandlers[op] = fn;
}

function RegisterHandlers(obj) {
    for (let k in obj) {
        register_handler(k, obj[k]);
    }
}


// ----------------------------------------------------------------------------
// tcp

function OnRecvTcpPacket(sess, code, body) {
    let op = code;
    let fn = gvarTcpHandlers[op];
    if (fn) {
        fn(sess, code, body);
        return;
    }

    console.warn(`OnRecvTcpPacket NOT found hander:`, code);
}

function RegisterTcpHandler(op, fn) {
    gvarTcpHandlers[op] = fn;
}


// ----------------------------------------------------------------------------

module.exports = {

    OnRecvPacket,
    RegisterHandlers,

    OnRecvTcpPacket,
    RegisterTcpHandler,
}
