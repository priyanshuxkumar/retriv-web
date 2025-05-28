import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#F9F6F0] px-4 py-16 text-center">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-medium text-black mb-8">
                    Oops, we couldn&apos;t find that page.
                </h1>

                <p className="text-lg text-gray-700 mb-10 max-w-xl mx-auto">
                    The page you&apos;re looking for doesnt exist or has been moved to another location.
                </p>

                <Link
                    href="/agent"
                    className="inline-block bg-[#556B2F] hover:bg-[#4A5F25] text-white font-medium px-8 py-3 rounded-md transition-colors"
                >
                    Go back to the homepage
                </Link>
            </div>
        </div>
    );
}
