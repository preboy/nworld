

// ----------------------------------------------------------------------------
// load module

const readline = require("readline");

require("./core");
require('./handler');


g_load_module('.', 'deploy');
let cmder = g_load_module('.', 'cmder');


let hsvc = require("./hsvc");
let net_mgr = require('./net_mgr.js');


// load config
let [conf, mconf] = g_get_conf('CreatureTeam');


// do start
on_start();

// command parser
const xterm = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
})

if (xterm) {
    xterm.setPrompt("server# ");
    xterm.prompt();

    xterm.on('line', function (str) {
        if (str == "quit") {
            xterm.close();
            ProcessExit();
            return;
        } else {
            cmder.Parse(str);
        }
        xterm.prompt();
    });
}


// event
function on_start() {
    hsvc.Start();
    net_mgr.Start();
}

function on_stop() {
    net_mgr.Stop();
    hsvc.Stop();
}

// ----------------------------------------------------------------------------
// process events

process.on('uncaughtException', (err) => {
    console.error('uncaughtException', err);
});

// process signal
process.on('SIGINT', on_signal);
process.on('SIGHUP', on_signal);
process.on('SIGTERM', on_signal);
process.on('SIGQUIT', on_signal);
process.on('SIGABRT', on_signal);

function on_signal(sig) {
    console.log(`收到信号: ${sig}`);
    ProcessExit();
}

function ProcessExit() {
    on_stop();
    process.exit(0);
}
