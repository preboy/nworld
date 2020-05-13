let express = require('express');
let router = express.Router();

// ----------------------------------------------------------------------------
// handler

router.get('/', function (req, res) {
    res.render('index.html', {
        title: "这里是首页",
        uname: "Brad",
        vehicle: "Jeep",
        terrain: "Mountains",
        climate: "Desert",
        location: "Unknown",
    });
});

// ----------------------------------------------------------------------------

module.exports = router;
