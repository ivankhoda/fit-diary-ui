/*
 * Import {UserStore} from './userStore';
 *
 * export const userStore = new UserStore();
 */

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const {WebApp} = window.Telegram;

import {BotCommandsStore} from './botCommandsStore';

export const botCommandsStore = new BotCommandsStore(WebApp);

