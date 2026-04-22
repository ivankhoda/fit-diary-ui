import React, { createContext, useContext, useState, useEffect } from 'react';

// Типы
type Mode = 'user' | 'coach';

const LOCAL_STORAGE_KEY = 'app_mode';

const CoachModeContext = createContext<{
    mode: Mode;
    setMode: React.Dispatch<React.SetStateAction<Mode>>;
}>({
    mode: 'user',
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    setMode: () => {},
});

export const CoachModeProvider: React.FC<React.PropsWithChildren<object>> = ({ children }) => {
    const getInitialMode = (): Mode => {
        const savedMode = localStorage.getItem(LOCAL_STORAGE_KEY);
        return savedMode === 'coach' ? 'coach' : 'user';
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
