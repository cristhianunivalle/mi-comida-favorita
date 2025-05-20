import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { Input, Button, Text } from 'react-native-elements';
import { auth } from '../config/firebase';
import { signOut } from 'firebase/auth';
import { db } from '../config/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export default function HomeScreen({ navigation }) {
    const [profile, setProfile] = useState({
        nombre: '',
        apellido: '',
        comidaFavorita: ''
    });
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const docRef = doc(db, 'usuarios', auth.currentUser.uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setProfile(docSnap.data());
            }
        } catch (error) {
            Alert.alert("Error", "No se pudo cargar el perfil");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async () => {
        setUpdating(true);
        try {
            await setDoc(doc(db, 'usuarios', auth.currentUser.uid), profile);
            Alert.alert('Éxito', 'Perfil actualizado exitosamente');
        } catch (error) {
            Alert.alert("Error", "No se pudo actualizar el perfil");
        } finally {
            setUpdating(false);
        }
    };

    const handleSignOut = async () => {
        try {
            await signOut(auth);
            navigation.replace('Login');
        } catch (error) {
            Alert.alert("Error", "No se pudo cerrar sesión");
        }
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text h4 style={styles.title}>Mi Perfil</Text>
            <Input
                placeholder="Nombre"
                value={profile.nombre}
                onChangeText={(text) => setProfile({ ...profile, nombre: text })}
            />
            <Input
                placeholder="Apellido"
                value={profile.apellido}
                onChangeText={(text) => setProfile({ ...profile, apellido: text })}
            />
            <Input
                placeholder="Comida Favorita"
                value={profile.comidaFavorita}
                onChangeText={(text) => setProfile({ ...profile, comidaFavorita: text })}
            />

            {updating ? <ActivityIndicator size="small" color="#0000ff" /> : null}

            <Button
                title="Actualizar Perfil"
                onPress={handleUpdate}
                disabled={updating}
                containerStyle={styles.button}
            />
            <Button
                title="Cerrar Sesión"
                type="outline"
                onPress={handleSignOut}
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
});
