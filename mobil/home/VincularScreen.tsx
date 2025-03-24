import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert, Clipboard } from 'react-native';
import { useAppTheme } from "../config/ThemeContext";
import { Button, Text, TextInput } from "react-native-paper";
import { Dropdown } from "react-native-paper-dropdown";
import moment from "moment";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { generateCode, getInfoCode, createSharedAccount, getSharedAccount, createPaymentPlan } from '../services/Generalservice';
import { CreateSharedAccountRequest, codeResponse, SharedAccountResponse } from '../models/SharedAccount';
import { useNavigation } from '@react-navigation/native';

export default function VincularScreen() {
  const { theme } = useAppTheme();
  const styles = getStyles(theme);

  const [amount, setAmount] = useState("");
  const [duration, setDuration] = useState<any>();
  const [code, setCode] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [activeTab, setActiveTab] = useState<any>("Crear Ahorro");
  const [isFormValid, setIsFormValid] = useState(false);
  const [isJoinFormValid, setIsJoinFormValid] = useState(false); // Estado para validar el formulario de unirse
  const [accountId, setAccountId] = useState<string | null>(null);
  const [showCode, setShowCode] = useState(false); // Estado para mostrar el código generado
  const [timer, setTimer] = useState(45); // Temporizador de 45 segundos
  const [sharedAccountId, setSharedAccountId] = useState<number | null>(null); // Estado para guardar el sharedAccountId
  const navigation = useNavigation(); // Obtener el objeto de navegación

  const items = [
    { label: "3 meses", value: "3 meses" },
    { label: "6 meses", value: "6 meses" },
    { label: "9 meses", value: "9 meses" },
  ];

  // Obtener el accountId desde AsyncStorage
  useEffect(() => {
    const fetchAccountId = async () => {
      const id = await AsyncStorage.getItem("accountId");
      setAccountId(id);
    };

    fetchAccountId();
  }, []);

  // Validar el formulario de creación de ahorro
  useEffect(() => {
    if (amount && duration) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  }, [amount, duration]);

  // Validar el formulario de unirse
  useEffect(() => {
    if (code.trim()) {
      setIsJoinFormValid(true);
    } else {
      setIsJoinFormValid(false);
    }
  }, [code]);

  // Temporizador de 45 segundos
  useEffect(() => {
    if (showCode && timer > 0) {
      const interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);

      return () => clearInterval(interval); // Limpiar el intervalo cuando el componente se desmonte
    } else if (timer === 0) {
      setShowCode(false); // Ocultar el código y mostrar el formulario
      setTimer(45); // Reiniciar el temporizador
    }
  }, [showCode, timer]);

  // Función para generar el código
  const handleGenerateCode = async () => {
    if (!accountId) {
      Alert.alert("Error", "No se pudo obtener el accountId");
      return;
    }

    const [monthsStr] = duration.split(" ");
    const months = parseInt(monthsStr, 10);

    const today = moment();
    const futureDate = moment().add(months, "months");


    try {
      const response = await generateCode(accountId); // Consume el servicio generateCode
      setGeneratedCode(response); // Guarda el código generado en el estado
      setShowCode(true); // Mostrar el código generado
      Alert.alert("Éxito", "Código generado correctamente");

      // Iniciar el intervalo para verificar la cuenta compartida
      const interval = setInterval(async () => {
        try {
          const sharedAccountResponse: SharedAccountResponse = await getSharedAccount(accountId);
          if (sharedAccountResponse.sharedAccountId) {
            clearInterval(interval); // Detener el intervalo si se obtiene una respuesta válida
            setSharedAccountId(sharedAccountResponse.sharedAccountId);

            // Crear el plan de pagos
            const paymentPlanBody = {
              sharedAccount: sharedAccountResponse.sharedAccountId,
              estimated_balance: amount, // Monto estimado
              initial_date: moment().format("YYYY-MM-DD"), // Fecha de inicio
              end_date: moment().add(months, "months").format("YYYY-MM-DD"), // Fecha de finalización (6 meses después)
              payment_period: 30, // Período de pago en días
            };

            await createPaymentPlan(paymentPlanBody);

            // Mostrar mensaje de éxito
            const otherAccount = sharedAccountResponse.accounts.find(
              (account) => account.idAccount.toString() !== accountId
            );
            if (otherAccount) {
              Alert.alert(
                "Éxito",
                `Se creó una cuenta compartida con ${otherAccount.name} ${otherAccount.lastname}`,
                [
                  {
                    text: "Aceptar",
                    onPress: () => navigation.navigate("HomeMain"), // Navegar a HomeMain
                  },
                ]
              );            }
          }
        } catch (error) {
          console.error("Error verificando la cuenta compartida:", error);
        }
      }, 5000); // Verificar cada 5 segundos
    } catch (error) {
      console.error("Error generando el código:", error);
      Alert.alert("Error", "No se pudo generar el código");
    }
  };

  // Función para copiar el código al portapapeles
  const copyToClipboard = () => {
    Clipboard.setString(generatedCode.toString());
    Alert.alert("Código copiado", "El código ha sido copiado al portapapeles.");
  };

  // Función para unirse a un código
  const handleJoinCode = async () => {
    if (!code.trim()) {
      Alert.alert("Error", "Por favor, ingresa un código válido");
      return;
    }

    try {
      // Obtener la información del código
      const codeInfo: codeResponse = await getInfoCode(code);

      // Mostrar cuadro de diálogo de confirmación
      Alert.alert(
        "Confirmar vinculación",
        `¿Deseas crear una cuenta compartida con ${codeInfo.name} ${codeInfo.lastName}?`,
        [
          {
            text: "Cancelar",
            style: "cancel",
          },
          {
            text: "Aceptar",
            onPress: async () => {
              // Crear la cuenta compartida
              const sharedAccountBody: CreateSharedAccountRequest = {
                total_amount: 0, // Monto inicial en 0
                created_date: moment().format("YYYY-MM-DD"), // Fecha de hoy
                account1: accountId!, // AccountId del usuario actual
                account2: codeInfo.accountId.toString(), // AccountId de la otra persona
              };

              const sharedAccountResponse = await createSharedAccount(sharedAccountBody);
              console.log("Cuenta compartida creada:", sharedAccountResponse);

              // Mostrar mensaje de éxito
              Alert.alert(
                "Éxito",
                `Cuenta compartida creada correctamente con ${codeInfo.name} ${codeInfo.lastName}`,
                [
                  {
                    text: "Aceptar",
                    onPress: () => navigation.navigate("HomeMain"), // Navegar a HomeMain
                  },
                ]
              );            },
          },
        ]
      );
    } catch (error) {
      if (error.response && error.response.status === 404) {
        Alert.alert("Error", "El código no es válido");
      } else {
        console.error("Error al unirse al código:", error);
        Alert.alert("Error", "No se pudo completar la vinculación");
      }
    }
  };

  return (
    <View style={styles.container}>
      <TabBarOfi activeTab={activeTab} setActiveTab={setActiveTab} />
      <View style={{ marginBottom: 30 }}></View>

      {activeTab === "Crear Ahorro" ? (
        showCode ? (
          // Mostrar el código generado y el temporizador
          <View style={styles.codeContainer}>
            <Text style={styles.codeTitle}>Código generado:</Text>
            <Text style={styles.codeText}>{generatedCode}</Text>
            <Text style={styles.timerText}>Tiempo restante: {timer} segundos</Text>
            <Button
              mode="contained"
              onPress={copyToClipboard}
              style={styles.copyButton}
            >
              <Text style={styles.buttonText}>Copiar Código</Text>
            </Button>
          </View>
        ) : (
          // Mostrar el formulario para crear la meta de ahorro
          <>
            <View style={styles.formHeader}>
              <Text style={styles.title}>Crea tu Meta de Ahorro</Text>
              <Text style={styles.subtitle}>Ingresa los datos solicitados</Text>
            </View>

            <TextInput
              style={styles.input}
              label="Monto (Bs)"
              value={amount}
              onChangeText={setAmount}
              keyboardType="decimal-pad"
              mode="outlined"
              theme={{ roundness: 10 }}
              outlineColor="#F6F6F6"
              activeOutlineColor="#EB3C85"
              returnKeyType="done"
            />

            <View style={styles.dropDownView}>
              <Dropdown
                CustomDropdownInput={(elem) => (
                  <View style={styles.dropdownContainer}>
                    <Text style={styles.dropdownText}>
                      {duration || "Duración (meses)"}
                    </Text>
                    <View style={styles.dropdownIcon}>{elem.rightIcon}</View>
                  </View>
                )}
                mode="outlined"
                placeholder="Duración (meses)"
                options={items}
                value={duration}
                onSelect={setDuration}
              />
            </View>

            <View style={{ marginTop: 40 }}></View>

            <Button
              mode="contained"
              onPress={handleGenerateCode}
              style={[styles.button, !isFormValid && styles.disabledButton]}
              disabled={!isFormValid}
            >
              <Text style={styles.buttonText}>Generar Código</Text>
            </Button>
          </>
        )
      ) : (
        // Mostrar el formulario para unirse a una meta de ahorro
        <>
          <View style={styles.formHeader}>
            <Text style={styles.title}>Unéte a una Meta de Ahorro</Text>
            <Text style={styles.subtitle}>Ingresa los datos solicitados</Text>
          </View>

          <TextInput
            style={styles.input}
            label="Código"
            value={code}
            onChangeText={setCode}
            keyboardType="decimal-pad"
            mode="outlined"
            theme={{ roundness: 10 }}
            returnKeyType="done"
            onSubmitEditing={handleJoinCode} // Enviar el formulario al presionar "Done"
          />

          <View style={{ marginTop: 40 }}></View>

          <Button
            mode="contained"
            onPress={handleJoinCode}
            style={[styles.button, !isJoinFormValid && styles.disabledButton]}
            disabled={!isJoinFormValid}
          >
            <Text style={styles.buttonText}>Unirse</Text>
          </Button>
        </>
      )}
    </View>
  );
}

