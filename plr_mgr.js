let plrs = {};  // pid -> plr_data
const PLAYERS_TABLE_NAME = 'players';

// ----------------------------------------------------------------------------
// data template
let free_names = [
    '梦中桃源',
    '冰河铁骑',
    '陌上如玉',
    '玄境真君',
    '西子霓裳',
    '独藏乾坤',
    '一去三生',
    '踏月留香',
    '掌缘生灭',
    '大漠空回首',
    '豪情满云天',
    '暗情难述',
    '相思成灰',
    '风凌黄衫',
];


function rand_nickname() {
    let idx = gCoreUtils.RandInt(free_names.length);
    let rnd = gCoreUtils.RandIntRange(1000, 9999);

    return `${free_names[idx]}_${rnd}`;
}

function initial_plr_data() {
    return {
        Coin: 0,    // 金币
        Gold: 0,    // 元宝(充值获得)
        Card: 0,    // 房卡
        Name: rand_nickname(),

        Play: {   // 游戏数据
            rid: 0,    // 当前房间ID
            tid: 0,    // 当前桌子ID
            pos: null, // 当前位置
        },
    }
}


// ----------------------------------------------------------------------------
// Player Class

class Player {
    constructor(pid, data) {
        this.ws = null;
        this.pid = pid;     // 玩家账号
        this.data = data;   // 玩家数据
        this.dirty = 0;     // 数据变脏的时间
    }

    plr_data() {
        return this.data;
    }

    GetName() {
        return this.data.Name;
    }

    GetData() {
        return this.data.Play;
    }

    save(force = false) {
        if (!force) {
            if (this.dirty == 0) {
                return;
            }

            let ts = Now();
            if (ts - this.dirty < 300) {
                return;
            }
        }

        this.dirty = 0;

        try {
            let str = JSON.stringify(this.data);
            let db = gDbMgr.Redis();

            db.hset(PLAYERS_TABLE_NAME, this.pid, str, (err, obj) => {
                if (err) {
                    console.info(`save ${this.pid} error =`, err);
                }
            });
        } catch (err) {
            console.error(`JSON.stringify error: pid=${this.pid}, err=`, err);
        }
    }

    SendMsg(msg) {
        this.SendStr(JSON.stringify(msg));
    }

    SendStr(str) {
        if (this.ws) {
            this.ws.send(str);
        }
    }

    online(ws) {
        this.ws = ws;
        ws.plr = this;

        // 发送玩家基本信息到客户端
        this.SendMsg({
            op: 'plr_data',
            data: this.data,
        });
    }

    offline() {
        this.save();

        this.ws.plr = null;
        this.ws = null;
    }

    isOnline() {
        return this.ws != null;
    }

    AddCoin(cnt) {
        if (cnt < 0) {
            return false;
        }

        this.data.Coin += cnt;

        this.notify_coin();
        return true;
    }

    SubCoin(cnt) {
        if (cnt < 0) {
            return false;
        }

        this.data.Coin -= cnt;

        if (this.data.Coin < 0) {
            this.data.Coin = 0;
        }

        this.notify_coin();
        return true;
    }

    EnoughCoin(cnt) {
        return this.data.Coin >= cnt;
    }

    notify_coin() {
        process.nextTick(() => {
            this.SendMsg({
                op: "property",
                Coin: this.data.Coin,
                Gold: this.data.Gold,
                Card: this.data.Card,
            });
        });
    }
}

// ----------------------------------------------------------------------------
// local

// 加载所有的玩家
function load_all_players() {
    let db = gDbMgr.Redis();

    db.hgetall(PLAYERS_TABLE_NAME, function (err, reply) {
        if (err) {
            console.error('load load_all_players error: ', err);
            process.abort();
            return;
        }

        let count = 0;
        for (let pid in reply) {
            try {
                let data = JSON.parse(reply[pid]);
                let plr = new Player(pid, data);
                plrs[pid] = plr;
                count++;
            } catch (err) {
                console.error(`JSON.parse player error: pid=${pid}, data=${reply[pid]}`);
            }
        }

        console.info(`load_all_players: ${count} players`);
    });
}

// ----------------------------------------------------------------------------
// exports

function FindPlr(pid) {
    return plrs[pid];
}

function GetPlr(pid) {
    let plr = FindPlr(pid);
    if (!plr) {
        plr = new Player(pid, initial_plr_data());
        plrs[pid] = plr;
        plr.save(true);
    }

    return plr;
}

function Start() {
    gCoreEvtMgr.Once(gConst.EVT_REDIS_READY, () => {
        load_all_players();
    });
}

function Stop() {
    for (let pid in plrs) {
        let plr = plrs[pid];
        plr.save(true);
    }

    console.info('all players saved');
}


// ----------------------------------------------------------------------------
// exports

module.exports = {
    FindPlr,    // 查找玩家，可能不存在
    GetPlr,     // 查找玩家，不存在就创建玩家对象

    Start,
    Stop,
}
