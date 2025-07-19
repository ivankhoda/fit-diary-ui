/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable require-await */
import { Network } from '@capacitor/network';

export const isOnline = async(): Promise<boolean> => {
    try {
        const status = await Network.getStatus();
        return status.connected;
    } catch (error) {
        console.error('Ошибка при проверке сети:', error);
        return false;
    }
};

export const onNetworkChange = async(callback: (connected: boolean) => void) => Network.addListener('networkStatusChange', status => {
    callback(status.connected);
});
