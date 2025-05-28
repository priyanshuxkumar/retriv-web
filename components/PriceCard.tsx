import { Check } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { PlanProps } from './Settings/BillingTab';

export default function PriceCard({ name, price, features }: PlanProps) {
    return (
        <Card className="w-full max-w-sm border-2 transition-all hover:shadow-md">
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-bold">{name}</CardTitle>
                    <Badge variant="secondary" className="font-medium">
                        Popular
                    </Badge>
                </div>
                <CardDescription className="pt-4">
                    <span className="text-3xl font-bold">₹{price}</span>
                    <span className="text-muted-foreground"> / month</span>
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-3 pt-2">
                    {features.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                            <div className="rounded-full bg-primary/10 p-1">
                                <Check className="h-4 w-4 text-primary" strokeWidth={3} />
                            </div>
                            <span className="text-sm">{item.title}</span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
