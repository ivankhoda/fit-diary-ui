import {action, makeObservable} from 'mobx';

export interface WebAppUserInterface {
    id?: number,
    is_bot?: boolean,
    first_name?: string,
    last_name?: string,
    username?: string,
    language_code?: string,
    is_premium?: boolean,
    photo_url?: string
}

interface Exercise {
    name: string;
    weight: number;
    created_at: string

}

export interface ShortStatInterface {
    best_records: Exercise[];
    last_records: Exercise[];
}

export class UserStore {
    telegramWebApp;

    webAppUser: WebAppUserInterface;

    shortStat: ShortStatInterface;

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    constructor(telegramWebApp) {
        this.telegramWebApp = telegramWebApp;
        this.webAppUser = telegramWebApp.initDataUnsafe.user;
        makeObservable(this, {
            getShortStat: action
        });
    }

    setData(newData: ShortStatInterface): void {
        this.shortStat = {...newData};
    }

    getShortStat(data: string): void {
        fetch('https://324c-188-243-183-225.ngrok-free.app/webapp/authorize',
            {body: JSON.stringify({data}),
                headers: {'Content-Type': 'application/json'},
                method: 'POST',
                mode: 'cors'})
            .then(d => d.json())
            .then(d => this.setData(d));
    }
}

