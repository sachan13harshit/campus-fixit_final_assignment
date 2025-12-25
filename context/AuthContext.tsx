import { useRouter, useSegments } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api';

interface AuthContextType {
    user: any;
    isLoading: boolean;
    login: (token: string, userData: any) => Promise<void>;
    register: (name: string, email: string, password: string, role?: string) => Promise<any>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    isLoading: true,
    login: async () => { },
    register: async () => { },
    logout: async () => { },
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const segments = useSegments();

    useEffect(() => {
        const loadUser = async () => {
            try {
                const token = await SecureStore.getItemAsync('token');
                const userData = await SecureStore.getItemAsync('user');

                if (token && userData) {
                    setUser(JSON.parse(userData));
                    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                }
            } catch (e) {
                console.log('Failed to load user', e);
            } finally {
                setIsLoading(false);
            }
        };

        loadUser();
    }, []);

    useEffect(() => {
        if (isLoading) return;

        const inAuthGroup = segments[0] === '(auth)';

        if (!user && !inAuthGroup) {
            // Redirect to login if not authenticated and not in auth group
            router.replace('/(auth)/login');
        } else if (user && inAuthGroup) {
            // Redirect to dashboard if authenticated
            if (user.role === 'admin') {
                router.replace('/(admin)');
            } else {
                router.replace('/(student)');
            }
        }
    }, [user, isLoading, segments]);

    const login = async (token: string, userData: any) => {
        await SecureStore.setItemAsync('token', token);
        await SecureStore.setItemAsync('user', JSON.stringify(userData));
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setUser(userData);
    };

    const register = async (name: string, email: string, password: string, role: string = 'student') => {
        const response = await api.post('/auth/register', { name, email, password, role });
        return response.data;
    }

    const logout = async () => {
        await SecureStore.deleteItemAsync('token');
        await SecureStore.deleteItemAsync('user');
        api.defaults.headers.common['Authorization'] = '';
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
