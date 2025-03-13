import React, {useState, useEffect, useRef, useCallback} from 'react';
import {
    View,
    StyleSheet,
    Image,
    StatusBar, //agregar header
    Alert,
    BackHandler,
    TouchableOpacity,
    ImageBackground,  // Importar ImageBackground
    ScrollView,
    FlatList,
    ActivityIndicator, RefreshControl
} from 'react-native';
import {Button, Text, Card, Chip, Searchbar, Paragraph, Title} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types';
import {CitaResponseDto} from "../models/Cita.interface";
import {obtenerCitas} from "../services/Generalservice";
import {useFocusEffect} from "@react-navigation/core";
import CitaCard from "./CitaCard";
import ScreenWrapper from "../shared/ScreenWrapper";
type HomeScreenNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    'CitasEstado'
>;

export default function CitasEstadoScreen() {
    const [citas, setCitas] = useState<CitaResponseDto[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [idCliente, setIdCliente] = useState<string | null>(null);
    const [refreshing, setRefreshing] = useState<boolean>(false); // State for RefreshControl

    useEffect(() => {
        const obtenerIdCliente = async () => {
            try {
                const userId = await AsyncStorage.getItem('userId');
                if (userId) {
                    setIdCliente(userId); // Establecer el idCliente en el estado
                }
            } catch (error) {
                console.error('Error al obtener idCliente del AsyncStorage:', error);
            }
        };

        obtenerIdCliente();
    }, []);

    useFocusEffect(
        useCallback(() => {
            const fetchCitas = async () => {
                if (!idCliente) return; // Esperar hasta tener el idCliente

                try {
                    setLoading(true);
                    const response = await obtenerCitas(idCliente);
                    setCitas(response);
                } catch (err) {
                    console.error('Error al obtener citas:', err);
                    setError('Error al obtener citas.');
                } finally {
                    setLoading(false);
                }
            };

            fetchCitas();
        }, [idCliente]) // Solo se llama cuando idCliente cambia o la pantalla gana el foco
    );
    const onRefresh = async () => {
        if (!idCliente) return; // Avoid refreshing if idCliente is not available

        setRefreshing(true);
        try {
            const response = await obtenerCitas(idCliente);
            setCitas(response); // Update the citas data
        } catch (err) {
            console.error('Error al refrescar las citas:', err);
            setError('Error al refrescar las citas.');
        } finally {
            setRefreshing(false); // Stop the refreshing animation
        }
    };

    if (loading && !refreshing) { // Show loader only on initial load, not during refresh
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#D3D3D3" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Paragraph>{error}</Paragraph>
                <Button onPress={() => setError(null)}>Reintentar</Button>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={citas}
                renderItem={({ item }) => <CitaCard key={item.idCita} initialCita={item} />}
                keyExtractor={(item) => item.idCita}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={['#FFF']} // Customize spinner color
                    />
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#FFF',
    },
    card: {
        marginBottom: 10,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',

    },
    errorContainer: {
        backgroundColor: '#fff',

        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
});
