
import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, SlidersHorizontal, Settings2 } from "lucide-react";
import LinkCard from "@/components/LinkCard";
import UrlShortener from "@/components/UrlShortener";
import QRCode from "@/components/QRCode";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import AnalyticsChart from "@/components/AnalyticsChart";
import { motion } from "framer-motion";

// Mock data for demo purposes
const MOCK_LINKS = [
  {
    id: "1",
    originalUrl: "https://example.com/very-long-url-that-needs-shortening-for-better-sharing",
    shortUrl: "https://linkgist.lovable.app/abc123",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    clicks: 145,
  },
  {
    id: "2",
    originalUrl: "https://docs.google.com/spreadsheets/d/1234567890/edit",
    shortUrl: "https://linkgist.lovable.app/gdocs",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    clicks: 87,
    expiresAt: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "3",
    originalUrl: "https://github.com/username/project-repository",
    shortUrl: "https://linkgist.lovable.app/gh-repo",
    createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    clicks: 234,
  },
  {
    id: "4",
    originalUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    shortUrl: "https://linkgist.lovable.app/yt-vid",
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    clicks: 1253,
  },
];

const Dashboard = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedQRLink, setSelectedQRLink] = useState<string | null>(null);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [selectedAnalyticsLink, setSelectedAnalyticsLink] = useState<string | null>(null);
  const [isAnalyticsModalOpen, setIsAnalyticsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  
  const handleViewQRCode = (id: string) => {
    const link = MOCK_LINKS.find((link) => link.id === id);
    if (link) {
      setSelectedQRLink(link.shortUrl);
      setIsQRModalOpen(true);
    }
  };
  
  const handleViewAnalytics = (id: string) => {
    setSelectedAnalyticsLink(id);
    setIsAnalyticsModalOpen(true);
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {MOCK_LINKS.map((link) => (
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
        </div>
      </Tabs>
      
      {/* Create Link Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
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
