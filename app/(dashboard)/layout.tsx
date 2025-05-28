import MobileNavbar from '@/components/MobileNavbar';
import Sidebar from '@/components/Sidebar';
import { UserProvider } from '@/context/user.context';

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <UserProvider>
            <div className="flex w-full">
                {/* Sidebar */}
                <nav className="hidden lg:block bg-[#FDFBF9]">
                    <aside className="w-64 flex flex-col justify-between h-screen border-r border-slate-6 p-4">
                        <Sidebar />
                    </aside>
                </nav>

                {/* Main */}
                <main className="w-full min-h-screen bg-[#F9F6F0]">
                    {/* Mobile view Navbar */}
                    <MobileNavbar />

                    <div className="h-screen overflow-auto">{children}</div>
                </main>
            </div>
        </UserProvider>
    );
}
