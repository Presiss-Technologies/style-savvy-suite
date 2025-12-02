import { ReactNode } from 'react';
import { Header } from './Header';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen gradient-warm">
      <Header />
      <main className="container py-6">
        {children}
      </main>
    </div>
  );
};
