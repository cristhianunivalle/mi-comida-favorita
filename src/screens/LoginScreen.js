import React, { useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { Input, Button, Text } from 'react-native-elements';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [fieldErrors, setFieldErrors] = useState({});

    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async () => {
        const errors = validateLoginForm();
        if (Object.keys(errors).length > 0) {
            setFieldErrors(errors);
            return;
        }

        setIsLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigation.replace('Home');
        } catch (error) {
            setError('Error al iniciar sesión: ' + error.message);
        } finally {
            setIsLoading(false);
        }
    };


    const validateLoginForm = () => {
        let errors = {};

        if (!email) {
            errors.email = 'El email es requerido';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            errors.email = 'El formato del email no es válido';
        }

        if (!password) {
            errors.password = 'La contraseña es requerida';
        }

        return errors;
    };

    const isFormValid = () => {
        const errors = validateLoginForm();
        return Object.keys(errors).length === 0;
    };

    return (
        <View style={styles.container}>
            <Text h3 style={styles.title}>Mi Comida Favorita</Text>

            <Input
                placeholder="Email"
                value={email}
                onChangeText={(text) => {
                    setEmail(text);
                    setFieldErrors({ ...fieldErrors, email: '' }); // limpia error al escribir
                }}
                autoCapitalize="none"
                errorMessage={fieldErrors.email}
            />

            <Input
                placeholder="Contraseña"
                value={password}
                onChangeText={(text) => {
                    setPassword(text);
                    setFieldErrors({ ...fieldErrors, password: '' }); // limpia error al escribir
                }}
                secureTextEntry
                errorMessage={fieldErrors.password}
            />

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <Button
                title="Registrarse"
                type="outline"
                onPress={() => navigation.navigate('Register')}
                containerStyle={styles.button}
            />

            {isLoading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <Button
                    title="Iniciar Sesión"
                    disabled={!isFormValid()}
                    onPress={handleLogin}
                    containerStyle={styles.button}
                />
            )}

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
    },
    title: {
        textAlign: 'center',
        marginBottom: 30,
    },
    button: {
        marginVertical: 10,
    },
    error: {
        color: 'red',
        textAlign: 'center',
        marginBottom: 10,
    },
});
