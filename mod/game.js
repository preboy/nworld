// 房间类型：   表格配置

const STAGE_SIGN = 0;   // 报名阶段
const STAGE_GAME = 1;   // 玩法阶段
const STAGE_CALC = 2;   // 结算阶段

const STAGE_LAST = [
    20,     // 报名阶段最长时间
    300,    // 玩法阶段最长时间
    20,     // 结算阶段最长时间
];

const MAX_SEATS_CNT = 18;   // 最大座位数，注：第一个位置不坐人

const MAX_MONEY = 100;      // 单手最大出钱数

// 牌的花型
const CARD_TYPE_CLUB = 1;       // 梅花
const CARD_TYPE_HEARTS = 2;     // 红桃
const CARD_TYPE_SPADES = 3;     // 黑桃
const CARD_TYPE_DIAMONDS = 4;   // 方块

// 牌的点数
const CARD_POINT_A = 1;
const CARD_POINT_2 = 2;
const CARD_POINT_3 = 3;
const CARD_POINT_4 = 4;
const CARD_POINT_5 = 5;
const CARD_POINT_6 = 6;
const CARD_POINT_7 = 7;
const CARD_POINT_8 = 8;
const CARD_POINT_9 = 9;
const CARD_POINT_10 = 10;
const CARD_POINT_J = 11;
const CARD_POINT_Q = 12;
const CARD_POINT_K = 13;

// 手牌类型
const HAND_TYPE_6 = 6000000;  // 炸
const HAND_TYPE_5 = 5000000;  // 同花顺
const HAND_TYPE_4 = 4000000;  // 金花
const HAND_TYPE_3 = 3000000;  // 顺子
const HAND_TYPE_2 = 2000000;  // 对子
const HAND_TYPE_1 = 1000000;  // 单

const BOUT_FEE = 200;   // 每一局的底金

class Card {
    constructor(type, point) {
        this.type = type;
        this.point = point;
    }
}

// 玩法数据
let playing = JSON.stringify({
    index: 0,           // 一组牌(3张)的索引
    score: 0,           // 牌面得分
    look: false,        // 是否看牌
    show: false,        // 是否向大家展示我的牌
    game: false,        // 是否准备好(刚加入的玩家，下一局才能准备好)
    abandon: false,     // 是否弃牌
});

// 计算一副牌的分值，用于比较谁的牌大
function calc_score(c1, c2, c3) {
    let arr = [c1, c2, c3];
    arr.sort((a, b) => {
        return a.point - b.point;
    });

    // 炸
    if (c1.point == c3.point) {
        if (c1.point == CARD_POINT_A) {
            return HAND_TYPE_6 + 14;
        }
        return HAND_TYPE_6 + c1.point;
    }

    let seq = false;    // 顺子
    let akj = false;    // 同花

    if (arr[0].type == arr[1].type && arr[0].type == arr[2].type) {
        akj = true;
    }

    let score;
    if (arr[1].point == arr[0].point + 1 && arr[1].point == arr[2].point - 1) {
        seq = true;
        score = arr[2].point;
    } else {
        if (arr[0].point == CARD_POINT_A && arr[1].point == CARD_POINT_Q && arr[2].point == CARD_POINT_K) {
            seq = true;
            score = 14;
        }
    }

    if (akj) {
        // 同花顺
        if (seq) {
            return HAND_TYPE_5 + score;
        }

        // 同花
        if (arr[0] != CARD_POINT_A) {
            return HAND_TYPE_4 + arr[2].point * 10000 + arr[1].point * 100 + arr[0].point;
        }

        return HAND_TYPE_4 + 14 * 10000 + arr[2].point * 100 + arr[1].point;
    }

    if (seq) {
        if (arr[0].point == 1 && arr[1].point == 12 && arr[2].point == 13) {
            return HAND_TYPE_3 + 14;
        }

        return HAND_TYPE_3 + arr[2].point
    }

    let pair;
    // 对子判断
    if (arr[0].point == arr[1].point) {
        pair = [arr[0].point, arr[2].point];
    }

    if (arr[1].point == arr[2].point) {
        pair = [arr[1].point, arr[0].point];
    }

    if (pair) {
        if (pair[0] == CARD_POINT_A) {
            return HAND_TYPE_2 + 14 * 10000 + pair[1];
        }
        return HAND_TYPE_2 + pair[0] * 10000 + pair[1];
    }

    // 单排得分
    if (arr[0].point == CARD_POINT_A) {
        return HAND_TYPE_1 + 14 * 10000 + arr[2].point * 100 + arr[1].point;
    }

    return HAND_TYPE_1 + arr[2].point * 10000 + arr[1].point * 100 + arr[0].point;

    /**
     * test case:
     *  c1 = {point : 1, type : 1};
     *  c2 = {point : 13, type : 2};
     *  c3 = {point : 12, type : 1};
     *  calc_score(c1, c2, c3);
     */
}


