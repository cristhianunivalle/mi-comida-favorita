import React, { useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { Input, Button, Text, Icon } from 'react-native-elements';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';

export default function RegisterScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [fieldErrors, setFieldErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [isLoading, setIsLoading] = useState(false);

    const validatePassword = (password) => {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d])[A-Za-z\d\S]{8,}$/;
        return passwordRegex.test(password);
    };

    const validateForm = () => {
        let errors = {};
        if (!email) errors.email = 'El email es requerido';
        else if (!/\S+@\S+\.\S+/.test(email)) errors.email = 'Email inválido';

        if (!password) errors.password = 'La contraseña es requerida';
        else if (!validatePassword(password)) {
            errors.password = 'La contraseña debe tener mínimo 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial';
        }

        if (!confirmPassword) errors.confirmPassword = 'Confirma tu contraseña';
        else if (password !== confirmPassword) {
            errors.confirmPassword = 'Las contraseñas no coinciden';
        }

        return errors;
    };

    const handleRegister = async () => {
        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setFieldErrors(errors);
            return;
        }
        setIsLoading(true);
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            navigation.replace('Home');
        } catch (error) {
            setError('Error al registrarse: ' + error.message);
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <View style={styles.container}>
            <Text h3 style={styles.title}>Registro</Text>
            <Input
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                errorMessage={fieldErrors.email}
            />
            <Input
                placeholder="Contraseña"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                errorMessage={fieldErrors.password}
                rightIcon={{
                    type: 'font-awesome',
                    name: showPassword ? 'eye-slash' : 'eye',
                    onPress: () => setShowPassword(!showPassword)
                }}
            />
            <Input
                placeholder="Confirmar Contraseña"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
                errorMessage={fieldErrors.confirmPassword}
                rightIcon={{
                    type: 'font-awesome',
                    name: showConfirmPassword ? 'eye-slash' : 'eye',
                    onPress: () => setShowConfirmPassword(!showConfirmPassword)
                }}
            />
            {error ? <Text style={styles.error}>{error}</Text> : null}
            {isLoading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <Button
                    title="Registrarse"
                    onPress={handleRegister}
                    containerStyle={styles.button}
                />
            )}
            <Button
                title="Volver al Login"
                type="outline"
                onPress={() => navigation.navigate('Login')}
                containerStyle={styles.button}
            />
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
