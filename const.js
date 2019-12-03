const EVENTS = [

    // system
    'EVT_REDIS_READY',      // redis ready
    'EVT_SYS_READY',        // system start up (network CAN boot)

    // OTHER
]

// ----------------------------------------------------------------------------
// exports

for (let i = 0; i < EVENTS.length; i++) {
    let v = EVENTS[i];
    module.exports[v] = v;
}
