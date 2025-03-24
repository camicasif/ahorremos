import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useAppTheme } from '../config/ThemeContext';
import { Button, Text, TextInput } from 'react-native-paper';
import { abonar } from '../services/Generalservice';

const PagarScreen = ({ navigation }) => {
  const { theme } = useAppTheme();
  const styles = getStyles(theme);

  const [montoActual, setMontoActual] = useState(1200);
  const [montoCompartido, setMontoCompartido] = useState(800);
  const [amount, setAmount] = useState('');

  const handlePagar = async () => {
    const monto = parseInt(amount, 10);
    if (!isNaN(monto) && monto > 0) {
      try {
        const response = await abonar({ idAccount: 1, amount: monto, idPaymentPlan: 1 });
        if (response.status === 'ok') {
          Alert.alert('Pago realizado con éxito', '', [
            { text: 'Ir a inicio', onPress: () => navigation.navigate('HomeMain') }
          ]);
          setMontoCompartido(montoCompartido + monto);
          setAmount('');
        } else {
          Alert.alert('Problema al realizar el pago');
        }
      } catch (error) {
        Alert.alert('Problema al realizar el pago');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Monto Actual: <Text style={styles.value}>{montoActual} Bs.</Text></Text>
      <Text style={styles.label}>Monto Cuenta Compartida: <Text style={styles.value}>{montoCompartido} Bs.</Text></Text>
      <TextInput
        style={styles.input}
        label="Monto (Bs)"
        value={amount}
        onChangeText={setAmount}
        keyboardType="decimal-pad"
        autoCapitalize="none"
        mode="outlined"
        returnKeyType='done'
        textColor={theme.colors.text}
        underlineColor={theme.colors.text}
        outlineColor="#FBFBFB"
        activeOutlineColor={theme.colors.placeholder}
        theme={{roundness: 10}}
        placeholderTextColor={theme.colors.text}
      />
      <Button mode="contained" onPress={handlePagar} style={styles.button}>
        Pagar
      </Button>
    </View>
  );
};

const getStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.background,
    padding: 20,
  },
  label: {
    fontSize: 18,
    color: theme.colors.onBackground,
    marginBottom: 10,
  },
  value: {
    fontWeight: 'bold',
  },
  input: {
    width: '80%',
    marginBottom: 20,
  },
  button: {
    marginTop: 10,
  },
});

export default PagarScreen;
