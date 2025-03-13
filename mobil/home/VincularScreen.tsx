import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, TextInput, Clipboard } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { useAppTheme } from '../config/ThemeContext';

export default function VincularScreen() {
  const { theme } = useAppTheme();
  const styles = getStyles(theme);

  const [code, setCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');

  const generateCode = () => {
    const newCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    setGeneratedCode(newCode);
  };

  const handleLinkCode = (code) => {
    if (!code.trim()) {
      alert('Por favor, ingresa un código válido');
      return;
    }
    console.log(`Código vinculado: ${code}`);
    alert(`Código vinculado con éxito: ${code}`);
  };
  const copyToClipboard = () => {
    Clipboard.setString(generatedCode);
    alert('Código copiado al portapapeles!');
  };

  return (
    <View style={styles.container}>
      <Button mode="contained" onPress={generateCode} style={styles.button}>
        Generar Código
      </Button>

      {generatedCode ? (
        <TouchableOpacity onPress={copyToClipboard} style={styles.codeContainer}>
          <Text style={styles.codeText}>{generatedCode}</Text>
        </TouchableOpacity>
      ) : null}

      <TextInput
        style={styles.input}
        placeholder="Ingresa el código"
        value={code}
        onChangeText={setCode}
      />

      {/* Botón para vincular el código ingresado */}
      <Button
        mode="contained"
        onPress={() => handleLinkCode(code)}
        style={styles.button}
      >
        Vincular
      </Button>
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
  button: {
    marginVertical: 20,
  },
  codeContainer: {
    marginVertical: 10,
    padding: 10,
    backgroundColor: theme.colors.primary,
    borderRadius: 8,
  },
  codeText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  input: {
    width: '80%',
    padding: 10,
    borderColor: theme.colors.primary,
    borderWidth: 1,
    borderRadius: 8,
    marginTop: 20,
  },
});
