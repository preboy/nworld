// ----------------------------------------------------------------------------
// load module

const colors = require('colors');
const readline = require('readline');

require('./core');
require('./handler');


g_load_module('.', 'cmder');
g_load_module('.', 'const')
g_load_module('.', 'deploy');
g_load_module('.', 'hsvc');
g_load_module('.', 'db_mgr');
g_load_module('.', 'net_mgr');
g_load_module('.', 'plr_mgr');
g_load_module('mod', 'game');


// load config
let [conf, mconf] = g_get_conf('CreatureTeam');


// do start
on_start();


// command parser
const xterm = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

if (xterm) {
    xterm.setPrompt('server# ');
    xterm.prompt();

    xterm.on('line', function (str) {
        if (str == 'quit') {
            xterm.close();
            ProcessExit();
            return;
        } else {
            gCmder.Parse(str);
        }
        xterm.prompt();
    });
}


// event
function on_start() {
    gDbMgr.Start(() => {
        gCoreEvtMgr.Fire(gConst.EVT_REDIS_READY);
        gCoreEvtMgr.Fire(gConst.EVT_SYS_READY);
    });

    gModGame.Start();
    gPlrMgr.Start();

    gCoreEvtMgr.Once(gConst.EVT_SYS_READY, () => {
        gHsvc.Start();
        gNetMgr.Start();

        console.log('server is ready');
    });
}

function on_stop() {
    gNetMgr.Stop();
    gHsvc.Stop();

    gPlrMgr.Stop();
    gModGame.Stop();

    gDbMgr.Stop();
}

// ----------------------------------------------------------------------------
// process events

process.on('uncaughtException', (err) => {
    console.error('uncaughtException', err);
});

// process signal

process.on('SIGHUP', () => {
    console.log(`SIGHUP: server running background`);
});

process.on('SIGINT', on_signal);
process.on('SIGTERM', on_signal);
process.on('SIGQUIT', on_signal);
process.on('SIGABRT', on_signal);

function on_signal(sig) {
    console.log(`收到信号: ${sig}`);
    ProcessExit();
}

let stoping = false;
function ProcessExit() {
    if (stoping) {
        return;
    }

    stoping = true;
    on_stop();

    let i = 4;
    setInterval(() => {
        i--;
        if (i == 0) {
            process.exit(0);
        }

        console.log(`server will STOP after ${i} sec`.red);
    }, 1000);
}
