'use client';

import { useEffect } from 'react';
import { useTheme } from 'next-themes';
import { getLocalStorage, setLocalStorage } from '@/lib/storage';

export function ThemeWatcher() {
    const { theme, systemTheme } = useTheme();

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const selectedTheme = theme === 'system' ? systemTheme : theme;
            const isDarkThemeSet = getLocalStorage<boolean>('isDarkTheme');
            if (isDarkThemeSet === null && selectedTheme) {
                setLocalStorage('isDarkTheme', selectedTheme === 'dark');
            }
        }
    }, [theme, systemTheme]);

    return null;
}
