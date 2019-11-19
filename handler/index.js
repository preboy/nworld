// ----------------------------------------------------------------------------
// loader

g_load_module('handler', 'dispatcher');


// ----------------------------------------------------------------------------
// wss msg handlers

g_load_module('handler', 'handler_player');


// ----------------------------------------------------------------------------
// tcp msg handlers

g_load_module('handler', 'tcp_player');
