let handlers = {

    // 消息1
    fuck(msg) {
        console.log("this is fuck");
    },

    // 消息2
    fuckyou(msg) {
        console.log("fuckyou");
    },
}


// ----------------------------------------------------------------------------
gHandlerDispatcher.RegisterHandlers(handlers);
