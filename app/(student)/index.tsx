import { UPLOADS_URL } from '@/constants/Config';
import { Colors, Layout, Shadows } from '@/constants/theme';
import api from '@/services/api';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Image, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Issue {
    _id: string;
    title: string;
    description: string;
    category: string;
    status: string;
    imageUrl: string;
    createdAt: string;
}

const CATEGORIES = ['All', 'Electrical', 'Water', 'Internet', 'Infrastructure', 'Other'];
const STATUSES = ['All', 'Open', 'In Progress', 'Resolved'];

export default function StudentDashboard() {
    const [issues, setIssues] = useState<Issue[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [filterCategory, setFilterCategory] = useState('All');
    const [filterStatus, setFilterStatus] = useState('All');
    const router = useRouter();

    const fetchIssues = async () => {
        try {
            const { data } = await api.get('/issues/my-issues');
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

    // Filter Logic
    const filteredIssues = useMemo(() => {
        return issues.filter(issue => {
            const categoryMatch = filterCategory === 'All' || issue.category === filterCategory;
            const statusMatch = filterStatus === 'All' || issue.status === filterStatus;
            return categoryMatch && statusMatch;
        });
    }, [issues, filterCategory, filterStatus]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Open': return { bg: '#FFE5E5', text: '#FF3B30' }; // Red-ish
            case 'In Progress': return { bg: '#FFF4E5', text: '#FF9500' }; // Orange-ish
            case 'Resolved': return { bg: '#E5F9E6', text: '#34C759' }; // Green-ish
            default: return { bg: '#F2F2F7', text: '#8E8E93' };
        }
    };

    const renderItem = ({ item }: { item: Issue }) => {
        const statusStyle = getStatusColor(item.status);
        return (
            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <View style={styles.categoryContainer}>
                        <Text style={styles.category}>{item.category}</Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
                        <Text style={[styles.statusText, { color: statusStyle.text }]}>{item.status}</Text>
                    </View>
                </View>

                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.description} numberOfLines={2}>{item.description}</Text>

                {item.imageUrl && (
                    <Image
                        source={{ uri: `${UPLOADS_URL}${item.imageUrl}` }}
                        style={styles.image}
                    />
                )}

                <View style={styles.cardFooter}>
                    <Ionicons name="time-outline" size={14} color={Colors.textTertiary} />
                    <Text style={styles.date}>{new Date(item.createdAt).toLocaleDateString()}</Text>
                </View>
            </View>
        );
    };

    const renderHeader = () => (
        <View style={styles.header}>
            <Text style={styles.headerTitle}>My Issues</Text>
            <Text style={styles.headerSubtitle}>Track and manage your reports</Text>

            <View style={styles.filtersContainer}>
                <Text style={styles.filterLabel}>Status</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
                    {STATUSES.map((status) => (
                        <TouchableOpacity
                            key={status}
                            style={[styles.filterChip, filterStatus === status && styles.filterChipActive]}
                            onPress={() => setFilterStatus(status)}
                        >
                            <Text style={[styles.filterText, filterStatus === status && styles.filterTextActive]}>{status}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                <Text style={styles.filterLabel}>Category</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
                    {CATEGORIES.map((cat) => (
                        <TouchableOpacity
                            key={cat}
                            style={[styles.filterChip, filterCategory === cat && styles.filterChipActive]}
                            onPress={() => setFilterCategory(cat)}
                        >
                            <Text style={[styles.filterText, filterCategory === cat && styles.filterTextActive]}>{cat}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
            {loading ? (
                <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 20 }} />
            ) : (
                <FlatList
                    data={filteredIssues}
                    keyExtractor={(item) => item._id}
                    renderItem={renderItem}
                    contentContainerStyle={styles.list}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />}
                    ListHeaderComponent={renderHeader()}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Ionicons name="filter-outline" size={48} color={Colors.textTertiary} />
                            <Text style={styles.emptyText}>No issues found.</Text>
                            <Text style={styles.emptySubText}>Try adjusting your filters.</Text>
                        </View>
                    }
                />
            )}

            <TouchableOpacity
                style={styles.fab}
                onPress={() => router.push('/(student)/create')}
                activeOpacity={0.9}
            >
                <Ionicons name="add" size={32} color="#fff" />
            </TouchableOpacity>
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
        paddingBottom: 100,
    },
    header: {
        marginBottom: 20,
        // Removed marginTop to reduce spacing
    },
    headerTitle: {
        fontSize: 34,
        fontWeight: '800',
        color: Colors.textPrimary,
        letterSpacing: -1,
    },
    headerSubtitle: {
        fontSize: 16,
        color: Colors.textSecondary,
        marginTop: 4,
        marginBottom: 20,
    },
    filtersContainer: {
        marginBottom: 10,
    },
    filterLabel: {
        fontSize: 13,
        fontWeight: '700',
        color: Colors.textSecondary,
        marginBottom: 8,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    filterScroll: {
        marginBottom: 16,
        flexGrow: 0,
    },
    filterChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: Colors.surface,
        borderRadius: 20,
        marginRight: 10,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    filterChipActive: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
    },
    filterText: {
        fontSize: 14,
        color: Colors.textSecondary,
        fontWeight: '600',
    },
    filterTextActive: {
        color: '#fff',
    },
    card: {
        backgroundColor: Colors.surface,
        borderRadius: Layout.radius,
        padding: 20,
        marginBottom: 16,
        ...Shadows.small,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.03)',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    categoryContainer: {
        backgroundColor: '#F2F2F7',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 6,
    },
    category: {
        fontSize: 12,
        color: Colors.textSecondary,
        fontWeight: '600',
        textTransform: 'uppercase',
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '700',
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 6,
        color: Colors.textPrimary,
    },
    description: {
        fontSize: 15,
        color: Colors.textSecondary,
        marginBottom: 12,
        lineHeight: 22,
    },
    image: {
        width: '100%',
        height: 160,
        borderRadius: Layout.radius - 4,
        marginBottom: 12,
    },
    cardFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    date: {
        fontSize: 13,
        color: Colors.textTertiary,
        marginLeft: 4,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 60,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.textSecondary,
        marginTop: 16,
    },
    emptySubText: {
        fontSize: 14,
        color: Colors.textTertiary,
        marginTop: 8,
    },
    fab: {
        position: 'absolute',
        bottom: 30,
        right: 24,
        backgroundColor: Colors.primary,
        width: 64,
        height: 64,
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
        ...Shadows.medium,
    },
});
