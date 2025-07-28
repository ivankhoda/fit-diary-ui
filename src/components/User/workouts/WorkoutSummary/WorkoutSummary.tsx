import React, { useState, useEffect, useCallback } from 'react';
import './WorkoutSummary.style.scss';
import { inject, observer } from 'mobx-react';
import { t } from 'i18next';
import { useNavigate, useParams } from 'react-router';
import WorkoutController from '../../../../controllers/WorkoutsController';
import { convertDurationToMMSS } from '../../../Admin/utils/convertDurationToMMSS';

export interface WorkoutSummaryProps {
    workoutsStore?: {
        summaryUserWorkout?: {
            name: string;
            comment?: string;
            date: string;
            duration: string;
            progress: Array<{
                name: string;
                progress_data: { [key: string]: string };
            }>;
        };
    };
    workoutsController?: WorkoutController;
}

const WorkoutSummary: React.FC<WorkoutSummaryProps> = ({ workoutsStore, workoutsController }) => {
    const [currentWorkout, setCurrentWorkout] = useState<WorkoutSummaryProps['workoutsStore']['summaryUserWorkout'] | null>(null);
    const [comment, setComment] = useState(workoutsStore?.summaryUserWorkout?.comment || '');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { workoutId } = useParams();
    const MAX_COMMENT_LENGTH = 250;

    const navigate = useNavigate();

    useEffect(() => {
        const fetchWorkout = async() => {
            setIsLoading(true);
            try {
                if (!workoutsStore?.summaryUserWorkout) {
                    await workoutsController?.getUserSummaryWorkout(workoutId);
                }
                setCurrentWorkout(workoutsStore?.summaryUserWorkout);
                setComment(workoutsStore?.summaryUserWorkout?.comment || '');
            } catch (error) {
                console.error('Error fetching workout:', error);
            } finally {
                setIsLoading(false);
            }
        };

        if (workoutId) {
            fetchWorkout();
        }
    }, [workoutId,
        workoutsController,
        workoutsStore?.summaryUserWorkout]);

    const handleCommentChange = useCallback((event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const updatedComment = event.target.value;

        if (updatedComment.length <= MAX_COMMENT_LENGTH) {
            setComment(updatedComment);
        }
    }, []);

    const handleSaveComment = useCallback(() => {
        if (comment.length <= MAX_COMMENT_LENGTH) {
            workoutsController.updateUserWorkout(workoutId, comment, navigate);
        }
    }, [comment,
        workoutsController,
        workoutId,
        navigate]);

    if (isLoading) {
        return <div className="loading-indicator">{t('workoutData.loading')}</div>;
    }

    if (!currentWorkout) {
        return <div className="no-workout">{t('workoutData.no_workout')}</div>;
    }

    return (
        <div className="workout-summary">
            <h2 className="workout-name">{currentWorkout.name}</h2>
            <p className="workout-date">{t('workoutData.date')}: {currentWorkout.date || '-'}</p>
            <p className="workout-duration">{t('workoutData.duration')}: {currentWorkout.duration || '-'}</p>

            <div className="exercises-list">
                {currentWorkout.progress && currentWorkout.progress.map((exercise, index) => (
                    <div key={index} className="exercise">
                        <p className="exercise-name"><strong>{exercise.name}</strong></p>
                        {Object.entries(exercise.progress_data).map(([key, value]) => (
                            <p key={key} className="exercise-detail">
                                {t(`workoutData.${key}`)}:{' '}
                                {key === 'duration' ? convertDurationToMMSS(Number(value)) : value}
                            </p>
                        ))}
                    </div>
                ))}
            </div>

            <div className="comment-section">
                <label htmlFor="workout-comment" className="comment-label">{t('workoutData.comment')}</label>
                <textarea
                    id="workout-comment"
                    className="comment-textarea"
                    value={comment}
                    onChange={handleCommentChange}
                    placeholder={t('workoutData.add_comment')}
                    maxLength={MAX_COMMENT_LENGTH}
                />
                <div className="comment-length">{comment.length}/{MAX_COMMENT_LENGTH}</div>
            </div>

            <button
                className="save-button"
                onClick={handleSaveComment}
            >
                {t('workoutData.save')}
            </button>
        </div>
    );
};

export default inject('workoutsStore', 'workoutsController')(observer(WorkoutSummary));
