// ----------------------------------------------------------------------------
const re = /[\s,]+/;
const cmds = {};


exports.Parse = function (str) {
    str = str.trim();
    if (str.length == 0) {
        return;
    }

    let args = [];
    str.split(re).forEach((v) => {
        let arg = v.trim();
        if (arg.length) {
            args.push(arg);
        }
    });

    if (!args.length) {
        return;
    }

    let name = args[0];
    let func = cmds[name];

    if (func) {
        args.shift();
        func.apply(null, args);
    } else {
        console.log("invalid command!!!", args[0]);
    }
}

// ----------------------------------------------------------------------------
// commands

cmds.help = function () {
    console.log("available commands:");

    console.log('reload     reload module');
    console.log('save       save all data');
}

cmds.reload = function (dir, file) {
    if (!dir || !file) {
        console.log('useage: reload dir file');
        return;
    }

    let mod = g_load_module(dir, file);
    console.log(`reload '${dir}\/${file}'.js AS '${mod.__m.__mod_name}'`);
}

cmds.save = function () {
    gModGame.Save();
    gPlrMgr.Save();
}
