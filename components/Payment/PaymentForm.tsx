/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import AxiosInstance from '@/utils/axiosInstance';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PaymentFormSchema } from '@/types';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import Script from 'next/script';
import { useParams } from 'next/navigation';
import { ParamValue } from 'next/dist/server/request/params';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { PhoneInput } from '../PhoneInput';
import { AxiosError } from 'axios';
import { toast } from 'sonner';

declare global {
    interface Window {
        Razorpay: any;
    }
}

interface RazorpayResponse {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
}

const useFetchPlanDetails = (id: ParamValue) => {
    const [amount, setAmount] = useState<number | null>(10);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await AxiosInstance.get(`/api/v1/plans/${id}`, {
                    withCredentials: true,
                });
                if (response.data.success == true) {
                    setAmount(response.data.data.amount);
                }
            } catch (err: unknown) {
                const error = err as AxiosError;

                if (error.response) {
                    toast.error('Failed to fetch plans', {
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
        };
        fetchData();
    }, [id]);
    return {
        amount,
    };
};

export default function PaymentForm() {
    const { id } = useParams(); // Plan Id
    const { amount } = useFetchPlanDetails(id);
    const router = useRouter();

    const [isPaymentHappening, setIsPaymentHappening] = useState<boolean>(false);

    const form = useForm<z.infer<typeof PaymentFormSchema>>({
        resolver: zodResolver(PaymentFormSchema),
        defaultValues: {
            name: '',
            email: '',
            phone: '',
        },
    });
    const termsAccepted = form.watch('terms');

    const handleCreateOrder = async () => {
        try {
            const response = await AxiosInstance.post(
                '/api/payment/checkout',
                {
                    planId: id,
                    currency: 'INR',
                },
                {
                    withCredentials: true,
                },
            );
            if (response.data.success == true) {
                return response.data.data.order_id;
            }
        } catch (err: unknown) {
            throw err;
        }
    };

    async function onSubmit(values: z.infer<typeof PaymentFormSchema>) {
        setIsPaymentHappening(true);
        const orderId = await handleCreateOrder();
        try {
            if (!window.Razorpay) {
                alert('Razorpay SDK failed to load. Please check your internet connection.');
                return;
            }

            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: amount,
                currency: 'INR',
                name: 'Retriv',
                description: 'Payment for subscription',
                order_id: orderId,
                handler: async function (response: RazorpayResponse) {
                    handlePaymentSuccess(response);
                },
                prefill: {
                    name: values.name,
                    email: values.email,
                    contact: values.phone,
                },
                notes: {
                    address: 'Customer Address',
                },
                theme: {
                    color: '#F9F6F0',
                },
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.open();

            paymentObject.on('payment.failed', function (response: any) {
                alert('Payment failed. Please try again. Error: ' + response.error.description);
            });
        } catch (err: unknown) {
            const error = err as AxiosError;

            if (error.response) {
                toast.error('Failed to payment of subscription', {
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
            setIsPaymentHappening(false);
        }
    }

    const handlePaymentSuccess = async (response: RazorpayResponse) => {
        try {
            const verificationResponse = await AxiosInstance.post(
                '/api/payment/verify',
                {
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_signature: response.razorpay_signature,
                },
                {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                },
            );
            if (verificationResponse.data.success) {
                alert('Payment successful');
                router.push('/settings');
            } else {
                alert('Payment verification failed');
            }
        } catch (error) {
            console.error('Error verifying payment:', error);
            alert('Error verifying payment');
        }
    };
    return (
        <>
            <Script id="razorpay-checkout-js" src="https://checkout.razorpay.com/v1/checkout.js" />
            <div className="space-y-6">
                <div>
                    <h2 className="text-3xl font-bold text-black dark:text-white">Confirm and Pay</h2>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mb-4" aria-label="Payment form">
                        <div className="space-y-2">
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
                        </div>

                        <div className="space-y-2">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-base">Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="email"
                                                placeholder="John@example.com"
                                                aria-label="Email"
                                                autoComplete="email"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="space-y-2">
                            <FormField
                                control={form.control}
                                name="phone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-base">Phone Number</FormLabel>
                                        <FormControl>
                                            <PhoneInput
                                                placeholder="9999999999"
                                                value={field.value}
                                                onChange={field.onChange}
                                                defaultCountry="IN"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="flex items-center space-x-2 pt-2">
                            <FormField
                                control={form.control}
                                name="terms"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-start space-x-2 space-y-0">
                                        <FormControl>
                                            <Checkbox
                                                id="terms"
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                        <FormLabel htmlFor="terms" className="text-sm leading-none gap-1">
                                            Accept{' '}
                                            <Link href="/legal/terms-of-services" className="text-blue-400 underline">
                                                Terms
                                            </Link>{' '}
                                            and{' '}
                                            <Link href="/legal/privacy-policy" className="text-blue-400 underline">
                                                Privacy
                                            </Link>
                                        </FormLabel>
                                    </FormItem>
                                )}
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-[#556B2F] hover:bg-[#4A5F25] text-white"
                            disabled={isPaymentHappening || !termsAccepted}
                        >
                            PAY NOW
                        </Button>
                    </form>
                </Form>

                <p className="mt-4 text-center text-sm text-gray-500">
                    By confirming your subscription, you allow the company to charge you for future payments in
                    accordance with their terms. You can always cancel your subscription.
                </p>

                <div className="mt-4 flex justify-center space-x-4 text-xs text-gray-500">
                    <Link href="/legal/terms-of-services" className="hover:underline">
                        Terms
                    </Link>
                    <Link href="/legal/privacy-policy" className="hover:underline">
                        Privacy
                    </Link>
                </div>
            </div>
        </>
    );
}
