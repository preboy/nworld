let mod_data = g_module_data(module, {
    events: {},
    once: {},
});

let events = mod_data.events;
let once = mod_data.once;


// ----------------------------------------------------------------------------

exports.Fire = function (evtId, ...args) {
    let evts = events[evtId];
    if (evts) {
        for (let k in evts) {
            try {
                evts[k](evtId, ...args);
            } catch (err) {
                console.log(`exports.Fire ERROR: ${evtId}`, err);
            }
        }
    }

    evts = once[evtId];
    if (evts) {
        evts.forEach((fn) => {
            try {
                fn(evtId, ...args);
            } catch (err) {
                console.log(`exports.Fire ERROR (ONCE): ${evtId}`, err);
            }
        });

        delete once[evtId];
    }
}

exports.On = function (evtId, key, fn) {
    if (events[evtId] == undefined) {
        events[evtId] = {};
    }

    events[evtId][key] = fn;
}

exports.Off = function (evtId, key) {
    let evts = events[evtId];
    if (evts) {
        delete evts[key];
    }
}

exports.Once = function (evtId, fn) {
    if (once[evtId] == undefined) {
        once[evtId] = [];
    }

    once[evtId].push(fn);
}
