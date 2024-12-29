import React, { useEffect, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, StyleSheet, ImageBackground } from 'react-native';
import {
    ActivityIndicator,
    Button,
    Card,
    Dialog,
    FAB,
    Portal,
    Provider as PaperProvider,
    Text,
    TextInput
} from 'react-native-paper';
import { useRouter } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useTodos } from '@/context/TodoContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import API_URL from '@/config/config';
import Constants from "expo-constants/src/Constants";

const TodosScreen = () => {
    const { todos, fetchTodos } = useTodos();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [isAdding, setIsAdding] = useState(false);
    const [loading, setLoading] = useState(true);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [dialogMessage, setDialogMessage] = useState('');
    const router = useRouter();

    useEffect(() => {
        const loadTodos = async () => {
            setLoading(true);
            await fetchTodos();
            setLoading(false);
        };
        loadTodos();
    }, []);

    const handleAddTodo = async () => {
        if (!title || !description) {
            setDialogMessage('Both title and description are required.');
            setDialogVisible(true);
            return;
        }
        try {
            const token = await AsyncStorage.getItem('token');
            await axios.post(`${API_URL}/api/todos`, {
                title,
                description
            }, { headers: { Authorization: `Bearer ${token}` } });
            fetchTodos();
            setTitle('');
            setDescription('');
            setIsAdding(false);
        } catch (error) {
            setDialogMessage('Failed to add todo');
            setDialogVisible(true);
        }
    };

    const handleDeleteTodo = async (id: string) => {
        try {
            const token = await AsyncStorage.getItem('token');
            await axios.delete(`${API_URL}/api/todos/${id}`, { headers: { Authorization: `Bearer ${token}` } });
            fetchTodos();
        } catch (error) {
            setDialogMessage('Failed to delete todo');
            setDialogVisible(true);
        }
    };

    return (
        <PaperProvider>
            {/* ImageBackground with transparent overlay */}
            <ImageBackground
                source={{ uri: 'https://i.pinimg.com/474x/89/42/bb/8942bbf2e528340515ee12496b285ffd.jpg' }}
                style={styles.container}
                imageStyle={styles.backgroundImage}
                resizeMode="cover"
            >
                <ThemedView style={styles.overlayContainer}>
                    <ThemedText style={[styles.title, { color: '#FF9800' }]} type="title">Galaxy Missions</ThemedText>
                    {loading ? (
                        <ActivityIndicator style={styles.loading} animating={true} color="#FF9800" />
                    ) : (
                        <FlatList
                            data={todos}
                            keyExtractor={(item) => item._id}
                            renderItem={({ item }) => (
                                <Card style={styles.card} elevation={5} onPress={() => router.push(`../todo/${item._id}`)}>
                                    <Card.Content>
                                        <Text variant="titleMedium" style={styles.cardTitle}>{item.title}</Text>
                                        <Text variant="bodyMedium" style={styles.cardDescription}>{item.description}</Text>
                                    </Card.Content>
                                    <Card.Actions>
                                        <Button onPress={() => handleDeleteTodo(item._id)} textColor="#FF5722">Delete</Button>
                                    </Card.Actions>
                                </Card>
                            )}
                            contentContainerStyle={styles.listContainer}
                        />
                    )}
                    {isAdding && (
                        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                            style={styles.inputContainer}>
                            <TextInput
                                label="Title"
                                value={title}
                                onChangeText={setTitle}
                                style={styles.input}
                                mode="outlined"
                                outlineColor="#FF5722"
                                activeOutlineColor="#FF9800"
                            />
                            <TextInput
                                label="Description"
                                value={description}
                                onChangeText={setDescription}
                                style={styles.input}
                                mode="outlined"
                                multiline
                                outlineColor="#FF5722"
                                activeOutlineColor="#FF9800"
                            />
                            <Button mode="contained" onPress={handleAddTodo} style={styles.addButton} buttonColor="#FF9800">Add Mission</Button>
                            <Button onPress={() => setIsAdding(false)} style={styles.cancelButton} textColor="#FF5722">Cancel</Button>
                        </KeyboardAvoidingView>
                    )}
                    {!isAdding && (
                        <FAB style={styles.fab} icon="plus" onPress={() => setIsAdding(true)} label="Add Mission" color="#FFFFFF" />
                    )}
                    <Portal>
                        <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)}>
                            <Dialog.Title style={styles.dialogTitle}>Alert</Dialog.Title>
                            <Dialog.Content>
                                <Text style={styles.dialogText}>{dialogMessage}</Text>
                            </Dialog.Content>
                            <Dialog.Actions>
                                <Button onPress={() => setDialogVisible(false)} textColor="#FF5722">OK</Button>
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
    },
    overlayContainer: {
        flex: 1,
        paddingTop: Constants.statusBarHeight,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Transparent overlay for readability
        padding: 16,
    },
    backgroundImage: {
        flex: 1,
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        marginTop: 16,
        marginHorizontal: 16,
        fontSize: 32,
        fontWeight: 'bold',
    },
    listContainer: {
        paddingBottom: 20,
    },
    card: {
        marginBottom: 16,
        borderRadius: 12,
        backgroundColor: '#263238',
        overflow: 'hidden', // To make rounded corners effective
    },
    cardTitle: {
        color: '#FF5722',
        fontSize: 20,
        fontWeight: 'bold',
    },
    cardDescription: {
        marginTop: 8,
        color: '#FFAB91',
        fontSize: 14,
    },
    fab: {
        position: 'absolute',
        right: 16,
        bottom: 16,
        backgroundColor: '#FF5722',
        elevation: 8,
    },
    inputContainer: {
        padding: 16,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        backgroundColor: '#3E2723',
        elevation: 5,
    },
    input: {
        marginBottom: 12,
        backgroundColor: '#ffffff',
    },
    addButton: {
        marginTop: 12,
    },
    cancelButton: {
        marginTop: 8,
    },
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    dialogTitle: {
        color: '#FF9800',
    },
    dialogText: {
        color: '#FFFFFF',
    },
});

export default TodosScreen;
