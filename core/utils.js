// 返回一个介于min和max之间的整型随机数
function RandIntRange(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

function RandInt(max) {
	return RandIntRange(0, max);
}

// 生成协议(测试使用)
function NewPacket() {
	let len = RandIntRange(3, 80);
	let pid = RandIntRange(1, 20);

	let buf = Buffer.allocUnsafe(len);
	buf.writeUInt16LE(pid, 0);

	for (let i = 2; i < len; i++) {
		let ch = RandIntRange(65, 125);
		buf.writeUInt8(ch, i);
	}

	return buf;
}

// ----------------------------------------------------------------------------

module.exports = {
	RandIntRange,
	RandInt,

	NewPacket,
}
