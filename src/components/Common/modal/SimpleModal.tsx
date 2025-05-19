// SimpleModal.tsx
import React, { useEffect, useRef } from 'react';
import './SimpleModal.style.scss';

type Props = {
  onClose: () => void;
};

const SimpleModal: React.FC<Props> = ({ onClose }) => {
    const modalRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose]);

    return (
        <div className="modal-backdrop">
            <div className="modal-container" ref={modalRef}>
                <h2>Простое модальное окно</h2>
                <p>Это пример базового модального окна без формы.</p>
                <div className="modal-actions">
                    <button onClick={onClose}>Закрыть</button>
                </div>
            </div>
        </div>
    );
};

export default SimpleModal;
