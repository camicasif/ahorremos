import React, {useState} from 'react';
import {Alert, Image, KeyboardAvoidingView, Modal, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Button, Portal, Text, TextInput, useTheme as usePaperTheme} from 'react-native-paper';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../navigation/types';
import {login} from '../services/Generalservice';
import {useAppTheme} from '../config/ThemeContext';
import {UserRol} from "../models/Auth";
import InputKeyboardView from "../shared/InputKeyboardView";
import axiosInstance, {setBaseURL} from "../config/axiosConfig";
// import CustomHeader from '../shared/CustomHeader';

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

export default function LoginScreen() {
    const navigation = useNavigation<LoginScreenNavigationProp>();
    const paperTheme = usePaperTheme();
    const { toggleTheme, theme } = useAppTheme();
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [ipModalVisible, setIpModalVisible] = useState(false); // Estado para mostrar el modal
    const [newIp, setNewIp] = useState(''); // Estado para la nueva IP
    const handleLogin = async () => {
            const authUser = await login({ username: email, password });
            console.log("auhuser info: ", authUser)
        console.log("entro en rol pelquuero")

        if (authUser.rol == UserRol.PELUQUERO){
                console.log("entro en rol pelquuero")
                navigation.navigate('MenuPeluquero',{ idPeluqueria: authUser.idPeluqueria });
            }else {
                navigation.navigate('Menu');
            }

    };

    const handleUpdateIp = () => {
        if (newIp.trim()) {
            const formattedIp = `http://${newIp}:8081`; // Formatear la IP para la URL
            setBaseURL(formattedIp); // Usar la función para actualizar la baseURL
            Alert.alert('Éxito', `La IP ha sido actualizada a ${newIp}`);
            setIpModalVisible(false); // Ocultar el modal después de actualizar
        } else {
            Alert.alert('Error', 'Por favor, ingresa una IP válida.');
        }
    };

    const handleForgotPassword = () => {
        Alert.alert('Forgot Password', 'Contactate con un administrador');
    };
    // const handleForgotPassword = () => {
    //     setIpModalVisible(true); // Mostrar el modal cuando se selecciona "Olvidé mi contraseña"
    // };

    return (
        <KeyboardAvoidingView style={{flex: 1}}
                              behavior={'height'}
                              keyboardVerticalOffset={150}>

            <View style={styles.container}>
                <View style={styles.headerImageContainer}>
                    <Image source={theme.headerImage} style={styles.headerImage}/>
                </View>
                <View style={styles.containerInputs}>
                    <Text variant="headlineMedium" style={styles.title}>Iniciar Sesión</Text>
                    <TextInput
                        style={styles.input}
                        label="Username"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        mode="flat"
                        textColor={'black'}
                        underlineColor={'white'}
                        outlineColor={theme.colors.text}
                        activeOutlineColor={theme.colors.text}
                        theme={{roundness: 10}}
                        placeholderTextColor={theme.colors.placeholder}
                    />
                    <TextInput
                        style={styles.input}
                        label="Contraseña"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={!showPassword}
                        mode="flat"
                        outlineColor={theme.colors.text}
                        activeOutlineColor={theme.colors.text}
                        theme={{roundness: 10}}
                        right={
                            <TextInput.Icon
                                name={showPassword ? "eye-off" : "eye"}
                                onPress={() => setShowPassword(!showPassword)}
                             icon={showPassword ? "eye-off" : "eye"}/>
                        }
                    />
                    <View style={styles.forgotPasswordContainer}>
                        <Text style={{color: theme.colors.text}}>Olvidé mi </Text>
                        <TouchableOpacity onPress={handleForgotPassword}>
                            <Text style={[styles.forgotPasswordLink, {color: theme.colors.text}]}>Contraseña</Text>
                        </TouchableOpacity>
                    </View>
                    <Button
                        mode="contained"
                        onPress={handleLogin}
                        style={[styles.button]}
                        contentStyle={[styles.buttonContent, {backgroundColor: theme.colors.primary}]}
                        labelStyle={styles.buttonLabel}
                    >
                        Ingresar
                    </Button>
                    <View style={styles.signupContainer}>
                        <Text style={styles.signupText}>¿No tienes una cuenta?</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                            <Text style={[styles.signupLink, {color: theme.colors.text}]}> Únete aquí</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.termsContainer}>
                        <Text style={{color: theme.colors.placeholder, fontSize: 12}}>
                            Al continuar acepto los{' '}
                            <Text
                                style={[styles.termsLink, {color: theme.colors.text}]}
                                onPress={toggleTheme}
                            >
                                Términos y Condiciones
                            </Text>
                        </Text>
                    </View>
                </View>
                {/* Modal para cambiar IP */}
                <Modal
                    visible={ipModalVisible}
                    onDismiss={() => setIpModalVisible(false)}
                    contentContainerStyle={styles.modalContent}
                >
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Cambiar IP</Text>
                        <TextInput
                            label="Nueva IP"
                            value={newIp}
                            onChangeText={setNewIp}
                            mode="outlined"
                            style={styles.modalInput}  // Input con fondo blanco y borde redondeado
                            theme={{ colors: { background: 'white' } }}  // Cambiar el fondo del input
                        />
                        <Button mode="contained" onPress={handleUpdateIp} style={styles.modalButton}>
                            Actualizar IP
                        </Button>
                    </View>
                </Modal>
            </View>
        </KeyboardAvoidingView>

            );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: '100%',
        backgroundColor: '#0057FF',
    },
    modalContainer: {
        marginTop:30,
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        alignSelf: 'center',
        width: '80%',  // Ajusta el ancho del modal
        alignItems: 'center',  // Centrar el contenido del modal
    },
    modalContent: {
        justifyContent: 'center',  // Centrar el modal en la pantalla
    },
    modalInput: {
        width: '100%',
        marginBottom: 15,
    },
    modalButton: {
        width: '100%',
        backgroundColor: '#0057FF',
    },
    modalTitle: {
        fontSize: 18,
        marginBottom: 10,
        fontWeight: 'bold',
    },
    headerImageContainer: {
        width: '100%',
        height: '29%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 8,
    },
    headerImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    title: {
        marginTop: 30,
        marginBottom: 15,
        color: '#FFFFFF',
        textAlign: 'left',
        fontWeight: 'bold',
    },
    containerInputs: {
        paddingHorizontal: 35,
    },
    input: {
        width: '100%',
        marginVertical: 10,
        height: 60,
        color: '#FFFFFF',
    },
    button: {
        width: '100%', // El ancho del botón
        height: 60, // La altura del botón
        // justifyContent: 'center', // Centrar el contenido verticalmente
        // alignItems: 'center', // Centrar el contenido horizontalmente
        marginTop: 30, // Margen superior
        // Bordes redondeados
    },
    buttonContent: {
        width: '100%', // Ancho completo del contenido del botón para que la animación cubra todo
        height: 60, // Altura del contenido del botón
        justifyContent: 'center',
        backgroundColor:'black',
    },
    buttonLabel: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    signupContainer: {
        flexDirection: 'row',
        alignSelf: 'flex-end',
        marginVertical: 5,
    },
    signupText: {
        color: '#FFFFFF',
    },
    signupLink: {
        fontWeight: 'bold',
    },
    termsContainer: {
        marginTop: 80,
        alignItems: 'center',
        justifyContent: 'center',
    },
    termsLink: {
        textDecorationLine: 'underline',
    },
    forgotPasswordContainer: {
        flexDirection: 'row',
        alignSelf: 'flex-end',
        marginVertical: 5,
    },
    forgotPasswordLink: {
        fontWeight: 'bold',
    },
});
