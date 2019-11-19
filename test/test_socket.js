const net  	 = require('net')
const colors = require('colors');

const common  = require('./common.js');
const session = require('./session.js');
const dispatcher = require("./dispatcher.js");


colors.setTheme({
    silly: 'rainbow',
    input: 'grey',
    verbose: 'cyan',
    prompt: 'grey',
    info: 'green',
    data: 'grey',
    help: 'cyan',
    warn: 'yellow',
    debug: 'blue',
    error: 'red'
});


const MAX_CONNECTION = 3000;

var cnt = 0;
var rec = {};

var mgr_cli = {
    on_connection(sess) {
        rec[sess.sid] = sess;
        cnt++;

        sess._buff = common.gen_packet();
        sess._send = +new Date();
        sess.send(sess._buff);
    },

    on_closed(sess) {
        delete rec[sess.sid];
        cnt--;
    },

    on_packet(sess, packet) {
        dispatcher.dispatch(sess, packet);

        var now = +new Date();
        var dur = (now - sess._send) / 1000;

        if (dur > 1) {
            console.log("时间差:", dur);
        }

        var ret = packet.compare(sess._buff, 0, sess._buff.byteLength, 0, packet.byteLength);
        if (ret) {
            console.log("收到不一样的包了");
        }

        sess._buff = null;
        setTimeout(()=>{
            sess._buff = common.gen_packet();
            sess._send = +new Date();
            sess.send(sess._buff);
        }, 3000);
    },
}

var sid = 1;
let tms = 0;

let tid = setInterval(() => {

    let c = net.createConnection(8080, "118.24.48.149");

    c.on('connect', () => {
        var sess = new session.Session(c, sid, mgr_cli);
        sid++;
    });

    c.on('error', (err) => {
        console.log("SOCKET error, err = ", err);
    });

	if (++tms >= MAX_CONNECTION) {
		clearInterval(tid);
	}
}, 100);

