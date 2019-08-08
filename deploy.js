let gameId = 1;

exports.gameId = gameId;

// tcp port
exports.addr = "0.0.0.0";
exports.port = 20000 + gameId;

// http svr port
exports.hsvr_addr = '0.0.0.0';
exports.hsvr_port = 21000 + gameId;

// mongodb addr
exports.dbGame = `mongodb://mongouser:mongopass@118.24.48.149:27017/nw_game${gameId}?authSource=admin`;
exports.dbStat = `mongodb://mongouser:mongopass@118.24.48.149:27017/nw_stat${gameId}?authSource=admin`;
