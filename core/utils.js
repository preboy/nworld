// 返回一个介于min和max之间的整型随机数
function RandInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}


// 生成协议(测试使用)
function NewPacket() {
	let len = RandInt(3, 80);
	let pid = RandInt(1, 20);

	let buf = Buffer.allocUnsafe(len);
	buf.writeUInt16LE(pid, 0);

	for (let i = 2; i < len; i++) {
		let ch = RandInt(65, 125);
		buf.writeUInt8(ch, i);
	}

	return buf;
}

// ----------------------------------------------------------------------------

module.exports = {
	RandInt,
	NewPacket,
}
