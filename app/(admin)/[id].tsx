import { UPLOADS_URL } from '@/constants/Config';
import { Colors, Layout, Shadows } from '@/constants/theme';
import api from '@/services/api';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const STATUS_OPTIONS = ['Open', 'In Progress', 'Resolved'];

export default function IssueDetails() {
    const { id } = useLocalSearchParams();
    const [issue, setIssue] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [params, setParams] = useState({ status: '', remarks: '' });
    const router = useRouter();

    useEffect(() => {
        fetchIssue();
    }, [id]);

    const fetchIssue = async () => {
        try {
            const { data } = await api.get('/issues');
            const found = data.find((i: any) => i._id === id);
            if (found) {
                setIssue(found);
                setParams({ status: found.status, remarks: found.remarks || '' });
            } else {
                router.back();
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async () => {
        setUpdating(true);
        try {
            await api.patch(`/issues/${id}/status`, params);
            Alert.alert('Success', 'Issue updated successfully');
            fetchIssue(); // Refresh
        } catch (error) {
            Alert.alert('Error', 'Failed to update issue');
        } finally {
            setUpdating(false);
        }
    };

    if (loading) return <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 20 }} />;
    if (!issue) return <View />;

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }} edges={['left', 'right', 'bottom']}>
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.headerCard}>
                    <View style={styles.statusRow}>
                        <View style={styles.categoryBadge}>
                            <Text style={styles.categoryText}>{issue.category}</Text>
                        </View>
                        <Text style={styles.date}>{new Date(issue.createdAt).toLocaleDateString()}</Text>
                    </View>
                    <Text style={styles.title}>{issue.title}</Text>

                    <View style={styles.reporterInfo}>
                        <Ionicons name="person-circle" size={20} color={Colors.textSecondary} />
                        <Text style={styles.reporterText}>{issue.reportedBy?.name} <Text style={styles.email}>({issue.reportedBy?.email})</Text></Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionHeader}>DETAILS</Text>
                    <Text style={styles.description}>{issue.description}</Text>
                    {issue.imageUrl && (
                        <Image
                            source={{ uri: `${UPLOADS_URL}${issue.imageUrl}` }}
                            style={styles.image}
                        />
                    )}
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionHeader}>UPDATE STATUS</Text>
                    <View style={styles.statusContainer}>
                        {STATUS_OPTIONS.map(status => (
                            <TouchableOpacity
                                key={status}
                                style={[
                                    styles.statusButton,
                                    params.status === status && styles.statusActive,
                                    params.status === status && { backgroundColor: getStatusColor(status).bg, borderColor: getStatusColor(status).bg }
                                ]}
                                onPress={() => setParams({ ...params, status })}
                            >
                                <Text style={[
                                    styles.statusOptionText,
                                    params.status === status && { color: getStatusColor(status).text }
                                ]}>{status}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <Text style={styles.label}>Admin Remarks</Text>
                    <TextInput
                        style={styles.input}
                        value={params.remarks}
                        onChangeText={(text) => setParams({ ...params, remarks: text })}
                        placeholder="Add notes about the resolution..."
                        placeholderTextColor={Colors.textTertiary}
                        multiline
                    />

                    <TouchableOpacity style={styles.updateButton} onPress={handleUpdate} disabled={updating}>
                        {updating ? <ActivityIndicator color="#fff" /> : <Text style={styles.updateButtonText}>Save Changes</Text>}
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}

const getStatusColor = (status: string) => {
    switch (status) {
        case 'Open': return { bg: '#FFE5E5', text: '#FF3B30' };
        case 'In Progress': return { bg: '#FFF4E5', text: '#FF9500' };
        case 'Resolved': return { bg: '#E5F9E6', text: '#34C759' };
        default: return { bg: '#F2F2F7', text: '#8E8E93' };
    }
};


const styles = StyleSheet.create({
    container: {
        padding: Layout.padding,
        paddingBottom: 50,
        backgroundColor: Colors.background,
        minHeight: '100%',
    },
    headerCard: {
        marginBottom: 24,
    },
    statusRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    categoryBadge: {
        backgroundColor: Colors.surface,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    categoryText: {
        fontSize: 12,
        fontWeight: '600',
        color: Colors.textSecondary,
        textTransform: 'uppercase',
    },
    date: {
        color: Colors.textTertiary,
        fontSize: 13,
    },
    title: {
        fontSize: 26,
        fontWeight: '800',
        color: Colors.textPrimary,
        marginBottom: 8,
        lineHeight: 32,
    },
    reporterInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    reporterText: {
        marginLeft: 6,
        fontSize: 14,
        fontWeight: '600',
        color: Colors.textSecondary,
    },
    email: {
        fontWeight: '400',
        color: Colors.textTertiary,
    },
    section: {
        backgroundColor: Colors.surface,
        borderRadius: Layout.radius,
        padding: 20,
        marginBottom: 20,
        ...Shadows.small,
    },
    sectionHeader: {
        fontSize: 12,
        fontWeight: '700',
        color: Colors.textTertiary,
        marginBottom: 16,
        letterSpacing: 1,
    },
    description: {
        fontSize: 16,
        color: Colors.textPrimary,
        lineHeight: 24,
        marginBottom: 16,
    },
    image: {
        width: '100%',
        height: 200,
        borderRadius: Layout.radius - 4,
        resizeMode: 'cover',
        backgroundColor: Colors.background,
    },
    statusContainer: {
        flexDirection: 'row',
        marginBottom: 20,
        gap: 10,
    },
    statusButton: {
        flex: 1,
        paddingVertical: 12,
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: 8,
        alignItems: 'center',
        backgroundColor: Colors.background,
    },
    statusActive: {
        borderWidth: 1, // Color is set dynamically
    },
    statusOptionText: {
        fontSize: 13,
        fontWeight: '600',
        color: Colors.textSecondary,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.textPrimary,
        marginBottom: 8,
    },
    input: {
        backgroundColor: Colors.background,
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: 8,
        padding: 12,
        minHeight: 80,
        marginBottom: 20,
        textAlignVertical: 'top',
    },
    updateButton: {
        backgroundColor: Colors.primary,
        padding: 16,
        borderRadius: Layout.radius,
        alignItems: 'center',
        ...Shadows.small,
    },
    updateButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
});
