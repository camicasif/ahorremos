import React, { useState, useEffect, useRef } from 'react';
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
    ActivityIndicator
} from 'react-native';
import { Button, Text, Card, Chip, Searchbar } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types';
import {Page, PeluqueriaResponseDto} from "../models/Peluqueria.interface";
import {filtrarPeluquerias, PeluqueriaFilterParams} from "../services/Generalservice";
type HomeScreenNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    'Home'
>;

export default function HomeScreen() {
    const navigation = useNavigation<HomeScreenNavigationProp>();
    const [data, setData] = useState<PeluqueriaResponseDto[]>([]);
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(false);
    const [endReached, setEndReached] = useState(false);
    const [nombre, setNombre] = useState('');  // Nuevo estado para el filtro de nombre
    const [onSite, setOnSite] = useState(false);  // Estado para el filtro onSite
    const [domicilio, setDomicilio] = useState(false);  // Estado para el filtro domicilio
    const loadMoreRef = useRef(false);

    useEffect(() => {
        fetchData();
    }, [page]);

    const fetchData = async () => {
        if (loading || endReached) return;

        setLoading(true);
        try {
            const params: PeluqueriaFilterParams = {
                page: page,
                size: 5,
                nombre: nombre,
                ...onSite && { onSite }, // Solo agregar si onSite es true
                ...domicilio && { domicilio } // Solo agregar si domicilio es true
            };

            const response: Page<PeluqueriaResponseDto> = await filtrarPeluquerias(params);
            if (response.last) {
                setEndReached(true);
            }
            if (page === 0) {
                setData(response.content);
            } else {
                setData(prevData => [...prevData, ...response.content]);
            }
        } catch (error) {
            console.error('Error al cargar los datos:', error);
        } finally {
            setLoading(false);
        }
    };
    const handleSearch = () => {
        setEndReached(false);
        setPage(0);  // Reiniciar la paginación
        fetchData(); // Llamar a la API con la nueva búsqueda
    };

    const renderItem = ({ item }: { item: PeluqueriaResponseDto }) => (
        <Card style={styles.card}>
            <View style={styles.cardContentContainer}>
                <Image
                    source={{ uri: `data:image/jpg;base64,${item.imagen}` }}
                    style={styles.cardImage}
                />
                <View style={styles.cardTextContainer}>
                    <Text style={styles.cardTitle}>{item.nombre}</Text>
                    <Text style={styles.cardDescription}>{item.descripcion}</Text>
                    <Text style={styles.cardScore}>Puntuación: {item.puntuacion}</Text>
                    <Button
                        style={styles.loadMoreButton}
                        labelStyle={styles.loadMoreButtonLabel}
                        onPress={() => { navigateToPeluqueria(item)}}>
                        Ver más
                    </Button>
                </View>
            </View>
        </Card>
    );


    const loadMore = () => {
        if (!loading && !endReached && !loadMoreRef.current) {
            loadMoreRef.current = true;
            setPage(prevPage => prevPage + 1);
            setTimeout(() => {
                loadMoreRef.current = false;
            }, 1000); // 1 second debounce
        }
    };

    const navigateToPeluqueria = (peluqueria: PeluqueriaResponseDto) => {
        navigation.navigate('Peluqueria', { peluqueria }); // Pasar los datos de la peluquería
       // navigation.navigate('Cita');
    };

    return (
        <View style={styles.container}>
            <Searchbar
                placeholder="Buscar por nombre"
                value={nombre}
                onChangeText={text => setNombre(text)}  // Actualizar el estado de nombre
                onSubmitEditing={handleSearch}  // Llamar a la API cuando el usuario presiona Enter en el teclado
                style={styles.searchbar}
            />
            <View style={styles.chipContainer}>
                <Chip
                    selected={onSite}
                    onPress={() => {
                        setOnSite(!onSite);  // Alternar el estado de onSite
                        handleSearch();  // Hacer la solicitud a la API
                    }}
                    style={styles.chip}
                >
                    OnSite
                </Chip>
                <Chip
                    selected={domicilio}
                    onPress={() => {
                        setDomicilio(!domicilio);  // Alternar el estado de domicilio
                        handleSearch();  // Hacer la solicitud a la API
                    }}
                    style={styles.chip}
                >
                    Domicilio
                </Chip>
            </View>
            <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                onEndReached={loadMore}
                onEndReachedThreshold={0.5}
                ListFooterComponent={loading ? <ActivityIndicator size="large" /> : null}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#0057FF',
    },
    searchbar: {
        marginBottom: 10,
        backgroundColor: '#fff'
    },
    chipContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    chip: {
        marginRight: 5,
        backgroundColor: '#fff', // Fondo semitransparente con tono azul
        borderColor: 'rgba(255, 255, 255, 0.3)', // Borde blanco con opacidad baja
        shadowOpacity: 0.1,
        shadowColor: '#000', // Sombra
    },
    card: {
        marginBottom: 10,
        backgroundColor: '#fff', // Fondo translúcido azul
        borderRadius: 15, // Bordes redondeados
        borderColor: 'rgba(255, 255, 255, 0.3)', // Borde blanco con opacidad baja
        borderWidth: 1, // Ancho del borde
        padding: 15, // Espaciado interno
        shadowColor: '#000', // Sombra
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 22,
        elevation: 10, // Elevación para Android
        position: 'relative', // Asegurarse de que el botón esté posicionado relativo a la tarjeta
        backdropFilter: 'blur(10px)', // Efecto de desenfoque
    },
    cardContentContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    cardImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginRight: 15,
    },
    cardTextContainer: {
        flex: 1,
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000', // Texto blanco para contraste
        textAlign: 'left',
    },
    cardDescription: {
        fontSize: 14,
        color: '#000', // Texto con tono claro para contraste
        marginTop: 10,
        marginBottom: 5,
    },
    cardScore: {
        fontSize: 12,
        color: '#000', // Texto con tono claro para contraste
        marginTop: 5,
        marginBottom: 10,
        fontWeight: 'bold',
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

