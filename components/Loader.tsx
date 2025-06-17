'use client';

import { LoaderCircle } from 'lucide-react';
import { getLocalStorage } from '@/lib/storage';

interface LoaderProp {
    strokeWidth: string;
    size: string;
}

export default function Loader({ strokeWidth = '2px', size = '1.5px' }: LoaderProp) {
    const isCurrentThemeDark = getLocalStorage('isDarkTheme');
    return (
        <div className="animate-spin">
            <LoaderCircle color={isCurrentThemeDark ? 'white' : 'black'} strokeWidth={strokeWidth} size={size} />
        </div>
    );
}