let handlers = {

    // 消息1
    fuck(ws, msg) {
        console.log("this is fuck");
    },

    // 消息2
    fuckyou(ws, msg) {
        console.log("fuckyou");
        ws.send(JSON.stringify(msg));
    },
}


// ----------------------------------------------------------------------------
gHandlerDispatcher.RegisterHandlers(handlers);
