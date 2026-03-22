import type { Metadata } from 'next';
import { DashboardSidebar } from '@/components/dashboard/Sidebar';
import { DashboardTopbar } from '@/components/dashboard/Topbar';

export const metadata: Metadata = {
  title: 'Dashboard',
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-[#080F17] overflow-hidden">
      {/* Sidebar */}
      <DashboardSidebar />

      {/* Main content area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <DashboardTopbar />
        <main className="flex-1 p-6 overflow-y-auto lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
