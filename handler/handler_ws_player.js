let def_handler = function (ws, msg) {
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

            // 发送玩家信息，玩家进入游戏
            process.nextTick(() => {
                gPlrMgr.GetPlr(acct).online(ws);
            });

            msg.ret = 0;
            msg.msg = 'ok';
        } while (false);

        ws.send(JSON.stringify(msg));
    },


    // 消息2
    fuckyou: def_handler,

}



// ----------------------------------------------------------------------------
gHandlerDispatcher.RegisterWsHandlers(handlers);
