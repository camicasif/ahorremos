import React, { useEffect, useState } from 'react';
import {View, Text, StyleSheet, Switch, Keyboard, Platform} from 'react-native';
import { Card, Button, TextInput } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import InputKeyboardView from "../shared/InputKeyboardView";
import ScreenWrapper from "../shared/ScreenWrapper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CitaRequestDto, ServicioResponseDto, TipoLugar } from "../models/Cita.interface";
import { crearCita } from "../services/Generalservice";

export default function CitasScreen({ route, navigation }) {
    const [servicios, setServicios] = useState<ServicioResponseDto[]>(route.params?.servicios || []);
    const [idPeluqueria, setIdPeluqueria] = useState<number | null>(route.params?.idPeluqueria || null);
    const [domicilio, setDomicilio] = useState(false);
    const [fecha, setFecha] = useState(new Date());
    const [hora, setHora] = useState(new Date());
    const [descripcionUbicacion, setDescripcionUbicacion] = useState('');
    const [ubicacion, setUbicacion] = useState<{ latitud: string; longitud: string; descripcion: string } >({ latitud: "-17.781704469615523", longitud: "-63.17468374781467", descripcion:""});
    const [idCliente, setIdCliente] = useState<string | null>(null);
    const nav = useNavigation();

    const [pickerState, setPickerState] = useState({
        date: new Date(),
        mode: 'date',  // Puede ser 'date' o 'time'
        show: false
    });

    useEffect(() => {
        if (route.params?.latitude && route.params?.longitude && route.params?.descripcion) {
            setUbicacion({
                latitud: route.params.latitude,
                longitud: route.params.longitude,
                descripcion: route.params.descripcion,
            });
        }

        // Mantener servicios e idPeluqueria de los parámetros originales
        if (route.params?.servicios) {
            setServicios(route.params.servicios);
        }

        if (route.params?.idPeluqueria) {
            setIdPeluqueria(route.params.idPeluqueria);
        }
    }, [route.params]);

    useEffect(() => {
        const obtenerIdCliente = async () => {
            try {
                const userId = await AsyncStorage.getItem('userId');
                if (userId) {
                    setIdCliente(userId);
                }
            } catch (error) {
                console.error('Error al obtener idCliente del AsyncStorage:', error);
            }
        };

        obtenerIdCliente();
    }, []);

    const onConfirmarCita = async () => {
        if (!idCliente) {
            console.error('No se pudo obtener el idCliente del almacenamiento.');
            return;
        }
        const adjustedFecha = new Date(fecha);
        adjustedFecha.setHours(0, 0, 0, 0);

        const horaLocal = new Date(hora.getTime() - hora.getTimezoneOffset() * 60000)
            .toISOString()
            .split('T')[1]
            .substring(0, 8);

        const citaRequestDto: CitaRequestDto = {
            fecha: adjustedFecha.toISOString().split('T')[0],
            fin: '',
            idCliente: idCliente,
            idPeluqueria: idPeluqueria as number,
            inicio: horaLocal,
            latitud: domicilio && ubicacion ? ubicacion.latitud : '',
            longitud: domicilio && ubicacion ? ubicacion.longitud : '',
            servicios: servicios as ServicioResponseDto[],
            tipoLugar: domicilio ? TipoLugar.DOMICILIO : TipoLugar.EN_SITIO,
            ubicacionDescripcion: domicilio ? descripcionUbicacion : '',
        };
        console.log("cita body:", citaRequestDto);

        try {
            const response = await crearCita(citaRequestDto);
            console.log('Cita creada exitosamente:', response);
            alert('¡Cita creada exitosamente!');
            navigation.navigate('CitasEstado');
        } catch (error) {
            console.error('Error al crear la cita:', error);
            alert('Error al crear la cita. Por favor, inténtelo de nuevo.');
        }
    };

    const abrirMapa = () => {
        nav.navigate('Mapa', { editable: true, latitude: ubicacion?.latitud ,longitude: ubicacion?.longitud
        });
    };
    const onChangeDate = (event, selectedDate) => {
        const currentDate = selectedDate || fecha;
        setFecha(currentDate);  // Actualizar el estado de la fecha
        setPickerState({ ...pickerState, show: false });  // Oculta el picker
    };

    // Maneja el cambio de hora
    const onChangeTime = (event, selectedTime) => {
        const currentTime = selectedTime || hora;
        setHora(currentTime);  // Actualizar el estado de la hora
        setPickerState({ ...pickerState, show: false });  // Oculta el picker
    };

    // Función para mostrar el DateTimePicker en modo de fecha
    const showDatePicker = () => {
        setPickerState({ ...pickerState, mode: 'date', show: true });
    };

    // Función para mostrar el DateTimePicker en modo de hora
    const showTimePicker = () => {
        setPickerState({ ...pickerState, mode: 'time', show: true });
    };
    const formattedDate = fecha.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
    const formattedTime = hora.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    });

    return (
        <InputKeyboardView>
            <ScreenWrapper contentContainerStyle={styles.scrollContainer}>
                <Text style={styles.titles}>Servicios Seleccionados: </Text>
                {servicios && servicios.map((servicio) => (
                    <Card key={servicio.id} style={styles.card}>
                        <Card.Title title={servicio.nombre} titleStyle={styles.cardTitle} />
                        <Card.Content>
                            <Text style={styles.cardText}>Precio: ${servicio.costo}</Text>
                            <Text style={styles.cardText}>Duración: {servicio.tiempo}</Text>
                        </Card.Content>
                    </Card>
                ))}

                <View style={styles.switchContainer}>
                    <Text style={styles.switchText}>A Domicilio</Text>
                    <Switch value={domicilio} onValueChange={setDomicilio} />
                </View>

                {domicilio && (
                    <>
                        <TextInput
                            label="Descripción de la Ubicación"
                            value={descripcionUbicacion}
                            multiline
                            numberOfLines={2}
                            onChangeText={setDescripcionUbicacion}
                            style={styles.input}
                            returnKeyType="done"
                            blurOnSubmit={true}
                            onSubmitEditing={Keyboard.dismiss}
                        />

                        {ubicacion && ubicacion.descripcion && (
                            <Text style={styles.ubicacionDescripcion}>
                                Ubicación Seleccionada: {ubicacion.descripcion}
                            </Text>
                        )}

                        <Button
                            mode="contained"
                            onPress={abrirMapa}
                            style={styles.mapButton}
                        >
                            Abrir Mapa
                        </Button>
                    </>
                )}

                <View style={styles.datePickerContainer}>
                    <Text style={styles.sectionTitle}>Seleccionar Fecha</Text>
                    {Platform.OS === 'ios' ? (
                        <DateTimePicker
                            value={fecha}
                            mode="date"
                            display="default"
                            onChange={(event, selectedDate) => {
                                if (selectedDate) setFecha(selectedDate);  // Actualizar la fecha seleccionada
                            }}
                            style={styles.datePicker}
                        />
                    ) : (
                        <>
                            <Button mode="text" onPress={showDatePicker} style={styles.androidButton} labelStyle={styles.buttonLabel}>
                                {formattedDate}
                            </Button>
                            {pickerState.show && pickerState.mode === 'date' && (
                                <DateTimePicker
                                    value={fecha}
                                    mode="date"
                                    display="default"
                                    onChange={onChangeDate}
                                    is24Hour={true}
                                />
                            )}
                        </>
                    )}

                    <Text style={styles.sectionTitle}>Seleccionar Hora</Text>
                    {Platform.OS === 'ios' ? (
                        <DateTimePicker
                            value={hora}
                            mode="time"
                            display="default"
                            onChange={(event, selectedTime) => {
                                if (selectedTime) setHora(selectedTime);  // Actualizar la hora seleccionada
                            }}
                            style={styles.datePicker}
                        />
                    ) : (
                        <>
                            <Button mode="text" onPress={showTimePicker}  style={styles.androidButton} labelStyle={styles.buttonLabel}>
                                {formattedTime}
                            </Button>
                            {pickerState.show && pickerState.mode === 'time' && (
                                <DateTimePicker
                                    value={hora}
                                    mode="time"
                                    display="default"
                                    onChange={onChangeTime}
                                    is24Hour={true}
                                />
                            )}
                        </>
                    )}
                </View>

                <Button
                    mode="contained"
                    onPress={onConfirmarCita}
                    style={styles.confirmButton}
                    labelStyle={styles.whiteText}
                    disabled={domicilio && (!ubicacion || !ubicacion.latitud || !ubicacion.longitud)}
                >
                    Confirmar Cita
                </Button>
            </ScreenWrapper>
        </InputKeyboardView>
    );
}

