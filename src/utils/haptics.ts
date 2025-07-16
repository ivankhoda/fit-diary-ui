/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-undefined */
import { Haptics, ImpactStyle } from '@capacitor/haptics';

const isCapacitorAvailable = typeof window !== 'undefined' && (window as any).Capacitor !== undefined;

export const triggerImpact = async(style: ImpactStyle = ImpactStyle.Medium): Promise<void>  => {
    if (!isCapacitorAvailable) {return;}

    try {
        await Haptics.impact({ style });
    } catch (e) {
        console.warn('Haptics not supported:', e);
    }
};
