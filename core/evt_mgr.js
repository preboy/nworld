global.gvarEvents = global.gvarEvents || {};
let gvarEvents = global.gvarEvents;

global.gvarOnceEvents = global.gvarOnceEvents || {};
let gvarOnceEvents = global.gvarOnceEvents;


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

    evts = gvarOnceEvents[evtId];
    if (evts) {
        evts.forEach((fn) => {
            try {
                fn(evtId, ...args);
            } catch (err) {
                console.log(`exports.Fire ERROR (ONCE): ${evtId}`, err);
            }
        });
        delete gvarOnceEvents[evtId];
    }
}

exports.On = function (evtId, key, fn) {
    if (!gvarEvents[evtId]) {
        gvarEvents[evtId] = {};
    }

    gvarEvents[evtId][key] = fn;
}

exports.Off = function (evtId, key) {
    let evts = gvarEvents[evtId];
    if (evts) {
        delete evts[key];
    }
}

exports.Once = function (evtId, fn) {
    if (!gvarOnceEvents[evtId]) {
        gvarOnceEvents[evtId] = [];
    }

    gvarOnceEvents[evtId].push(fn);
}
