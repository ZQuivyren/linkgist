
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center max-w-md px-4"
      >
        <div className="rounded-full mx-auto bg-primary/10 w-20 h-20 flex items-center justify-center mb-6">
          <span className="text-4xl font-bold text-brand-blue">404</span>
        </div>
        <h1 className="text-3xl font-bold mb-4">Page not found</h1>
        <p className="text-muted-foreground mb-8">
          Sorry, we couldn't find the page you're looking for. It might have been moved, deleted, or never existed.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button variant="outline" asChild>
            <Link to="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go back
            </Link>
          </Button>
          <Button asChild>
            <Link to="/">
              <Home className="h-4 w-4 mr-2" />
              Return to home
            </Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;
