import { action, makeObservable, observable } from 'mobx';

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

