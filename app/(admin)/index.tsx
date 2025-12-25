import { Colors, Layout, Shadows } from '@/constants/theme';
import api from '@/services/api';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Issue {
    _id: string;
    title: string;
    description: string;
    category: string;
    status: string;
    createdAt: string;
    reportedBy: {
        name: string;
        email: string;
    }
}

export default function AdminDashboard() {
    const [issues, setIssues] = useState<Issue[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const router = useRouter();

    const fetchIssues = async () => {
        try {
            const { data } = await api.get('/issues');
            setIssues(data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchIssues();
        }, [])
    );

    const onRefresh = () => {
        setRefreshing(true);
        fetchIssues();
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Open': return { bg: '#FFE5E5', text: '#FF3B30' };
            case 'In Progress': return { bg: '#FFF4E5', text: '#FF9500' };
            case 'Resolved': return { bg: '#E5F9E6', text: '#34C759' };
            default: return { bg: '#F2F2F7', text: '#8E8E93' };
        }
    };

    const renderItem = ({ item }: { item: Issue }) => {
        const statusStyle = getStatusColor(item.status);
        return (
            <TouchableOpacity
                onPress={() => router.push(`/(admin)/${item._id}`)}
                activeOpacity={0.7}
            >
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <Text style={styles.category}>{item.category}</Text>
                        <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
                            <Text style={[styles.statusText, { color: statusStyle.text }]}>{item.status}</Text>
                        </View>
                    </View>

                    <Text style={styles.title}>{item.title}</Text>

                    <View style={styles.reporterRow}>
                        <Ionicons name="person-circle-outline" size={16} color={Colors.textTertiary} />
                        <Text style={styles.reporter}>{item.reportedBy?.name || 'Unknown'}</Text>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.cardFooter}>
                        <Text style={styles.date}>{new Date(item.createdAt).toLocaleDateString()}</Text>
                        <Ionicons name="chevron-forward" size={16} color={Colors.textTertiary} />
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
            {loading ? (
                <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 20 }} />
            ) : (
                <FlatList
                    data={issues}
                    keyExtractor={(item) => item._id}
                    renderItem={renderItem}
                    contentContainerStyle={styles.list}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                    ListEmptyComponent={<Text style={styles.emptyText}>No issues reported.</Text>}
                    ListHeaderComponent={
                        <View style={styles.header}>
                            <Text style={styles.headerTitle}>Admin Dashboard</Text>
                            <Text style={styles.headerSubtitle}>{issues.length} Total Reports</Text>
                        </View>
                    }
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    list: {
        padding: Layout.padding,
        paddingBottom: 50,
    },
    header: {
        marginBottom: 20,
        marginTop: 10,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '800',
        color: Colors.textPrimary,
    },
    headerSubtitle: {
        fontSize: 14,
        color: Colors.textSecondary,
        marginTop: 4,
    },
    card: {
        backgroundColor: Colors.surface,
        borderRadius: Layout.radius,
        padding: 20,
        marginBottom: 16,
        ...Shadows.small,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    category: {
        fontSize: 12,
        color: Colors.textSecondary,
        textTransform: 'uppercase',
        fontWeight: '600',
        letterSpacing: 0.5,
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    statusText: {
        fontSize: 11,
        fontWeight: '700',
    },
    title: {
        fontSize: 17,
        fontWeight: '700',
        marginBottom: 10,
        color: Colors.textPrimary,
    },
    reporterRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    reporter: {
        fontSize: 14,
        color: Colors.textSecondary,
        marginLeft: 6,
    },
    divider: {
        height: 1,
        backgroundColor: '#F2F2F7',
        marginVertical: 10,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    date: {
        fontSize: 12,
        color: Colors.textTertiary,
    },
    emptyText: {
        textAlign: 'center',
        color: Colors.textSecondary,
        marginTop: 30,
        fontSize: 16,
    },
});
