const redis = require("redis");

// ----------------------------------------------------------------------------
let ready = false;
let client;

function start(cb) {
    client = redis.createClient(gDeploy.redis);

    client.on('error', (err) => {
        console.warn('redis error:', err);
    });

    client.on('connect', () => {
        console.info('redis connect ok');
        ready = true;
        cb();
    });

    client.on('reconnecting', () => {
        console.info('redis reconnecting');
    });

    client.on('end', () => {
        ready = false;
        delete client;
    });
}

function stop() {
    if (client) {
        client.quit();
    }
}


// ----------------------------------------------------------------------------
// exports

exports.Start = function (cb) {
    start(cb);
}

exports.Stop = function () {
    stop();
}

exports.Redis = function () {
    return client;
}

exports.Ready = function () {
    return ready;
}
