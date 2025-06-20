import { Badge } from '@/components/ui/badge';
import { useEffect, useState } from 'react';
import AxiosInstance from '@/utils/axiosInstance';
import { AxiosError } from 'axios';
import { toast } from 'sonner';
import BuySubscription from '../BuySubscription';
import { Button } from '../ui/button';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '../ui/alert-dialog';
import NoDataFound from '../NoDataFound';
import Loader from '../Loader';
import SubscriptionCancelled from '../SubscriptionCancelled';

export interface ActivePlanProp {
    planId: string;
    name: string;
    price: number;
    billingPeriod: string;
    userCancelledSubscription: boolean;
}

const useFetchUserActivePlan = () => {
    const [userCancelledSubscription, setUserCancelledSubscription] = useState<boolean | null>(null);
    const [activePlan, setActivePlan] = useState<ActivePlanProp | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            try {
                const response = await AxiosInstance.get('/api/v1/plans/active', {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    withCredentials: true,
                });

                if (response.data.success === true) {
                    if (response.data.data.planId) {
                        setActivePlan(response.data.data);
                        setUserCancelledSubscription(response.data.data.userCancelledSubscription);
                    }
                }
            } catch (err: unknown) {
                const error = err as AxiosError;

                const errMsg = (error.response?.data as AxiosError)?.message || 'Something went wrong';
                const statusCode = error.response?.status;

                if (statusCode === 402) {
                    // Payment required for subscription
                    setActivePlan(null);
                    setUserCancelledSubscription(false);
                    return;
                }

                if (error.response) {
                    setError(errMsg || 'Failed to fetch active plan details');
                } else if (error.request) {
                    setError('No response from server. Please check your connection.');
                } else {
                    setError('Something went wrong');
                }
            } finally {
                setIsLoading(false);
            }
        })();
    }, []);

    return {
        activePlan,
        isLoading,
        userCancelledSubscription,
        error,
    };
};

export default function SettingsBillingTab() {
    const { activePlan, isLoading, userCancelledSubscription, error } = useFetchUserActivePlan();
    const [subscriptionCancelling, setSubscriptionCancelling] = useState<boolean>(false);

    const handleCancelSubscription = async () => {
        setSubscriptionCancelling(true);
        try {
            const response = await AxiosInstance.delete('/api/payment/subscription/cancel', {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true,
            });
            if (response.data.success === true) {
                toast(response.data.message);
            }
        } catch (err: unknown) {
            const error = err as AxiosError;

            if (error.response) {
                toast.error('Failed to cancel subscription', {
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
            setSubscriptionCancelling(false);
        }
    };

    if (isLoading) {
        return (
            <div className="fixed top-0 left-0 flex justify-center items-center w-screen h-screen">
                <Loader size="30" strokeWidth="2" />
            </div>
        );
    }

    if (error) {
        return <NoDataFound content={error} />;
    }
    return (
        <div className="my-8 flex flex-col gap-5 px-4">
            {/* Active Plan Display */}
            {!isLoading && activePlan?.name && (
                <>
                    <div className="rounded-lg border p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium">{activePlan.name} Plan</p>
                                <p className="text-sm text-muted-foreground">
                                    ₹ {activePlan.price}/{activePlan.billingPeriod.toLowerCase()}, Billed monthly
                                </p>
                            </div>
                            <Badge>Active</Badge>
                        </div>
                    </div>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            {!userCancelledSubscription && (
                                <Button variant="outline" className="w-full">
                                    {subscriptionCancelling ? 'Please wait...' : 'Cancel Subscription'}
                                </Button>
                            )}
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Cancel your subscription?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Are you sure you want to cancel your subscription? You will lose access to premium
                                    features at the end of your current billing cycle.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={handleCancelSubscription}
                                    className="bg-destructive hover:bg-destructive/90"
                                >
                                    Confirm
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </>
            )}

            {/* Display if the user Cancelled the subscription */}
            {userCancelledSubscription === true && <SubscriptionCancelled />}

            {/* Fallback to show BuySubscription */}
            {userCancelledSubscription === false && !activePlan?.name && <BuySubscription />}
        </div>
    );
}
