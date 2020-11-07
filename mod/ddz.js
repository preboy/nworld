// ----------------------------------------------------------------------------
// var

let mod_data = g_module_data(module, {
    all_tables: {},
});

let all_tables = mod_data.all_tables;


// ----------------------------------------------------------------------------
// const

const evt_key_1 = "ddz_table_finished";
const evt_key_2 = "ddz_table_deck_finished";

// 方位
const POS_E = 0;
const POS_S = 1;
const POS_W = 2;

const CALL_LAST = 15 * 1000;    // 最长叫分时间

// 牌副阶段
const DECK_STAGE_CALL = 1;       // 叫分
const DECK_STAGE_WALK = 2;       // 打牌
const DECK_STAGE_OVER = 3;       // 结束
const DECK_STAGE_PASS = 4;       // 流局

// 牌副结果是否春天
const DECK_SPRING_NOT = 1;       // 不是春天
const DECK_SPRING_YES = 2;       // 春天
const DECK_SPRING_OPP = 3;       // 反春

// 牌的花型
const CARD_TYPE_CLUBS = 1;      // 梅花
const CARD_TYPE_HEARTS = 2;     // 红桃
const CARD_TYPE_SPADES = 3;     // 黑桃
const CARD_TYPE_DIAMONDS = 4;   // 方块
const CARD_TYPE_JOKER = 5;      // 王

// 牌的点数
const CARD_POINT_3 = 3;
const CARD_POINT_4 = 4;
const CARD_POINT_5 = 5;
const CARD_POINT_6 = 6;
const CARD_POINT_7 = 7;
const CARD_POINT_8 = 8;
const CARD_POINT_9 = 9;
const CARD_POINT_T = 10;
const CARD_POINT_J = 11;
const CARD_POINT_Q = 12;
const CARD_POINT_K = 13;
const CARD_POINT_A = 14;
const CARD_POINT_2 = 16;
const CARD_POINT_JOKER_S = 18;
const CARD_POINT_JOKER_B = 20;

// 出牌历史
const HISTORY_TYPE_CALL = 10;   // 叫分
const HISTORY_TYPE_HAND = 20;   // 出牌


// 手牌类型
const HAND_TYPE_1 = 1;

// 单张



