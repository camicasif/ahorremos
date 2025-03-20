import React, { useEffect, useState, useLayoutEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
    Image,
    TouchableOpacity,
    Dimensions,
    Linking
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Card, Button } from 'react-native-paper'; // Usar Button de react-native-paper
import AsyncStorage from '@react-native-async-storage/async-storage';
import { obtenerServiciosPeluqueria } from '../../services/Generalservice';
import { PeluqueriaServiciosResponseDto, Servicio, Disponibilidad } from '../../models/Peluqueria.interface';
import {GestureHandlerRootView, PanGestureHandler} from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import {MaterialCommunityIcons} from "@expo/vector-icons";

const SCREEN_WIDTH = Dimensions.get('window').width; // Get screen width

export default function PeluqueriaScreen({ route }) {
    // const { peluqueria } = route.params;
    const peluqueria  = {nombre:"pelu", id:2, descripcion:"23"};

    const [servicios, setServicios] = useState<Servicio[]>([]);
    const [disponibilidad, setDisponibilidad] = useState<Disponibilidad[]>([]);
    const [loading, setLoading] = useState(true);
    const [carrito, setCarrito] = useState<Servicio[]>([]); // Carrito ahora es una lista de servicios
    const [citas, setCitas] = useState<Servicio[]>([]); // Estado para manejar las citas guardadas
    const [activeTab, setActiveTab] = useState('Servicios'); // Estado para manejar la pestaña activa
    const [ubicacionDescripcion, setUbicacionDescripcion] = useState(' '); // Estado para manejar la pestaña activa
    const navigation = useNavigation();

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: peluqueria.nombre,

        });
    }, [navigation, peluqueria.nombre]);

    useEffect(() => {
        const fetchServicios = async () => {
            try {
                // const data: PeluqueriaServiciosResponseDto = await obtenerServiciosPeluqueria(peluqueria.id);
                setServicios( []);
                setDisponibilidad( []);
                setUbicacionDescripcion("Descripcion")
            } catch (error) {
                console.error('Error al obtener servicios de la peluquería:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchServicios();
        loadCitasFromStorage();
    }, [peluqueria.id]);

    // Cargar citas guardadas en AsyncStorage
    const loadCitasFromStorage = async () => {
        try {
            const citasGuardadas = await AsyncStorage.getItem('citas');
            if (citasGuardadas) {
                setCitas(JSON.parse(citasGuardadas));
            }
        } catch (error) {
            console.error('Error al cargar citas guardadas:', error);
        }
    };

    const agregarAlCarrito = (servicio: Servicio) => {
        if (!carrito.some((item) => item.id === servicio.id)) {
            setCarrito([...carrito, servicio]); // Agregar el servicio al carrito si no está ya
        }
    };

    const eliminarDelCarrito = (servicioId: number) => {
        const nuevoCarrito = carrito.filter((item) => item.id !== servicioId);
        setCarrito(nuevoCarrito);
    };

    const pedirCita = () => {
        if (carrito.length > 0) {
            const pel = {
                idPeluqueria: peluqueria.id,
                servicios: carrito,
            };
            navigation.navigate('Cita',pel );
        }
    };

    if (loading) {
        return <ActivityIndicator size="large" style={styles.loader} />;
    }

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>

        <View style={styles.container}>
            <HeaderComponent peluqueria={peluqueria} ubicacion={ubicacionDescripcion} />
            <View style={styles.contentContainer}>

                <TabBar activeTab={activeTab} setActiveTab={setActiveTab}  style={styles.tabBar}/>

                {activeTab === 'Servicios' ? (
                    <ServiciosScreen servicios={servicios} agregarAlCarrito={agregarAlCarrito} carrito={carrito} eliminarDelCarrito={eliminarDelCarrito} />
                ) : (
                    <DisponibilidadScreen disponibilidad={disponibilidad} />
                )}

            </View>

            {carrito.length > 0 && (
                <View style={styles.cartContainer}>
                    <Text style={styles.cartText}>Servicios en el carrito: {carrito.length}</Text>
                    <Button mode="contained" onPress={pedirCita} style={styles.cartButton}>
                        Pedir Cita
                    </Button>
                </View>
            )}
        </View>
        </GestureHandlerRootView>

    );
}
function HeaderComponent({ peluqueria, ubicacion }) {
    const [showMoreInfo, setShowMoreInfo] = useState(false); // State to toggle between views

    const handleLinkPress = (url) => {
        Linking.openURL(url);
    };

    // Function to handle swipe gesture
    const handleSwipe = (event) => {
        if (event.nativeEvent.translationX < -50) {
            // Swipe left to show more info
            setShowMoreInfo(true);
        } else if (event.nativeEvent.translationX > 50) {
            // Swipe right to go back to main info
            setShowMoreInfo(false);
        }
    };

    return (
        <PanGestureHandler onGestureEvent={handleSwipe}>
            <View style={styles.headerContainer}>
                <View style={styles.fixedSizeContainer}>
                    {!showMoreInfo ? (
                        <>
                            <Image source={{ uri: `../../../mobil/assets/logosweetsavings.png` }} style={styles.image} />
                            <Text style={styles.title}>{peluqueria.nombre}</Text>
                        </>
                    ) : (
                        <View style={styles.moreInfoContainer}>
                            <Text style={styles.title}>{peluqueria.nombre}</Text>

                            <Text style={styles.description}>{peluqueria.descripcion}</Text>
                            <Text style={styles.moreInfoText}>Celular: 67709167</Text>
                            <TouchableOpacity
                                style={styles.linkContainer}
                                onPress={() => handleLinkPress(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ubicacion)}`)}
                            >
                                <Icon name="map-marker" size={24} color="#FF5733" style={styles.icon} />
                                <Text style={styles.moreInfoLink}>{ubicacion}</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.linkContainer}
                                onPress={() => handleLinkPress('https://www.instagram.com/username')}
                            >
                                <Icon name="instagram" size={24} color="#E1306C" style={styles.icon} />
                                <Text style={styles.moreInfoLink}>{peluqueria.nombre}</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.linkContainer}
                                onPress={() => handleLinkPress('https://www.tiktok.com/@username')}
                            >
                                <Image
                                    source={require('../../../mobil/assets/tiktoklogo.png')}
                                    style={styles.iconImage}
                                />
                                <Text style={styles.moreInfoLink}>{peluqueria.nombre}</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>

                <View style={styles.paginationContainer}>
                    <View style={[styles.dot, !showMoreInfo ? styles.activeDot : styles.inactiveDot]} />
                    <View style={[styles.dot, showMoreInfo ? styles.activeDot : styles.inactiveDot]} />
                </View>
            </View>
        </PanGestureHandler>
    );
}
function TabBar({ activeTab, setActiveTab }) {
    return (
        <View style={styles.tabBarContainer}>
            <TouchableOpacity
                style={[styles.tabButton, activeTab === 'Servicios' && styles.activeTabButton]}
                onPress={() => setActiveTab('Servicios')}
            >
                <Text style={[styles.tabButtonText, activeTab === 'Servicios' && styles.activeTabButtonText]}>Servicios</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.tabButton, activeTab === 'Disponibilidad' && styles.activeTabButton]}
                onPress={() => setActiveTab('Disponibilidad')}
            >
                <Text style={[styles.tabButtonText, activeTab === 'Disponibilidad' && styles.activeTabButtonText]}>Disponibilidad</Text>
            </TouchableOpacity>
        </View>
    );
}

function ServiciosScreen({ servicios, agregarAlCarrito, carrito, eliminarDelCarrito }: { servicios: Servicio[]; agregarAlCarrito: (servicio: Servicio) => void; carrito: Servicio[]; eliminarDelCarrito: (servicioId: number) => void }) {
    if (!servicios || servicios.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No hay servicios disponibles.</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.scrollView}>
            {servicios.map((servicio) => (
                <Card key={servicio.id} style={styles.card}>
                    <Card.Title
                        title={servicio.nombre}
                        titleStyle={styles.cardTitle} // Estilo del título
                    />
                    <Card.Content>
                        <Text style={styles.cardText}>Precio: ${servicio.costo}</Text>
                        <Text style={styles.cardText}>Duración: {servicio.tiempo}</Text>
                    </Card.Content>
                    <Card.Actions>
                        {carrito.some((item) => item.id === servicio.id) ? (
                            <Button mode="outlined" onPress={() => eliminarDelCarrito(servicio.id)}>
                                Eliminar
                            </Button>
                        ) : (
                            <Button mode="contained" onPress={() => agregarAlCarrito(servicio)}>
                                Agregar
                            </Button>
                        )}
                    </Card.Actions>
                </Card>
            ))}
            <View style={{height:60}}></View>

        </ScrollView>
    );
}

function DisponibilidadScreen({ disponibilidad }: { disponibilidad: Disponibilidad[] }) {
    const formatearHora = (hora: string): string => {
        const [hour, minute] = hora.split(':').map(Number);
        const ampm = hour >= 12 ? 'pm' : 'am';
        const formattedHour = hour % 12 || 12;
        return `${formattedHour}:${minute.toString().padStart(2, '0')} ${ampm}`;
    };

    if (!disponibilidad || disponibilidad.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No hay disponibilidad disponible.</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.scrollView}>
            {disponibilidad.map((item, index) => (
                <Card key={index} style={styles.card}>
                    <Card.Title title={`Día: ${item.dia}`} />
                    <Card.Content>
                        <Text>
                            Horario: {formatearHora(item.inicio)} - {formatearHora(item.fin)}
                        </Text>
                    </Card.Content>
                </Card>
            ))}
            <View style={{height:60}}></View>

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0057FF', // Fondo azul
    },
    contentContainer: {
        flex: 1, // Hace que este contenedor ocupe todo el espacio restante
    },
    tabBar: {
        flex: 0, // Evita que el TabBar crezca
    },
    screenContainer: {
        flex: 1, // Ocupa el espacio restante para el contenido de la pantalla
    },
    headerContainer: {
        paddingVertical: 8,
        paddingHorizontal:10,
        alignItems: 'center',
        backgroundColor: '#FFFFFF', // Transparencia para el efecto glass
        borderRadius: 20,
        margin: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        backdropFilter: 'blur(10px)', // Desenfoque para efecto Glassmorphism
    },
    fixedSizeContainer: {
        width: SCREEN_WIDTH - 40, // Fixed width (screen width minus margins)
        height: 240, // Fixed height for both views
        justifyContent: 'center', // Center content vertically
        alignItems: 'center', // Center content horizontally
    },
    title: {
        fontSize: 25, // Jerarquía 1: Mayor tamaño
        fontWeight: 'bold',
        marginTop: 10,
        textAlign: 'center',
        color: '#000:',
    },
    subtitle: {
        fontSize: 15, // Jerarquía 2: Subtítulo
        fontWeight: '600', // Peso medio
        textAlign: 'center',
        color: '#ffffff99', // Color blanco con opacidad
    },
    description: {
        fontSize: 16, // Jerarquía 3: Descripción
        color: 'black', // Blanco con más opacidad
        textAlign: 'center',
        marginTop: 5,
    },
    image: {
        width: '90%',
        height: 160,
        borderRadius: 15,
        marginTop:30,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    tabBarContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.2)', // Transparente con efecto glass
        paddingVertical: 10,
        margin: 10,
        borderRadius: 10,
        backdropFilter: 'blur(10px)',
    },
    tabButton: {
        flex: 1,
        padding: 10,
        alignItems: 'center',
    },
    activeTabButton: {
        borderBottomWidth: 2,
        borderBottomColor: '#fff',
    },
    tabButtonText: {
        fontSize: 16,
        color: '#ffffffcc', // Color blanco con opacidad
    },
    activeTabButtonText: {
        fontWeight: 'bold',
        color: '#fff',
    },
    scrollView: {
        padding: 10,
    },
    cardText: {
        fontSize: 16, // Tamaño para el texto de precio y duración
        color: '#000', // Color del texto
    },
    card: {
        marginBottom: 15,
        borderRadius: 15,
        backgroundColor: '#FFFFFF', // Transparente para efecto glass
        padding: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)', // Borde suave para glassmorphism
        backdropFilter: 'blur(10px)',
    },
    cardTitle: {
        fontSize: 20, // Jerarquía 1 dentro de la tarjeta
        fontWeight: 'bold',
        color: '#000',
    },
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    emptyText: {
        fontSize: 16,
        color: '#888',
    },
    cartContainer: {
        position: 'absolute',  // Make the cart view float above the content
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#FFFFFF', // Transparente para efecto glass
        padding: 10,
        borderTopWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backdropFilter: 'blur(10px)',
    },
    cartText: {
        fontSize: 16,
        color: '#000000',
    },
    cartButton: {
        marginLeft: 10,
        backgroundColor: '#D33C3C', // Fondo claro con transparencia
        color: '#000',
    },
    moreInfoContainer: {
        alignItems: 'center',
    },
    moreInfoText: {
        fontSize: 18,
        color: '#555',
        marginBottom: 10,
    },
    moreInfoLink: {
        fontSize: 18,
        color: '#1E90FF', // Use a blue color to signify a link
        marginBottom: 10,
        textAlign: 'center',
        textDecorationLine: 'underline', // Underline to indicate it's a clickable link
    },
    linkContainer: {
        flexDirection: 'row', // Align icon and text in a row
        alignItems: 'center', // Center the icon and text vertically
        marginBottom: 10,
    },
    icon: {
        marginRight: 5, // Margin to space the icon from the text
    },
    iconImage: {
        width: 24, // Set the desired width of the icon image
        height: 24, // Set the desired height of the icon image
        marginRight: 5, // Margin to space the image from the text
    },
    paginationContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginHorizontal: 5,
    },
    activeDot: {
        backgroundColor: '#1E90FF', // Filled dot color
    },
    inactiveDot: {
        backgroundColor: '#C0C0C0', // Unfilled dot color
    },
});


