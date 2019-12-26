const assert = require('assert');

// ----------------------------------------------------------------------------
// var

let mod_data = g_module_data(module, {
    confs: {},
});

let confs = mod_data.confs;

let list;
let manual;


// ----------------------------------------------------------------------------

function load_preparation() {
    list = g_load_module('.', 'conf_list');
    manual = g_load_module('.', 'conf_manual');
}

function arrange(conf, keys) {

    let len = keys.length;
    assert(len);

    let obj = {};
    let man = {};

    for (let item of conf) {

        let tmp1 = obj;
        let tmp2 = man;

        for (let i = 0; i < len - 1; i++) {
            let key = item[keys[i]];

            if (!tmp1[key]) {
                tmp1[key] = {};
                tmp2[key] = {};
            }

            tmp1 = tmp1[key];
            tmp2 = tmp2[key];
        }

        let last = item[keys[len - 1]];

        tmp1[last] = item;
        tmp2[last] = {};
    }

    return [obj, man];
}

function load_item(fname, keys) {
    let mod = g_load_module('conf', fname);
    let [conf, mconf] = arrange(mod, keys);

    manual.tidy(fname, conf, mconf);

    confs[fname] = [conf, mconf];
}

function load_conf(fname) {
    let item = list.find(v => v[0] == fname);
    if (item) {
        load_item(item[0], item[1]);
    }
}

function load_confs() {
    load_preparation();
    for (let item of list) {
        load_item(item[0], item[1]);
    }
}

function get_conf(fname) {
    let conf = confs[fname];
    if (conf) {
        return conf;
    }

    return [null, null];
}


// ----------------------------------------------------------------------------
(function init() {
    load_confs();
})();


// ----------------------------------------------------------------------------
global.g_get_conf = get_conf;


// ----------------------------------------------------------------------------
module.exports = {
    load_conf,
    load_confs,
    load_preparation,
}
