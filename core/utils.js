// 返回随机整数[min, max)
function RandIntRange(min, max) {
	return Math.floor(Math.random() * (max - min) + min);
}

// 返回随机整数[0, max)
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

// 打乱数组
function Shuffle(arr) {
	let l = arr.length;
	for (let i = 0; i < l; i++) {
		let r = RandInt(l);
		if (r != i) {
			[arr[i], arr[r]] = [arr[r], arr[i]];
		}
	}
}

// ----------------------------------------------------------------------------

module.exports = {
	RandIntRange,
	RandInt,

	Shuffle,

	NewPacket,
}
