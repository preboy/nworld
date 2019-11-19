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
	console.log("help");
}

cmds.show = function (p1, p2, p3) {
	console.log(p1, p2, p3);
}

cmds.hide = function (p1, p2, p3) {
	console.log(p1, p2, p3);
}
