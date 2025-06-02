import { Button } from '@/components/ui/button';
import Image from 'next/image';
import heroImg from '@/public/hero.png';
import { alegreya } from './fonts/fonts';
import Link from 'next/link';

export function HeroSection() {
    return (
        <section className="relative min-h-screen pt-32 pb-16 overflow-hidden">
            <div className="relative z-10 max-w-6xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h1 className={`text-4xl md:text-6xl font-bold mb-6 tracking-tight ${alegreya.className}`}>
                        Make your website smarter.
                    </h1>
                    <p className="text-gray-800 dark:text-white text-lg mb-8 max-w-2xl mx-auto">
                        Transform your website content into an intelligent assistant that answers customer questions
                        accurately and instantly.
                    </p>
                    <div className="flex gap-4 justify-center">
                        <Link href={'/signup'}>
                            <Button variant="secondary" className="bg-[#556B2F] text-white hover:bg-[#4A5F25]">
                                Get started
                            </Button>
                        </Link>
                    </div>
                </div>
                <div className="relative mx-auto rounded-2xl overflow-hidden shadow-2xl ring-3 sm:ring-6 ring-[#556B2F] ring-offset-2">
                    <div className="relative block">
                        <Image
                            src={heroImg}
                            alt="hero-section-image"
                            width={1920}
                            height={1080}
                            className="w-full h-auto block"
                            priority
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
