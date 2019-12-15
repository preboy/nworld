let plrs = {};  // pid -> plr_data
const PLAYERS_TABLE_NAME = 'players';

// ----------------------------------------------------------------------------
// data template

function initial_plr_data() {
    return {
        Coin: 0,    // 金币
        Gold: 0,    // 元宝(充值获得)
        Card: 0,    // 房卡
    }
}


// ----------------------------------------------------------------------------
// Player Class

class Player {
    constructor(pid, data) {
        this.pid = pid;     // 玩家账号
        this.data = data;   // 玩家数据
        this.dirty = 0;     // 数据变脏的时间
    }

    plr_data() {
        return this.data;
    }

    save(force = false) {
        if (!force) {
            if (this.dirty == 0) {
                return;
            }

            let ts = now();
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
    GetPlr,     // 查找玩家，不存在就创建玩家对象，提供回调函数

    Start,
    Stop,
}
