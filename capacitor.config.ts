/* eslint-disable sort-keys */
import type { CapacitorConfig } from '@capacitor/cli';
import { KeyboardResize } from '@capacitor/keyboard';

const config: CapacitorConfig = {
    appId: 'com.planka.app',
    appName: 'Planka',
    webDir: 'dist',
    plugins: {
        Keyboard: {

            resize: KeyboardResize.None
        }
    }
};

export default config;
