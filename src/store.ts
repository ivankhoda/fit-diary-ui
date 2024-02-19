import {observable, action, makeObservable} from 'mobx';

class Store {
    data: any = [];

    constructor() {
        makeObservable(this, {
            data: observable,
            setData: action
        });
    }

    setData(newData: any) {
        this.data = newData;
    }
}

const store = new Store();

export default store;
