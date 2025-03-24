import { DefaultTheme, MD3Theme } from 'react-native-paper';
import {MD3ElevationColors, MD3Typescale} from "react-native-paper/lib/typescript/types";
import {Mode} from "node:fs";
export const DarkColor: {
    mode?: Mode;
    fonts: MD3Typescale;
    headerImage: any;
    isV3: true;
    dark: boolean;
    roundness: number;
    version: 3;
    colors: {
        onPrimary: string;
        shadow: string;
        onPrimaryContainer: string;
        onTertiary: string;
        inverseOnSurface: string;
        scrim: string;
        primaryContainer: string;
        tertiaryContainer: string;
        secondaryContainer: string;
        error: string;
        onErrorContainer: string;
        outline: string;
        surfaceDisabled: string;
        onSurfaceVariant: string;
        onBackground: string;
        outlineVariant: string;
        disabled: string;
        text: string;
        placeholder: string;
        errorContainer: string;
        elevation: MD3ElevationColors;
        onSurface: string;
        onError: string;
        surface: string;
        backdrop: string;
        onSecondaryContainer: string;
        tertiary: string;
        onTertiaryContainer: string;
        surfaceVariant: string;
        inversePrimary: string;
        accent: string;
        onSurfaceDisabled: string;
        secondary: string;
        inverseSurface: string;
        background: string;
        onSecondary: string;
        primary: string
    };
    api:string;
    animation: { scale: number; defaultAnimationDuration?: number }
} = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary: '#D33C3C',    // BOTON
        secondary: '#04BF79',  // Negro azulado muy oscuro
        accent: '#D33C3C',     // rojo/botones
        background: '#FFFFFF', // fondo blanco
        surface: '#FFFFFF',    // Blanco
        tertiary: '#EB3D85',
        text: '#000000',       // dark violet texto
        disabled: '#9E9E9E',   // Gris medio para estados deshabilitados
        placeholder: '#FFFFFF', // Gris medio para placeholders
    },
    headerImage: require('../assets/adaptive-icon.png'),
    api:'http://172.16.74.16:8081'
};

export const LightColor: {
    mode?: Mode;
    fonts: MD3Typescale;
    headerImage: any;
    isV3: true;
    dark: boolean;
    roundness: number;
    version: 3;
    colors: {
        onPrimary: string;
        shadow: string;
        onPrimaryContainer: string;
        onTertiary: string;
        inverseOnSurface: string;
        scrim: string;
        primaryContainer: string;
        tertiaryContainer: string;
        secondaryContainer: string;
        error: string;
        onErrorContainer: string;
        outline: string;
        surfaceDisabled: string;
        onSurfaceVariant: string;
        onBackground: string;
        outlineVariant: string;
        disabled: string;
        text: string;
        placeholder: string;
        errorContainer: string;
        elevation: MD3ElevationColors;
        onSurface: string;
        onError: string;
        surface: string;
        backdrop: string;
        onSecondaryContainer: string;
        tertiary: string;
        onTertiaryContainer: string;
        surfaceVariant: string;
        inversePrimary: string;
        accent: string;
        onSurfaceDisabled: string;
        secondary: string;
        inverseSurface: string;
        background: string;
        onSecondary: string;
        primary: string
    };
    api:string;
    animation: { scale: number; defaultAnimationDuration?: number }
} = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary: '#D33C3C',    // BOTON
        secondary: '#04BF79',  // Negro azulado muy oscuro
        accent: '#D33C3C',     // rojo/botones
        background: '#FFFFFF', // fondo azul
        surface: '#FFFFFF',    // Blanco
        tertiary: '#EB3D85',

        text: '#000',       // dark violet texto
        disabled: '#dad7d7',   // Gris medio para estados deshabilitados
        placeholder: '#f6f5f5', // Gris medio para placeholders
    },
    headerImage: require('../assets/adaptive-icon.png'), // Actualiza con la ruta de tu imagen
    api:'http://172.16.74.16:8081'

};
