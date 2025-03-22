
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, LineChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface AnalyticsProps {
  linkId: string;
  className?: string;
}

const AnalyticsChart: React.FC<AnalyticsProps> = ({ linkId, className }) => {
  const [timeRange, setTimeRange] = useState("7d");
  const [isLoading, setIsLoading] = useState(true);
  const [clickData, setClickData] = useState<any[]>([]);
  const [deviceData, setDeviceData] = useState<any[]>([]);
  const [referrerData, setReferrerData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      
      // Simulate API fetch with a delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate fake data for the demo
      const days = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90;
      
      // Generate click data
      const newClickData = Array.from({ length: days }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (days - i - 1));
        return {
          date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          clicks: Math.floor(Math.random() * 100) + 5,
        };
      });
      
      // Generate device data
      const newDeviceData = [
        { name: "Desktop", value: Math.floor(Math.random() * 60) + 20 },
        { name: "Mobile", value: Math.floor(Math.random() * 40) + 10 },
        { name: "Tablet", value: Math.floor(Math.random() * 20) + 5 },
      ];
      
      // Generate referrer data
      const newReferrerData = [
        { name: "Direct", value: Math.floor(Math.random() * 40) + 20 },
        { name: "Google", value: Math.floor(Math.random() * 30) + 15 },
        { name: "Twitter", value: Math.floor(Math.random() * 20) + 10 },
        { name: "Facebook", value: Math.floor(Math.random() * 15) + 5 },
        { name: "Other", value: Math.floor(Math.random() * 10) + 5 },
      ];
      
      setClickData(newClickData);
      setDeviceData(newDeviceData);
      setReferrerData(newReferrerData);
      setIsLoading(false);
    };
    
    fetchData();
  }, [timeRange, linkId]);

  return (
    <Card className={cn("shadow-sm border-gray-100", className)}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Link Analytics</CardTitle>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Select range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="clicks">
          <TabsList className="mb-4">
            <TabsTrigger value="clicks">Clicks</TabsTrigger>
            <TabsTrigger value="devices">Devices</TabsTrigger>
            <TabsTrigger value="referrers">Referrers</TabsTrigger>
          </TabsList>
          
          <TabsContent value="clicks" className="h-[300px]">
            {isLoading ? (
              <div className="h-full w-full flex items-center justify-center bg-muted/20 rounded animate-pulse">
                <span className="text-sm text-muted-foreground">Loading chart data...</span>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={clickData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} width={30} />
                  <Tooltip 
                    contentStyle={{ 
                      background: "white", 
                      border: "1px solid #f0f0f0",
                      borderRadius: "8px",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
                    }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="clicks" 
                    stroke="#0A84FF" 
                    strokeWidth={2}
                    activeDot={{ r: 6 }} 
                    dot={{ r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </TabsContent>
          
          <TabsContent value="devices" className="h-[300px]">
            {isLoading ? (
              <div className="h-full w-full flex items-center justify-center bg-muted/20 rounded animate-pulse">
                <span className="text-sm text-muted-foreground">Loading chart data...</span>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={deviceData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} width={30} />
                  <Tooltip 
                    contentStyle={{ 
                      background: "white", 
                      border: "1px solid #f0f0f0",
                      borderRadius: "8px",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
                    }} 
                  />
                  <Bar dataKey="value" fill="#0A84FF" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </TabsContent>
          
          <TabsContent value="referrers" className="h-[300px]">
            {isLoading ? (
              <div className="h-full w-full flex items-center justify-center bg-muted/20 rounded animate-pulse">
                <span className="text-sm text-muted-foreground">Loading chart data...</span>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={referrerData} layout="vertical" margin={{ top: 10, right: 10, left: 50, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis type="number" tick={{ fontSize: 12 }} />
                  <YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} width={50} />
                  <Tooltip 
                    contentStyle={{ 
                      background: "white", 
                      border: "1px solid #f0f0f0",
                      borderRadius: "8px",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
                    }} 
                  />
                  <Bar dataKey="value" fill="#0A84FF" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AnalyticsChart;
