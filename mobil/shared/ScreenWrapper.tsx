// ScreenWrapper.tsx
import React from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';

const ScreenWrapper = ({ children, style,  withScrollView = true,
                       }) => {
    return (
        <>
        {withScrollView ? (
                <ScrollView
                    keyboardShouldPersistTaps="always"
                    alwaysBounceVertical={false}
                    showsVerticalScrollIndicator={false}
                    style={[styles.container, style]}
                >
                    {children}
                    <View style={styles.bottomSpacer} />

                </ScrollView>
            ) : (
                <View style={[styles.container, style]}>{children}
                    <View style={styles.bottomSpacer} />
                </View>
            )}
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1, //todo el espacio  en la pantalla
        padding: 16,
        backgroundColor: '#0057FF', // Color de fondo
    },
    bottomSpacer: {
        height: 60,  // Espaciador para evitar que el último elemento quede tapado
    },
});

export default ScreenWrapper;
