import React, {useState} from 'react';
import {Alert, StyleSheet, View} from 'react-native';
import {Button, Card, List, Text} from 'react-native-paper';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigation/types';
import {CitaPeluqueroResponseDto, EnumEstado, TipoLugar} from "../models/Peluqueria.interface";
import ScreenWrapper from "../shared/ScreenWrapper";
import {modificarCita} from "../services/Generalservice"; // Importar la interfaz del modelo

type CitaDetailScreenNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    'CitaDetail'
>;

type CitaDetailScreenRouteProp = RouteProp<{ params: { cita: CitaPeluqueroResponseDto } }, 'params'>;

export default function CitaDetailScreen() {
    const route = useRoute<CitaDetailScreenRouteProp>();
    const { cita } = route.params;  // Obtener los detalles de la cita desde los parámetros de navegación
    const navigation = useNavigation<CitaDetailScreenNavigationProp>();  // Navegación
    const [expanded, setExpanded] = useState(false);  // Estado para el acordeón

    const handleApprove = async (estado: EnumEstado) => {
         const updatedCita = await modificarCita(cita.idCita, estado); // Send as CONFIRMADA
        Alert.alert(
            'Éxito',
            `La cita ha sido ${estado === EnumEstado.CONFIRMADA ? 'confirmada' : 'rechazada'} con éxito.`,
            [
                {
                    text: 'OK',
                    onPress: () => navigation.goBack(), // Navigate back to the previous screen
                },
            ]
        );

    };
    const abrirMapa = () => {
        navigation.navigate('Mapa', {
            latitude: cita.latitud,
            longitude: cita.longitud,
            editable: false,  // Parámetro para definir que es solo vista
        });
    };

    return (
        <ScreenWrapper contentContainerStyle={styles.container}>
            {/* Mostrar toda la información de la cita */}
            <Card style={styles.card}>
                <Card.Content>
                    <Text style={styles.label}>ID de Cita:</Text>
                    <Text style={styles.value}>{cita.idCita}</Text>

                    <Text style={styles.label}>Cliente:</Text>
                    <Text style={styles.value}>{cita.nombreCompletoCliente}</Text>

                    <Text style={styles.label}>Celular:</Text>
                    <Text style={styles.value}>{cita.celular}</Text>

                    <Text style={styles.label}>Cantidad de Servicios:</Text>
                    <Text style={styles.value}>{cita.servicios.length}</Text>

                    <Text style={styles.label}>Tipo de Lugar:</Text>
                    <Text style={styles.value}>
                        {cita.tipoLugar === TipoLugar.onSite ? 'En la barbería' : cita.tipoLugar}
                    </Text>

                    {/* Mostrar la ubicación solo si el tipo de lugar no es "onsite" */}
                    {cita.tipoLugar !== TipoLugar.onSite && (
                        <>
                            <Text style={styles.label}>Ubicación:</Text>
                            <Text style={styles.value}>{cita.ubicacionDescripcion}</Text>
                        </>
                    )}

                    <Text style={styles.label}>Fecha:</Text>
                    <Text style={styles.value}>{cita.fecha}</Text>

                    <Text style={styles.label}>Hora de Inicio:</Text>
                    <Text style={styles.value}>{cita.inicio}</Text>

                    <Text style={styles.label}>Estado:</Text>
                    <Text style={styles.value}>{cita.estado}</Text>

                </Card.Content>
                {cita.tipoLugar !== TipoLugar.onSite && (
                    <Card.Actions style={styles.cardActions}>
                        <Button
                            mode="outlined"
                            onPress={abrirMapa}
                            style={styles.mapButton}
                            theme={{ colors: { primary: '#000' } }}  // Cambiar color de enfoque del botón
                        >
                            Abrir Mapa
                        </Button>
                    </Card.Actions>
                )}
            </Card>



            {/* Acordeón expandible para mostrar los servicios, fuera de la tarjeta */}
            <List.Accordion
                title="Servicios"
                expanded={expanded}
                onPress={() => setExpanded(!expanded)}
                style={styles.accordion}
                titleStyle={styles.accordionTitle}
                theme={{ colors: { primary: '#000' } }}  // Cambiar el color de enfoque
            >
                {cita.servicios.map((servicio, index) => (
                    <List.Item
                        key={index}
                        title={servicio.nombre}
                        description={`Costo: ${servicio.costo} - Tiempo: ${servicio.tiempo}`}
                        titleStyle={styles.servicioTitle}
                        descriptionStyle={styles.servicioDescription}
                    />
                ))}
            </List.Accordion>
            {/* Botones de acciones adicionales */}
            {cita.estado === 'PENDIENTE' && (
            <View style={styles.buttonContainer}>

                <Button
                    mode="contained"
                    onPress={()=>handleApprove(EnumEstado.RECHAZADA)}
                    style={styles.button}
                >
                    Rechazar
                </Button>
                <Button
                    mode="contained"
                    onPress={()=>handleApprove(EnumEstado.CONFIRMADA)}
                    style={styles.button}
                >
                    Aprobar
                </Button>
            </View>
                )}
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: '#ffffff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#333',
    },
    card: {
        marginBottom: 20,
        padding: 15,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
        backgroundColor: '#f8f9fa',
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 10,
        color: '#333',
    },
    value: {
        fontSize: 16,
        marginBottom: 10,
        color: '#555',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    button: {
        width: '45%',
        borderRadius: 5,
        paddingVertical: 8,
    },
    mapButton: {
        marginTop: 10,
        borderColor: '#000',
        borderWidth: 1,
    },
    cardActions: {
        justifyContent: 'center',
        paddingHorizontal: 10,
    },
    accordion: {
        marginTop: 20,  // Asegurar que el acordeón tenga suficiente margen en la parte superior
        backgroundColor: '#fff',
    },
    accordionTitle: {
        color: '#333',
        fontWeight: 'bold',
    },
    servicioTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
    servicioDescription: {
        fontSize: 13,
        color: '#fff',
    },
});
