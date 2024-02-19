import {action, makeObservable, observable} from 'mobx';

export interface BotCommandInterface {
    command: string;
}
export interface BotCommandsInterface {
    commands: BotCommandInterface[];
}
export class BotCommandsStore {
    telegramWebApp;

    commands: [];

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    constructor(telegramWebApp) {
        this.telegramWebApp = telegramWebApp;
        this.getCommands();
        makeObservable(this, {
            commands: observable,
            getCommands: action
        });
    }

    setData(newData: []): void {
        this.commands = newData;
    }

    getCommands(): void {
        fetch('https://odio.serveo.net/commands',
            {body: JSON.stringify(Object.assign(this.telegramWebApp.initData)),
                headers: {'Content-Type': 'application/json'},
                method: 'POST'})
            .then(data => data.json())
            .then(data => {
                this.setData(data.response);
            });
    }
}

