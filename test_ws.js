const WebSocket = require('ws');
 
const ws = new WebSocket('ws://127.0.0.1:8080');
 
let s = 0;
let c = [
    "fuck",
    "fuckyou",
]

ws.on('open', function open() {
    setInterval(()=>{
        let obj = {
            op: c[s%2],
            a:33,
            b:"fuckyou",
            c:322.33534,
            d: false,
        }

        ws.send(JSON.stringify(obj));
        s++;
    }, 1000);
});


ws.on('message', function incoming(data) {
  console.log(data);
});
