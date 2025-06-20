import type { Metadata } from 'next';
import './globals.css';
import { Geist, Geist_Mono } from 'next/font/google';
import { notoSans } from '@/components/fonts/fonts';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from '../components/providers/themeProvider';
import GoogleProviderWrapper from '../components/providers/googleProvider';
import { ThemeWatcher } from '@/components/ThemeWatcher';

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
});

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
});

export const metadata: Metadata = {
    title: 'Retriv',
    description: 'No Code Personal Agent',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${notoSans.className} ${geistSans.variable} ${geistMono.variable} antialiased`}>
                <GoogleProviderWrapper>
                    <ThemeProvider>
                        <ThemeWatcher />
                        {children}
                        <Toaster />
                    </ThemeProvider>
                </GoogleProviderWrapper>
            </body>
        </html>
    );
}
