const express = require('express');
let router = express.Router();

let path = require.resolve('./bill_handlers.js');
let handlers = require(path);


// ----------------------------------------------------------------------------

function reload() {
    delete require.cache[path];
    handlers = require(path);
}


function set_platform(method, platform) {
    router[method](`/${platform}`, function (req, res) {
        let handler = handlers[platform];
        if (handler) {
            handler(req, res);
        }
    });
}


// ----------------------------------------------------------------------------
// 纯属补救措施

router.get('/reload', function (req, res) {
    reload();
    res.end('SUCC');
});


router.get('/add_platform', function (req, res) {
    let method = req.query.method;
    let platform = req.query.platform;

    // verify simply
    if (typeof platform != "string" || platform == '') {
        res.end(`INVALID platform = ${platform}`);
        return;
    }

    if (method != 'get' && method != 'post') {
        res.end(`INVALID method = ${method}`);
        return;
    }

    set_platform(method, platform);

    res.end('SUCC');
});


set_platform('get', 'wx');
set_platform('get', 'vivo');
set_platform('post', 'huawei');


// ----------------------------------------------------------------------------
module.exports = router;
