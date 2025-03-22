
import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import { useLocation } from "react-router-dom";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [mounted, setMounted] = useState(false);
  const location = useLocation();

  // For smooth mounting transitions
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className={`flex-grow ${mounted ? "animate-fade-in" : "opacity-0"}`} key={location.pathname}>
        {children}
      </main>
      <footer className="mt-auto py-6 text-center text-sm text-muted-foreground">
        <div className="container mx-auto px-4">
          <p>© {new Date().getFullYear()} linkgist. All rights reserved.</p>
          <div className="mt-2 flex justify-center space-x-4">
            <a href="#" className="hover:text-brand-blue transition-colors">
              Terms
            </a>
            <a href="#" className="hover:text-brand-blue transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-brand-blue transition-colors">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
