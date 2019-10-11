global.gvarPlayers = global.gvarPlayers || {};
let gvarPlayers = global.gvarPlayers;


// ----------------------------------------------------------------------------

function LoadPlrData(id, callback) {
    let p = gvarPlayers[id];
    if (p && callback) {
        callback(p);
        return;
    }

    // mongodb load
}

function GetPlrData(id) {
    return gvarPlayers[id];
}

// 初始化各个模块数据
function InitData(pdata) {
    gModBag.InitData(pdata);
    // to be continue
}

// ----------------------------------------------------------------------------

function init() {
    for (let k in gvarPlayers) {
        let p = gvarPlayers[k];
        InitData(p);
    }
}

function release() {
}

// ----------------------------------------------------------------------------

module.exports = {
    init,
    release,

    GetPlrData,
    LoadPlrData,
}
