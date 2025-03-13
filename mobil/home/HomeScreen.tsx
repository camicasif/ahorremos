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
import { useAppTheme } from '../config/ThemeContext';
type HomeScreenNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    'Home'
>;

export default function HomeScreen() {
    const { theme } = useAppTheme();
    const styles = getStyles(theme);

    /*tener dos variables que se obtienen al principio de la api*/
    /*si no tiene una cuenta compartida mostrar otro mensaje en vez de */

    /*Tener una variable estado de Critico, feliz dependiendo de esos dos estados,
         que esa sea la imagen del cachorro*/
    return (
      <View style={styles.container}>
          <Text style={styles.savingsTitle}>Saldo en cuenta $</Text>
          <Text style={styles.amount}>Bs 250.00</Text>

          <Text style={styles.savingsTitle}>Ahorro Compartido $</Text>
          <Text style={styles.amount}>Bs 250.00</Text>

          <Text style={styles.savingsTitle}>Proxima fecha de abono  fecha ${}</Text>


          <Chip style={styles.chip}>Crítico</Chip>
          <Text style={styles.statusText}>No has abonado</Text>

          {/*<Image*/}
          {/*  source={require('../assets/sad_dog.png')}*/}
          {/*  style={styles.image}*/}
          {/*  resizeMode="contain"*/}
          {/*/>*/}

          <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button}>
                  {/*<Image source={require('../assets/icon_payment.png')} style={styles.icon} />*/}
                  <Text>Pagar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button}>
                  {/*<Image source={require('../assets/icon_link.png')} style={styles.icon} />*/}
                  <Text>Vincular</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button}>
                  {/*<Image source={require('../assets/icon_plan.png')} style={styles.icon} />*/}
                  <Text>Plan de pagos</Text>
              </TouchableOpacity>
          </View>
      </View>
    );
}

const getStyles = (theme) => StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.colors.background,
        padding: 20,
    },
    savingsTitle: {
        fontSize: 16,
        color: theme.colors.text,
    },
    amount: {
        fontSize: 24,
        fontWeight: 'bold',
        marginVertical: 5,
    },
    chip: {
        backgroundColor: 'red',
        color: 'white',
        paddingHorizontal: 10,
        marginVertical: 10,
    },
    statusText: {
        fontSize: 14,
        color: theme.colors.text,
        marginBottom: 20,
    },
    image: {
        width: 150,
        height: 150,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 20,
    },
    button: {
        alignItems: 'center',
        padding: 10,
    },
    icon: {
        width: 40,
        height: 40,
    }
});
