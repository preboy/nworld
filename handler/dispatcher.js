global.gvarHandlers = global.gvarHandlers || {};
let gvarHandlers = global.gvarHandlers;


// ----------------------------------------------------------------------------

function OnRecvPacket(msg) {
    if (msg.op) {
        let fn = gvarHandlers[msg.op];
        if (fn) {
            fn();
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

module.exports = {
    OnRecvPacket,
    RegisterHandlers,
}
