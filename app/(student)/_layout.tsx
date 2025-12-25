import { useAuth } from '@/context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import { TouchableOpacity } from 'react-native';

export default function StudentLayout() {
    const { logout } = useAuth();

    return (
        <Stack>
            <Stack.Screen
                name="index"
                options={{
                    title: 'My Issues',
                    headerRight: () => (
                        <TouchableOpacity onPress={logout} style={{ marginRight: 10 }}>
                            <Ionicons name="log-out-outline" size={24} color="red" />
                        </TouchableOpacity>
                    )
                }}
            />
            <Stack.Screen
                name="create"
                options={{ title: 'Report Issue' }}
            />
        </Stack>
    );
}
