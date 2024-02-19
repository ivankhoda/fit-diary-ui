import React, {Component} from 'react';
import {observer, inject} from 'mobx-react';
import {BotCommandsStore} from '../../store/botCommandsStore';

export interface BotCommandInterface {
    command: string;
}
export interface BotCommandsInterface {
    commands: BotCommandInterface[];
}

export interface CommandsComponentInterface {
    commands?: BotCommandsInterface[];
    botCommandsStore?: BotCommandsStore;
}

interface CommandsComponentState {
    commands?: BotCommandInterface[]
}
@inject('botCommandsStore')
@observer
export class Commands extends Component<CommandsComponentInterface, CommandsComponentState> {
    render(): JSX.Element {
        const {commands} = this.props.botCommandsStore;
        return <div className="commands">
            <h2 className="commands__title">{'Команды'}</h2>
            {commands && commands.map((c, i) => <li key={i}>{`Команда:${c}`}</li>)}
        </div>;
    }
}

