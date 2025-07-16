/* eslint-disable sort-keys */
/* eslint-disable init-declarations */
import { useEffect } from 'react';
import { Capacitor, PluginListenerHandle } from '@capacitor/core';
import { Keyboard } from '@capacitor/keyboard';

export const useCapacitorKeyboardAvoiding = (
    containerRef: React.RefObject<HTMLElement>
): void => {
    useEffect(() => {
        let showListener: PluginListenerHandle | undefined;
        let hideListener: PluginListenerHandle | undefined;

        const setupListeners = async() => {
            showListener = await Keyboard.addListener('keyboardWillShow', info => {
                const { keyboardHeight } = info;
                const container = containerRef.current;
                const active = document.activeElement as HTMLElement | null;

                if (container) {
                    container.style.paddingBottom = `${keyboardHeight}px`;
                }

                if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA')) {
                    setTimeout(() => {
                        const rect = active.getBoundingClientRect();
                        const viewportHeight = window.innerHeight - keyboardHeight;
                        const buffer = 100;

                        if (rect.bottom > viewportHeight - buffer) {
                            active.scrollIntoView({
                                block: 'center',
                                behavior: 'smooth',
                            });
                        } else {
                            active.scrollIntoView({ block: 'center', behavior: 'smooth' });
                        }
                    }, 100);
                }
            });

            hideListener = await Keyboard.addListener('keyboardWillHide', () => {
                const container = containerRef.current;

                if (container) {
                    container.style.paddingBottom = '0px';
                }
            });
        };

        if (Capacitor.getPlatform() !== 'web') {
            setupListeners();
        }

        return () => {
            showListener?.remove();
            hideListener?.remove();
        };
    }, [containerRef]);
};
