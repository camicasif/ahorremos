import { DefaultTheme, MD3Theme } from 'react-native-paper';
import {MD3ElevationColors, MD3Typescale} from "react-native-paper/lib/typescript/types";
import {Mode} from "node:fs";

interface CustomTheme extends MD3Theme {
    headerImage: any;
    api:string;
}

export const SantanderTheme: {
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
        background: '#0057FF', // fondo azul
        surface: '#FFFFFF',    // Blanco
        text: '#FFFFFF',       // dark violet texto
        disabled: '#9E9E9E',   // Gris medio para estados deshabilitados
        placeholder: '#FFFFFF', // Gris medio para placeholders
    },
    headerImage: require('../assets/img.png'),
    api:'http://172.16.74.16:8081'
};

export const BNBTheme: {
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
        background: '#0057FF', // fondo azul
        surface: '#FFFFFF',    // Blanco
        text: '#FFFFFF',       // dark violet texto
        disabled: '#9E9E9E',   // Gris medio para estados deshabilitados
        placeholder: '#9E9E9E', // Gris medio para placeholders
    },
    headerImage: require('../assets/img.png'), // Actualiza con la ruta de tu imagen
    api:'http://172.16.74.16:8081'

};
