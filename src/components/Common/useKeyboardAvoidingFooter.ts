import { useEffect, useRef } from 'react';
import { Keyboard } from '@capacitor/keyboard';
import { Capacitor, PluginListenerHandle } from '@capacitor/core';

export const useKeyboardAvoidingFooter = (): React.RefObject<HTMLElement> => {
    const footerRef = useRef<HTMLElement | null>(null);

    useEffect(() => {
        let showListenerHandle: PluginListenerHandle | null = null;
        let hideListenerHandle: PluginListenerHandle | null = null;

        const setupListeners = async() => {
            showListenerHandle = await Keyboard.addListener('keyboardWillShow', info => {
                if (footerRef.current) {
                    footerRef.current.style.transform = `translateY(-${info.keyboardHeight}px)`;
                    footerRef.current.style.display = 'none';
                }
            });

            hideListenerHandle = await Keyboard.addListener('keyboardWillHide', () => {
                if (footerRef.current) {
                    footerRef.current.style.transform = '';
                    footerRef.current.style.display = 'flex';
                }
            });
        };

        if (Capacitor.getPlatform() !== 'web') {
            setupListeners();
        }

        return () => {
            showListenerHandle?.remove();
            hideListenerHandle?.remove();
        };
    }, []);

    return footerRef;
};
