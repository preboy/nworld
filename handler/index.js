// ----------------------------------------------------------------------------
// loader

g_load_module('handler', 'dispatcher');


// ----------------------------------------------------------------------------
// wss msg handlers

g_load_module('handler', 'handler_ws_player');


// ----------------------------------------------------------------------------
// tcp msg handlers

g_load_module('handler', 'handler_tcp_player');
