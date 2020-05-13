let express = require('express');
let router = express.Router();

// ----------------------------------------------------------------------------
// handler

router.get('/', function (req, res) {
    res.render('player.html', {
        title: "玩家列表",
        uname: "Brad",
        vehicle: "Jeep",
        terrain: "Mountains",
        climate: "Desert",
        location: "Unknown",
    });
});

// ----------------------------------------------------------------------------

module.exports = router;
