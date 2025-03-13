import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import MapView, {Marker, PROVIDER_DEFAULT, UrlTile} from 'react-native-maps';
import { Button, TextInput } from 'react-native-paper';

// Función para obtener la descripción de la ubicación usando Nominatim (OpenStreetMap)
const obtenerDescripcionNominatim = async (latitud, longitud) => {
    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitud}&lon=${longitud}&addressdetails=1`
        );
        const data = await response.json();
        if (data && data.display_name) {
            return data.display_name; // Retornar la dirección formateada
        } else {
            return 'Descripción no disponible';
        }
    } catch (error) {
        console.warn('Error al obtener la descripción de la ubicación:', error);
        return 'Error al obtener la descripción';
    }
};

export default function MapsScreen({ route, navigation }) {
    const { latitude, longitude, editable } = route.params; // Recibir coordenadas y si es editable
    const [markerPosition, setMarkerPosition] = useState(null);  // Inicializar como null
    const [descripcion, setDescripcion] = useState(''); // Estado para la descripción de la ubicación
    const [loading, setLoading] = useState(true); // Estado de carga

    useEffect(() => {
        // Cuando latitude y longitude estén disponibles, actualizar el marcador
        if (latitude !== undefined && longitude !== undefined) {
            setMarkerPosition({
                latitude: Number(latitude) ?? -17.78629,
                longitude: Number(longitude) ?? -63.18117
            });
            setLoading(false); // Marcar como cargado
        }
    }, [latitude, longitude]);

    useEffect(() => {
        // Obtener la descripción de la ubicación cuando la posición del marcador cambie
        if (markerPosition) {
            console.log("markerPosition:", markerPosition);
           obtenerDescripcion(markerPosition.latitude.toString(), markerPosition.longitude.toString());
        }
    }, [markerPosition]);

    const handleMapPress = (event) => {
        if (editable) {  // Solo permitir el cambio de marcador si es editable
            const { latitude, longitude } = event.nativeEvent.coordinate;
            console.log("coord:", event.nativeEvent.coordinate);
            setMarkerPosition({ latitude, longitude });
        }
    };

    // Función para obtener la descripción de la ubicación basada en latitud y longitud usando Nominatim
    const obtenerDescripcion = async (latitud, longitud) => {
        const direccion = await obtenerDescripcionNominatim(latitud, longitud);
        setDescripcion(direccion); // Actualizar el estado con la descripción
    };

    // Función para confirmar la ubicación seleccionada y volver a la pantalla anterior
    const confirmarUbicacion = () => {
        if (editable) {
            // Regresar a CitasScreen con las coordenadas seleccionadas
            const originalParams = route.params;

            // Regresar a CitasScreen con las coordenadas seleccionadas y los parámetros originales
            navigation.navigate('Cita', {
                ...originalParams,  // Mantener los parámetros originales
                latitude: markerPosition.latitude.toString(),
                longitude: markerPosition.longitude.toString(),
                descripcion: descripcion,
            });
        } else {
            navigation.goBack();  // Si no es editable, simplemente regresar
        }
    };

    if (loading) {
        // Mostrar un indicador de carga mientras esperamos las coordenadas
        return <ActivityIndicator size="large" color="#0000ff" style={styles.loadingIndicator} />;
    }

    return (
        <View style={styles.container}>
            {markerPosition && markerPosition.latitude && markerPosition.longitude ? (
                <MapView
                    style={styles.map}
                    initialRegion={{
                        latitude: markerPosition.latitude,
                        longitude: markerPosition.longitude,
                        latitudeDelta: 0.05,
                        longitudeDelta: 0.05,
                    }}
                    onPress={handleMapPress}
                >
                    <UrlTile
                        urlTemplate="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        maximumZ={19}
                        flipY={false}
                    />
                    {markerPosition && <Marker coordinate={markerPosition} />}
                </MapView>
            ) : (
                // Si no hay marcador, también renderizamos el MapView pero sin el marcador
                <MapView
                    style={styles.map}
                    initialRegion={{
                        latitude: -17.78629,
                        longitude: -63.18117,
                        latitudeDelta: 0.05,
                        longitudeDelta: 0.05,
                    }}
                    onPress={handleMapPress}
                >
                    <UrlTile
                        urlTemplate="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        maximumZ={19}
                        flipY={false}
                    />
                </MapView>
            )}

            <TextInput
                label="Descripción de la Ubicación"
                value={descripcion}
                editable={false} // No editable ya que es autogenerado
                style={styles.input}
                multiline
            />

            {editable && (
                <Button mode="contained" onPress={confirmarUbicacion} style={styles.confirmButton}>
                    Confirmar Ubicación
                </Button>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    input: {
        position: 'absolute',
        bottom: 80,
        left: 20,
        right: 20,
        backgroundColor: 'white',
    },
    confirmButton: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
    },
    loadingIndicator: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
