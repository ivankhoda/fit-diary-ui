
export const SECONDS_IN_A_MINUTE = 60;
export const FIFTY_NINE_SECONDS = 59;
const PAD_LENGTH = 2;

export const convertDurationToMMSS = (totalSeconds: number): string => {
    const minutes = Math.floor(totalSeconds / SECONDS_IN_A_MINUTE);
    const seconds = totalSeconds % SECONDS_IN_A_MINUTE;
    return `${String(minutes).padStart(PAD_LENGTH, '0')}:${String(seconds).padStart(PAD_LENGTH, '0')}`;
};
