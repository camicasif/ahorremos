import React, {useEffect, useState} from 'react';
import { Card, Title, Paragraph, Button, Dialog, Portal, Text } from 'react-native-paper';
import { View, StyleSheet, Alert } from 'react-native';
import StarRating from 'react-native-star-rating-widget';
import { EnumEstado } from "../models/Peluqueria.interface";
import {calificarCita, obtenerEstadoCita} from "../services/Generalservice"; // Correct import

const CitaCard = ({ initialCita  }) => {
    const [cita, setCita] = useState(initialCita ); // Estado para la cita

    const [visible, setVisible] = useState(false); // State to manage dialog visibility
    const [rating, setRating] = useState(0); // State to manage selected rating

    // Functions to show and hide the dialog
    const showDialog = () => setVisible(true);
    const hideDialog = () => setVisible(false);

    // Function to handle rating submission
    const handlePuntuar = async () => {
        console.log("Cita", cita);
        const response = await calificarCita(cita.idCita, rating);
        setCita(prevCita => ({ ...prevCita, estado: EnumEstado.COMPLETADA }));
        Alert.alert("Éxito", `Cita calificada con ${rating} estrellas.`);
        hideDialog();
    };

    useEffect(() => {
        if (cita.estado === EnumEstado.PENDIENTE) {  // Solo ejecuta si la cita está pendiente
            const interval = setInterval(async () => {
                try {
                    const updatedCita = await obtenerEstadoCita(cita.idCita); // Llamar a la API para obtener el estado de la cita
                    if (updatedCita.estado !== cita.estado) { // Solo actualizar si el estado ha cambiado
                        setCita(prevCita => ({ ...prevCita, estado: updatedCita.estado })); // Actualizar solo el estado de la cita
                    }
                } catch (error) {
                    console.error('Error al actualizar el estado de la cita:', error);
                }
            }, 8000); // Cada 8 segundos

            // Limpiar el intervalo cuando el componente se desmonte
            return () => clearInterval(interval);
        }
    }, [cita.idCita, cita.estado]); // Dependencias de useEffect
    const canShowActions = () => {
        if (cita.estado !== EnumEstado.CONFIRMADA) return false; // Must be CONFIRMADA
        const citaFechaHora = new Date(`${cita.fecha}T${cita.inicio}`); // Combine date and time
        const currentTime = new Date();
        const oneHourInMs = 60 * 60 * 1000; // One hour in milliseconds
        return currentTime - citaFechaHora >= oneHourInMs; // Check if at least one hour has passed
    };

    return (
        <View>
            <Card style={styles.card}>
                <Card.Content style={styles.cardContent}>
                    <View style={styles.headerContainer}>
                        <Title style={styles.title}>{cita.nombrePeluqueria}</Title>
                        <Paragraph style={styles.estado(cita.estado)}>{cita.estado}</Paragraph>
                    </View>
                    <Paragraph style={styles.paragraph}>Fecha: {cita.fecha}</Paragraph>
                    <Paragraph style={styles.paragraph}>Hora de inicio: {cita.inicio}</Paragraph>
                    <Paragraph style={styles.paragraph}>Ubicación: {cita.ubicacionDescripcion}</Paragraph>
                </Card.Content>
                {canShowActions() && (
                    <Card.Actions style={styles.cardActions}>
                        <Button onPress={showDialog} >Puntuar</Button>
                    </Card.Actions>
                )}
            </Card>

            {/* Dialog for rating */}
            <Portal>
                <Dialog visible={visible} onDismiss={hideDialog}>
                    <Dialog.Title style={styles.dialogTitle}>Puntuar Servicio</Dialog.Title>
                    <Dialog.Content>
                        <Text style={styles.dialogText}>
                            ¿Cómo calificarías el servicio recibido en {cita.nombrePeluqueria}?
                        </Text>
                        <StarRating
                            enableHalfStar={false}
                            rating={rating}
                            onChange={setRating}
                            starSize={40} // Tamaño más grande para mayor visibilidad
                            color="#ffc300" // Color dorado para las estrellas
                            style={styles.starRating}
                        />
                        {rating > 0 ? (
                            <Text style={styles.ratingText}>
                                Has seleccionado {rating} estrella{rating > 1 ? 's' : ''}.
                            </Text>
                        ) : (
                            <Text style={styles.ratingText}>
                                Por favor selecciona una calificación.
                            </Text>
                        )}
                    </Dialog.Content>
                    <Dialog.Actions style={styles.dialogActions}>
                        <Button onPress={hideDialog} color="#757575">Cancelar</Button>
                        <Button
                            onPress={rating > 0 ? handlePuntuar : () => Alert.alert("Error", "Debes seleccionar una puntuación antes de confirmar.")}
                            color={rating > 0 ? "#0057FF" : "#D3D3D3"} // Deshabilitar el botón si no hay calificación
                        >
                            Confirmar
                        </Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </View>
    );
};

export default CitaCard;

const styles = StyleSheet.create({
    card: {
        margin: 15,
        marginBottom: 10,
        borderRadius: 12,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 6,
    },
    cardContent: {
        padding: 15,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    estado: (estado) => ({
        fontSize: 14,
        fontWeight: 'bold',
        color: estado === 'CONFIRMADA' ? '#28a745' : estado === 'PENDIENTE' ? '#ffc107' : '#d9534f',
    }),
    paragraph: {
        fontSize: 14,
        color: '#666',
        marginBottom: 5,
    },
    cardActions: {
        justifyContent: 'flex-end',
        paddingRight: 10,
        paddingBottom: 10,
    },
    dialogTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
    },
    dialogText: {
        fontSize: 16,
        color: '#666',
        marginBottom: 10,
    },
    starRating: {
        marginVertical: 15,
    },
    ratingText: {
        fontSize: 14,
        color: '#757575',
        marginTop: 5,
        textAlign: 'center',
    },
    dialogActions: {
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        paddingBottom: 10,
    },
    loadMoreButton: {
        backgroundColor: '#D33C3C',
        borderRadius: 20,
        paddingVertical: 1,
        paddingHorizontal: 1,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        bottom: -2,
        right: -2,
    },
    loadMoreButtonLabel: {
        color: '#fff', // Color del texto
        fontSize: 14, // Tamaño del texto reducido
        fontWeight: 'bold', // Negrita
    },
});