// Función para obtener los estilos
const getStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      backgroundColor: theme.colors.background,
      padding: 20,
    },
    formHeader: {
      width: "100%",
      marginBottom: 40,
    },
    title: {
      fontSize: 22,
      fontWeight: "700",
      marginBottom: 10,
    },
    subtitle: {
      fontSize: 15,
      fontWeight: "400",
      color: "#7A7A7A",
    },
    input: {
      width: "100%",
      marginVertical: 10,
      height: 60,
      backgroundColor: "#F6F6F6",
    },
    dropdownContainer: {
      height: 60,
      width: "100%",
      flexDirection: "row",
      alignItems: "center",
      gap: 20,
      backgroundColor: "#F6F6F6",
      borderRadius: 10,
    },
    dropdownText: {
      fontSize: 18,
      marginLeft: 20,
      flex: 0.85,
    },
    dropdownIcon: {
      height: 30,
      width: 30,
      flex: 0.15,
    },
    button: {
      marginVertical: 20,
      backgroundColor: "#EB3C85",
      width: "70%",
      height: 60,
      borderRadius: 1000,
      justifyContent: "center",
    },
    buttonText: {
      color: "white",
      fontSize: 17,
      fontWeight: "600",
    },
    disabledButton: {
      backgroundColor: "#C0C0C0",
      opacity: 0.7,
    },
    dropDownView: {
      marginTop: 20,
      width: "100%",
    },
    codeContainer: {
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
    },
    codeTitle: {
      fontSize: 22,
      fontWeight: "700",
      marginBottom: 10,
    },
    codeText: {
      fontSize: 24,
      fontWeight: "bold",
      color: "#EB3C85",
      marginBottom: 20,
    },
    timerText: {
      fontSize: 16,
      color: "#7A7A7A",
      marginBottom: 20,
    },
    copyButton: {
      backgroundColor: "#EB3C85",
      width: "70%",
      height: 60,
      borderRadius: 1000,
      justifyContent: "center",
    },
  });

// Componente TabBarOfi
function TabBarOfi({ activeTab, setActiveTab }: any) {
  const styles = StyleSheet.create({
    tabBarContainer: {
      flexDirection: "row",
      justifyContent: "center",
      backgroundColor: "rgba(255, 255, 255, 0.2)",
      paddingVertical: 10,
      margin: 10,
      gap: 20,
      borderRadius: 10,
      backdropFilter: "blur(10px)",
    },
    tabButton: {
      flex: 1,
      paddingVertical: 10,
      padding: 10,
      alignItems: "center",
    },
    activeTabButton: {
      borderBottomWidth: 2.5,
      borderBottomColor: "#EB3C85",
    },
  });

  return (
    <View style={styles.tabBarContainer}>
      <Text
        style={[
          styles.tabButton,
          activeTab === "Crear Ahorro" && styles.activeTabButton,
        ]}
        onPress={() => setActiveTab("Crear Ahorro")}
      >
        Crear Ahorro
      </Text>

      <Text
        style={[
          styles.tabButton,
          activeTab === "Unirse" && styles.activeTabButton,
        ]}
        onPress={() => setActiveTab("Unirse")}
      >
        Unirse
      </Text>
    </View>
  );
}
