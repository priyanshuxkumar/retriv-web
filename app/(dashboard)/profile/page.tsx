'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useUser } from '@/context/user.context';
import { getLocalStorage, resetLocalStorage } from '@/lib/storage';
import AxiosInstance from '@/utils/axiosInstance';
import { AxiosError } from 'axios';
import { User } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function Page() {
    const { user } = useUser();
    const [isUpdating, setIsUpdating] = useState<boolean>(false);
    const userEmail: string | null = getLocalStorage('user_email');
    const userFullName: string | null = getLocalStorage('user_fullname');

    const [formData, setFormData] = useState({
        fullName: userFullName,
        email: userEmail,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleReset = () => {
        setFormData({
            fullName: user?.userMetadata.name || '',
            email: user?.email || '',
        });
    };

    const handleSave = async () => {
        setIsUpdating(true);
        try {
            const response = await AxiosInstance.post(
                '/api/v1/user',
                {
                    name: formData.fullName,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    withCredentials: true,
                },
            );
            if (response.data.success === true) {
                resetLocalStorage('user_fullname');
                toast.success(response.data.message);
            }
        } catch (err: unknown) {
            const error = err as AxiosError;

            if (error.response) {
                toast.error('Failed to fetch active plan details', {
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
        } finally {
            setIsUpdating(false);
        }
    };
    return (
        <div className="flex items-center justify-between mx-4 md:mx-26 md:mt-12">
            <div className="w-full">
                {/* Header */}
                <div className="flex items-center gap-3 mb-8">
                    <User className="h-6 w-6 text-black dark:text-white" />
                    <h1 className="text-xl font-semibold text-black dark:text-white">Profile Information</h1>
                </div>

                {/* Body  */}
                <div className="mt-6 space-y-4">
                    {/* Profile Card */}
                    <Card className="mb-6 border bg-[#EEECE8] dark:bg-muted shadow-none">
                        <CardContent className="px-6">
                            <div className="flex items-center gap-4">
                                <Avatar className="h-15 w-15 rounded-lg">
                                    <AvatarImage src={user?.userMetadata.avatarUrl} />
                                    <AvatarFallback className="text-xl rounded-lg bg-gray-200 text-gray-700 font-medium">
                                        {user?.userMetadata.name?.[0]?.toUpperCase() || 'U'}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <h2 className="text-lg font-semibold text-black dark:text-white">
                                        {user?.userMetadata.name}
                                    </h2>
                                    <p className="text-black dark:text-neutral-400">{user?.email}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    {/* Form Card */}
                    <Card className="border bg-[#EEECE8] dark:bg-muted shadow-none">
                        <CardContent className="px-6 space-y-6">
                            <div className="space-y-2">
                                <label htmlFor="fullName" className="text-sm font-medium text-black dark:text-white">
                                    Full Name
                                </label>
                                <Input
                                    id="fullName"
                                    name="fullName"
                                    value={formData.fullName || ''}
                                    onChange={handleChange}
                                    className="mt-2 h-11 border-gray-300 focus:border-[#556B2F] focus:ring-[#556B2F]"
                                    placeholder="Enter your full name"
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="email" className="text-sm font-medium text-black dark:text-white">
                                    Email
                                </label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formData.email || ''}
                                    onChange={handleChange}
                                    disabled
                                    className="mt-2 h-11 border-gray-300 focus:border-[#556B2F] focus:ring-[#556B2F]"
                                    placeholder="Enter your email"
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <Button
                                    onClick={handleSave}
                                    className="bg-[#556B2F] hover:bg-[#4A5F25] text-white px-5 h-11"
                                    disabled={formData.fullName == userFullName}
                                >
                                    {isUpdating ? 'Updating' : 'Save Changes'}
                                </Button>
                                <Button variant="outline" onClick={handleReset} className="px-5 h-11">
                                    Reset
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
