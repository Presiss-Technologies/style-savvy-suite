import { useApp } from '@/contexts/AppContext';
import { Wifi, WifiOff, Scissors, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';

const navItems = [
  { to: '/', label: 'Dashboard' },
  { to: '/customers', label: 'Customers' },
  { to: '/orders', label: 'Orders' },
];

export const Header = () => {
  const { state } = useApp();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-4">
          <Sheet>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 bg-sidebar text-sidebar-foreground">
              <div className="flex items-center gap-2 mb-8 mt-4">
                <div className="rounded-lg gradient-gold p-2">
                  <Scissors className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="font-display text-xl font-semibold text-sidebar-foreground">TailorPro</span>
              </div>
              <nav className="flex flex-col gap-2">
                {navItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium transition-colors',
                        isActive
                          ? 'bg-sidebar-accent text-sidebar-primary'
                          : 'text-sidebar-foreground hover:bg-sidebar-accent'
                      )
                    }
                  >
                    {item.label}
                  </NavLink>
                ))}
              </nav>
            </SheetContent>
          </Sheet>

          <NavLink to="/" className="flex items-center gap-2">
            <div className="rounded-lg gradient-gold p-2 shadow-glow">
              <Scissors className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-display text-xl font-semibold hidden sm:inline-block">TailorPro</span>
          </NavLink>

          <nav className="hidden lg:flex items-center gap-1 ml-8">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-soft'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <div
            className={cn(
              'flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all',
              state.isOnline
                ? 'bg-success/15 text-success'
                : 'bg-warning/15 text-warning animate-pulse-warning'
            )}
          >
            {state.isOnline ? (
              <>
                <Wifi className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Online</span>
              </>
            ) : (
              <>
                <WifiOff className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Offline</span>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
