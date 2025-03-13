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
import themeContext from "@react-navigation/native/src/theming/ThemeContext";
// import CustomHeader from '../shared/CustomHeader';

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

export default function LoginScreen() {
    const navigation = useNavigation<LoginScreenNavigationProp>();
    const { toggleTheme, theme } = useAppTheme();
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [ipModalVisible, setIpModalVisible] = useState(false); // Estado para mostrar el modal
    const [newIp, setNewIp] = useState(''); // Estado para la nueva IP

    const styles = getStyles(theme);
    const handleLogin = async () => {
        const authUser = await login({ username: email, password });
            console.log("auhuser info: ", authUser)

        if (authUser.rol == UserRol.PELUQUERO){
                navigation.navigate('MenuPeluquero',{ idPeluqueria: authUser.idPeluqueria });
            }else {
                navigation.navigate('Menu');
            }

    };

    const handleForgotPassword = () => {
        Alert.alert('Forgot Password', 'Contactate con un administrador');
    };

    return (
        <KeyboardAvoidingView style={{flex: 1}}
                              behavior={'height'}
                              keyboardVerticalOffset={150}>

            <View style={styles.container} >
                <View style={styles.headerImageContainer} >
                    <Image   source={require('../assets/logosweetsavings.png')} style={styles.headerImage}/>
                </View>
                <View style={styles.containerInputs}>
                    <View>
                    <Text variant="headlineMedium" style={styles.title}>Iniciar Sesión</Text>
                    <Text variant="headlineMedium" style={{fontSize:16,color:"#7A7A7A",marginBottom:20}} >Ingresa los datos solicitados</Text>
                    </View>
                  
                    <TextInput
                        style={styles.input}
                        label="Email"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        mode="outlined"
                        textColor={theme.colors.text}
                        underlineColor={theme.colors.text}
                        outlineColor="#FBFBFB"
                        activeOutlineColor={theme.colors.placeholder}
                        theme={{roundness: 10}}
                        placeholderTextColor={theme.colors.text}
                    />
                    <TextInput
                        style={styles.input}
                        label="Contraseña"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={!showPassword}
                        mode="outlined"
                        outlineColor="#FBFBFB"
                        activeOutlineColor={theme.colors.placeholder}
                        
                        theme={{roundness: 10}}
                        placeholderTextColor={theme.colors.text}
                        right={
                            <TextInput.Icon
                                name={showPassword ? "eye-off" : "eye"}
                                onPress={() => setShowPassword(!showPassword)}
                             icon={showPassword ? "eye-off" : "eye"}/>
                        }
                    />
                    {/*<View style={styles.forgotPasswordContainer}>*/}
                    {/*    <Text style={{color: theme.colors.text}}>Olvidé mi </Text>*/}
                    {/*    <TouchableOpacity onPress={handleForgotPassword}>*/}
                    {/*        <Text style={[styles.forgotPasswordLink, {color: theme.colors.text}]}>Contraseña</Text>*/}
                    {/*    </TouchableOpacity>*/}
                    {/*</View>*/}
                    <Button
                        mode="contained"
                        onPress={handleLogin}
                        style={[
                            styles.button,
                            { backgroundColor: theme.colors.background, borderWidth: 1.5,marginTop:"15%", borderColor: theme.colors.secondary ,borderRadius:100 }
                        ]}
                        contentStyle={styles.buttonContent}
                        labelStyle={styles.buttonLabel}
                    >
                        Ingresar
                    </Button>

                    <Text style={{color:"#189A82",fontSize:16,marginTop:20}}>No tengo una cuenta. <Text style={{fontWeight:700,color:"#189A82"}}>Registrarme</Text> </Text>
                    {/*<View style={styles.signupContainer}>*/}
                    {/*    <Text style={styles.signupText}>¿No tienes una cuenta?</Text>*/}
                    {/*    <TouchableOpacity onPress={() => navigation.navigate('Signup')}>*/}
                    {/*        <Text style={[styles.signupLink, {color: theme.colors.text}]}> Únete aquí</Text>*/}
                    {/*    </TouchableOpacity>*/}
                    {/*</View>*/}
                    {/*<View style={styles.termsContainer}>*/}
                    {/*    <Text style={{color: theme.colors.placeholder, fontSize: 12}}>*/}
                    {/*        Al continuar acepto los{' '}*/}
                    {/*        <Text*/}
                    {/*            style={[styles.termsLink, {color: theme.colors.text}]}*/}
                    {/*            onPress={toggleTheme}*/}
                    {/*        >*/}
                    {/*            Términos y Condiciones*/}
                    {/*        </Text>*/}
                    {/*    </Text>*/}
                    {/*</View>*/}
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
                            theme={{ colors: { background: theme.colors.background } }}  // Cambiar el fondo del input
                        />

                    </View>
                </Modal>
            </View>
        </KeyboardAvoidingView>

            );
}

const getStyles = (theme: any ) =>  StyleSheet.create({
    container: {
        flex: 1,
        height: '100%',
     
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
        backgroundColor: theme.colors.background,
    },
    modalTitle: {
        fontSize: 18,
        marginBottom: 10,
        fontWeight: 'bold',
    },
    headerImageContainer: {
        width: '100%',
        height: '29%',
        marginTop:"15%",
        justifyContent:"center",
        alignItems:"center"
   
    },
    headerImage: {
        width: '50%',
        height: '50%',
        resizeMode: 'contain',
    },
    title: {
        marginTop: 30,
  
        color: theme.colors.text,
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
        color: theme.colors.placeholder,
        backgroundColor: "#FBFBFB"
    },
    button: {
        width: '100%', // El ancho del botón
        height: 65, // La altura del botón
        marginTop: 30, // Margen superior
        // Bordes redondeados
    },
    buttonContent: {
        width: '100%', // Ancho completo del contenido del botón para que la animación cubra todo
        height: 60, // Altura del contenido del botón
        justifyContent: 'center',
    },
    buttonLabel: {
        fontSize: 18,
        fontWeight: 'bold',
        color: theme.colors.text
    },
    signupContainer: {
        flexDirection: 'row',
        alignSelf: 'flex-end',
        marginVertical: 5,
    },
    signupText: {
        color: theme.colors.text,
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
