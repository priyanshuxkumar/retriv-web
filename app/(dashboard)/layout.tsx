import Sidebar from "@/components/Sidebar";
import { UserProvider } from "@/context/user.context";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <UserProvider>
      <div className="flex">
        {/* Sidebar */}
        <nav>
          <aside className="w-64 flex flex-col justify-between h-screen border-r border-slate-6 p-4">
            <Sidebar />
          </aside>
        </nav>

        {/* Main Content */}
        <main className="w-full">
          <div className="h-[calc(100vh-60px)] overflow-auto">{children}</div>
        </main>
      </div>
    </UserProvider>
  );
}