// 所有的牌
let CARD = Array(54);
let CARD_MAP =
{
    C3 : CARD_TYPE_CLUBS * 10000  + CARD_POINT_3,
    C4 : CARD_TYPE_CLUBS * 10000  + CARD_POINT_4,
    C5 : CARD_TYPE_CLUBS * 10000  + CARD_POINT_5,
    C6 : CARD_TYPE_CLUBS * 10000  + CARD_POINT_6,
    C7 : CARD_TYPE_CLUBS * 10000  + CARD_POINT_7,
    C8 : CARD_TYPE_CLUBS * 10000  + CARD_POINT_8,
    C9 : CARD_TYPE_CLUBS * 10000  + CARD_POINT_9,
    CT : CARD_TYPE_CLUBS * 10000  + CARD_POINT_T,
    CJ : CARD_TYPE_CLUBS * 10000  + CARD_POINT_J,
    CQ : CARD_TYPE_CLUBS * 10000  + CARD_POINT_Q,
    CK : CARD_TYPE_CLUBS * 10000  + CARD_POINT_K,
    CA : CARD_TYPE_CLUBS * 10000  + CARD_POINT_A,
    C2 : CARD_TYPE_CLUBS * 10000  + CARD_POINT_2,
    H3 : CARD_TYPE_HEARTS * 10000  + CARD_POINT_3,
    H4 : CARD_TYPE_HEARTS * 10000  + CARD_POINT_4,
    H5 : CARD_TYPE_HEARTS * 10000  + CARD_POINT_5,
    H6 : CARD_TYPE_HEARTS * 10000  + CARD_POINT_6,
    H7 : CARD_TYPE_HEARTS * 10000  + CARD_POINT_7,
    H8 : CARD_TYPE_HEARTS * 10000  + CARD_POINT_8,
    H9 : CARD_TYPE_HEARTS * 10000  + CARD_POINT_9,
    HT : CARD_TYPE_HEARTS * 10000  + CARD_POINT_T,
    HJ : CARD_TYPE_HEARTS * 10000  + CARD_POINT_J,
    HQ : CARD_TYPE_HEARTS * 10000  + CARD_POINT_Q,
    HK : CARD_TYPE_HEARTS * 10000  + CARD_POINT_K,
    HA : CARD_TYPE_HEARTS * 10000  + CARD_POINT_A,
    H2 : CARD_TYPE_HEARTS * 10000  + CARD_POINT_2,
    S3 : CARD_TYPE_SPADES * 10000  + CARD_POINT_3,
    S4 : CARD_TYPE_SPADES * 10000  + CARD_POINT_4,
    S5 : CARD_TYPE_SPADES * 10000  + CARD_POINT_5,
    S6 : CARD_TYPE_SPADES * 10000  + CARD_POINT_6,
    S7 : CARD_TYPE_SPADES * 10000  + CARD_POINT_7,
    S8 : CARD_TYPE_SPADES * 10000  + CARD_POINT_8,
    S9 : CARD_TYPE_SPADES * 10000  + CARD_POINT_9,
    ST : CARD_TYPE_SPADES * 10000  + CARD_POINT_T,
    SJ : CARD_TYPE_SPADES * 10000  + CARD_POINT_J,
    SQ : CARD_TYPE_SPADES * 10000  + CARD_POINT_Q,
    SK : CARD_TYPE_SPADES * 10000  + CARD_POINT_K,
    SA : CARD_TYPE_SPADES * 10000  + CARD_POINT_A,
    S2 : CARD_TYPE_SPADES * 10000  + CARD_POINT_2,
    D3 : CARD_TYPE_DIAMONDS * 10000  + CARD_POINT_3,
    D4 : CARD_TYPE_DIAMONDS * 10000  + CARD_POINT_4,
    D5 : CARD_TYPE_DIAMONDS * 10000  + CARD_POINT_5,
    D6 : CARD_TYPE_DIAMONDS * 10000  + CARD_POINT_6,
    D7 : CARD_TYPE_DIAMONDS * 10000  + CARD_POINT_7,
    D8 : CARD_TYPE_DIAMONDS * 10000  + CARD_POINT_8,
    D9 : CARD_TYPE_DIAMONDS * 10000  + CARD_POINT_9,
    DT : CARD_TYPE_DIAMONDS * 10000  + CARD_POINT_T,
    DJ : CARD_TYPE_DIAMONDS * 10000  + CARD_POINT_J,
    DQ : CARD_TYPE_DIAMONDS * 10000  + CARD_POINT_Q,
    DK : CARD_TYPE_DIAMONDS * 10000  + CARD_POINT_K,
    DA : CARD_TYPE_DIAMONDS * 10000  + CARD_POINT_A,
    D2 : CARD_TYPE_DIAMONDS * 10000  + CARD_POINT_2,
    J1 : CARD_TYPE_JOKER * 10000  + CARD_POINT_JOKER_S,
    J2 : CARD_TYPE_JOKER * 10000  + CARD_POINT_JOKER_B,
};

function init_card() {
    CARD = Object.values(CARD_MAP);
}

// ----------------------------------------------------------------------------
// 协议消息定义

/*
    ntf : 服务器主动发的通知，针对单个玩家
    brd : 服务器广播
    req : 客户端请求
    res : 服务器回应请求
*/
const msg_init_brd = 100;   // 初始       data: {player:{e:{},...}, total_deck:20}
const msg_deal_ntf = 101;   // 发牌       data: {deck_idx: 1, card:[1,...]}
const msg_call_req = 102;   // 叫分       data: {score: 2}
const msg_call_res = 103;   //            ret:0, msg:"OK"
const msg_call_brd = 104;   //            data: {curr : {pid: 1, score:2}, next:{pid:}}, 
const msg_lord_brd = 105;   // 地主       data: {lord_pos: 1, score:3}
const msg_hand_req = 106;   // 出牌       data: {card:[2,3,]}
const msg_hand_res = 107;   //            ret:0, msg:"OK"
const msg_hand_brd = 108;   //            data: {prev : {pid: 1, card:[2,3,]}, next : {pid: 1, first:true, type : 1}}
const msg_deck_brd = 109;   // 结果       data: {lord_win: true, e:-6,w:3,s:3}
const msg_over_brd = 110;   // 结束       data: {e:0,w:13,s:-13}

// 给单个玩家发送消息
function send_msg(pid, msg) {

}

// 广播消息
function broad_msg(pids, msg) {

}

// ----------------------------------------------------------------------------
// card define



