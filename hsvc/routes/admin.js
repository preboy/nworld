var express = require('express');
var router = express.Router();

// ----------------------------------------------------------------------------
// handler

router.get('/', function(req, res) {
    res.end('admin');
});

// ----------------------------------------------------------------------------

module.exports = router;
