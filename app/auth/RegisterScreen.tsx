import React, { useState } from "react";
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ThemedView } from "@/components/ThemedView";
import { Button, Dialog, PaperProvider, Portal } from "react-native-paper";
import API_URL from "../../config/config";

export default function LoginScreen() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [dialogVisible, setDialogVisible] = useState(false);
    const [dialogMessage, setDialogMessage] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);
    const router = useRouter();

    const handleLogin = async () => {
        try {
            const response = await axios.post(`${API_URL}/api/auth/login`, { username, password });
            const { token } = response.data.data;
            await AsyncStorage.setItem("token", token);
            setDialogMessage("Login successful!");
            setIsSuccess(true);
            setDialogVisible(true);
        } catch (error) {
            const errorMessage = (error as any).response?.data?.message || "An error occurred";
            setDialogMessage(errorMessage);
            setIsSuccess(false);
            setDialogVisible(true);
        }
    };

    const handleDialogDismiss = () => {
        setDialogVisible(false);
        if (isSuccess) {
            router.replace("/(tabs)");
        }
    };

    return (
        <PaperProvider>
            <ThemedView style={styles.container}>
                {/* Background image with scroll view */}
                <Image
                    source={{ uri: 'https://i.pinimg.com/474x/20/fa/9f/20fa9f99f41820d2e7141d0c40f81709.jpg' }}
                    style={styles.logo}
                />
                <ScrollView contentContainerStyle={styles.formContainer}>
                    <Text style={styles.title}>Selamat Datang di Boboiboy Galaxy!</Text>
                    <Text style={styles.subtitle}>Masuk untuk melanjutkan petualangan</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Username"
                        value={username}
                        onChangeText={setUsername}
                        autoCapitalize="none"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />
                    <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                        <Text style={styles.loginButtonText}>Masuk</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.registerButton} onPress={() => router.push("/auth/RegisterScreen")}>
                        <Text style={styles.registerButtonText}>Daftar</Text>
                    </TouchableOpacity>
                </ScrollView>
                <Portal>
                    <Dialog visible={dialogVisible} onDismiss={handleDialogDismiss}>
                        <Dialog.Title>{isSuccess ? "Berhasil" : "Gagal Masuk"}</Dialog.Title>
                        <Dialog.Content>
                            <Text>{dialogMessage}</Text>
                        </Dialog.Content>
                        <Dialog.Actions>
                            <Button onPress={handleDialogDismiss}>OK</Button>
                        </Dialog.Actions>
                    </Dialog>
                </Portal>
            </ThemedView>
        </PaperProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#0D1B2A",
        padding: 16,
    },
    logo: {
        width: 150,
        height: 150,
        marginBottom: 10, // Reduced margin between image and title
        resizeMode: "contain",
    },
    formContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        marginBottom: 4, // Reduced margin between title and subtitle
        color: "#FFD700",
    },
    subtitle: {
        fontSize: 16,
        marginBottom: 20, // Adjusted the margin to bring the elements closer
        color: "#FFF",
    },
    input: {
        width: "100%",
        height: 50,
        borderColor: "#FFD700",
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 12,
        marginBottom: 16,
        backgroundColor: "#1B263B",
        color: "#FFF",
    },
    loginButton: {
        width: "100%",
        height: 50,
        backgroundColor: "#FFD700",
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 16,
    },
    loginButtonText: {
        color: "#0D1B2A",
        fontSize: 16,
        fontWeight: "600",
    },
    registerButton: {
        width: "100%",
        height: 50,
        borderWidth: 1,
        borderColor: "#FFD700",
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#1B263B",
    },
    registerButtonText: {
        color: "#FFD700",
        fontSize: 16,
        fontWeight: "600",
    },
});
