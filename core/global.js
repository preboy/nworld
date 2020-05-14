exports.init = () => {
    console.log('global: init');
}

exports.release = () => {
    console.log('global: release');
}

global.print = (...args) => {
    console.log(`[${new Date().toISOString()}]`, ...args);
}

// 获取当前的秒
global.Now = () => {
    return Math.floor(+new Date() / 1000);
};
