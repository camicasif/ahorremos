import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Keyboard, Alert, ScrollView } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import * as Yup from 'yup'; // Para validación de formularios
import AsyncStorage from '@react-native-async-storage/async-storage';
import { register } from '../services/Generalservice'; // Importa el servicio de registro
import ScreenWrapper from "../shared/ScreenWrapper";
import InputKeyboardView from "../shared/InputKeyboardView";
import { UserRequestDto } from "../models/Auth";
import {useNavigation} from "@react-navigation/native"; // Importa el modelo adecuado

// Definir el esquema de validación utilizando Yup
const SignupSchema = Yup.object().shape({
    name: Yup.string().required('El nombre es requerido'),
    firstName: Yup.string().required('El primer nombre es requerido'),
    secondName: Yup.string().required('El segundo nombre es requerido'),
    email: Yup.string().email('Email inválido').required('El email es requerido'),
    address: Yup.string().required('La dirección es requerida'),
    phone: Yup.string().required('El número de teléfono es requerido'),
    password: Yup.string()
        .min(8, 'La contraseña debe tener al menos 8 caracteres')
        .matches(/[a-z]/, 'Debe contener al menos una letra minúscula')
        .matches(/[A-Z]/, 'Debe contener al menos una letra mayúscula')
        .matches(/[0-9]/, 'Debe contener al menos un número')
        .matches(/[!@#$%^&*(),.?":{}|<>]/, 'Debe contener al menos un símbolo especial')
        .required('La contraseña es requerida'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Las contraseñas deben coincidir')
        .required('Debe confirmar su contraseña'),
    ci: Yup.number().typeError('El CI debe ser un número').required('El CI es requerido'),
});

export default function SignupScreen({ route, navigation }) {
    const [formData, setFormData] = useState({
        name: '',
        firstName: '',
        secondName: '',
        email: '',
        address: '',
        phone: '',
        password: '',
        confirmPassword: '',
        ci: '',
    });

    const [errors, setErrors] = useState({}); // Estado para almacenar los errores
    const [touched, setTouched] = useState(() => { // Inicializar todas las propiedades como no tocadas
        const fields = ['name', 'firstName', 'secondName', 'email', 'address', 'phone', 'password', 'confirmPassword', 'ci'];
        return fields.reduce((acc, field) => ({ ...acc, [field]: false }), {});
    });
    const [loading, setLoading] = useState(false);
    const [isFormValid, setIsFormValid] = useState(false); // Estado para el botón de registro
    const [showPassword, setShowPassword] = useState(false); // Estado para mostrar/ocultar contraseña
    const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Estado para mostrar/ocultar confirmación de contraseña
    const nav = useNavigation();
    // Validar el formulario en cada cambio de estado
    useEffect(() => {
        const validateForm = async () => {
            try {
                await SignupSchema.validate(formData, { abortEarly: false });
                setIsFormValid(true);
                setErrors({}); // Limpiar los errores cuando el formulario sea válido
            } catch (validationErrors) {
                setIsFormValid(false);
                // Transformar los errores de Yup en un objeto legible
                const formattedErrors = {};
                validationErrors.inner.forEach((error) => {
                    formattedErrors[error.path] = error.message;
                });
                setErrors(formattedErrors);
            }
        };

        validateForm();
    }, [formData]);

    const handleInputChange = (name, value) => {
        setFormData({ ...formData, [name]: value });
    };

    const handleBlur = (name) => {
        setTouched({ ...touched, [name]: true }); // Marcar el campo como "tocado"
    };

    const handleRegister = async () => {
        try {
            await SignupSchema.validate(formData); // Validación de datos con Yup
            setLoading(true);

            // Crear un objeto con los datos que coinciden con UserRequestDto
            const userData: UserRequestDto = {
                name: formData.name,
                firstName: formData.firstName,
                secondName: formData.secondName,
                email: formData.email,
                address: formData.address,
                phone: formData.phone,
                password: formData.password,
                ci: parseInt(formData.ci, 10), // Convertir ci de string a number
            };

            // Enviar los datos al backend
            const response = await register(userData);

            Alert.alert('Registro exitoso', 'Usuario registrado con éxito');
            nav.navigate('Login');
            setLoading(false);
        } catch (error) {

            setLoading(false);
        }
    };

    return (
        <InputKeyboardView>
            <ScreenWrapper contentContainerStyle={styles.container}>
                <TextInput
                    label="Nombre"
                    value={formData.name}
                    onChangeText={(text) => handleInputChange('name', text)}
                    onBlur={() => handleBlur('name')}
                    style={styles.input}
                    error={!!errors['name'] && touched.name}
                />
                {errors['name'] && touched.name && <Text style={styles.errorText}>{errors['name']}</Text>}

                <TextInput
                    label="Primer Nombre"
                    value={formData.firstName}
                    onChangeText={(text) => handleInputChange('firstName', text)}
                    onBlur={() => handleBlur('firstName')}
                    style={styles.input}
                    error={!!errors['firstName'] && touched.firstName}
                />
                {errors['firstName'] && touched.firstName && <Text style={styles.errorText}>{errors['firstName']}</Text>}

                <TextInput
                    label="Segundo Nombre"
                    value={formData.secondName}
                    onChangeText={(text) => handleInputChange('secondName', text)}
                    onBlur={() => handleBlur('secondName')}
                    style={styles.input}
                    error={!!errors['secondName'] && touched.secondName}
                />
                {errors['secondName'] && touched.secondName && <Text style={styles.errorText}>{errors['secondName']}</Text>}

                <TextInput
                    label="Email"
                    value={formData.email}
                    onChangeText={(text) => handleInputChange('email', text)}
                    onBlur={() => handleBlur('email')}
                    style={styles.input}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    error={!!errors['email'] && touched.email}
                />
                {errors['email'] && touched.email && <Text style={styles.errorText}>{errors['email']}</Text>}

                <TextInput
                    label="Dirección"
                    value={formData.address}
                    onChangeText={(text) => handleInputChange('address', text)}
                    onBlur={() => handleBlur('address')}
                    style={styles.input}
                    error={!!errors['address'] && touched.address}
                />
                {errors['address'] && touched.address && <Text style={styles.errorText}>{errors['address']}</Text>}

                <TextInput
                    label="Teléfono"
                    value={formData.phone}
                    onChangeText={(text) => handleInputChange('phone', text)}
                    onBlur={() => handleBlur('phone')}
                    style={styles.input}
                    keyboardType="phone-pad"
                    error={!!errors['phone'] && touched.phone}
                />
                {errors['phone'] && touched.phone && <Text style={styles.errorText}>{errors['phone']}</Text>}

                <TextInput
                    label="Contraseña"
                    value={formData.password}
                    onChangeText={(text) => handleInputChange('password', text)}
                    onBlur={() => handleBlur('password')}
                    secureTextEntry={!showPassword}
                    right={
                        <TextInput.Icon
                            icon={showPassword ? 'eye-off' : 'eye'}
                            onPress={() => setShowPassword(!showPassword)}
                        />
                    }
                    style={styles.input}
                    error={!!errors['password'] && touched.password}
                />
                {errors['password'] && touched.password && <Text style={styles.errorText}>{errors['password']}</Text>}

                <TextInput
                    label="Confirmar Contraseña"
                    value={formData.confirmPassword}
                    onChangeText={(text) => handleInputChange('confirmPassword', text)}
                    onBlur={() => handleBlur('confirmPassword')}
                    secureTextEntry={!showConfirmPassword}
                    right={
                        <TextInput.Icon
                            icon={showConfirmPassword ? 'eye-off' : 'eye'}
                            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                        />
                    }
                    style={styles.input}
                    error={!!errors['confirmPassword'] && touched.confirmPassword}
                />
                {errors['confirmPassword'] && touched.confirmPassword && <Text style={styles.errorText}>{errors['confirmPassword']}</Text>}

                <TextInput
                    label="CI"
                    value={formData.ci}
                    onChangeText={(text) => handleInputChange('ci', text)}
                    onBlur={() => handleBlur('ci')}
                    style={styles.input}
                    keyboardType="numeric"
                    error={!!errors['ci'] && touched.ci}
                />
                {errors['ci'] && touched.ci && <Text style={styles.errorText}>{errors['ci']}</Text>}

                <Button
                    mode="contained"
                    onPress={handleRegister}
                    loading={loading}
                    disabled={!isFormValid || loading} // Deshabilitar si el formulario no es válido o si está cargando
                    style={styles.button}
                >
                    Registrar
                </Button>
            </ScreenWrapper>
        </InputKeyboardView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 16,
        justifyContent: 'center',
    },
    input: {
        marginBottom: 10,
    },
    errorText: {
        color: 'red',
        marginBottom: 10,
    },
    button: {
        marginTop: 20,
    },
});
