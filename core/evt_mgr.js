global.gvarEvents = global.gvarEvents || {};
let gvarEvents = global.gvarEvents;


// ----------------------------------------------------------------------------

exports.Fire = function (evtId, ...args) {
    let evts = gvarEvents[evtId];
    if (evts) {
        for (let k in evts) {
            try {
                evts[k](evtId, ...args);
            } catch (err) {
                console.log(`exports.Fire ERROR: ${evtId}`, err);
            }
        }
    }
}

exports.On = function (evtId, key, fn) {
    if (!gvarEvents[evtId]) {
        gvarEvents[evtId] = {};
    }

    gvarEvents[evtId][key] = fn;
}
