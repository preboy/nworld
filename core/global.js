exports.x = 'global ss';


console.log('go')


exports.init = () => {
    console.log(' global , init')
}


exports.release = () => {
    console.log(' global , release')
}
