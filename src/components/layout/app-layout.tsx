
import Link from "next/link";
import { SidebarNavigation } from './sidebar-navigation';
import { UserNav } from './user-nav';
import { MobileSidebar } from './mobile-sidebar';

interface AppLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

export default async function AppLayout({
  children,
  title = "Dashboard",
  description = "Production Management System"
}: AppLayoutProps) {

  return (
    <div className="min-h-screen w-full flex flex-col bg-background">
      {/* Top Navigation Header - Original Style */}
      <header className="sticky top-0 z-30 bg-card border-b border-border shadow-sm">
        <div className="flex h-14 items-center justify-between px-4">
          {/* Left side - Logo and Mobile Menu */}
          <div className="flex items-center space-x-4">
            {/* Mobile Navigation */}
            <div className="md:hidden">
              <MobileSidebar />
            </div>

            {/* Logo and Brand */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <span className="font-bold text-lg text-foreground hidden sm:block">BSMcarton</span>
              <span className="font-bold text-sm text-foreground sm:hidden">BSM</span>
            </Link>
          </div>

          {/* Desktop Navigation - Hidden on mobile */}
          <nav className="hidden items-center space-x-6 text-sm font-medium md:flex">
            <SidebarNavigation />
          </nav>

          {/* Right side - User menu */}
          <div className="flex items-center space-x-2">
            <UserNav name="BSMcarton" email={null} />
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 bg-background min-h-screen">
        <div className="p-3 sm:p-4 md:p-6 lg:p-8">
          <div className="mx-auto w-full max-w-7xl">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
