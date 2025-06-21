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

const LOCAL_STORAGE_KEY = 'app_mode';

export const CoachModeProvider: React.FC<React.PropsWithChildren<object>> = ({ children }) => {
    const getInitialMode = (): Mode => {
        const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
        return saved === 'coach' ? 'coach' : 'user';
    };

    const [mode, setMode] = useState<Mode>(getInitialMode);

    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_KEY, mode);
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
