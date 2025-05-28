import PaymentForm from '@/components/Payment/PaymentForm';
import { ChevronLeft } from 'lucide-react';

export default function Page() {
    return (
        <div className="flex min-h-screen flex-col md:flex-row">
            <div className="flex flex-col justify-center bg-zinc-900 p-8 text-white md:w-1/2">
                <div className="mx-auto max-w-md">
                    <button className="mb-8 flex items-center text-sm font-medium text-zinc-400 hover:text-white">
                        <ChevronLeft />
                        Back
                    </button>
                    <h2 className="text-xl font-medium">Subscribe to Retriv Pro</h2>
                    <div className="mt-4 flex items-baseline">
                        <span className="text-4xl font-bold">₹ 3000.00</span>
                        <span className="ml-2 text-sm text-zinc-400">per month</span>
                    </div>

                    <div className="mt-8 space-y-4 border-b border-zinc-800 pb-8">
                        <div className="flex justify-between">
                            <span>Retriv Pro</span>
                            <span>₹ 3000.00</span>
                        </div>
                        <div className="text-sm text-zinc-400">Billed monthly</div>
                    </div>

                    <div className="mt-4 flex justify-between pb-8">
                        <span>Subtotal</span>
                        <span>₹ 3000.00</span>
                    </div>
                </div>
            </div>

            <div className="flex flex-col justify-center p-8 md:w-1/2 bg-[#F9F6F0]">
                <div className="mx-auto max-w-md">
                    <PaymentForm />
                </div>
            </div>
        </div>
    );
}