// ----------------------------------------------------------------------------
// local aux

function pos_i2a(pos) {
    if (pos == 0) return "e";
    if (pos == 1) return "s";
    if (pos == 2) return "w";
}

function pos_a2i(pos) {
    if (pos == "e") return 0;
    if (pos == "s") return 1;
    if (pos == "w") return 2;    
}

function rand_pos() {
    return gCoreUtils.RandInt(3);
}

function next_pos(pos) {
    if (pos == 2) {
        return 0;
    } else {
        return pos + 1;
    }
}

function check_conf(conf) {
    /*
    conf = {
        tid : "",       // 唯一ID

        player : {     // 三个玩家 (索引即是位置)
            "e" : {
                pid: "",
                name: "",
            },
            "s" : {},
            "w": {},
        },

        deck : 100,   // 总共要打的牌副数
    }
    */

    return true;
}

// 本副牌初始化
function init_deck(table) {
    let {conf, calc, data } = table;

    data.player = { e : [], s : [], w : [], };
    data.cards = [...gCoreUtils.Shuffle(CARD)];
    data.deck_data = create_table_deck(table);
    data.stage_start_ts = Tick();

    data.call_pos = data.deck_data.start_pos;
    data.call_start_ts = Tick();

    LogicTable.SwitchStage(table, DECK_STAGE_CALL);
}

// 最终结算的数据结构
function create_table_calc() {
    let calc = 
    {
        deck : 0,               // 已完成的副数
        calc : {                // 当前的统计信息
            "e" : {
                score : 1,      // 最后总得分
                win_cnt: 0,     // 胜场数
                lost_cnt : 0,   // 败场数
                lord_cnt : 0,   // 地主场数
            },
            "s" : {
                score : 1,
                win_cnt: 0,    
                lost_cnt : 0,  
                lord_cnt : 0,  
            },
            "w": {
                score : 1,
                win_cnt: 0,    
                lost_cnt : 0,  
                lord_cnt : 0, 
            },
        },

        history : [],           // 牌副历史数据
    };

    return calc;
}

// 运行中的数据
function create_table_data() {
    // NOTE: 此处的数据要在 init_deck 中初始化，或者置空
    let data = 
    {
        cards : null,
        deck_data : null,       // from create_table_deck
        stage_start_ts:0,       // 当前阶段开始时间戳

        player : { e : [], s : [], w : [], },   // 玩家手中的牌

        call_pos : 0,           // 当前叫分者
        call_start_ts: 0,       // 开始叫分时间
    };

    return data;
}

// 一副牌的数据
function create_table_deck(table) {
    let {conf, calc, data } = table;

    let deck =
    {
        ts : Tick(),                    // 本副开始时间戳
        index : calc.deck+1,            // 当前第n副牌
        stage : DECK_STAGE_CALL,        // 当前阶段(叫分、打牌、已结束、流局)

        card : {                        // 手牌
            e : [],                     // 东
            s : [],                     // 南
            w : [],                     // 西
            b : [],                     // 底牌
        },

        calc : {
            start_pos : rand_pos(),         // 随机生成的首叫位置
            lord_pos : -1,                  // 地主方位
            score : 0,                      // 最终叫分
            seq : [-1, -1, -1],             // 索引:叫分
        },

        hand : [                // 每一手出牌数据
            /*
            {
                ts : 0,         // 开始时间
                first : true,   // 是否首出(或者跟牌)
                pass : true,    // 过否
                card : [],      // 出的牌
            },
            */
        ],

        calc : {                        // 结算数据
            spring : DECK_SPRING_NOT,   // 春天标识
            rocket_cnt : 0,             // 火箭数
            bomb_cnt :  0,              // 炸弹数
            lord_win : true,            // 地主胜否
            e : 0,
            w : 0,
            s : 0,
        }
    };
    
    let cards = data.cards;
    
    for(let i = 0; i < 17; i++) {
        let idx = 0 * 17 + i;
        deck.card.e.push(cards[idx]);
        data.player.e.push(cards[idx]);        
    }

    for(let i = 0; i < 17; i++) {
        let idx = 1 * 17 + i;
        deck.card.s.push(cards[idx]);
        data.player.s.push(cards[idx]);
    }

    for(let i = 0; i < 17; i++) {
        let idx = 2 * 17 + i;
        deck.card.w.push(cards[idx]);
        data.player.w.push(cards[idx]);
    }

    deck.card.b.push(cards[51]);
    deck.card.b.push(cards[52]);
    deck.card.b.push(cards[53]);

    return deck;
}

