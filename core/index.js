const path = require('path');
const assert = require('assert');

global.__mod_data = {};
let mod_data = global.__mod_data;

console.log_ = console.log;
console.log  = function(...args) {
    console.log_(`[${new Date().toISOString()}]`, ...args);
}

// ----------------------------------------------------------------------------

// 模块私有数据
global.g_module_data = function (mod, init = {}) {
    let mid = mod.id;

    if (mod_data[mid] == undefined) {
        mod_data[mid] = init;
    }

    return mod_data[mid];
}

global.g_capital = function (str) {
    return str.replace(/([a-zA-Z0-9]+)[-_]*/g, function (match, p1) {
        return p1.replace(p1[0], p1[0].toUpperCase());
    });
};

// 加载模块
global.g_load_module = function (dir, file) {
    let path = require.resolve(`${process.cwd()}/${dir}/${file}`);
    let name = `g${dir == '.' ? '' : g_capital(dir)}${g_capital(file)}`;

    let old = require.cache[path];
    if (old) {
        if (old.exports.release) {
            old.exports.release();
        }

        delete require.cache[path];
    }

    let mod = require(path);
    if (mod) {
        if (mod.init) {
            mod.init();
        }

        let m = require.cache[path];
        m.__mod_name = name;
        m.__mod_data = g_module_data(m);

        mod.__m = m;
        global[name] = mod;
    }

    assert.ok(mod, `g_load_module: load ${dir}\/${file}.js AS '${name}' FAILED !!!`);

    return mod;
}

// ----------------------------------------------------------------------------

g_load_module('core', 'assign');
g_load_module('core', 'conf');
g_load_module('core', 'evt_mgr');
g_load_module('core', 'global');
g_load_module('core', 'tcp_mgr');
g_load_module('core', 'tcp_session');
g_load_module('core', 'utils');
