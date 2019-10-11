// 配置定制列表

let funcs = {

    Creature(conf, mconf) {
    },

    CreatureTeam(conf, mconf) {

    },
}



// ----------------------------------------------------------------------------

exports.tidy = function (fname, conf, mconf) {
    let func = funcs[fname];
    if (func) {
        func(conf, mconf)
    }
}
