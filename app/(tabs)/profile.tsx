import React, { useEffect, useState } from 'react';
import { StyleSheet, ImageBackground, View } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { ActivityIndicator, Button, Dialog, PaperProvider, Portal, Text, Card } from 'react-native-paper';
import API_URL from '@/config/config';

type UserProfile = {
    username: string;
    email: string;
};

const ProfileScreen = () => {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [dialogVisible, setDialogVisible] = useState(false);
    const router = useRouter();

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await axios.get<{ data: UserProfile }>(`${API_URL}/api/profile`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setProfile(response.data.data);
        } catch (error) {
            console.error('Failed to fetch profile', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        setDialogVisible(true);
    };

    const confirmLogout = async () => {
        await AsyncStorage.removeItem('token');
        router.replace('/auth/LoginScreen');
    };

    if (loading) {
        return (
            <PaperProvider>
                <ThemedView style={styles.container}>
                    <ActivityIndicator animating={true} color="#FF9800" />
                </ThemedView>
            </PaperProvider>
        );
    }

    return (
        <PaperProvider>
            {/* ImageBackground with a transparent overlay */}
            <ImageBackground
                source={{ uri: 'https://i.pinimg.com/474x/89/42/bb/8942bbf2e528340515ee12496b285ffd.jpg' }}
                style={styles.container}
                imageStyle={styles.backgroundImage}
                resizeMode="cover"
            >
                <ThemedView style={styles.overlayContainer}>
                    <Card style={styles.profileCard} elevation={6}>
                        <Card.Content>
                            <ThemedText style={[styles.title, { color: '#FF9800' }]}>Profile</ThemedText>
                            {profile ? (
                                <>
                                    <ThemedText style={[styles.label, { color: '#FF5722' }]}>Username:</ThemedText>
                                    <ThemedText style={[styles.value, { color: '#FFAB91' }]}>{profile.username}</ThemedText>
                                    <ThemedText style={[styles.label, { color: '#FF5722' }]}>Email:</ThemedText>
                                    <ThemedText style={[styles.value, { color: '#FFAB91' }]}>{profile.email}</ThemedText>
                                </>
                            ) : (
                                <ThemedText style={{ color: '#FFFFFF' }}>No profile data available</ThemedText>
                            )}
                            <Button mode="contained" onPress={handleLogout} style={styles.logoutButton} buttonColor="#FF9800">
                                Log Out
                            </Button>
                        </Card.Content>
                    </Card>

                    <Portal>
                        <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)}>
                            <Dialog.Title style={styles.dialogTitle}>Logout</Dialog.Title>
                            <Dialog.Content>
                                <Text style={styles.dialogText}>Are you sure you want to logout?</Text>
                            </Dialog.Content>
                            <Dialog.Actions>
                                <Button onPress={() => setDialogVisible(false)} textColor="#FF5722">Cancel</Button>
                                <Button onPress={confirmLogout} textColor="#FF5722">OK</Button>
                            </Dialog.Actions>
                        </Dialog>
                    </Portal>
                </ThemedView>
            </ImageBackground>
        </PaperProvider>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    overlayContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.6)', // Transparent overlay for better contrast
        width: '100%',
        height: '100%',
        padding: 16,
    },
    backgroundImage: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
    },
    profileCard: {
        width: '90%',
        backgroundColor: 'rgba(38, 50, 56, 0.8)', // Semi-transparent background for card
        borderRadius: 16,
        padding: 20,
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    label: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 16,
    },
    value: {
        fontSize: 18,
        marginTop: 4,
        marginBottom: 16,
    },
    logoutButton: {
        marginTop: 16,
        marginBottom: 8,
        borderRadius: 8,
    },
    dialogTitle: {
        color: '#FF9800',
    },
    dialogText: {
        color: '#FFFFFF',
    },
});

export default ProfileScreen;
