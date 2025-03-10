import React, { createContext, useState, useContext } from 'react';
import { DarkColor, LightColor } from './themes';
import { PaperProvider } from 'react-native-paper';

const ThemeContext = createContext({
    toggleTheme: () => {},
    isDarkTheme: false,
    theme: DarkColor, // Default theme
});

export const ThemeProvider = ({ children }) => {
    const [isDarkTheme, setIsDarkTheme] = useState(false);

    const toggleTheme = () => {
        setIsDarkTheme(!isDarkTheme);
    };

    const theme = isDarkTheme ? DarkColor : LightColor;

    return (
        <ThemeContext.Provider value={{ toggleTheme, isDarkTheme, theme }}>
            <PaperProvider theme={theme}>
                {children}
            </PaperProvider>
        </ThemeContext.Provider>
    );
};

export const useAppTheme = () => useContext(ThemeContext);
