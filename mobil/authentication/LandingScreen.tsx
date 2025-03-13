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

export default function LandingScreen() {
    const navigation = useNavigation<LoginScreenNavigationProp>();
    const { toggleTheme, theme } = useAppTheme();
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [ipModalVisible, setIpModalVisible] = useState(false); // Estado para mostrar el modal
    const [newIp, setNewIp] = useState(''); // Estado para la nueva IP

    const styles = getStyles(theme);
    // const handleLogin = async () => {
    //     const authUser = await login({ username: email, password });
    //         console.log("auhuser info: ", authUser)

    //     if (authUser.rol == UserRol.PELUQUERO){
    //             navigation.navigate('MenuPeluquero',{ idPeluqueria: authUser.idPeluqueria });
    //         }else {
    //             navigation.navigate('Menu');
    //         }

    // };

    const handleForgotPassword = () => {
        Alert.alert('Forgot Password', 'Contactate con un administrador');
    };

    return (
        <KeyboardAvoidingView style={{flex: 1}}
                              behavior={'height'}
                              keyboardVerticalOffset={150}>

            <View style={styles.container}  >
                <View style={styles.headerImageContainer} >
                    <Image   source={require('../assets/logosweetsavings.png')} style={styles.headerImage}/>
                    <View>
            <Text style={{color:"#8E8E8E",fontSize:16,marginTop:15}}>¡Ahorrar ahora es cosa de a dos!</Text>
            </View>
                </View>
              
               <Button
                                   mode="contained"
                                    
                                   style={[
                                       styles.button,
                                       {   backgroundColor:"#EB3C85", borderWidth: 1.5,marginTop:"15%" ,borderRadius:100 }
                                   ]}
                                   onPress={()=>{navigation.push("Login")}}
                                   contentStyle={styles.buttonContent}
                                   labelStyle={styles.buttonLabel}
                               >
                                   Comenzar
                               </Button>

                              <View style={{height:"50%",width:"100%" , flex:1, justifyContent:"flex-end" } }>
                              <Image   source={require('../assets/landinganimals.png')}  style={{width:"100%",height:"77%",objectFit:"contain"}}/>
                              </View>
                              
           
            </View>
         
         
        </KeyboardAvoidingView>

            );
}

const getStyles = (theme: any ) =>  StyleSheet.create({
    container: {
        flex: 1,
        height: '100%',
        alignItems:"center"
     
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
        width: '70%', // El ancho del botón
        height: 65, // La altura del botón
        backgroundColor:"#EB3C85",
        marginTop: 30, // Margen superior
        
        // Bordes redondeados
    },
    buttonContent: {
        width: '100%', // Ancho completo del contenido del botón para que la animación cubra todo
        height: 60, // Altura del contenido del botón
        justifyContent: 'center',
    },
    buttonLabel: {
        fontSize: 21,
        fontWeight: '400',
        color: "white"
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
