const redis = require("redis");

// ----------------------------------------------------------------------------
let ready = false;
let client;
let running;

function start(cb) {
    client = redis.createClient(gDeploy.redis);

    client.on('error', (err) => {
        ready = false;
        if (!running) {
            client.quit();
            return;
        }
        console.warn('redis error:', err);
    });

    client.on('connect', () => {
        console.info('redis connected');
        ready = true;
        cb();
    });

    client.on('reconnecting', () => {
        console.info('redis reconnecting ...');
    });

    client.on('end', () => {
        ready = false;
        console.log("redis closed");
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
    running = true;
    start(cb);
}

exports.Stop = function () {
    running = false;
    stop();
}

exports.Redis = function () {
    return client;
}

exports.Ready = function () {
    return ready;
}
