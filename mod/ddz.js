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
const POS_E = "east";
const POS_S = "south";
const POS_W = "west";

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
// card define



// ----------------------------------------------------------------------------
// local aux

function rand_pos() {
    let r = gCoreUtils.RandInt(3);
    if (r == 0) return "e";
    if (r == 1) return "s";
    if (r == 2) return "w";
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
function deck_init(table) {
    let {conf, calc, data } = table;

    data.cards = [...gCoreUtils.Shuffle(CARD)];
    data.deck_data = create_table_deck(table);
    data.stage_start_ts = Tick();

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
    let data = 
    {
        cards : null,
        deck_data : null,    // from create_table_deck
        stage_start_ts:0,    // 当前阶段开始时间戳

        player : {           // 玩家手中的牌
            e : [],
            s : [],
            w : [],
        },
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

        start_pos : rand_pos(),         // 随机生成的首叫位置
        lord_pos : "",                  // 地主方位

        card : {                        // 手牌
            e : [], 
            s : [], 
            w : [], 
        },

        bottom: [],             // 底牌

        call : {                // 叫分数据
            score : 0,          // 最终叫分
            seq : [],           // [{"e" : 0}, {"s" : 2,}, {"w" 3,}]
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
    }

    for(let i = 0; i < 17; i++) {
        let idx = 1 * 17 + i;
        deck.card.e.push(cards[idx]);
    }

    for(let i = 0; i < 17; i++) {
        let idx = 2 * 17 + i;
        deck.card.e.push(cards[idx]);
    }

    deck.bottom.push(cards[51]);
    deck.bottom.push(cards[52]);
    deck.bottom.push(cards[53]);

    return deck;
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
}

LogicTable.UpdateCALL = (table) => {
    let {conf, calc, data } = table;

    let now = Tick();
    // 流局或者打牌
};

// ----------------------------------------------------------------------------
// stage walk

LogicTable.EnterWALK = (table) => {
}

LogicTable.UpdateWALK = (table) => {
    let {conf, calc, data } = table;
};

// ----------------------------------------------------------------------------
// stage OVER

LogicTable.EnterOVER = (table) => {
}

LogicTable.UpdateOVER = (table) => {
    let {conf, calc, data } = table;
};

// ----------------------------------------------------------------------------
// stage PASS

LogicTable.EnterPASS = (table) => {
}

LogicTable.UpdatePASS = (table) => {
    let {conf, calc, data } = table;
};


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

    deck_init(table);
    all_tables[key] = table;

    return "OK";
};

// 运行
exports.Update = () => {
    for (let table in all_tables) {
        LogicTable.Update(table);
    }
};
