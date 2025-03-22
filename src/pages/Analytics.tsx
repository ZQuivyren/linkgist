
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AnalyticsChart from "@/components/AnalyticsChart";
import { BarChart, LineChart, PieChart, Smartphone, Globe, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

// Mock data for demo
const MOCK_LINKS = [
  { id: "1", name: "Product Launch", url: "linkgist.lovable.app/product" },
  { id: "2", name: "Marketing Campaign", url: "linkgist.lovable.app/campaign" },
  { id: "3", name: "Documentation", url: "linkgist.lovable.app/docs" },
  { id: "4", name: "Social Media", url: "linkgist.lovable.app/social" },
];

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
  const [selectedLink, setSelectedLink] = useState(MOCK_LINKS[0].id);
  const [timeRange, setTimeRange] = useState("30d");

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
              {MOCK_LINKS.map((link) => (
                <SelectItem key={link.id} value={link.id}>
                  {link.name}
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
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0 }}>
          <AnalyticsStat 
            icon={<BarChart className="h-5 w-5 text-brand-blue" />} 
            label="Total Clicks" 
            value="12,456" 
            change="12.5%" 
            changeDirection="up"
          />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.1 }}>
          <AnalyticsStat 
            icon={<Smartphone className="h-5 w-5 text-brand-blue" />} 
            label="Mobile Clicks" 
            value="7,231" 
            change="8.3%" 
            changeDirection="up"
          />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.2 }}>
          <AnalyticsStat 
            icon={<PieChart className="h-5 w-5 text-brand-blue" />} 
            label="Conversion Rate" 
            value="24.8%" 
            change="2.1%" 
            changeDirection="down"
          />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.3 }}>
          <AnalyticsStat 
            icon={<Globe className="h-5 w-5 text-brand-blue" />} 
            label="Unique Visitors" 
            value="5,872" 
            change="15.4%" 
            changeDirection="up"
          />
        </motion.div>
      </div>

      {/* Main Charts */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.3, delay: 0.4 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
      >
        <Card className="shadow-sm border-gray-100">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Click Trends</CardTitle>
            <Tabs defaultValue="line">
              <TabsList>
                <TabsTrigger value="line">
                  <LineChart className="h-4 w-4" />
                </TabsTrigger>
                <TabsTrigger value="bar">
                  <BarChart className="h-4 w-4" />
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <AnalyticsChart linkId={selectedLink} />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-gray-100">
          <CardHeader>
            <CardTitle>Link Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <AnalyticsChart linkId={selectedLink} />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Additional Metrics */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.3, delay: 0.5 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8"
      >
        <Card className="shadow-sm border-gray-100">
          <CardHeader>
            <CardTitle>Top Locations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { country: "United States", clicks: 4321, percent: 35 },
                { country: "United Kingdom", clicks: 2158, percent: 17 },
                { country: "Germany", clicks: 1762, percent: 14 },
                { country: "India", clicks: 1247, percent: 10 },
                { country: "Other", clicks: 2968, percent: 24 },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-brand-blue opacity-80"></div>
                    <span>{item.country}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">{item.clicks}</span>
                    <span className="text-xs text-muted-foreground">({item.percent}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-gray-100">
          <CardHeader>
            <CardTitle>Browsers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { browser: "Chrome", clicks: 5632, percent: 45 },
                { browser: "Safari", clicks: 3721, percent: 30 },
                { browser: "Firefox", clicks: 1245, percent: 10 },
                { browser: "Edge", clicks: 873, percent: 7 },
                { browser: "Other", clicks: 985, percent: 8 },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-brand-blue opacity-80"></div>
                    <span>{item.browser}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">{item.clicks}</span>
                    <span className="text-xs text-muted-foreground">({item.percent}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-gray-100">
          <CardHeader>
            <CardTitle>Referrers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { source: "Direct", clicks: 4127, percent: 33 },
                { source: "Twitter", clicks: 2854, percent: 23 },
                { source: "Google", clicks: 2145, percent: 17 },
                { source: "Facebook", clicks: 1762, percent: 14 },
                { source: "Other", clicks: 1568, percent: 13 },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-brand-blue opacity-80"></div>
                    <span>{item.source}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">{item.clicks}</span>
                    <span className="text-xs text-muted-foreground">({item.percent}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Export Button */}
      <div className="flex justify-end">
        <Button variant="outline">
          Export Report
        </Button>
      </div>
    </div>
  );
};

export default Analytics;
