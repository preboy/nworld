exports.init = () => {
}

exports.release = () => {
}

global.print = (...args) => {
    console.log(`[${new Date().toISOString()}]`, ...args);
}

// 获取当前的秒
global.Now = () => {
    return Math.floor(+new Date() / 1000);
};


// 获取当前的tick
global.Tick = () => {
    let now = new Date();
    return +now;
};
