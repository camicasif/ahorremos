import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, FlatList, TouchableOpacity } from 'react-native';
import { Text, Card } from 'react-native-paper';
import { useAppTheme } from '../config/ThemeContext';
import { PaymentPlanItem, AccountUser } from '../models/SharedAccount';
import { getPaymentPlansByAccount } from '../services/Generalservice';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function PlanPagosScreen({ navigation }) {
    const { theme } = useAppTheme();
    const styles = getStyles(theme);

    const [loading, setLoading] = useState(true);
    const [paymentPlans, setPaymentPlans] = useState<PaymentPlanItem[]>([]);


    useEffect(() => {
        const fetchPaymentPlans = async () => {
            try {
                // Obtener el accountId (ejemplo con un valor hardcodeado)
                const accountId = await AsyncStorage.getItem('accountId');
                if (!accountId) return;
                const paymentPlans = await getPaymentPlansByAccount(accountId);
                setPaymentPlans(paymentPlans);
                setLoading(false);

            } catch (error) {
                console.error("Error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPaymentPlans();
    }, []);

    if (loading) {
        return <ActivityIndicator size="large" color={theme.colors.primary} />;
    }

    const renderItem = ({ item }: { item: PaymentPlanItem }) => (
      <TouchableOpacity onPress={() => navigation.navigate('Movimientos')}>
          <Card style={styles.card}>
              <Card.Content>
                  <Text style={styles.name}>Plan #{item.idPaymentPlan}</Text>
                  <Text style={styles.balance}>Saldo estimado: {item.estimatedBalance} Bs</Text>
                  <Text style={styles.date}>Inicio: {item.initialDate} - Fin: {item.endDate}</Text>
                  <Text style={styles.accounts}>Participantes: {item.accounts.map(a => `${a.name} ${a.lastname}`).join(', ')}</Text>
              </Card.Content>
          </Card>
      </TouchableOpacity>
    );

    return (
      <View style={styles.container}>
          <FlatList
            data={paymentPlans}
            keyExtractor={(item) => item.idPaymentPlan.toString()}
            renderItem={renderItem}
          />
      </View>
    );
}

const getStyles = (theme) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
        padding: 20,
    },
    card: {
        marginBottom: 10,
        backgroundColor: theme.colors.surface,
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
        color: theme.colors.primary,
    },
    balance: {
        fontSize: 16,
        color: theme.colors.onSurface,
    },
    date: {
        fontSize: 14,
        color: theme.colors.onSurfaceVariant,
    },
    accounts: {
        fontSize: 14,
        fontStyle: 'italic',
        color: theme.colors.secondary,
    }
});
