// ----------------------------------------------------------------------------
const re = /[\s,]+/;
const cmds = {};


exports.Parse = function (str) {
    str = str.trim();
    if (str.length == 0) {
        return;
    }

    let cmd = str.split(re);
    let name = cmd[0];
    let func = cmds[name];

    if (func) {
        cmd.shift();
        func.apply(null, cmd);
    } else {
        console.log("invalid command!!!", cmd[0]);
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
    console.log(`reload '${dir}\/${file}'.js AS '${mod.__mod_name}'`);
}

cmds.hide = function (p1, p2, p3) {
	console.log(p1, p2, p3);
}
