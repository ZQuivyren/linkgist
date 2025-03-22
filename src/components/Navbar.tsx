
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Dashboard", path: "/dashboard" },
    { name: "Analytics", path: "/analytics" },
  ];

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        isScrolled
          ? "bg-white/80 backdrop-blur-lg border-b shadow-sm"
          : "bg-transparent"
      )}
    >
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link
            to="/"
            className="flex items-center gap-2 font-semibold text-xl"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="relative h-8 w-8 rounded-md bg-brand-blue">
                <div className="absolute inset-0 flex items-center justify-center text-white font-bold">
                  L
                </div>
              </div>
            </motion.div>
            <span>linkgist</span>
          </Link>

          <nav className="hidden md:flex gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-brand-blue relative",
                  location.pathname === link.path
                    ? "text-brand-blue"
                    : "text-muted-foreground"
                )}
              >
                {link.name}
                {location.pathname === link.path && (
                  <motion.span
                    layoutId="navbar-indicator"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-brand-blue"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </Link>
            ))}
          </nav>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <Link to="/login">
            <Button variant="outline" size="sm">
              Log in
            </Button>
          </Link>
          <Link to="/login">
            <Button size="sm">Sign up</Button>
          </Link>
        </div>

        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2"
          aria-label="Toggle menu"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {isMobileMenuOpen ? (
              <path
                d="M18 6L6 18M6 6L18 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ) : (
              <path
                d="M4 6H20M4 12H20M4 18H20"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      <motion.div
        initial={false}
        animate={{ height: isMobileMenuOpen ? "auto" : 0, opacity: isMobileMenuOpen ? 1 : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={`md:hidden overflow-hidden ${isScrolled ? "bg-white/80 backdrop-blur-lg" : "bg-white"}`}
      >
        <div className="container py-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`p-2 ${location.pathname === link.path ? "text-brand-blue" : "text-muted-foreground"}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          <div className="flex flex-col gap-2 mt-2">
            <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
              <Button variant="outline" className="w-full" size="sm">
                Log in
              </Button>
            </Link>
            <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
              <Button className="w-full" size="sm">
                Sign up
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>
    </header>
  );
};

export default Navbar;
