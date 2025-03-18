/* eslint-disable max-lines-per-function */
import React, {  useRef, useEffect } from 'react';

export interface ExerciseFormData {
  category: string;
  created_at: string;
  description: string;
  difficulty: string;
  duration: number;
  id: string;
  muscle_groups: string[];
  type_of_measurement: string;
  name: string;
  updated_at: string;
}

type Props = {
  onClose: () => void;
  onSave: () => void;
};

const LoginModal: React.FC<Props> = ({ onClose, }) => {
    const modalRef = useRef<HTMLDivElement | null>(null);
    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleOutsideClick);
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, [onClose]);

    return (
        <div className="exercise-create-modal">

        </div>
    );
};

export default LoginModal;
