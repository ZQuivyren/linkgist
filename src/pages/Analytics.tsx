
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AnalyticsChart from "@/components/AnalyticsChart";
import { BarChart, LineChart, PieChart, Smartphone, Globe, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { getUserLinks, getLinkAnalytics } from "@/utils/api";
import { toast } from "sonner";

const AnalyticsStat = ({ icon, label, value, change, changeDirection }: { 
  icon: React.ReactNode, 
  label: string, 
  value: string | number,
  change?: string,
  changeDirection?: 'up' | 'down'
}) => (
  <Card>
    <CardContent className="p-6">
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <div className="text-2xl font-bold">{value}</div>
          {change && (
            <div className={`text-xs flex items-center ${changeDirection === 'up' ? 'text-green-500' : 'text-red-500'}`}>
              {changeDirection === 'up' ? (
                <ArrowUpRight className="h-3 w-3 mr-1" />
              ) : (
                <ArrowUpRight className="h-3 w-3 mr-1 rotate-180" />
              )}
              {change} from last period
            </div>
          )}
        </div>
        <div className="rounded-full p-3 bg-primary/10">
          {icon}
        </div>
      </div>
    </CardContent>
  </Card>
);

const Analytics = () => {
  const [links, setLinks] = useState<any[]>([]);
  const [selectedLink, setSelectedLink] = useState<string>("");
  const [timeRange, setTimeRange] = useState("30d");
  const [isLoading, setIsLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect if not authenticated
    if (!authLoading && !user) {
      toast.error("Please log in to view analytics");
      navigate("/login?redirect=/analytics");
      return;
    }
    
    if (user) {
      fetchLinks();
    }
  }, [user, authLoading, navigate]);
  
  useEffect(() => {
    if (selectedLink && timeRange) {
      fetchAnalyticsData();
    }
  }, [selectedLink, timeRange]);
  
  const fetchLinks = async () => {
    setIsLoading(true);
    try {
      const links = await getUserLinks();
      setLinks(links);
      if (links.length > 0) {
        setSelectedLink(links[0].id);
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching links:", error);
      toast.error("Failed to fetch your links.");
      setIsLoading(false);
    }
  };
  
  const fetchAnalyticsData = async () => {
    setIsLoading(true);
    try {
      const data = await getLinkAnalytics(selectedLink, timeRange);
      setAnalyticsData(data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching analytics data:", error);
      toast.error("Failed to fetch analytics data.");
      setIsLoading(false);
    }
  };
  
  if (isLoading || authLoading) {
    return (
      <div className="container py-8 flex justify-center items-center" style={{ minHeight: "70vh" }}>
        <div className="flex flex-col items-center">
          <svg className="animate-spin h-8 w-8 text-brand-blue mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p>Loading analytics...</p>
        </div>
      </div>
    );
  }
  
  if (links.length === 0) {
    return (
      <div className="container py-8 flex justify-center items-center" style={{ minHeight: "70vh" }}>
        <div className="flex flex-col items-center text-center">
          <div className="rounded-full bg-muted p-6 mb-4">
            <BarChart className="h-10 w-10 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-bold mb-2">No links to analyze yet</h2>
          <p className="text-muted-foreground max-w-md mb-6">
            Start by creating short links in the dashboard. You'll be able to track their performance here.
          </p>
          <Button onClick={() => navigate("/dashboard")}>Create Links</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-muted-foreground">Track performance of your shortened links</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Select value={selectedLink} onValueChange={setSelectedLink}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select link" />
            </SelectTrigger>
            <SelectContent>
              {links.map((link) => (
                <SelectItem key={link.id} value={link.id}>
                  {link.shortCode}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {selectedLink && (
        <div className="space-y-6">
          <AnalyticsChart linkId={selectedLink} />
        </div>
      )}
    </div>
  );
};

export default Analytics;
