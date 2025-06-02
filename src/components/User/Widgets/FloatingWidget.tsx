/* eslint-disable max-statements */
import React, { useState, useRef, useEffect } from 'react';
import './FloatingWidget.style.scss';

interface FloatingWidgetProps {
  initialPosition?: { x: number; y: number };
  children?: React.ReactNode;
}

const FloatingWidget: React.FC<FloatingWidgetProps> = ({
    initialPosition = { x: 0, y: 200 },
    children
}) => {
    const widgetRef = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState(initialPosition);
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

    useEffect(() => {
        if (!widgetRef.current) {return;}

        const updatePosition = () => {
            if (!widgetRef.current) {return;}

            const footer = document.querySelector('.footer');
            const footerHeight = footer?.clientHeight || 0;

            const widgetHeight = widgetRef.current.scrollHeight;

            setPosition(prev => ({
                x: prev.x,
                y:
                  document.documentElement.scrollHeight -
                  widgetHeight -
                  footerHeight -
                  // eslint-disable-next-line no-magic-numbers
                  20
            }));
        };

        // Наблюдаем за изменением размеров самого виджета
        const resizeObserver = new ResizeObserver(updatePosition);
        resizeObserver.observe(widgetRef.current);

        // Дополнительно наблюдаем за всем содержимым внутри виджета
        const mutationObserver = new MutationObserver(updatePosition);
        mutationObserver.observe(widgetRef.current, {
            characterData: true,
            childList: true,
            subtree: true,
        });

        // Также слушаем событие загрузки (например, если внутри изображения)
        window.addEventListener('load', updatePosition);

        updatePosition();

        // eslint-disable-next-line consistent-return
        return () => {
            resizeObserver.disconnect();
            mutationObserver.disconnect();
            window.removeEventListener('load', updatePosition);
        };
    }, []);

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        setDragStart({
            x: e.clientX - position.x,
            y: e.clientY - position.y
        });
        e.preventDefault();
    };

    const handleMove = (clientX: number, clientY: number) => {
        if (!isDragging) {return;}

        const newX = clientX - dragStart.x;
        const newY = clientY - dragStart.y;
        const maxX = window.innerWidth - (widgetRef.current?.offsetWidth || 0);
        const maxY = window.innerHeight - (widgetRef.current?.offsetHeight || 0);

        setPosition({
            x: Math.max(0, Math.min(newX, maxX)),
            y: Math.max(0, Math.min(newY, maxY))
        });
    };

    const handleMouseMove = (e: MouseEvent) => {
        handleMove(e.clientX, e.clientY);
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        } else {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, dragStart]);

    const handleMouseDownWrapper = handleMouseDown;

    return (
        <div
            ref={widgetRef}
            className="floating-widget"
            style={{
                cursor: isDragging ? 'grabbing' : 'grab',
                left: `${position.x}px`,
                top: `${position.y}px`,
                transition: isDragging ? 'none' : 'top 0.3s ease'
            }}

            onMouseDown={handleMouseDownWrapper}
        >
            {children}
        </div>
    );
};

export default FloatingWidget;
