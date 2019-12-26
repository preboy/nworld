// ----------------------------------------------------------------------------

gHandlerDispatcher.RegisterTcpHandler(100, function (sess, code, body) {
    console.log("tcp recv : ", 100);
});

gHandlerDispatcher.RegisterTcpHandler(200, function (sess, code, body) {
    console.log("tcp recv : ", 200);
});
