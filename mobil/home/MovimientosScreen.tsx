import React, { useState, useEffect } from 'react';
import {
    View,
    StyleSheet,
    ActivityIndicator,
    FlatList
} from 'react-native';
import { Text, Card } from 'react-native-paper';
import { useAppTheme } from '../config/ThemeContext';
import { PaymentItem } from '../models/SharedAccount';

const fetchPayments = async (): Promise<PaymentItem[]> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([
                { idAccount: 1, amount: 100, account: { name: 'Camila', lastName: 'Lino', idAccount: 1 }, date: '20-03-2025' },
                { idAccount: 2, amount: 200, account: { name: 'Santiago', lastName: 'Suarez', idAccount: 2 }, date: '19-03-2025' },
                { idAccount: 3, amount: 150, account: { name: 'Camila', lastName: 'Lino', idAccount: 3 }, date: '18-03-2025' },
            ]);
        }, 1000);
    });
};

export default function MovimientosScreen() {
    const { theme } = useAppTheme();
    const styles = getStyles(theme);

    const [loading, setLoading] = useState(true);
    const [payments, setPayments] = useState<PaymentItem[]>([]);

    useEffect(() => {
        const loadPayments = async () => {
            const data = await fetchPayments();
            setPayments(data);
            setLoading(false);
        };
        loadPayments();
    }, []);

    if (loading) {
        return <ActivityIndicator size="large" color={theme.colors.primary} />;
    }

    const renderItem = ({ item }: { item: PaymentItem }) => (
      <Card style={styles.card}>
          <Card.Content>
              <View style={{flexDirection:"row" ,justifyContent:"space-between",alignItems:"center"}}>
                <View>
                <Text style={styles.name}>{`${item.account.name} ${item.account.lastName}`}</Text>
           
           <Text style={styles.date}>Fecha: {item.date}</Text>
                </View>
              <Text style={styles.amount}>Monto: <Text style={{fontWeight:600}}>{item.amount} Bs </Text></Text>
              </View>
             
          </Card.Content>
      </Card>
    );

    return (
      <View style={styles.container}>
          <FlatList
            data={payments}
            keyExtractor={(item) => item.idAccount.toString()}
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
        color: theme.colors.tertiary,
    },
    amount: {
        fontSize: 16,
        color: theme.colors.onSurface,
    },
    date: {
        fontSize: 14,
        color: theme.colors.onSurfaceVariant,
    },
});
