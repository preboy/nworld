require("./core");

let hsvc = require("./hsvc");


g_load_module('.', 'deploy');




const io = require('socket.io')();
io.on('connection', (client) => {
    
});
io.listen(3000);




// 启动网络


hsvc.Start();


let [conf, mconf] = g_get_conf('CreatureTeam');



// ----------------------------------------------------------------------------
// process events

process.on('uncaughtException', (err) => {
    console.error('uncaughtException', err);
});