const styles = StyleSheet.create({
    scrollContainer: {
        padding: 15,
        backgroundColor: '#F5F5F5',
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#333',
    },

    titles : {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#fff',
    },
    card: {
        marginBottom: 10,
        borderRadius: 10,
        backgroundColor: '#FFFFFF',
        padding: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2C3E50',
    },
    cardText: {
        fontSize: 16,
        color: '#34495E',
    },
    switchContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 15,
    },
    switchText: {
        fontSize: 16,
        color: '#fff',
    },
    input: {
        backgroundColor: '#fff',
        marginVertical: 10,
        borderRadius: 8,
    },
    ubicacionDescripcion: {
        marginVertical: 5,
        fontStyle: 'italic',
        color: 'grey',
    },
    datePickerContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        padding: 15,
        marginVertical: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    datePicker: {
        marginVertical: 10,
    },
    confirmButton: {
        marginTop: 20,
        paddingVertical: 10,
        backgroundColor: '#D33C3C',
    },
    mapButton: {
        marginTop: 10,
        paddingVertical: 5,
        borderRadius: 8,
        backgroundColor: '#D33C3C',

    },
    whiteText: {
        color: '#fff',
    },
    androidButton: {
        backgroundColor: '#ece9e9', // Fondo gris claro
        alignSelf: 'flex-end', // Alinear el botón a la derecha
    },
    buttonLabel: {
        color: '#000', // Texto en negro
    },
});
