class Session {

    constructor(c, sid, mgr) {
        this.socket = c;
        this.sid = sid;
        this.recv_buffer = null;
        this.sending = false;
        this.send_queue = [];

        c.setTimeout(10 * 1000);

        c.on('data', (data) => {
            if (this.recv_buffer) {
                data = Buffer.concat([this.recv_buffer, data]);
                this.recv_buffer = null;
            }

            if (data.byteLength < 4 + 2) {
                this.recv_buffer = data;
                return;
            }

            // read header
            let packet_size = data.readUInt32LE(0);
            if (packet_size > 0x10000) {
                console.log("超大的包");
                c.end("超大的包");
                return;
            }

            if (data.byteLength - 4 < packet_size) {
                this.recv_buffer = data;
                return;
            }

            let packet = Buffer.allocUnsafe(packet_size);
            let bytes = data.copy(packet, 0, 4, 4 + packet_size);
            if (bytes != packet_size) {
                console.log("拷贝消息失败");
                c.end("拷贝消息失败");
                return;
            }

            this.recv_buffer = null;
            if (data.byteLength - 4 > packet_size) {
                this.recv_buffer = Buffer.allocUnsafe(data.byteLength - (packet_size + 4));
                let bytes = data.copy(this.recv_buffer, 0, (packet_size + 4), data.byteLength - (packet_size + 4));
                if (bytes != data.byteLength - (packet_size + 4)) {
                    console.log("拷贝数据失败");
                    c.end("拷贝数据失败");
                    return;
                }
            }

            mgr.on_packet(this, packet);
        });

        c.on('timeout', () => {
            console.log('socket timeout: ', this.sid);
            c.destroy();
        });

        c.on('drain', () => {
            this.sending = false;
        });

        c.on('error', (err) => {
            console.log("SESSION error, err = ", err);
            if (!c.destroyed) {
                c.destroy();
            }
        });

        c.on('close', (had_error) => {
            mgr.on_closed(this);
            console.log("socket closed, err = ", had_error);
        });
    }

    Send(packet) {
        if (this.socket.destroyed) {
            return;
        }

        let data = Buffer.allocUnsafe(packet.byteLength + 4);
        data.writeUInt32LE(packet.byteLength);
        data.fill(packet, 4);

        if (this.sending) {
            this.send_queue.push(data);
            return;
        }

        let send_buffer = data;

        if (this.send_queue.length > 0) {
            send_buffer = Buffer.concat(this.send_queue);
            send_buffer = Buffer.concat([send_buffer, data]);
            this.send_queue = [];
        }

        let ret = this.socket.write(send_buffer);
        if (!ret) {
            this.sending = true;
            console.log("data queued in user memory!");
        }
    }

    Stop() {
        if (!this.socket.destroyed) {
            this.socket.end();
        }
    }
}


// ----------------------------------------------------------------------------
exports.Session = Session;
