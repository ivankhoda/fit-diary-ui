/* eslint-disable default-case */
/* eslint-disable eqeqeq */
/* eslint-disable no-negated-condition */
/* eslint-disable no-eq-null */
/* eslint-disable complexity */
/* eslint-disable max-statements */

/* eslint-disable no-case-declarations */
/* eslint-disable sort-keys */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Share } from '@capacitor/share';
import { toast } from 'react-toastify';
import { secondsToMMSS } from './../../utils/secondsToMMSS';

export type ShareType = 'workout' | 'plan' | 'result';

interface ShareData {
  type: ShareType;
  data: any;
}

const formatExercise = (exercise: any): string => {
    const { name, type_of_measurement, repetitions, duration, distance, sets, weight, comment } = exercise;

    const safeReps = repetitions === null ? '' : repetitions;
    const safeSets = sets === null ? '' : sets;
    const safeWeight = weight === null ? '' : weight;
    const safeDistance = distance === null ? '' : distance;

    let details = '';

    switch (type_of_measurement) {
    case 'weight_and_reps': {
        const setsText = safeSets !== '' ? `${safeSets} подход${safeSets === 1 ? 'а' : 'ов'}` : '';
        const repsText = safeReps !== '' ? `${safeReps} повторени${safeReps === 1 ? 'е' : 'й'}` : '';
        const weightText = safeWeight !== '' ? `с весом ${safeWeight} кг` : '';

        details = [setsText,
            repsText,
            weightText].filter(Boolean).join(' по ');
        break;
    }
    case 'reps': {
        const setsText = safeSets !== '' ? `${safeSets} подход${safeSets === 1 ? 'а' : 'ов'}` : '';
        const repsText = safeReps !== '' ? `${safeReps} повторени${safeReps === 1 ? 'е' : 'й'}` : '';

        details = [setsText, repsText].filter(Boolean).join(' по ');
        break;
    }
    case 'duration_and_reps': {
        const setsText = safeSets !== '' ? `${safeSets} подход${safeSets === 1 ? 'а' : 'ов'}` : '';
        const repsText = safeReps !== '' ? `${safeReps} повторени${safeReps === 1 ? 'е' : 'й'}` : '';
        const durationText = duration != null ? `длительность ${secondsToMMSS(duration)}` : '';

        details = [setsText,
            repsText,
            durationText].filter(Boolean).join(', ');
        break;
    }
    case 'duration': {
        details = duration != null ? `Длительность упражнения: ${secondsToMMSS(duration)}` : '';
        break;
    }
    case 'cardio': {
        const durationText = duration != null ? `${secondsToMMSS(duration)}` : '';
        const distanceText = safeDistance !== '' ? `${safeDistance} м` : '';
        const setsText = safeSets !== '' ? `${safeSets} подход${safeSets === 1 ? 'а' : 'ов'}` : '';

        details = ['Кардио:',
            durationText,
            distanceText,
            setsText].filter(Boolean).join(', ');
        break;
    }
    default:
        details = '';
    }

    return `${name}${details ? `: ${  details}` : ''}${comment ? ` (комментарий: ${comment})` : ''}`;
};

const formatSetRow = (set: any, index: number, type: string): string => {
    const rep = set.repetitions ?? '';
    const weight = set.weight ?? '';
    const distance = set.distance ?? '';
    const duration = set.duration != null ? secondsToMMSS(set.duration) : '';

    const cols: string[] = [`${  index + 1}`];

    switch (type) {
    case 'weight_and_reps':
        cols.push(rep, weight);
        break;
    case 'reps':
        cols.push(rep);
        break;
    case 'duration_and_reps':
        cols.push(duration, rep);
        break;
    case 'duration':
        cols.push(duration);
        break;
    case 'cardio':
        cols.push(distance, duration);
        break;
    }

    return cols.join('\t');
};

const formatDoneExerciseDetailed = (exercise: any): string => {
    const { name, type_of_measurement, formatted_duration, number_of_sets } = exercise;

    const header = `${name}\n\nВремя: ${formatted_duration || '--'}\n`;

    const columnHeaders = '';

    const rows = number_of_sets
        ?.map((set: any, index: number) => formatSetRow(set, index, type_of_measurement))
        .join('\n');

    return [header,
        columnHeaders,
        rows].filter(Boolean).join('\n');
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const formatDetailedResultShare = (share: any) => {
    const { name, duration, user_exercises } = share.data;

    const exerciseBlocks = user_exercises
        .map(formatDoneExerciseDetailed)
        .filter(Boolean)
        .join('\n');

    const headerParts = [
        `${name}`,
        '',
        `Продолжительность: ${duration}`,
    ];

    if (exerciseBlocks) {
        headerParts.push('Упражнения:');
    }

    const header = headerParts.filter(Boolean).join('\n');

    return {
        title: 'Выполнил тренировку 🔥',
        text: `${header}${exerciseBlocks ? `\n${  exerciseBlocks}` : ''}`,
        url: 'https://planka.tech'
    };
};

const formatShareText = (share: ShareData): { title: string; text: string; url?: string } => {
    switch (share.type) {
    case 'workout':
        const workout = share.data;
        const exercisesText = workout.workout_exercises
            .sort((a: any, b: any) => a.order - b.order)
            .map(formatExercise)
            .join('\n');

        const descriptionText = workout.description ? `\nОписание: ${workout.description}` : '';

        return {
            title: 'Моя тренировка в Planka \uD83D\uDCAA',
            text: `На сегодня: ${workout.name}${descriptionText}\n\nУпражнения:\n${exercisesText}`,
            url: 'https://planka.tech'
        };

    case 'result':
        return formatDetailedResultShare(share);
    default:
        return {
            title: 'Fit Diary',
            text: 'Тренируюсь с умом \uD83D\uDCAA',
            url: 'https://fitdiary.app'
        };
    }
};

export const shareUniversal = async(share: ShareData): Promise<void> => {
    const { title, text, url } = formatShareText(share);
    const sharePayload = {
        title,
        text,
        url,
        dialogTitle: title,
    };

    try {
        await Share.share(sharePayload);
    } catch (err) {
        if (navigator?.clipboard) {
            const textToCopy = `${text}${url ? `\n${url}` : ''}`;

            try {
                await navigator.clipboard.writeText(textToCopy);
                toast.success('Текст успешно скопирован в буфер обмена!');
            } catch (copyError) {
                toast.error('Не удалось скопировать текст \uD83D\uDE1E');
                console.error('Ошибка копирования в буфер:', copyError);
            }
        } else {
            toast.error('Не удалось поделиться и скопировать \uD83D\uDE1E');
            console.error('Ошибка шаринга:', err);
        }
    }
};
