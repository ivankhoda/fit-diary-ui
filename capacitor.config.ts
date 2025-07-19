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
        },
        SplashScreen: {
            launchShowDuration: 3000,
            launchAutoHide: true,
            backgroundColor: '#ffffff',
            androidSplashResourceName: 'splash',
            iosSpinnerStyle: 'small',
            showSpinner: true,
            spinnerColor: '#999999'
        }
    }
};

export default config;
