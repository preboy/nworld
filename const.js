const EVENTS = [

    // system
    'EVT_SYS_REDIS_READY',          // redis ready
    'EVT_SYS_SERVER_READY',         // system start up (network CAN boot)

    // OTHER
    'EVT_DDZ_Table_Finished',       // 斗地主一桌结束
]

// ----------------------------------------------------------------------------
// exports

for (let i = 0; i < EVENTS.length; i++) {
    let v = EVENTS[i];
    module.exports[v] = v;
}
