let express = require('express');
let router = express.Router();

// ----------------------------------------------------------------------------
// handler

router.get('/', function (req, res) {
    res.render('guild.html', {
        title: "帮会列表",
        uname: "Brad",
        vehicle: "Jeep",
        terrain: "Mountains",
        climate: "Desert",
        location: "Unknown",
    });
});

// ----------------------------------------------------------------------------

module.exports = router;
