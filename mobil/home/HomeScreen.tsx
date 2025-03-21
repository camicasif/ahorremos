import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from "react-native";
import { Text, Chip } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAccountPlanDetail } from "../services/Generalservice";
import { useAppTheme } from "../config/ThemeContext";
import { AccountPlanDetailResponse } from "../models/SharedAccount";
import { useNavigation } from "@react-navigation/native";

export default function HomeScreen() {
  const { theme } = useAppTheme();
  const styles = getStyles(theme);
  const navigation = useNavigation();
  const [accountData, setAccountData] =
    useState<AccountPlanDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAccountData = async () => {
            try {
                // const accountId = await AsyncStorage.getItem('accountId');
                const accountId = 3;
                if (accountId) {
                    const data = await getAccountPlanDetail(parseInt(String(accountId)));
                    setAccountData(data);
                }
            } catch (error) {
                console.error('Error fetching account data:', error);
            } finally {
                setLoading(false);
            }
        };

    fetchAccountData();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color={theme.colors.primary} />;
  }

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row", gap: 25 }}>
        <View>
          <Text style={styles.savingsTitle}>Saldo en cuenta $</Text>
          <Text style={styles.amount}>Bs {accountData?.balance ?? 0}</Text>
        </View>

        <View>
          {accountData?.sharedAccount ? (
            <>
              <Text style={styles.savingsTitle}>Ahorro Compartido $</Text>
              <Text style={styles.amount}>
                Bs {accountData.sharedAccount.totalAmount}
              </Text>
            </>
          ) : (
            <Text style={styles.statusText}>
              No tienes una cuenta compartida
            </Text>
          )}
        </View>
      </View>

      {accountData?.paymentPlan ? (
        <>
          <View style={{ flexDirection: "row", gap: 25, marginTop: 30 }}>
            <View>
              <Text style={styles.savingsTitle}>Próxima fecha de abono</Text>
              <Text style={styles.amount}>{accountData.actualPaymentDate}</Text>
            </View>

            <View style={{ flex: 0.6 }}></View>
          </View>
          <Chip
            style={[
              styles.chip,
              accountData.paymentState === "CRITIC"
                ? styles.critic
                : styles.normal,
            ]}
          >
            Normal
          </Chip>
          <Text style={styles.statusText}>
            {accountData.paymentState === "CRITIC"
              ? "No has abonado"
              : "Gracias por confiar en nosotros"}
          </Text>

          <View
            style={{ width: "100%", flex: 0.6, justifyContent: "flex-end" }}
          >
            <Image
              source={require("../assets/rb_7368.png")}
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
          </View>
        </>
      ) : (
        <Text style={styles.statusText}>No tienes un plan de pagos activo</Text>
      )}

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button}
                          onPress={() => navigation.navigate("Pagar")}

        >
          <Image
            source={require("../assets/btnpay.png")}
            style={{
              width: 60,
              height: 60,
              marginBottom: 10,
              objectFit: "contain",
            }}
          />

          <Text>Pagar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Vincular")}
        >
          <Image
            source={require("../assets/btnpay.png")}
            style={{
              width: 60,
              height: 60,
              marginBottom: 10,
              objectFit: "contain",
            }}
          />
          <Text>Vincular</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}
                          onPress={() => navigation.navigate("PlanPagos")}
        >
          <Image
            source={require("../assets/btnpay.png")}
            style={{
              width: 60,
              height: 60,
              marginBottom: 10,
              objectFit: "contain",
            }}
          />
          <Text>Plan de pagos</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const getStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.colors.background,
      padding: 20,
    },
    savingsTitle: {
      fontSize: 16,
      color: "#7A7A7A",
    },
    amount: {
      fontSize: 24,
      fontWeight: "bold",
      marginVertical: 5,
    },
    chip: {
      paddingHorizontal: 15,
      paddingVertical: 5,
      marginVertical: 10,
      marginTop: 30,
      borderRadius: 100,
      color: "white",
    },
    critic: {
      backgroundColor: "red",
      color: "white",
    },
    normal: {
      backgroundColor: "#DFFFDC",
      color: "white",
    },
    statusText: {
      fontSize: 14,
      color: "#8B8B8B",
      marginBottom: 20,
    },
    buttonContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      width: "100%",
      marginTop: 20,
    },
    button: {
      alignItems: "center",
      padding: 10,
    },
  });
