let def_handler = function (ws, msg) {
    if (!ws.plr) {
        console.error('NOT login');
        return;
    }

    gModGame.onMessage(ws, msg);
}


let handlers = {

    // 玩家登录
    login(ws, msg) {
        msg.ret = 1;
        msg.msg = 'failed';

        do {

            let acct = msg.acct;
            let pass = msg.pass;

            if (!acct || !pass) {
                break;
            }

            if (pass != '1') {
                msg.ret = 2;
                msg.msg = 'invalid password';
                break;
            }

            let plr = gPlrMgr.GetPlr(acct);
            // 发送玩家信息，玩家进入游戏
            process.nextTick(() => {
                plr.online(ws);
            });

            msg.data = {
                pid: plr.GetPid(),
                coin: plr.GetCoin(),
                name: plr.GetName(),
            }

            msg.ret = 0;
            msg.msg = 'ok';
        } while (false);

        ws.send(JSON.stringify(msg));
    },

    add_coin(ws, msg) {
        msg.ret = 1;
        msg.msg = 'failed';

        do {
            let amount = +msg.amount;

            if (!amount || amount < 0) {
                msg.ret = 1;
                msg.msg = 'invalid amount';
                break;
            }

            if (!ws.plr) {
                msg.ret = 2;
                msg.msg = 'NOT login';
                break;
            }

            ws.plr.AddCoin(amount);

            msg.ret = 0;
            msg.msg = 'ok';
        } while (false);

        ws.send(JSON.stringify(msg));
    },

    // 游戏内消息
    join: def_handler,
    look: def_handler,
    attack: def_handler,
    quit: def_handler,
    waiver: def_handler,
    value: def_handler,

    dump: def_handler,
}


// ----------------------------------------------------------------------------
gHandlerDispatcher.RegisterWsHandlers(handlers);