class Table {

    constructor() {
        this.cnt_plrs = 0;      // 进入到本桌的玩家数
        this.all_plrs = {};     // 进入到本桌的玩家   pid -> plr

        this.seats = [];        // 桌子上作的一圈玩家 [pid,...]，注意：0号位置不使用,0表示无玩家
        for (let i = 0; i < MAX_SEATS_CNT; i++) {
            this.seats[i] = {
                pid: 0,
                dat: JSON.parse(playing),
            };
        }

        this.host = 1;              // 庄(上一局胜者)
        this.stage_time = now();    // 阶段开始时间

        this.bout_init();
        this.bout_stage = STAGE_CALC;       // 本局阶段(STAGE_XXX)

        // 扑克牌
        this.cards = [];
        for (let i = CARD_TYPE_CLUB; i <= CARD_TYPE_DIAMONDS; i++) {
            for (let j = CARD_POINT_A; j <= CARD_POINT_K; j++) {
                this.cards.push(new Card(i, j));
            }
        }
    }

    // ------------------------------------------------------------------------
    // schedule

    next_stage() {
        if (this.bout_stage == STAGE_SIGN) {
            this.leave_stage_sign();
        }
        if (this.bout_stage == STAGE_GAME) {
            this.leave_stage_game();
        }
        if (this.bout_stage == STAGE_CALC) {
            this.leave_stage_calc();
        }

        this.bout_stage++;
        this.stage_time = now();

        if (this.bout_stage > STAGE_CALC) {
            this.bout_stage = STAGE_SIGN;
        }

        if (this.bout_stage == STAGE_SIGN) {
            this.enter_stage_sign();
        }
        if (this.bout_stage == STAGE_GAME) {
            this.enter_stage_game();
        }
        if (this.bout_stage == STAGE_CALC) {
            this.enter_stage_calc();
        }
    }

    update() {
        // stage update
        if (this.bout_stage == STAGE_SIGN) {
            this.update_stage_sign();
        }

        if (this.bout_stage == STAGE_GAME) {
            this.update_stage_game();
        }

        if (this.bout_stage == STAGE_CALC) {
            this.update_stage_calc();
        }
    }

    enter_stage_sign() {
        // 清理数据
        this.bout_init();

        for (let i = 1; i < MAX_SEATS_CNT; i++) {
            this.seats[i].dat = JSON.parse(playing);
        }

        // 洗牌，听说洗7次之后，就完全没有规律了
        for (let i = 0; i < 7; i++) {
            gCoreUtils.Shuffle(this.cards);
        }

        // TODO 通知大家可以报名了
    }

    update_stage_sign() {
        let next = false;

        do {
            let cnt = 0;
            for (let i = 1; i < MAX_SEATS_CNT; i++) {
                let plr = this.get_plr(i);
                if (plr && plr.EnoughCoin(BOUT_FEE)) {
                    cnt++;
                }
            }

            if (cnt < 2) {
                break;
            }

            if (cnt == MAX_SEATS_CNT - 1) {
                next = true;
                break;
            }

            if (now() - this.stage_time > STAGE_LAST[STAGE_SIGN]) {
                next = true;
                break;
            }
        } while (false);

        if (next) {
            this.next_stage();
        }
    }

    leave_stage_sign() {
    }

    enter_stage_game() {
        // 发牌
        let idx = 0;
        for (let i = 1; i < MAX_SEATS_CNT; i++) {
            let v = this.seats[i];
            if (v.pid == 0) {
                continue;
            }

            let plr = this.get_plr(i);
            if (!plr) {
                continue;
            }

            plr.SubCoin(BOUT_FEE);
            this.bout_total_money += BOUT_FEE;

            let seq = idx * 3;

            v.dat.game = true;
            v.dat.index = idx;
            v.dat.score = calc_score(this.cards[seq], this.cards[seq + 1], this.cards[seq + 2]);
            idx++;
        }

        this.set_host();
        this.bout_turn = this.host;

        // TODO 通知大家，牌发好了
    }

