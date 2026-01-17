import React, { createContext, useContext, useState, useEffect } from 'react';

// Типы
type Mode = 'user' | 'coach';

const CoachModeContext = createContext<{
    mode: Mode;
    setMode: React.Dispatch<React.SetStateAction<Mode>>;
}>({
    mode: 'user',
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    setMode: () => {},
});

/*
 * Disable coach mode completely for v1.0
 * const LOCAL_STORAGE_KEY = 'app_mode';
 */

export const CoachModeProvider: React.FC<React.PropsWithChildren<object>> = ({ children }) => {
    const getInitialMode = (): Mode => 
        /*
         * COACH MODE DISABLED FOR V1.0 - Always return 'user'
         * Const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
         * Return saved === 'coach' ? 'coach' : 'user';
         */
        'user'
    ;

    const [mode, setMode] = useState<Mode>(getInitialMode);

    useEffect(() => {
        /*
         * COACH MODE DISABLED FOR V1.0
         * LocalStorage.setItem(LOCAL_STORAGE_KEY, mode);
         * Force user mode
         */
        if (mode !== 'user') {
            setMode('user');
        }
    }, [mode]);

    return (
        <CoachModeContext.Provider value={{ mode, setMode }}>

            {children}
        </CoachModeContext.Provider>
    );
};

// Хук для использования
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useCoachMode = () => useContext(CoachModeContext);
