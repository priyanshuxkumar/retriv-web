import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import AxiosInstance from '@/utils/axiosInstance';
import { Check } from 'lucide-react';
import { Separator } from '../ui/separator';

export interface PlanProps {
    id: string;
    name: string;
    price: number;
    billingPeriod: string;
    features: string[];
}

export interface ActivePlanProp {
    planId: string;
    name: string;
    price: number;
    billingPeriod: string;
}

const useFetchUserActivePlan = () => {
    const [activePlan, setActivePlan] = useState<ActivePlanProp | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        (async () => {
            try {
                const response = await AxiosInstance.get('/api/v1/plans/active', {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    withCredentials: true,
                });

                if (response.data.success === true) {
                    setActivePlan(response.data.data);
                }
            } catch (err: unknown) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    return { activePlan, loading };
};

export default function SettingsBillingTab() {
    const router = useRouter();
    const { activePlan, loading } = useFetchUserActivePlan();
    const [plans, setPlans] = useState<PlanProps[]>([]);

    useEffect(() => {
        const fecthPlans = async () => {
            try {
                const response = await AxiosInstance.get('/api/v1/plans');
                if (response.data.success === true) {
                    setPlans(response.data.data);
                }
            } catch (err: unknown) {
                console.error(err);
            }
        };
        fecthPlans();
    }, []);
    return (
        <div className="my-8 flex flex-col gap-5">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {plans.map((plan) => (
                    <Card key={plan.id}>
                        <CardHeader className="text-center pb-4">
                            <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                            <div className="mt-2">
                                <span className="text-4xl font-bold text-gray-900 dark:text-white">₹ {plan.price}</span>
                                <span className="text-gray-500">/{plan.billingPeriod}</span>
                            </div>
                        </CardHeader>

                        <CardContent className="pt-0">
                            <Separator className="mb-6" />
                            <ul className="space-y-3">
                                {plan.features.map((feature, idx) => (
                                    <li key={idx} className="flex items-start">
                                        <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                                        <span className="text-sm text-gray-700 dark:text-white">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>

                        <CardFooter className="pt-6">
                            <Button
                                onClick={() => router.push(`/checkout/billing/${plan.id}`)}
                                className="w-full bg-gray-900 dark:bg-white text-white dark:text-black hover:bg-gray-800 hover:dark:bg-white/90"
                            >
                                Buy now
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>

            {/* Active Plan Display */}
            {!loading && activePlan?.name && (
                <div className="rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium">{activePlan.name} Plan</p>
                            <p className="text-sm text-muted-foreground">
                                ₹ {activePlan.price}/{activePlan.billingPeriod}, billed monthly
                            </p>
                        </div>
                        <Badge>Active</Badge>
                    </div>
                </div>
            )}
        </div>
    );
}