    update_stage_game() {
        // TODO 提醒出牌

        // 大家都放弃了，最后就是胜利这
    }

    leave_stage_game() {
    }

    enter_stage_calc() {
        // TODO结算 通知所有人，谁赢了多少
    }

    update_stage_calc() {
        if (now() - this.stage_time < STAGE_LAST[STAGE_CALC]) {
            return;
        }

        this.next_stage();
    }

    leave_stage_calc() {
        // 钱不够的玩家，踢掉
        for (let i = 1; i < MAX_SEATS_CNT; i++) {
            let plr = this.get_plr(i);
            if (plr && !plr.EnoughCoin(BOUT_FEE)) {
                this.kick(plr);
            }
        }
    }

    // ------------------------------------------------------------------------
    // dispatch

    onMessage(plr, msg) {

        let res = {
            op: msg.op,
            ret: 1,
            msg: 'failed',
        };

        switch (msg.op) {
            // 加入/离开
            case 'join':
                this.join(plr);
                break;

            case 'leave':
                this.leave(plr);
                break;

            // 玩法操作
            case 'look':        // 看牌
                if (!this.plr_in_bout(plr)) {
                    res.msg = 'not in bout';
                    return;
                }
                break;

            case 'show':        // 公示自己的牌
                break;

            case 'recharge':    // 加码
                break;

            case 'abandon':     // 弃牌
                break;

            case 'open':        // 开牌
                break;

            default:
                console.info(`未处理的消息: ${msg.op}`);
        }

        plr.SendMsg(res);
    }

    // ------------------------------------------------------------------------
    // aux

    bout_init() {
        this.bout_turn = 0;                 // 下一个该出牌的人
        this.bout_meng = 0;                 // 蒙打(未看牌)
        this.bout_ming = 0;                 // 名打
        this.bout_total_money = 0;          // 总金额
    }

    broadcast(msg) {
        let str = JSON.stringify(msg);
        for (let plr in this.all_plrs) {
            plr.SendStr(str);
        }
    }

    join(plr) {
        let pid = plr.pid;

        // 已经存在
        if (this.all_plrs[pid]) {
            return true;
        }

        // 是否有空位
        let pos = this.find_empty_seat();
        if (pos == 0) {
            return false;
        }

        // 底金是否足够
        if (!plr.EnoughCoin(BOUT_FEE)) {
            return false;
        }

        this.cnt_plrs++;
        this.all_plrs[pid] = plr;
        this.seats[pos].pid = pid;

        return true;
    }

    leave(plr) {
        let pid = plr.pid;
        let pos = find_player_seat(pid);
        if (pos) {
            this.seats[pos] = { pid: 0, dat: JSON.parse(playing), };
        } else {
            return;
        }

        this.cnt_plrs--;
        delete this.all_plrs[pid];
    }

    find_empty_seat() {
        for (let i = 1; i < MAX_SEATS_CNT; i++) {
            if (this.seats[i].pid == 0) {
                return i;
            }
        }

        return 0;
    }

    find_player_seat(pid) {
        if (!pid) {
            return 0;
        }

        for (let i = 1; i < MAX_SEATS_CNT; i++) {
            if (this.seats[i].pid == pid) {
                return i;
            }
        }

        return 0;
    }

    set_host() {
        // TODO
        // this.host = 1;
    }

    get_plr(pos) {
        let pid = this.seats[pos].pid;
        if (pid) {
            return this.all_plrs[pid];
        }
    }

    kick(plr) {
        this.leave(plr);
    }

    // 玩家是否再赌博中
    plr_in_bout(plr) {
        let pos = this.find_player_seat(plr.pid);
        if (pos) {
            return this.seats[pos].dat.game;
        }

        return false;
    }
}


// ----------------------------------------------------------------------------
// local
let tab;
let tid;


// ----------------------------------------------------------------------------
// export

exports.Start = () => {
    tab = new Table();
    tid = setInterval(() => {
        tab.update();
    }, 1000);
}

exports.Stop = () => {
    clearInterval(tid);
}

exports.Save = () => {
}

exports.onMessage = function (ws, msg) {
    tab.onMessage(ws.plr, msg);
}