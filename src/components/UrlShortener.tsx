
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Link } from "lucide-react";

const UrlShortener = () => {
  const [url, setUrl] = useState("");
  const [customSlug, setCustomSlug] = useState("");
  const [shortenedUrl, setShortenedUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url) {
      toast.error("Please enter a URL to shorten");
      return;
    }
    
    // Validate URL
    try {
      new URL(url);
    } catch (error) {
      toast.error("Please enter a valid URL");
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call
    try {
      // In a real implementation, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate fake shortened URL
      const domain = "linkgist.lovable.app";
      const slug = customSlug || Math.random().toString(36).substring(2, 6);
      setShortenedUrl(`https://${domain}/${slug}`);
      
      toast.success("URL shortened successfully!");
    } catch (error) {
      toast.error("Failed to shorten URL. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCopy = () => {
    navigator.clipboard.writeText(shortenedUrl);
    toast.success("Copied to clipboard!");
  };
  
  const handleReset = () => {
    setShortenedUrl("");
    setUrl("");
    setCustomSlug("");
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      <div className="glass rounded-2xl p-6 md:p-8">
        <AnimatePresence mode="wait">
          {!shortenedUrl ? (
            <motion.form 
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              <div className="space-y-4">
                <div>
                  <label htmlFor="url" className="block text-sm font-medium mb-1">
                    Enter URL
                  </label>
                  <div className="relative">
                    <Link className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="url"
                      placeholder="https://example.com/very-long-url"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="customSlug" className="block text-sm font-medium mb-1">
                    Custom slug (optional)
                  </label>
                  <div className="flex items-center space-x-2">
                    <div className="rounded-md bg-muted px-3 py-2 text-sm">
                      linkgist.lovable.app/
                    </div>
                    <Input
                      id="customSlug"
                      placeholder="my-custom-url"
                      value={customSlug}
                      onChange={(e) => setCustomSlug(e.target.value)}
                      className="max-w-[200px]"
                    />
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Shortening...
                  </span>
                ) : (
                  "Shorten URL"
                )}
              </Button>
            </motion.form>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-center space-y-6"
            >
              <div className="rounded-full mx-auto bg-primary/10 w-16 h-16 flex items-center justify-center mb-4">
                <Link className="h-8 w-8 text-brand-blue" />
              </div>
              
              <h3 className="text-xl font-semibold">URL Shortened Successfully!</h3>
              
              <div className="bg-muted rounded-lg p-4 flex items-center justify-between">
                <span className="font-medium text-brand-blue truncate mr-2">{shortenedUrl}</span>
                <Button size="icon" variant="ghost" onClick={handleCopy}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="pt-2 flex justify-center space-x-4">
                <Button variant="outline" onClick={handleReset}>
                  Shorten another URL
                </Button>
                <Button onClick={handleCopy}>
                  Copy URL
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default UrlShortener;
