import { ReactNode, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { 
  BarChart3, 
  Settings, 
  MessageSquare, 
  Mail, 
  Layers, 
  ShieldCheck, 
  Home,
  Star,
  Menu,
  X,
  ChevronRight,
  Store
} from 'lucide-react';
import { useMobile } from '../../hooks/use-mobile';
import { NotificationCenter } from '../ui/notification-center';

type NavItemProps = {
  to: string;
  icon: ReactNode;
  label: string;
  isActive?: boolean;
  onClick?: () => void;
};

const NavItem = ({ to, icon, label, isActive, onClick }: NavItemProps) => {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive: routeActive }) => cn(
        'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
        'hover:bg-sidebar-accent/10',
        (isActive || routeActive) 
          ? 'bg-sidebar-accent/15 text-sidebar-accent' 
          : 'text-sidebar-foreground/80'
      )}
    >
      <span className="flex-shrink-0 w-5 h-5">{icon}</span>
      <span>{label}</span>
    </NavLink>
  );
};

type AppLayoutProps = {
  children: ReactNode;
};

export function AppLayout({ children }: AppLayoutProps) {
  const { pathname } = useLocation();
  const isMobile = useMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  const navigation = [
    { to: '/', icon: <Home size={20} />, label: 'Dashboard' },
    { to: '/store-setup', icon: <Store size={20} />, label: 'Store Setup' },
    { to: '/reviews', icon: <Star size={20} />, label: 'Reviews Manager' },
    { to: '/qa', icon: <MessageSquare size={20} />, label: 'Q&A Engine' },
    { to: '/campaigns', icon: <Mail size={20} />, label: 'Email Campaigns' },
    { to: '/widgets', icon: <Layers size={20} />, label: 'Widget Builder' },
    { to: '/analytics', icon: <BarChart3 size={20} />, label: 'Analytics' },
    { to: '/moderation', icon: <ShieldCheck size={20} />, label: 'Moderation' },
    { to: '/settings', icon: <Settings size={20} />, label: 'Settings' },
  ];

  return (
    <div className="flex min-h-screen">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && isMobile && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={cn(
          "bg-sidebar w-64 flex-shrink-0 border-r border-sidebar-border transition-all duration-300 flex flex-col z-50",
          isMobile && "fixed inset-y-0 left-0 transform",
          isMobile && (sidebarOpen ? "translate-x-0" : "-translate-x-full")
        )}
      >
        {/* Logo and mobile close button */}
        <div className="p-4 flex items-center justify-between border-b border-sidebar-border">
          <Link to="/" className="flex items-center gap-2" onClick={closeSidebar}>
            <div className="w-8 h-8 rounded-md bg-sidebar-accent text-white flex items-center justify-center font-bold">
              TL
            </div>
            <span className="font-semibold text-white">TrustLoop</span>
          </Link>
          {isMobile && (
            <button onClick={closeSidebar} className="text-sidebar-foreground">
              <X size={20} />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto scrollbar-hide">
          {navigation.map((item) => (
            <NavItem 
              key={item.to} 
              to={item.to} 
              icon={item.icon} 
              label={item.label}
              onClick={closeSidebar}
            />
          ))}
        </nav>

        {/* Store info */}
        <div className="p-4 border-t border-sidebar-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-sidebar-foreground/10 flex items-center justify-center">
              <ShieldCheck size={16} className="text-sidebar-foreground/80" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sidebar-foreground text-sm font-medium truncate">Demo Store</p>
              <p className="text-sidebar-foreground/60 text-xs truncate">Free Plan</p>
            </div>
            <ChevronRight size={16} className="text-sidebar-foreground/60" />
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 border-b border-border flex items-center justify-between px-4 sticky top-0 bg-background z-10">
          <div className="flex items-center">
            {isMobile && (
              <button 
                onClick={toggleSidebar}
                className="mr-4 text-foreground p-1 rounded-md hover:bg-secondary"
              >
                <Menu size={20} />
              </button>
            )}
            <h1 className="text-xl font-semibold">
              {navigation.find(item => item.to === pathname)?.label || 'Dashboard'}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <NotificationCenter />
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}