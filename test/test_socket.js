const net  	 = require('net')
const colors = require('colors');

const utils  = require('../core/utils.js');
const session = require('../core/tcp_session.js');

const deploy = require('../deploy.js');


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

        sess._buff = utils.NewPacket();
        sess._send = +new Date();
        sess.Send(sess._buff);
    },

    on_closed(sess) {
        delete rec[sess.sid];
        cnt--;
    },

    on_packet(sess, packet) {
        console.log(`收到回应包:${sess.sid}`);
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
            sess._buff = utils.NewPacket();
            sess._send = +new Date();
            sess.Send(sess._buff);
        }, 3000);
    },
}

var sid = 1;
let tms = 0;

let tid = setInterval(() => {

    let c = net.createConnection(deploy.tcp_port, "118.24.48.149");

    c.on('connect', () => {
        var sess = new session.Session(c, sid, mgr_cli);
        mgr_cli.on_connection(sess);
        sid++;
    });

    c.on('error', (err) => {
        console.log("SOCKET error, err = ", err);
    });

	if (++tms >= MAX_CONNECTION) {
		clearInterval(tid);
	}
}, 100);

