let assert = require('assert');

// ----------------------------------------------------------------------------
// const

const STAGE_WAITING = 1;    // 等待玩家阶段
const STAGE_RUNNING = 2;    // 游戏阶段

const MAX_SEATS_CNT = 17;   // 最大座位数

const BOUT_FEE = 100;       // 每一局的底金

const MAX_THINKING_TIME = 10;       // 出牌者最长思考时间

// 牌的花型
const CARD_TYPE_CLUBS = 1;      // 梅花
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



// ----------------------------------------------------------------------------
// Card

class Card {
    constructor(type, point) {
        this.type = type;
        this.point = point;
    }

    toMsg() {
        return {
            type: this.type,
            point: this.point,
        }
    }
}

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

// ----------------------------------------------------------------------------
// Seat

class Seat {
    constructor(tab, pos) {
        this.tab = tab;             // 桌子
        this.pos = pos;             // 位置
        this.pid = 0;               // 玩家ID，默认为0
        this.robot = true;          // 是否机器人(每一局开始时根据pid重置)
        this.index = 0;             // 一组牌(3张)的索引
        this.score = 0;             // 牌面得分
        this.look = false;          // 本局是否看牌
        this.quit = false;          // 本局是否退出
        this.value = 1;             // 价值系数
        this.balance = 0;           // 本局当前余额
        this.winner = null;         // 击败我的人
    }

    reset() {
        if (this.pid) {
            this.robot = false;
        } else {
            this.robot = true;
        }

        this.index = 0;
        this.score = 0;
        this.look = false;
        this.quit = false;
        this.balance = 0;
        this.winner = null;
    }

    killed(killer) {
        this.balance = 0;
        this.winner = killer;
    }

    out() {
        if (this.quit)
            return true;

        if (this.winner != null)
            return true;

        return false;
    }

    toMsg() {
        let obj = {
            pos: this.pos,
            pid: this.pid,
            robot: this.robot,
            look: this.look,
            quit: this.quit,
            value: this.value,
            balance: this.balance,
            winner: this.winner,
        }

        if (this.pid) {
            obj.name = this.tab.plrs[this.pid].GetName();
        } else {
            obj.name = `robot: ${this.pos}`;
        }

        if (this.winner) {
            obj.cards = this.get_cards(this.index);
        }

        return obj;
    }
}

// ----------------------------------------------------------------------------
// Table 一桌游戏

class Table {

    constructor() {
        this.plrs = {};     // 进入到本桌的玩家   pid -> plr

        this.seats = Array(MAX_SEATS_CNT);  // 桌子上作的一圈玩家 [pid,...]，注意：0表示无玩家(即为robot)
        for (let i = 0; i < MAX_SEATS_CNT; i++) {
            this.seats[i] = new Seat(this, i);
        }

        this.host = 0;                  // 庄(每一局开始产生随机值)
        this.bout_turn = 0;             // 该谁出手了
        this.bout_total_balance = 0;    // 底

        this.stage_data = {};           // 阶段数据
        this.stage_time = Now();        // 阶段开始时间

        this.bout_stage = STAGE_WAITING;
        this.enter_stage_waiting();

        // 扑克牌
        let idx = 0;
        this.cards = Array(CARD_TYPE_DIAMONDS * CARD_POINT_K);
        for (let i = CARD_TYPE_CLUBS; i <= CARD_TYPE_DIAMONDS; i++) {
            for (let j = CARD_POINT_A; j <= CARD_POINT_K; j++) {
                this.cards[idx++] = new Card(i, j);
            }
        }
    }

    // ------------------------------------------------------------------------
    // schedule

    switch_stage() {
        if (this.bout_stage == STAGE_WAITING) {
            this.leave_stage_waiting();
            this.bout_stage = STAGE_RUNNING;
            this.stage_time = Now();
            this.enter_stage_running();
        } else {
            this.leave_stage_running();
            this.bout_stage = STAGE_WAITING;
            this.stage_time = Now();
            this.enter_stage_waiting();
        }
    }

    update() {
        if (this.bout_stage == STAGE_WAITING) {
            this.update_stage_waiting();
        } else {
            this.update_stage_running();
        }
    }

    enter_stage_waiting() {
        this.stage_data = {
            cd: 0,
        };
    }

    update_stage_waiting() {
        // 检测是否有玩家(金钱足够)，如果至少有1个玩家则开始计时5秒，时间到了进入下一个阶段
        let able = this.runnable();

        if (this.stage_data.cd) {
            this.stage_data.cd--;

            if (this.stage_data.cd == 0) {
                if (able) {
                    this.switch_stage();
                }
            }
        } else {
            if (able) {
                this.stage_data.cd = 2;
                this.notice(`新的一局2秒后开启`);
            }
        }
    }

