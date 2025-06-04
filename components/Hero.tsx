import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

export function HeroSection() {
    return (
        <section className="relative py-24 overflow-hidden">
            <div className="z-10 max-w-6xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">Make your website smarter.</h1>
                    <p className="text-gray-800 dark:text-white text-xl mb-8 max-w-2xl mx-auto">
                        Transform your website content into an intelligent assistant that answers customer questions
                        accurately and instantly.
                    </p>
                    <div className="flex gap-4 justify-center">
                        <Link
                            href={'/signup'}
                            className="inline-flex h-11 items-center gap-2 px-3 rounded-lg bg-secondary text-secondary-foreground border border-input hover:border-ring transition-all"
                        >
                            <Button variant="secondary" className="border-none shadow-none text-lg">
                                Try now
                                <ArrowUpRight />
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
