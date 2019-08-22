require("./core");

let hsvc = require("./hsvc");


g_load_module('.', 'deploy');


require('./handler');

// 启动网络
require('./net_mgr.js');


hsvc.Start();


let [conf, mconf] = g_get_conf('CreatureTeam');




// ----------------------------------------------------------------------------
// process events

process.on('uncaughtException', (err) => {
    console.error('uncaughtException', err);
});