    leave_stage_waiting() {
        // 洗牌，听说洗7次之后，就完全没有规律了
        for (let i = 0; i < 7; i++) {
            gCoreUtils.Shuffle(this.cards);
        }

        this.notice(`新局已经开启`);
    }

    enter_stage_running() {
        this.stage_data = {};
        this.bout_total_balance = 0;

        for (let i = 0; i < MAX_SEATS_CNT; i++) {
            let seat = this.seats[i];
            seat.reset();

            let plr = this.plrs[seat.pid];
            if (plr) {
                plr.SubCoin(BOUT_FEE * 2);
                seat.value = 1;
            } else {
                seat.value = gCoreUtils.RandIntRange(1, 4);
            }

            this.bout_total_balance += BOUT_FEE;

            let seq = i * 3;
            seat.index = i;

            seat.score = calc_score(this.cards[seq], this.cards[seq + 1], this.cards[seq + 2]);
            seat.balance = seat.value * BOUT_FEE;
        }

        this.host = gCoreUtils.RandInt(MAX_SEATS_CNT);

        // 通知大家，牌发好了
        this.broadcast({
            op: 'deal_n',
            info: this.get_bout_info(),
        });

        this.set_bout_turn(this.host);
    }

    update_stage_running() {
        let seat = this.seats[this.bout_turn];

        if (seat.robot) {
            let pos = this.find_bout_next();
            if (pos == this.bout_turn) {
                // 胜利: 我是最后一个机器人
                this.set_bout_over(pos);
                return;
            } else {
                this.set_bout_turn(pos);
            }
        } else {
            // 是否超时
            let now = Now();
            if (now - this.bout_time > MAX_THINKING_TIME) {
                let pos = this.find_bout_next();
                if (pos == this.bout_turn) {
                    // 胜利: 我是最后一玩家
                    this.set_bout_over(pos);
                    return;
                } else {
                    this.set_bout_turn(pos);
                }
            }
        }

        // 是否结束本局(所有玩家被KO)
        {
            let left_player = false;
            for (let i = 0; i < MAX_SEATS_CNT; i++) {
                let seat = this.seats[i];
                if (seat.robot || seat.out()) {
                    continue;
                }

                left_player = true;
                break;
            }

            if (!left_player) {
                this.set_bout_over(null);
                return;
            }
        }

        // 是否结束本局(只剩唯一的活口了)
        {
            let pos;
            let cnt = 0;
            for (let i = 0; i < MAX_SEATS_CNT; i++) {
                let seat = this.seats[i];
                if (seat.quit) {
                    continue;
                }

                cnt++;
                pos = i;
                if (cnt > 1) {
                    return;
                }
            }

            // assert(cnt == 1, "所有人都放弃了本局");
            this.set_bout_over(pos);
            return;
        }
    }

    leave_stage_running() {
        this.notice(`本局已结束`);
    }

    // ------------------------------------------------------------------------
    // dispatch

