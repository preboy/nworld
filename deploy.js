let gameId = 1;

exports.gameId = gameId;

// tcp host & port
exports.tcp_host = "0.0.0.0";
exports.tcp_port = 30000 + gameId;

// wss port
exports.wss_port = 31000 + gameId;

// http service port
exports.hsvc_addr = '0.0.0.0';
exports.hsvc_port = 32000 + gameId;

exports.redis = {
    db: 2,
    port: 6379,
    host: '127.0.0.1',
    password: '123456',
};

// mongodb addr
exports.dbGame = `mongodb://mongouser:mongopass@118.24.48.149:27017/nw_game${gameId}?authSource=admin`;
exports.dbStat = `mongodb://mongouser:mongopass@118.24.48.149:27017/nw_stat${gameId}?authSource=admin`;
