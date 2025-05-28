import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import PriceCard from '../PriceCard';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import AxiosInstance from '@/utils/axiosInstance';

interface PlanFeatures {
    title: string;
}

export interface PlanProps {
    id: string;
    name: string;
    price: number;
    features: PlanFeatures[];
}

export default function SettingsBillingTab() {
    const router = useRouter();
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
        <>
            <Card className="border-none shadow-none bg-transparent">
                <CardHeader>
                    <CardTitle>Billing Information</CardTitle>
                    <CardDescription>Manage your subscription and payment methods</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex flex-col justify-center items-center">
                        {plans.map((item) => (
                            <div key={item.id}>
                                <PriceCard {...item} />
                                <Button
                                    onClick={() => router.push(`/checkout/billing/${item.id}`)}
                                    className="mt-4 cursor-pointer h-10 text-base"
                                >
                                    Buy now
                                </Button>
                            </div>
                        ))}
                    </div>

                    <div className="rounded-lg border p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium">Pro Plan</p>
                                <p className="text-sm text-muted-foreground">₹3000/month, billed monthly</p>
                            </div>
                            <Badge>Active</Badge>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </>
    );
}