    onMessage(plr, msg) {

        let res = {
            op: msg.op,
            ret: 1,
            msg: 'failed',
        };

        let pid = plr.pid;

        switch (msg.op) {
            case 'join':    // 加入
                {
                    // 已经存在
                    if (this.plrs[pid]) {
                        res.msg = 'exist';
                        break;
                    }

                    // 是否有空位
                    let pos = this.find_empty_seat();
                    if (pos == null) {
                        res.msg = 'no empty seat';
                        break;
                    }

                    this.plrs[pid] = plr;
                    this.seats[pos].pid = pid;

                    this.broadcast({
                        op: "join_n",
                        data: this.seats[pos].toMsg(),
                    }, true);

                    res.ret = 0;
                    res.msg = 'ok';
                    res.data = this.get_bout_info();
                    break;
                }

            case 'look':    // 看牌
                {
                    if (this.bout_stage != STAGE_RUNNING) {
                        res.msg = 'not in stage running';
                        break;
                    }

                    let pos = this.find_player_seat(pid);
                    if (pos == null) {
                        res.msg = 'not in seat';
                        break;
                    }

                    let seat = this.seats[pos];

                    if (seat.robot) {
                        res.msg = 'robot';
                        break;
                    }

                    if (seat.out()) {
                        res.msg = 'out';
                        break;
                    }

                    if (seat.look) {
                        res.msg = 'looked';
                        break;
                    }

                    seat.look = true;
                    res.cards = this.get_cards(seat.index);

                    this.broadcast({
                        op: "look_n",
                        pos: pos,
                    }, true);

                    res.ret = 0;
                    res.msg = 'ok';
                    break;
                }

            case 'attack':  // 攻击
                {
                    if (this.bout_stage != STAGE_RUNNING) {
                        res.msg = 'not in stage running';
                        break;
                    }

                    let pos = this.find_player_seat(pid);
                    if (pos == null) {
                        res.msg = 'not in seat';
                        break;
                    }

                    let seat = this.seats[pos];

                    if (seat.robot) {
                        res.msg = 'robot';
                        break;
                    }

                    if (seat.out()) {
                        res.msg = 'out';
                        break;
                    }

                    if (this.bout_turn != pos) {
                        res.msg = 'not your turn';
                        break;
                    }

                    let ntf = {
                        op: 'attack_n',
                        pid: pid,
                        pos: pos,
                    }

                    // 玩家出牌操作

                    let target_seat = this.get_seat(msg.target);
                    if (target_seat == null) {
                        res.msg = 'INVALID target';
                        break;
                    }

                    if (target_seat.out()) {
                        res.msg = 'target OUT';
                        break;
                    }

                    let amount = target_seat.value * BOUT_FEE;
                    if (!plr.EnoughCoin(amount)) {
                        res.msg = 'NOT enough coin';
                        break;
                    }

                    plr.SubCoin(amount);

                    ntf.target = msg.target;

                    // 比大小
                    if (seat.score > target_seat.score) {
                        seat.balance += target_seat.balance;
                        seat.balance += amount;
                        target_seat.balance = 0;
                        target_seat.killed(pos);
                        ntf.win = true;
                        ntf.data_lost = target_seat.toMsg();
                        ntf.data_win = seat.toMsg();
                    } else {
                        target_seat.balance += seat.balance;
                        target_seat.balance += amount;
                        seat.balance = 0;
                        seat.killed(target_seat.pos);
                        ntf.data_win = target_seat.toMsg();
                        ntf.data_lost = seat.toMsg();
                        ntf.win = false;
                    }

                    this.set_bout_turn(this.find_bout_next());

                    this.broadcast(ntf, true);

                    res.ret = 0;
                    res.msg = 'ok';
                    break;
                }

            case 'quit':    // 退出本局
                {
                    if (this.bout_stage != STAGE_RUNNING) {
                        res.msg = 'not in stage running';
                        break;
                    }

                    let pos = this.find_player_seat(pid);
                    if (pos == null) {
                        res.msg = 'not in seat';
                        break;
                    }

                    let seat = this.seats[pos];

                    if (seat.robot) {
                        res.msg = 'robot';
                        break;
                    }

                    if (seat.out()) {
                        res.msg = 'out';
                        break;
                    }

                    let next = this.find_bout_next();
                    if (next == pos) {
                        res.msg = 'quit FAILED';
                        break;
                    }

                    seat.quit = true;
                    plr.AddCoin(seat.balance);
                    this.set_bout_turn(next);

                    break;
                }

            case 'waiver':  // 放弃，开始下一局
                {
                    if (this.bout_stage != STAGE_RUNNING) {
                        res.msg = 'not in stage running';
                        break;
                    }

                    let pos = this.find_player_seat(pid);
                    if (pos == null) {
                        res.msg = 'not in seat';
                        break;
                    }

                    let seat = this.seats[pos];

                    if (seat.robot) {
                        res.msg = 'robot';
                        break;
                    }

                    if (seat.out()) {
                        res.msg = 'out';
                        break;
                    }

                    let next = this.find_bout_next();
                    if (next == pos) {
                        res.msg = 'quit FAILED';
                        break;
                    }

                    // this.set_bout_turn(this.find_bout_next());
                    break;
                }

            case 'value':   // 增加手牌价值
                {
                    if (this.bout_stage != STAGE_RUNNING) {
                        res.msg = 'not in stage running';
                        break;
                    }

                    let pos = this.find_player_seat(pid);
                    if (pos === null) {
                        res.msg = 'not in seat';
                        break;
                    }

                    let seat = this.seats[pos];

                    if (seat.robot) {
                        res.msg = 'robot';
                        break;
                    }

                    if (seat.out()) {
                        res.msg = 'out';
                        break;
                    }

                    if (!plr.EnoughCoin(BOUT_FEE)) {
                        res.msg = 'NOT enough coin';
                        break;
                    }

                    seat.value++;
                    seat.balance += BOUT_FEE;
                    plr.SubCoin(BOUT_FEE);

                    this.broadcast({
                        op: "value_n",
                        pos: pos,
                        value: seat.value,
                        balance: seat.balance,
                    }, true);

                    res.ret = 0;
                    res.msg = 'ok';
                    break;
                }

            case 'dump':
                {
                    console.log("本局信息:");
                    console.log("balance:", this.balance);

                    for (let i = 0; i < MAX_SEATS_CNT; i++) {
                        let seat = this.seats[i];
                        console.log(`第 <${i}> 个位置:`, seat);
                        console.log("手牌:", seat.get_cards(seat.index));
                    }

                    break;
                }

            default:
                console.info(`未处理的消息: ${msg.op}`);
        }

        plr.SendMsg(res);
    }

