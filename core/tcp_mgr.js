const net = require('net');
const session = require('./tcp_session');

// ----------------------------------------------------------------------------
// tcp manager

class Manager {
    constructor() {
        this.svr = null;
        this.rec = {};
        this.sid = 1;
        this.cnt = 0;
        this.tid = 0;

        this.sec = 0;
        this.curr_count = 0;
        this.prev_count = 0;
    }

    Start() {
        this.tid = setInterval(() => {
            console.warn("total %d connections, %d packets per second !", this.cnt, this.prev_count);
        }, 5 * 1000);
    }

    Stop() {
        if (this.tid) {
            clearInterval(this.tid);
        }

        for (let k in this.rec) {
            this.rec[k].end();
        }

        this.tid = 0;
        this.rec = {};
    }

    OnRecvPacket(func) {
        this.fn_recv_packet = func;
    }

    // event
    on_connection(c) {
        let sess = new session.Session(c, this.sid, this);
        this.rec[sess.sid] = sess;
        this.cnt++;
        this.sid++;
    }

    on_closed(sess) {
        delete this.rec[sess.sid];
        this.cnt--;
    }

    on_packet(sess, packet) {
        let code = packet.readUInt16LE();
        let body = packet.slice(2);

        this.fn_recv_packet(sess, code, body, packet);

        // stat
        this.curr_count++;

        let now = new Date();
        let sec = now.getSeconds();

        if (this.sec != sec) {
            this.sec = sec;
            this.prev_count = this.curr_count;
            this.curr_count = 0;
        }
    }

    set_server(svr) {
        this.svr = svr;
    }

    clr_server() {
        this.svr = null;
    }
}

// ----------------------------------------------------------------------------
// tcp server

class Server {

    constructor(mgr) {
        this.mgr = mgr;
        this.svr = null;
        this.mgr.set_server(this);
    }

    Start(host, port) {
        this.svr = net.createServer((c) => {
            this.mgr.on_connection(c);
        });

        this.svr.on('error', (err) => {
            console.warn("listen err:", err);
            throw err;
        });

        this.svr.listen(port, host);
    }

    Stop() {
        this.mgr.clr_server();

        if (this.svr) {
            this.svr.close(function () {
                this.svr = null;
                console.log("tcp svr closed !");
            });
        }
    }
}

// ----------------------------------------------------------------------------
exports.Manager = Manager;
exports.Server = Server;
