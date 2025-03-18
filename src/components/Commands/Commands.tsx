import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';

export interface BotCommandInterface {
    command: string;
}
export interface BotCommandsInterface {
    commands: BotCommandInterface[];
}

export interface CommandsComponentInterface {
    commands?: BotCommandsInterface[];

}

interface CommandsComponentState {
    commands?: BotCommandInterface[]
}
@inject('botCommandsStore')
@observer
export class Commands extends Component<CommandsComponentInterface, CommandsComponentState> {
    render(): JSX.Element {
        return <div className="commands">
            {'sss'}
        </div>;
    }
}

