'use client';

import { alegreya } from '@/components/fonts/fonts';
import MobileMenuItems from '@/components/MenuItems';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/button';

export default function MobileNavbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
    const handleMenuItemClick = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };
    return (
        <>
            <div
                aria-label="mobile-menu"
                className="lg:hidden sticky top-0 bg-[#F9F6F0] dark:bg-black flex justify-between px-4 py-4 border-b z-50"
            >
                <div className={`flex justify-between px-2 ${alegreya.className}`}>
                    <span className="text-2xl font-semibold">Retriv</span>
                </div>
                <span>
                    <Button variant={'link'} onClick={handleMenuItemClick}>
                        {isMobileMenuOpen ? (
                            <span>
                                <X />
                            </span>
                        ) : (
                            <span>
                                {' '}
                                <Menu />{' '}
                            </span>
                        )}
                    </Button>
                </span>
            </div>
            {isMobileMenuOpen && <MobileMenuItems onItemClick={handleMenuItemClick} />}
        </>
    );
}
