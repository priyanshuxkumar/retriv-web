import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { alegreya } from './fonts/fonts';

export function Header() {
    return (
        <header className="fixed top-0 left-0 right-0 z-50">
            <div className="flex items-center justify-between px-6 py-4 bg-[#F9F6F0] dark:bg-black border-b">
                <div className="flex items-center gap-2">
                    <Link href="/" className={`flex items-center gap-3 ${alegreya.className}`}>
                        <span className="font-bold text-2xl">Retriv</span>
                    </Link>
                </div>
                <nav className="hidden md:flex items-center gap-8">
                    <Link href="#faq" className="text-base transition-colors">
                        Faq
                    </Link>
                    <Link href="#pricing" className="text-base transition-colors">
                        Pricing
                    </Link>
                </nav>
                <Link href={'/signup'}>
                    <Button variant="secondary" className="bg-[#556B2F] text-white hover:bg-[#4A5F25]">
                        Get started
                    </Button>
                </Link>
            </div>
        </header>
    );
}
