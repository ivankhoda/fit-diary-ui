export const parseDurationInput = (input: string): number => {
    const FIFTY_NINE_SECONDS = 59;
    const SECONDS_IN_A_MINUTE = 60;


    const sanitizedInput = input.replace(/[^0-9:]/gu, '');

    const parts = sanitizedInput.split(':');
    let minutes = 0;
    let seconds = 0;


    if (parts[0]) {
        minutes = parseInt(parts[0], 10) || 0;
    }


    if (parts[1]) {
        seconds = parseInt(parts[1], 10) || 0;
    }


    if (seconds > FIFTY_NINE_SECONDS) {
        seconds = FIFTY_NINE_SECONDS;
    }


    return minutes * SECONDS_IN_A_MINUTE + seconds;
};
