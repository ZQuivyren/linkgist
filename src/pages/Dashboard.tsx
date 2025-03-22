
import React, { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, SlidersHorizontal } from "lucide-react";
import LinkCard from "@/components/LinkCard";
import UrlShortener from "@/components/UrlShortener";
import QRCode from "@/components/QRCode";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import AnalyticsChart from "@/components/AnalyticsChart";
import { motion } from "framer-motion";
import { getUserLinks } from "@/utils/api";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface LinkData {
  id: string;
  originalUrl: string;
  shortUrl: string;
  createdAt: string;
  expiresAt?: string;
  clicks: number;
  qrCode?: string;
}

const Dashboard = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedQRLink, setSelectedQRLink] = useState<string | null>(null);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [selectedAnalyticsLink, setSelectedAnalyticsLink] = useState<string | null>(null);
  const [isAnalyticsModalOpen, setIsAnalyticsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [links, setLinks] = useState<LinkData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if user is authenticated
    if (!authLoading && !user) {
      navigate("/login");
      return;
    }
    
    if (user) {
      fetchLinks();
    }
  }, [user, authLoading, navigate]);
  
  const fetchLinks = async () => {
    setIsLoading(true);
    try {
      const links = await getUserLinks();
      setLinks(links);
    } catch (error) {
      console.error("Error fetching links:", error);
      toast.error("Failed to fetch your links.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleViewQRCode = (id: string) => {
    const link = links.find((link) => link.id === id);
    if (link) {
      setSelectedQRLink(link.shortUrl);
      setIsQRModalOpen(true);
    }
  };
  
  const handleViewAnalytics = (id: string) => {
    setSelectedAnalyticsLink(id);
    setIsAnalyticsModalOpen(true);
  };

  // Filter links based on active tab
  const getFilteredLinks = () => {
    switch (activeTab) {
      case "recent":
        return [...links].sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ).slice(0, 10);
      case "popular":
        return [...links].sort((a, b) => b.clicks - a.clicks);
      case "expiring":
        return links.filter(link => link.expiresAt && new Date(link.expiresAt) > new Date());
      default:
        return links;
    }
  };
  
  const filteredLinks = getFilteredLinks();
  
  // Handle create modal close and refresh links
  const handleCreateModalClose = (value: boolean) => {
    setIsCreateModalOpen(value);
    if (!value) {
      fetchLinks();
    }
  };
  
  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Your Links</h1>
          <p className="text-muted-foreground">Manage and track all your shortened URLs</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm">
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button size="sm" onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Link
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList>
          <TabsTrigger value="all">All Links</TabsTrigger>
          <TabsTrigger value="recent">Recent</TabsTrigger>
          <TabsTrigger value="popular">Popular</TabsTrigger>
          <TabsTrigger value="expiring">Expiring Soon</TabsTrigger>
        </TabsList>
        
        <div className="mt-6">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <svg className="animate-spin h-8 w-8 text-brand-blue" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          ) : filteredLinks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredLinks.map((link) => (
                <motion.div
                  key={link.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <LinkCard
                    id={link.id}
                    originalUrl={link.originalUrl}
                    shortUrl={link.shortUrl}
                    createdAt={link.createdAt}
                    clicks={link.clicks}
                    expiresAt={link.expiresAt}
                    onViewAnalytics={handleViewAnalytics}
                    onViewQRCode={handleViewQRCode}
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">You don't have any links yet.</p>
              <Button onClick={() => setIsCreateModalOpen(true)}>
                Create your first shortened link
              </Button>
            </div>
          )}
        </div>
      </Tabs>
      
      {/* Create Link Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={handleCreateModalClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Link</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <UrlShortener />
          </div>
        </DialogContent>
      </Dialog>
      
      {/* QR Code Modal */}
      {selectedQRLink && (
        <QRCode
          url={selectedQRLink}
          isOpen={isQRModalOpen}
          onClose={() => setIsQRModalOpen(false)}
        />
      )}
      
      {/* Analytics Modal */}
      <Dialog open={isAnalyticsModalOpen} onOpenChange={setIsAnalyticsModalOpen}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Link Analytics</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {selectedAnalyticsLink && (
              <AnalyticsChart linkId={selectedAnalyticsLink} />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
