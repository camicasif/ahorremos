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
import {BNBTheme, SantanderTheme} from "./config/themes";
import axiosInstance from "./config/axiosConfig";
import PeluqueriaScreen from "./home/PeluqueriaScreen";
import CitaScreen from "./home/CitaScreen";
import MapsScreen from "./home/MapsScreen";
import Menu from './home/NavigationScreen';
import MenuPeluquero from "./home/NavigationPeluqueroScreen";
import CitaDetailScreen from "./home/CitaDetailScreen"; // Import the Menu component that contains the bottom tab navigator


const Stack = createNativeStackNavigator();

const App = () => {
    const [isDarkTheme, setIsDarkTheme] = React.useState(false);

    const theme = isDarkTheme ? SantanderTheme : BNBTheme;

    return (
        <ThemeProvider>
            <NavigationContainer theme={theme}>
                <Stack.Navigator>
                    <Stack.Screen
                        name="Login"
                        component={LoginScreen}
                        options={{
                            headerShown: true,
                            headerTitle: '', // No mostrar el título
                            headerBackVisible: false, // No mostrar el botón de volver atrás
                            headerStyle: {
                                backgroundColor: '#0057FF', // Cambiar el color de fondo del header
                                borderColor: '#0057FF', //
                                height: 50, // Ajustar la altura del header para hacerlo más delgado
                                elevation: 0, // Eliminar la sombra en Android}} // Ocultar el header en la pantalla de inicio de sesión
                            },
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
                    {/*<Stack.Screen*/}
                    {/*    name="Menu"*/}
                    {/*    component={Menu} // Use the Menu component that contains the bottom tab navigator*/}
                    {/*    options={{*/}
                    {/*        headerShown: false, // Hide the header since Menu has its own navigation*/}
                    {/*    }}*/}
                    {/*/>*/}
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
