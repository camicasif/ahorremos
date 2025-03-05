import React, {useState, useEffect, useCallback} from 'react';
import {
    View,
    StyleSheet,
    FlatList,
    ActivityIndicator,
    Text,
    Button, RefreshControl,
} from 'react-native';
import { Card } from 'react-native-paper';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import {RouteProp, useFocusEffect, useRoute} from '@react-navigation/core';
import { obtenerCitasPeluqueria } from "../services/Generalservice";  // Importar el nuevo servicio
import { RootStackParamList } from '../navigation/types';
import { CitaPeluqueroResponseDto } from "../models/Peluqueria.interface";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";  // Importar la interfaz del modelo

type HomeScreenNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    'HomePeluquero'
>;

export default function HomePeluqueroScreen() {
    const [data, setData] = useState<CitaPeluqueroResponseDto[]>([]);
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation<HomeScreenNavigationProp>();
    const route = useRoute<RouteProp<{ params: { params: { idPeluqueria?: number } } }, 'params'>>();
    const idPeluqueria = route.params?.params?.idPeluqueria;  // Acceder a idPeluqueria de parámetros anidados
    const [refreshing, setRefreshing] = useState(false); // State for refreshing

    useFocusEffect(
        useCallback(() => {
            if (idPeluqueria) {
                fetchData(idPeluqueria);  // Call fetchData only if idPeluqueria is defined
            }
        }, [idPeluqueria]) // Dependency array ensures this runs when idPeluqueria changes
    );

    useEffect(() => {
        if (idPeluqueria) {
            const interval = setInterval(async () => {
                try {
                    const newData = await obtenerCitasPeluqueria(idPeluqueria); // Llamar a la API para obtener las citas

                    // Obtener los IDs actuales de las citas
                    const currentIds = data.map(cita => cita.idCita);
                    // Obtener los nuevos IDs de las citas
                    const newIds = newData.map(cita => cita.idCita);

                    // Comprobar si hay nuevos IDs de citas
                    const hasNewCitas = newIds.some(id => !currentIds.includes(id));

                    if (hasNewCitas) {
                        setData(newData); // Actualizar el estado solo si hay nuevas citas
                    }
                } catch (error) {
                    console.error('Error al cargar las citas:', error);
                }
            }, 8000);

            // Limpiar el intervalo cuando el componente se desmonte
            return () => clearInterval(interval);
        }
    }, [idPeluqueria, data]); // Ejecutar cuando idPeluqueria o data cambien


    const fetchData = async (idPeluqueria:number) => {
        setLoading(true);
        try {
            // Llamar al servicio obtenerCitasPeluqueria con el idPeluquero
            const response: CitaPeluqueroResponseDto[] = await obtenerCitasPeluqueria(idPeluqueria);
            setData(response);  // Guardar los datos en el estado
        } catch (error) {
            console.error('Error al cargar las citas:', error);
        } finally {
            setLoading(false);
        }
    };
    const onRefresh = async () => {
        if (idPeluqueria) {
            setRefreshing(true); // Set refreshing state to true
            await fetchData(idPeluqueria); // Fetch data
            setRefreshing(false); // Set refreshing state to false
        }
    };
    const handleViewMore = (cita: CitaPeluqueroResponseDto) => {
        // Navegar a la pantalla de detalles de la cita con la información de la cita seleccionada
        navigation.navigate('CitaDetailPeluquero', { cita });
    };

    const renderItem = ({item}: { item: CitaPeluqueroResponseDto }) => {
        let titleColor = '#000';
        let iconName = '';
        let iconColor = '#000';
        //De este sitio puedes ver los nombres de los iconos
        // https://static.enapter.com/rn/icons/material-community.html
        switch (item.estado) {
            case
            'PENDIENTE'
            :
                titleColor = '#0057FF';
                iconName = 'alarm-light-outline';
                iconColor = '#0057FF';
                break;
            case
            'CONFIRMADA'
            :
                titleColor = '#28a745';
                iconName = 'check-circle';
                iconColor = '#28a745';
                break;
            case
            'RECHAZADA'
            :
                titleColor = '#d9534f';
                iconName = 'close-thick';
                iconColor = '#d9534f';
                break;
            default:
                break;
        }
        return <Card style={styles.card}>
            <View style={styles.cardContentContainer}>

                <View style={styles.titleContainer}>

                    <Text style={[styles.cardTitle, { color: titleColor }]}>
                        {item.estado}
                    </Text>
                    <Icon name={iconName} size={20} color={iconColor} style={styles.icon} />
                </View>
                <View style={styles.cardTextContainer}>
                    <Text style={styles.cardTitle}>Cliente: {item.nombreCompletoCliente}</Text>
                    <Text style={styles.cardDescription}>Celular: {item.celular}</Text>
                    <Text style={styles.cardDescription}>Tipo de Lugar: {item.tipoLugar}</Text>
                    <Text style={styles.cardDescription}>Ubicación: {item.ubicacionDescripcion}</Text>
                    <Text style={styles.cardDescription}>Fecha: {item.fecha}  {item.inicio}</Text>

                </View>

                <Card.Actions>
                    <Button onPress={() => handleViewMore(item)} color="#0057FF" title={" Ver más"}>
                    </Button>
                </Card.Actions>
            </View>
        </Card>
    };

    if (!idPeluqueria) {
        return (
            <View style={styles.centeredContainer}>
                <Text style={styles.warningText}>
                    No tiene registrada una peluquería. Por favor, póngase en contacto con el administrador para registrar su peluquería.
                </Text>
                <Button
                    title="Contactar Administrador"
                    onPress={() => console.log('Acción para contactar administrador')}
                    color="#0057FF"
                />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <FlatList
                    data={data}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.idCita.toString()}
                    refreshControl={  // Add RefreshControl to FlatList
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            colors={['#0057FF']} // Customize spinner color
                        />
                    }
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#0057FF',
    },
    centeredContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f8f9fa',
    },
    warningText: {
        fontSize: 18,
        textAlign: 'center',
        color: '#d9534f',  // Color de advertencia
        marginBottom: 20,
    },
    card: {
        marginBottom: 10,
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 22,
        elevation: 10,
    },
    cardContentContainer: {
        flexDirection: 'column',
        alignItems: 'flex-start',
    },
    cardId: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    cardTextContainer: {
        flex: 1,
    },
    titleContainer: {

        flexDirection: 'row', // Align icon and text in a row
        alignItems: 'center', // Center vertically
        marginBottom: 5,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
        textAlign: 'left',
        marginBottom: 5,
    },
    cardDescription: {
        fontSize: 14,
        color: '#000',
        marginBottom: 5,
    },
    iconTextContainer: {
        flexDirection: 'row', // Display icon and text in a row
        alignItems: 'center', // Center vertically
    },
    icon: {
        marginLeft: 5, // Margin to separate icon from text
    },
});
