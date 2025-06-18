'use client';

import { getLocalStorage, setLocalStorage } from '@/lib/storage';
import AxiosInstance from '@/utils/axiosInstance';
import { AxiosError } from 'axios';
import { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'sonner';

export interface User {
    id: number;
    email: string;
    userMetadata: {
        name: string;
        avatarUrl: string;
        email: string;
        emailVerified: boolean;
        agentId: string;
    };
}

interface UserContextType {
    user: User | null;
    isAuthenticated: boolean;
}

interface UserProviderProps {
    children: React.ReactNode;
}

const UserContext = createContext<UserContextType | null>(null);

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('User must be use in UserProvider');
    }
    return context;
};

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    useEffect(() => {
        (async () => {
            try {
                const response = await AxiosInstance.get(`/api/v1/user`, {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                if (response.data.success == true) {
                    const userData = response.data.data;
                    setUser(response.data.data);
                    setIsAuthenticated(true);

                    // Set data to local storage
                    const isNameAlreadyExist = getLocalStorage('user_fullname');
                    if (!isNameAlreadyExist && userData?.userMetadata.name) {
                        setLocalStorage('user_fullname', userData.userMetadata.name);
                    }

                    const isEmailAlreadyExist = getLocalStorage('user_email');
                    if (!isEmailAlreadyExist && userData?.userMetadata.email) {
                        setLocalStorage('user_email', userData.userMetadata.email);
                    }
                }
            } catch (err) {
                const error = err as AxiosError;

                if (error.response) {
                    toast.error('Failed to fetch logged in user details', {
                        description: (error.response.data as AxiosError)?.message || 'An error occurred',
                    });
                } else if (error.request) {
                    toast.error('Network error', {
                        description: 'No response from server. Please check your connection.',
                    });
                } else {
                    toast.error('Unexpected error', {
                        description: error.message,
                    });
                }
            }
        })();
    }, [user?.userMetadata.email, user?.userMetadata.name]);
    return <UserContext.Provider value={{ user, isAuthenticated }}>{children}</UserContext.Provider>;
};
