const path = require('path');

// ----------------------------------------------------------------------------

global.g_capital = function (str) {
    return str.replace(/([a-zA-Z0-9]+)[-_]*/g, function (match, p1) {
        return p1.replace(p1[0], p1[0].toUpperCase());
    });
};

// 加载模块
global.g_load_module = function (dir, file) {
    let path = require.resolve(`${process.cwd()}/${dir}/${file}`);
    let name = `g${dir == '.' ? '' : g_capital(dir)}${g_capital(file)}`;

    var mod = require.cache[path];
    if (mod && mod.exports.release) {
        mod.exports.release();
    }

    delete require.cache[path];

    var mod = require(path);
    if (mod && mod.init) {
        mod.init();
    }

    global[name] = mod;
    return mod;
}

// ----------------------------------------------------------------------------

g_load_module('core', 'global');
g_load_module('core', 'evt_mgr');
g_load_module('core', 'conf');
g_load_module('core', 'utils');
g_load_module('core', 'assign');
g_load_module('core', 'tcp_mgr');
