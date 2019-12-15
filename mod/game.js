// 房间类型：   表格配置

const STAGE_SIGN = 0;   // 报名阶段
const STAGE_GAME = 1;   // 玩法阶段
const STAGE_CALC = 2;   // 结算阶段

const STAGE_LAST = [
    60,     // 报名阶段最长时间
    360,    // 玩法阶段最长时间
    380,    // 结算阶段最长时间
];


class Table {
    constructor(cfg) {
        this.id = 0;            // 每一局所需要的金币数
        this.cfg = cfg;         // 配置
        this.all_plrs = {};

        this.bout_cnt = 0;
        this.bout_plrs = [];                // 参加本局的玩家
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
        this.all_plrs[plr.id] = plr;
    }

    leave(plr) {
        delete this.all_plrs[plr.id];
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

