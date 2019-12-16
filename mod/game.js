// 房间类型：   表格配置

const STAGE_SIGN = 0;   // 报名阶段
const STAGE_GAME = 1;   // 玩法阶段
const STAGE_CALC = 2;   // 结算阶段

const STAGE_LAST = [
    60,     // 报名阶段最长时间
    360,    // 玩法阶段最长时间
    380,    // 结算阶段最长时间
];

const MAX_SEATS_CNT = 18;


class Table {
    constructor(cfg) {
        this.id = 0;            // 每一局所需要的金币数
        this.cfg = cfg;         // 配置

        this.all_plrs = {};     // 进入到本桌的玩家   pid -> plr
        this.seats = [];        // 桌子上作的一圈玩家 [pid,...]，注意：0号位置不使用
        for (let i = 0; i < MAX_SEATS_CNT; i++) {
            this.seats[i] = null;
        }

        this.bout_cnt = 0;
        this.bout_plrs = [];                // 参加本局的玩家 (seats索引)
        this.bout_host = 1;                 // 庄
        this.bout_stage = STAGE_CALC;       // 本局阶段(STAGE_XXX)
        this.bout_start = 0;                // 本局开始时间
    }

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
        this.bout_start = now();

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

    join(plr) {
        let pid = plr.pid;

        // 已经存在
        if (this.all_plrs[pid]) {
            return false;
        }

        // 是否有空位
        let pos = this.find_empty_seat();
        if (pos == 0) {
            return false;
        }

        this.all_plrs[pid] = plr;
        this.seats[pos] = pid;

        return true;
    }

    leave(plr) {
        let pid = plr.pid;

        let pos = find_player_seat(pid);
        if (pos) {
            this.seats[pos] = null;
        }

        delete this.all_plrs[pid];
    }

    next_bout() {
        if (this.bout_stage != STAGE_CALC || now() - this.bout_start < STAGE_LAST[STAGE_CALC]) {
            return;
        }

        this.next_stage();
    }

    // ------------------------------------------------------------------------
    // stage event

    enter_stage_sign() {
    }

    update_stage_sign() {
        let now = now();
        if (now > STAGE_LAST[STAGE_SIGN]) {
            this.next_stage();
        }
    }

    leave_stage_sign() {
    }

    enter_stage_game() {
        // 发牌
    }

    update_stage_game() {
        let now = now();
        if (now > STAGE_LAST[STAGE_GAME]) {
            this.next_stage();
        }
    }

    leave_stage_game() {
    }

    enter_stage_calc() {
    }

    update_stage_calc() {
        // 是否自动开启下一局
        let now = now();
        if (false && now > STAGE_LAST[STAGE_GAME]) {
            this.next_stage();
        }
    }

    leave_stage_calc() {
    }

    // ------------------------------------------------------------------------
    // game event

    find_empty_seat() {
        for (let i = 1; i < MAX_SEATS_CNT; i++) {
            if (!this.seats[i]) {
                return i;
            }
        }

        return 0;
    }

    find_player_seat(pid) {
        for (let i = 1; i < MAX_SEATS_CNT; i++) {
            if (this.seats[i] == pid) {
                return i;
            }
        }

        return 0;
    }

    get_plr_cnt() {
        let cnt = 0;
        for (let i = 1; i < MAX_SEATS_CNT; i++) {
            if (this.seats[i]) {
                cnt++;
            }
        }

        return cnt;
    }

    // 报名

    // 出牌操作
}


class Room {
    constructor(type, id) {
        this.id = id;
        this.type = type;
        this.tables = {};
    }

    AddTable(table) {
        let id = table.id;
        this.tables[id] = table;
    }

    RemTable(table) {
        delete this.tables[table.id];
    }

    FindTable(id) {
        return this.tables[id];
    }
}


class RoomMgr {
    constructor() {
        this.rooms = {};
    }

    AddRoom(room) {
        let id = room.id;
        let ty = room.type;
        this.rooms[ty] = this.rooms[ty] || {};
        this.rooms[ty][id] = room;
    }

    GetRooms(type) {
        return this.rooms[types] || {};
    }

    FindRoom(type, id) {
        if (this.rooms[type]) {
            return this.rooms[type][id];
        }
        return null;
    }

}