    onNotice(plr, ntf, ...args) {
        if (ntf == 'offline') {

            let pid = plr.GetPid();
            if (!this.plrs[pid]) {
                return;
            }

            let pos = this.find_player_seat(pid);
            if (pos == null) {
                return;
            }

            this.seats[pos].pid = 0;
            if (this.seats[pos].robot == false) {
                this.seats[pos].robot = true;
                this.seats[pos].quit = true;
            }

            delete this.plrs[pid];

            this.broadcast({
                op: "leave_n",
                pos: pos,
                pid: pid,
            });

        }
    }
    // ------------------------------------------------------------------------
    // aux

    get_seat(pos) {
        pos = +pos;

        do {
            if (isNaN(pos)) {
                break;
            }

            if (pos < 0 || pos >= MAX_SEATS_CNT) {
                break;
            }

            return this.seats[pos];
        } while (false);

        return null;
    }

    broadcast(msg, delay) {
        let str = JSON.stringify(msg);

        let func = () => {
            for (let pid in this.plrs) {
                let plr = this.plrs[pid];
                plr.SendStr(str);
            }
        };

        if (delay) {
            process.nextTick(func);
        } else {
            func();
        }
    }

    // 查找下一个出牌者(不跳过机器人)
    find_bout_next() {
        for (let i = 1; i <= MAX_SEATS_CNT; i++) {
            let pos = (this.bout_turn + i) % MAX_SEATS_CNT;
            let seat = this.seats[pos];
            if (seat.out()) {
                continue;
            }

            return pos;
        }

        console.warn(false, "find_bout_next FAILED");
        return null;
    }

    // 设置下一个出牌者
    set_bout_turn(turn) {
        this.bout_turn = turn;
        this.bout_time = Now();
        this.broadcast({
            op: 'turn_n',
            turn: turn,
        });
    }

    // 是否可进入 STAGE_RUNNING 阶段
    runnable() {
        for (let i = 0; i < MAX_SEATS_CNT; i++) {
            let plr = this.get_plr(i);
            if (plr && plr.EnoughCoin(BOUT_FEE * 2)) {
                return true;
            }
        }
        return false;
    }

    find_empty_seat() {
        for (let i = 0; i < MAX_SEATS_CNT; i++) {
            if (this.seats[i].pid == 0) {
                return i;
            }
        }

        return null;
    }

    find_player_seat(pid) {
        for (let i = 0; i < MAX_SEATS_CNT; i++) {
            if (this.seats[i].pid === pid) {
                return i;
            }
        }

        return null;
    }

    get_plr(pos) {
        let pid = this.seats[pos].pid;
        if (pid) {
            return this.plrs[pid];
        }
    }

    get_cards(index) {
        return [
            this.cards[index * 3 + 0].toMsg(),
            this.cards[index * 3 + 1].toMsg(),
            this.cards[index * 3 + 2].toMsg(),
        ];
    }

    // 结束本局
    set_bout_over(winner) {
        if (winner) {
            let seat = this.seats[winner];
            if (!seat.robot) {
                let plr = this.plrs[seat.pid];
                plr.AddCoin(this.bout_total_balance);
                this.bout_total_balance = 0;
            }
        }

        let ntf = {
            op: 'bout_result_n',
            pos: winner,
            cards: Array(17),
        };

        for (let i = 0; i < MAX_SEATS_CNT; i++) {
            ntf.cards[i] = this.get_cards(i);
        }

        this.broadcast(ntf);

        this.switch_stage();
    }

    get_bout_info() {
        let info = {
            host: this.host,
            seats: Array(MAX_SEATS_CNT),
            balance: this.bout_total_balance,
        };

        for (let i = 0; i < MAX_SEATS_CNT; i++) {
            info.seats[i] = this.seats[i].toMsg();
        }

        return info;
    }

    notice(str) {
        this.broadcast({
            op: 'notify',
            str: str,
        }, true);
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

exports.onNotice = function (plr, ntf, ...args) {
    tab.onNotice(plr, ntf, ...args);
}
