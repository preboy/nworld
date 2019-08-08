
class Player {

    constructor(data){
        this.data = data;
    }

    Init(){
        this.init_base();

        this.init_bag();

        if(!this.data.bag) {
            this.data.bag = {};
        }
        let ret = gModBag.InitData(this.data.bag);
        if (ret && ret != this.data.bag) {
            this.data.bag = ret;
        }
    }

    GetBag(){
        return this.data.bag;
    }

    init_base() {
        if(!this.data.name) {
            this.data.name = 'lord-1';
        }
    }

    init_bag(){
        gModBag.Init(this.data)
    }

    init_hero(){

    }

// ------------------------------------------

    GetId(){
        return 1;
    }

    GetName(){
        return 'zcg';
    }
}
