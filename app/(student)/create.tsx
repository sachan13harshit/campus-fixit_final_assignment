import { Colors, Layout, Shadows } from '@/constants/theme';
import api from '@/services/api';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const CATEGORIES = ['Electrical', 'Water', 'Internet', 'Infrastructure', 'Other'];

export default function CreateIssue() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState(CATEGORIES[0]);
    const [image, setImage] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const router = useRouter();

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const handleSubmit = async () => {
        if (!title || !description) {
            Alert.alert('Error', 'Please fill in Title and Description');
            return;
        }

        setSubmitting(true);
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('category', category);

        if (image) {
            // @ts-ignore
            formData.append('image', {
                uri: image,
                type: 'image/jpeg',
                name: 'issue.jpg',
            });
        }

        try {
            await api.post('/issues', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            Alert.alert('Success', 'Issue Reported Successfully', [
                { text: 'OK', onPress: () => router.back() }
            ]);
        } catch (error: any) {
            Alert.alert('Error', error.response?.data?.message || 'Failed to report issue');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }} edges={['left', 'right', 'bottom']}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
            >
                <ScrollView
                    style={{ flex: 1 }}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <Text style={styles.headerTitle}>New Issue</Text>

                    <View style={styles.section}>
                        <Text style={styles.label}>What's the problem?</Text>
                        <TextInput
                            style={styles.inputTitle}
                            value={title}
                            onChangeText={setTitle}
                            placeholder="e.g. WiFi not connecting in Library"
                            placeholderTextColor={Colors.textTertiary}
                        />
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.label}>Category</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
                            {CATEGORIES.map((cat) => (
                                <TouchableOpacity
                                    key={cat}
                                    style={[styles.categoryChip, category === cat && styles.categoryActive]}
                                    onPress={() => setCategory(cat)}
                                >
                                    <Text style={[styles.categoryText, category === cat && styles.categoryTextActive]}>{cat}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.label}>Description</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            value={description}
                            onChangeText={setDescription}
                            placeholder="Provide more details so we can fix it faster..."
                            placeholderTextColor={Colors.textTertiary}
                            multiline
                            numberOfLines={5}
                        />
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.label}>Photo Evidence</Text>
                        <TouchableOpacity style={styles.imageButton} onPress={pickImage} activeOpacity={0.8}>
                            {image ? (
                                <Image source={{ uri: image }} style={styles.previewImage} />
                            ) : (
                                <View style={styles.imagePlaceholder}>
                                    <Ionicons name="camera" size={32} color={Colors.primary} />
                                    <Text style={styles.imageText}>Upload Photo</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                        {image && (
                            <TouchableOpacity onPress={() => setImage(null)} style={styles.removeButton}>
                                <Ionicons name="close-circle" size={16} color={Colors.textSecondary} />
                                <Text style={styles.removeText}>Remove</Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    <View style={styles.footer}>
                        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={submitting}>
                            {submitting ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.submitButtonText}>Submit Report</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    scrollContent: {
        flexGrow: 1,
        padding: Layout.padding,
        paddingBottom: 100, // Extra space for scrolling past the submit button
        backgroundColor: Colors.background,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '800',
        color: Colors.textPrimary,
        marginBottom: 30,
        marginTop: 10,
    },
    section: {
        marginBottom: 24,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 12,
        color: Colors.textPrimary,
    },
    inputTitle: {
        backgroundColor: Colors.surface,
        padding: 18,
        borderRadius: Layout.radius,
        fontSize: 17,
        color: Colors.textPrimary,
        ...Shadows.small,
    },
    input: {
        backgroundColor: Colors.surface,
        padding: 16,
        borderRadius: Layout.radius,
        fontSize: 16,
        color: Colors.textPrimary,
        ...Shadows.small,
    },
    textArea: {
        height: 120,
        textAlignVertical: 'top',
    },
    categoryScroll: {
        flexDirection: 'row',
    },
    categoryChip: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        backgroundColor: Colors.surface,
        borderRadius: 25,
        marginRight: 10,
        ...Shadows.small,
    },
    categoryActive: {
        backgroundColor: Colors.primary,
    },
    categoryText: {
        color: Colors.textSecondary,
        fontWeight: '500',
    },
    categoryTextActive: {
        color: '#fff',
        fontWeight: '700',
    },
    imageButton: {
        borderRadius: Layout.radius,
        overflow: 'hidden',
    },
    imagePlaceholder: {
        height: 140,
        backgroundColor: Colors.surface,
        borderRadius: Layout.radius,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#E5E5EA',
        borderStyle: 'dashed'
    },
    previewImage: {
        width: '100%',
        height: 220,
        borderRadius: Layout.radius,
    },
    imageText: {
        color: Colors.primary,
        marginTop: 8,
        fontWeight: '600',
    },
    removeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 12,
        padding: 8,
    },
    removeText: {
        color: Colors.textSecondary,
        marginLeft: 4,
        fontSize: 14,
    },
    footer: {
        marginTop: 20,
        marginBottom: 40,
    },
    submitButton: {
        backgroundColor: Colors.success,
        padding: 18,
        borderRadius: Layout.radius,
        alignItems: 'center',
        ...Shadows.medium,
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 17,
        fontWeight: '700',
    },
});
