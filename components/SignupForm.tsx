'use client';

import Link from 'next/link';
import { Loader } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AxiosInstance from '@/utils/axiosInstance';
import GoogleIcon from './Icons/GoogleIcon';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { SignupFormSchema } from '@/types';

export function SignupForm() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const form = useForm<z.infer<typeof SignupFormSchema>>({
        resolver: zodResolver(SignupFormSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
        },
    });

    async function onSubmit(values: z.infer<typeof SignupFormSchema>) {
        try {
            setIsSubmitting(true);
            const response = await AxiosInstance.post(
                '/api/v1/auth/signup',
                {
                    name: values.name,
                    email: values.email,
                    password: values.password,
                },
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true,
                },
            );
            if (response.data.success === true) {
                toast.success('Login Successful', {
                    description: 'Redirecting to emails...',
                });
                router.push('/agent');
            }
        } catch (err: unknown) {
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    }
    return (
        <div className="flex justify-center items-center gap-6">
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="flex flex-col items-start text-center mb-2">
                    <h1 className="text-start text-2xl font-bold">Create a Retriv account</h1>
                </div>

                {/* Sign up link */}
                <div className="text-start text-base mb-8">
                    Already have an account?{' '}
                    <Link href="/login" className="underline underline-offset-4 text-blue-500 hover:underline">
                        Login
                    </Link>
                </div>

                {/* Form */}
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mb-4" aria-label="Login form">
                        {/* Email Field */}
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">Name</FormLabel>
                                    <FormControl>
                                        <Input type="text" placeholder="John Doe" aria-label="Name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Email Field */}
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="email"
                                            placeholder="john@example.com"
                                            autoComplete="email"
                                            aria-label="Email"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Password Field with Toggle */}
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            placeholder="••••••••"
                                            autoComplete="current-password"
                                            aria-label="Password"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            className="w-full h-10 text-base bg-[#556B2F] hover:bg-[#4A5F25] focus:ring-2 focus:ring-offset-2 focus:ring-[#556B2F]"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <span className="flex items-center gap-2">
                                    <Loader className="animate-spin" /> Please wait
                                </span>
                            ) : (
                                'Create account'
                            )}
                        </Button>
                    </form>
                </Form>

                {/* Divider */}
                <div className="my-6 flex items-center">
                    <div className="flex-grow border-t border-gray-200" />
                    <span className="mx-4 text-xs text-gray-400">OR</span>
                    <div className="flex-grow border-t border-gray-200" />
                </div>

                {/* Google Login */}
                <Button
                    variant="outline"
                    className="bg-white hover:bg-white/80 h-10 text-base w-full font-semibold flex items-center gap-2 border-gray-300"
                    type="button"
                    aria-label="Login with Google"
                >
                    <GoogleIcon />
                    <span>Sign up with Google</span>
                </Button>

                {/* Terms */}
                <div className="text-balance text-center text-xs text-muted-foreground mt-4">
                    By signing up, you agree to our{' '}
                    <Link href="/legal/terms-of-services" className="text-blue-500 hover:underline">
                        Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link href="/legal/privacy-policy" className="text-blue-500 hover:underline">
                        Privacy Policy
                    </Link>
                    .
                </div>
            </div>
        </div>
    );
}
