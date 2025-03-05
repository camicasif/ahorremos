import React, { createContext, useState, useContext } from 'react';
import { SantanderTheme, BNBTheme } from './themes';
import { PaperProvider } from 'react-native-paper';

const ThemeContext = createContext({
    toggleTheme: () => {},
    isDarkTheme: false,
    theme: SantanderTheme, // Default theme
});

export const ThemeProvider = ({ children }) => {
    const [isDarkTheme, setIsDarkTheme] = useState(false);

    const toggleTheme = () => {
        setIsDarkTheme(!isDarkTheme);
    };

    const theme = isDarkTheme ? SantanderTheme : BNBTheme;

    return (
        <ThemeContext.Provider value={{ toggleTheme, isDarkTheme, theme }}>
            <PaperProvider theme={theme}>
                {children}
            </PaperProvider>
        </ThemeContext.Provider>
    );
};

export const useAppTheme = () => useContext(ThemeContext);
