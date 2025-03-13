import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './HomeScreen'; // Importa tu componente HomeScreen
import CitasEstadoScreen from "./CitasEstadoScreen"; // Importa tu componente CitasEstadoScreen
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MovimientosScreen from './MovimientosScreen';

const Tab = createBottomTabNavigator();

export default function Menu() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ color, size }) => {

                    return <Icon name={'store'} size={size} color={color} />;
                },
                tabBarLabel: ({ focused, color }) => {
                    return (
                        <Text style={{ color: focused ? 'tomato' : 'black', fontSize: 12 }}>
                            {'Inicio'}
                        </Text>
                    );
                },
                tabBarLabelStyle: {
                    fontSize: 12, // Tamaño de la fuente de la etiqueta
                    fontWeight: 'bold', // Peso de la fuente
                },
                tabBarActiveTintColor: 'tomato', // Color del ícono activo
                tabBarInactiveTintColor: 'black', // Color del ícono inactivo
                tabBarStyle: {
                    backgroundColor: '#FFFFFF', // Color de fondo de la barra de pestañas
                    borderTopColor: '#DDDDDD', // Color del borde superior
                    borderTopWidth: 1, // Ancho del borde superior
                    shadowColor: '#000', // Color de la sombra para iOS
                    shadowOffset: { width: 0, height: 2 }, // Desplazamiento de la sombra para iOS
                    shadowOpacity: 0.1, // Opacidad de la sombra para iOS
                    shadowRadius: 2, // Radio de la sombra para iOS
                    elevation: 4, // Elevación de la sombra para Android
                },
                headerStyle: {
                    backgroundColor: '#FFFFFF', // Color de fondo del encabezado
                    borderBottomColor: '#DDDDDD', // Color del borde inferior del encabezado
                    borderBottomWidth: 1, // Ancho del borde inferior del encabezado
                    height: 50, // Altura del encabezado
                    elevation: 0, // Eliminar sombra del encabezado
                },
                headerTitleStyle: {
                    fontSize: 18, // Tamaño de la fuente del título del encabezado
                    fontWeight: 'bold', // Peso de la fuente del título del encabezado
                },
            })}
        >
            {/* Define las pestañas */}
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    headerShown: true, // Mostrar el encabezado
                    headerTitle: '', // Sin título en el encabezado
                    headerBackVisible: false, // Sin botón de retroceso en el encabezado
                    tabBarLabel: 'Inicio', // Etiqueta para la pestaña Home
                }}
            />
            <Tab.Screen
                name="Movimientos"
                component={MovimientosScreen}
                options={{
                    headerShown: true, // Mostrar el encabezado
                    headerTitle: '', // Sin título en el encabezado
                    headerBackVisible: false, // Sin botón de retroceso en el encabezado
                    tabBarLabel: 'Movimientos', // Etiqueta para la pestaña CitasEstado
                }}
            />
        </Tab.Navigator>
    );
}