function pos_to_pid(table, pos) {
    return table.conf.player[pos].pid;
}

function pid_to_pos(table, pid) {
    let player = table.conf.player;

    for (let pos in player) {
        if (player[pos].pid == pid) {
            return e;
        }
    }
}

function add_history(table, history) {
    let {conf, calc, data } = table;
    data.deck_data.hand.push(history);
}

function get_table_pids(table) {
    let pids = [];
    let player = table.conf.player;

    for (let k in player) {
        pids.push(player[k].pid);
    }

    return pids;
}

// ----------------------------------------------------------------------------
// LogicTable

let LogicTable = {};

LogicTable.Update = (table) => {
    let stage = table.data.deck_data.stage;

    switch (stage) {
        case DECK_STAGE_CALL: {
            LogicTable.UpdateCALL(table);
        }
        break;

        case DECK_STAGE_WALK: {
            LogicTable.UpdateWALK(table);
        }
        break;

        case DECK_STAGE_OVER: {
            LogicTable.UpdateOVER(table);
        }
        break;

        case DECK_STAGE_PASS: {
            LogicTable.UpdatePASS(table);
        }
        break;
    }
};

LogicTable.Message = (table, pid, msg) => {
    let stage = table.data.deck_data.stage;

    switch (stage) {
        case DECK_STAGE_CALL: {
            LogicTable.MessageCALL(table, pid, msg);
        }
        break;

        case DECK_STAGE_WALK: {
            LogicTable.MessageWALK(table, pid, msg);
        }
        break;

        case DECK_STAGE_OVER: {
            LogicTable.MessageOVER(table, pid, msg);
        }
        break;

        case DECK_STAGE_PASS: {
            LogicTable.MessagePASS(table, pid, msg);
        }
        break;
    }
};

LogicTable.SwitchStage = (table, next_stage) => {
    let {conf, calc, data } = table;
    data.deck_data.stage = next_stage;

    switch (next_stage) {
        case DECK_STAGE_CALL: {
            LogicTable.EnterCALL(table);
        }
        break;

        case DECK_STAGE_WALK: {
            LogicTable.EnterWALK(table);
        }
        break;

        case DECK_STAGE_OVER: {
            LogicTable.EnterOVER(table);
        }
        break;

        case DECK_STAGE_PASS: {
            LogicTable.EnterPASS(table);
        }
        break;
    }
}

// ----------------------------------------------------------------------------
// stage call

LogicTable.EnterCALL = (table) => {
    let {conf, calc, data } = table;

    // 通知所有人的牌
    let player = data.player;
    for (let pos in player) {
        send_msg(pos_to_pid(table, pos), {
            id : msg_deal_ntf,
            data : {
                deck_idx: data.deck_data.index,
                card : player[pos],
            }
        });
    }
}

LogicTable.UpdateCALL = (table) => {
    let {conf, calc, data } = table;

    let now = Tick();
    let call = data.deck_data.call;

    // 超时未叫分，做自动叫0分
    if (call.seq[data.call_pos] == -1) {
        if (now - data.call_start_ts > CALL_LAST) {
            call.seq[data.call_pos] = 0;

            // 设置下一个叫分者
            let next = next_pos(data.call_pos);
            if (call.seq[next] == -1) {
                data.call_pos = next;
                data.call_start_ts = now;
                
                let brd = {
                    id : msg_call_brd,
                    data : {
                        curr : {
                            pid : data.call_pos,
                            score : 0,
                        },
                        next: {
                            pid : next,
                        }
                    }
                };

                broad_msg(get_table_pids(table), brd);
            }
        }
    }

    // 跳阶段处理
    if (true) {
        let pos = -1;
        let score = -1;

        for(let i = 0; i < 3; i++) {
            if (call.seq[i] == -1) {
                return;
            }
            if (call.seq[i] > score) {
                score = call.seq[i];
                pos = i;
            }
        }

        if (score == 0) {
            LogicTable.SwitchStage(table, DECK_STAGE_PASS);
        } else {
            call.score = score;
            call.lord_pos = pos;
            LogicTable.SwitchStage(table, DECK_STAGE_WALK);        
        }
    }
};

