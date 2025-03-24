import React from 'react';
import {View, StyleSheet, Alert} from 'react-native';
import {Button, IconButton, Text} from 'react-native-paper';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import Slider from '@react-native-community/slider';
import LoginScreen from './authentication/LoginScreen';
import SignupScreen from './authentication/SignupScreen';
import { useAppTheme, ThemeProvider } from './config/ThemeContext';
import HomeScreen from "./home/HomeScreen";
import {LightColor, DarkColor} from "./config/themes";
import axiosInstance from "./config/axiosConfig";
import Menu from './home/NavigationScreen';
import LandingScreen from './authentication/LandingScreen';




const Stack = createNativeStackNavigator();

const App = () => {
    const [isDarkTheme, setIsDarkTheme] = React.useState(false);

    const theme = isDarkTheme ? DarkColor : LightColor;

    return (
        <ThemeProvider>
            <NavigationContainer theme={theme}>
                <Stack.Navigator>
                <Stack.Screen
                        name="Landing"
                        component={LandingScreen}
                        options={{
                            headerShown: false,
                            headerTitle: '', // No mostrar el título
                            headerBackVisible: false, // No mostrar el botón de volver atrás
               
                        }}
                    />
                    <Stack.Screen
                        name="Login"
                        component={LoginScreen}
                        options={{
                            headerShown: false,
                            headerTitle: '', // No mostrar el título
                            headerBackVisible: false, // No mostrar el botón de volver atrás
               
                        }}
                    />
                    {/*<Stack.Screen*/}
                    {/*    name="Signup"*/}
                    {/*    component={SignupScreen}*/}
                    {/*    options={{*/}
                    {/*        headerShown: true, // Mostrar la cabecera*/}
                    {/*        headerTitle: '', // No mostrar el título*/}
                    {/*        headerStyle: {*/}
                    {/*            backgroundColor: 'white', // Cambiar el color de fondo del header*/}
                    {/*            borderColor: 'white', //*/}
                    {/*            elevation: 0, // Eliminar la sombra en Android}} // Ocultar el header en la pantalla de inicio de sesión*/}
                    {/*        },*/}
                    {/*    }}*/}
                    {/*/>*/}
                    <Stack.Screen
                        name="Menu"
                        component={Menu} // Use the Menu component that contains the bottom tab navigator
                        options={{
                            headerShown: false, // Hide the header since Menu has its own navigation
                        }}
                    />
                    {/*<Stack.Screen*/}
                    {/*    name="MenuPeluquero"*/}
                    {/*    component={MenuPeluquero} // Use the Menu component that contains the bottom tab navigator*/}
                    {/*    options={{*/}
                    {/*        headerShown: false, // Hide the header since Menu has its own navigation*/}
                    {/*    }}*/}
                    {/*/>*/}
                    {/*<Stack.Screen*/}
                    {/*    name="Peluqueria"*/}
                    {/*    component={PeluqueriaScreen}*/}
                    {/*    options={{*/}
                    {/*        headerShown: true, // Mostrar la cabecera*/}
                    {/*        headerTitle: '', // No mostrar el título*/}
                    {/*        headerStyle: {*/}
                    {/*            backgroundColor: 'white', // Cambiar el color de fondo del header*/}
                    {/*            borderColor: 'white', //*/}
                    {/*        },*/}
                    {/*    }}*/}
                    {/*/>*/}
                    {/*<Stack.Screen*/}
                    {/*    name="Cita"*/}
                    {/*    component={CitaScreen}*/}
                    {/*    options={{*/}
                    {/*        headerShown: true, // Mostrar la cabecera*/}
                    {/*        headerTitle: '', // No mostrar el título*/}
                    {/*        headerStyle: {*/}
                    {/*            backgroundColor: 'white', // Cambiar el color de fondo del header*/}
                    {/*            borderColor: 'white', //*/}
                    {/*            elevation: 0, // Eliminar la sombra en Android}} // Ocultar el header en la pantalla de inicio de sesión*/}
                    {/*        },*/}
                    {/*        headerTintColor: 'red',*/}
                    {/*        headerTitleStyle: {*/}
                    {/*            color: 'red', // Color rojo para el título*/}
                    {/*        },*/}
                    {/*    }}*/}
                    {/*/>*/}
                    {/*<Stack.Screen*/}
                    {/*    name="CitaDetailPeluquero"*/}
                    {/*    component={CitaDetailScreen}  // Este es tu componente de detalles de cita*/}
                    {/*    options={{*/}
                    {/*        headerShown: true,*/}
                    {/*        headerTitle: 'Detalles de la Cita',  // Título del encabezado*/}
                    {/*    }}*/}
                    {/*/>*/}
                    {/*<Stack.Screen*/}
                    {/*    name="Mapa"*/}
                    {/*    component={MapsScreen}*/}
                    {/*    options={{*/}
                    {/*        headerShown: true, // Mostrar la cabecera*/}
                    {/*        headerTitle: '', // No mostrar el título*/}
                    {/*    }}*/}
                    {/*/>*/}
                </Stack.Navigator>
            </NavigationContainer>
        </ThemeProvider>
    );
};

export default App;
