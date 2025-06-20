import { AlertTriangle } from 'lucide-react';
import { Badge } from './ui/badge';

export default function SubscriptionCancelled() {
    return (
        <div className="w-full">
            <Badge
                variant="destructive"
                className="h-14 rounded-xl text-sm w-full font-medium bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors duration-200 flex items-center justify-center gap-3 shadow-sm dark:shadow-red-900/20"
            >
                <div className="flex flex-col items-center gap-1">
                    <div className="flex gap-2 items-center">
                        <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                        <span className="font-semibold">Subscription Cancelled</span>
                    </div>
                    <span className="text-xs font-normal opacity-90">
                        Your subscription will remain active until the end of your billing period
                    </span>
                </div>
            </Badge>
        </div>
    );
}
