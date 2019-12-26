let express = require('express');
let router = express.Router();

// ----------------------------------------------------------------------------
// handler

router.get('/reload', function (req, res) {
    g_load_module('.', 'deploy');

    res.json({ ret: 0, msg: 'OK' });
});

router.get('/save', function (req, res) {
    gModGame.Save();
    gPlrMgr.Save();

    res.json({ ret: 0, msg: 'OK' });
});

// ----------------------------------------------------------------------------

module.exports = router;
