import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, FlatList, TouchableOpacity } from 'react-native';
import { Text, Card } from 'react-native-paper';
import { useAppTheme } from '../config/ThemeContext';
import { PaymentPlanItem, AccountUser } from '../models/SharedAccount';

const fetchPaymentPlans = async (): Promise<PaymentPlanItem[]> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([
                {
                    id: 1,
                    estimatedBalance: 5000,
                    initialDate: '2025-03-01',
                    endDate: '2025-12-01',
                    paymentPeriod: 30,
                    accounts: [
                        { name: 'Camila', lastName: 'Perez', idAccount: 1 },
                        { name: 'Sebastian', lastName: 'Morales', idAccount: 2 }
                    ]
                },
                {
                    id: 2,
                    estimatedBalance: 3000,
                    initialDate: '2025-04-01',
                    endDate: '2025-10-01',
                    paymentPeriod: 15,
                    accounts: [
                        { name: 'Carlos', lastName: 'Lopez', idAccount: 3 },
                        { name: 'Camila', lastName: 'Perez', idAccount: 4 }
                    ]
                },
                {
                    id: 3,
                    estimatedBalance: 2450,
                    initialDate: '2025-10-01',
                    endDate: '2026-01-01',
                    paymentPeriod: 15,
                    accounts: [
                        { name: 'Carlos', lastName: 'Lopez', idAccount: 3 },
                        { name: 'Camila', lastName: 'Perez', idAccount: 4 }
                    ]
                }
            ]);
        }, 1000);
    });
};

export default function PlanPagosScreen({ navigation }) {
    const { theme } = useAppTheme();
    const styles = getStyles(theme);

    const [loading, setLoading] = useState(true);
    const [paymentPlans, setPaymentPlans] = useState<PaymentPlanItem[]>([]);

    useEffect(() => {
        const loadPaymentPlans = async () => {
            const data = await fetchPaymentPlans();
            setPaymentPlans(data);
            setLoading(false);
        };
        loadPaymentPlans();
    }, []);

    if (loading) {
        return <ActivityIndicator size="large" color={theme.colors.primary} />;
    }

    const renderItem = ({ item }: { item: PaymentPlanItem }) => (
      <TouchableOpacity onPress={() => navigation.navigate('Movimientos')}>
          <Card style={styles.card}>
              <Card.Content>
                  <Text style={styles.name}>Plan #{item.id}</Text>
                  <Text style={styles.balance}>Saldo estimado: {item.estimatedBalance} Bs</Text>
                  <Text style={styles.date}>Inicio: {item.initialDate} - Fin: {item.endDate}</Text>
                  <Text style={styles.accounts}>Participantes: {item.accounts.map(a => `${a.name} ${a.lastName}`).join(', ')}</Text>
              </Card.Content>
          </Card>
      </TouchableOpacity>
    );

    return (
      <View style={styles.container}>
          <FlatList
            data={paymentPlans}
            keyExtractor={(item) => item.id.toString()}
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