LogicTable.MessageCALL = (table, pid, msg) => {
    let {conf, calc, data } = table;
    // 玩家消息

    let res = {
        id : msg.id,
        ret : -1,
        msg : "FAILED"
    };

    switch(msg.id) {
        case msg_call_req:
        {
            let pos = pos_a2i(pid_to_pos());
            let score = msg.data.score;

            // 是否已叫分
            let call = data.deck_data.call;
            if (call.seq[pos] != -1) {
                msg.ret = -11;
                msg.msg = "已经叫过了";
                send_msg(pid, msg);
                return;
            }

            if (call.score >= score) {
                msg.ret = -12;
                msg.msg = "叫分过小";
                send_msg(pid, msg);
                return;
            }

            call.seq[pos] = score;
            call.score = score;
            
            msg.ret = 0;
            msg.msg = "OK";
            send_msg(pid, msg);

            add_history(table, {
                ts : Tick(),
                pos : pos,
                type : HISTORY_TYPE_CALL,
                data : { score },
            });

            let brd = {
                id : msg_call_brd,
                data : {
                    curr : {
                        pid,
                        score,    
                    },
                    next: {
                        pid : -1,
                    }
                }
            };

            // 设置下一个叫分者
            let next = next_pos(pos);
            if (call.seq[next] == -1) {
                data.call_pos = next;
                data.call_start_ts = now;
                brd.data.next.pid = next;
            }

            broad_msg(get_table_pids(table), brd);
        }
        break;
    }
}

// ----------------------------------------------------------------------------
// stage walk

LogicTable.EnterWALK = (table) => {
    let {conf, calc, data } = table;

    // 确定地主
    let max = -1;
    let pos = -1;

    let call = data.deck_data.call;

    for(let i = 0; i < 3; i++ ) {
        if (call.seq[i] > max) {
            max = call.seq[i];
            pos = i;
        }
    }

    call.score = max;
    call.lord_pos = pos;

    // 下一阶段开始
    data.stage_start_ts = Tick();

    let pids = get_table_pids(table);

    // 通知叫分结果
    broad_msg(pids, {
        id : msg_lord_brd,
        data : {
            lord_pos: call.lord_pos,
            score: call.score,
        }
    });

    // 通知出牌
    broad_msg(pids, {
        id : msg_hand_brd,
        data : {
            prev: null,
            next : {
                pid : ,
                type : ,
                first : true,
            }
        }
    });
}

LogicTable.UpdateWALK = (table) => {
    let {conf, calc, data } = table;
};

LogicTable.MessageWALK = (table, pid, msg) => {
    let {conf, calc, data } = table;
}

// ----------------------------------------------------------------------------
// stage OVER

LogicTable.EnterOVER = (table) => {
}

LogicTable.UpdateOVER = (table) => {
    let {conf, calc, data } = table;
};

LogicTable.MessageOVER = (table, pid, msg) => {
    let {conf, calc, data } = table;
}

// ----------------------------------------------------------------------------
// stage PASS

LogicTable.EnterPASS = (table) => {
}

LogicTable.UpdatePASS = (table) => {
    let {conf, calc, data } = table;
};

LogicTable.MessagePASS = (table, pid, msg) => {
    let {conf, calc, data } = table;
}

// ----------------------------------------------------------------------------
// exports

exports.init = () => {
    init_card();

    gCoreEvtMgr.Once(gConst.EVT_DDZ_Table_Finished, evt_key_1, (evtId, tid) => {
        delete all_tables[tid];
        console.log("event, ", tid);
    });
}

exports.release = () => {
    gCoreEvtMgr.Off(gConst.EVT_DDZ_Table_Finished, evt_key_1);
}

exports.Start = () => {
};

exports.Stop = () => {
};

// 开启一桌
exports.StartTable = (conf) => {
    if (!check_conf(conf)) {
        return "invalid conf";
    }

    let tid = conf.tid;

    if (all_tables[tid]) {
        return "exist table";
    }

    let table = {
        conf,
        calc: create_table_calc(),
        data: create_table_data(),  
    };

    init_deck(table);
    all_tables[key] = table;

    return "OK";
};

// 运行
exports.Update = () => {
    for (let table in all_tables) {
        LogicTable.Update(table);
    }
};

exports.Message = (tid, pid, msg) => {
    let table = all_tables[tid];
    if (table) {
        LogicTable.Message(table, pid, msg);    
    }
}