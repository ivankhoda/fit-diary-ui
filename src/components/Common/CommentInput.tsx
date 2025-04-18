/* eslint-disable no-magic-numbers */
import React, { useCallback, useState, useRef, useEffect } from 'react';
import { ExerciseInterface } from '../../store/exercisesStore';
import { AdminExerciseProfile } from '../Admin/store/AdminExercisesStore';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface CommentInputProps {
    onChange: (comment: string, exercise: ExerciseInterface | AdminExerciseProfile) => void;
    exercise: ExerciseInterface | AdminExerciseProfile;
    onBlur?: (field: string, value: string | number | null) => void;
}

export const CommentInput: React.FC<CommentInputProps> = ({ onChange, exercise, onBlur }) => {
    const [addComment, setAddComment] = React.useState(false);
    const [inputValue, setInputValue] = useState(exercise.comment || '');
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const MAX_COMMENT_LENGTH = 40;

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { value } = e.target;

        if (value.length <= MAX_COMMENT_LENGTH) {
            setInputValue(value);
            onChange(value, exercise);
        }
    }, [onChange, exercise]);

    const handleBlur = useCallback(() => {
        if (onBlur) {
            onBlur('comment', inputValue);
        }
    }, [onBlur, inputValue]);

    useEffect(() => {
        setInputValue(exercise.comment || '');
    }, [exercise.comment]);

    const handleAddComment = useCallback(() => {
        setAddComment(!addComment);
        if (!addComment && inputRef.current) {
            setTimeout(() => inputRef.current?.focus(), 0);
        }
    }, [addComment]);

    return (
        <div className='exercise-fields comment-block'>
            <FontAwesomeIcon
                icon={faEdit}
                onClick={handleAddComment}
                className='comment-button'
            />
            <textarea
                className={`exercise-comment ${addComment ? 'visible' : 'hidden'}`}
                placeholder='Комментарий (макс. 40 символов)'
                value={inputValue}
                ref={inputRef}
                onChange={handleInputChange}
                onBlur={handleBlur}
                maxLength={MAX_COMMENT_LENGTH}
            />
            {addComment && (
                <div className="comment-length-counter">
                    {inputValue.length}/{MAX_COMMENT_LENGTH}
                </div>
            )}
        </div>
    );
};

export default CommentInput;
