exports.init = () => {
    console.log('global: init');
}

exports.release = () => {
    console.log('global: release');
}

global.print = console.log

// 获取当前的秒
global.now = () => {
    return Math.floor(+new Date() / 1000);
};
