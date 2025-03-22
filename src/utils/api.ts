
import { toast } from "sonner";

/**
 * Simulates API call to shorten a URL
 * @param originalUrl The URL to be shortened
 * @param customSlug Optional custom slug for the shortened URL
 * @returns Promise with the shortened URL data
 */
export const shortenUrl = async (originalUrl: string, customSlug?: string) => {
  try {
    // Validate URL
    new URL(originalUrl);
    
    // This would be a real API call in production
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Generate fake shortened URL
    const domain = "linkgist.lovable.app";
    const slug = customSlug || Math.random().toString(36).substring(2, 6);
    const shortUrl = `https://${domain}/${slug}`;
    
    return {
      id: Math.random().toString(36).substring(2, 9),
      originalUrl,
      shortUrl,
      createdAt: new Date().toISOString(),
      clicks: 0,
    };
  } catch (error) {
    console.error("Error shortening URL:", error);
    toast.error("Failed to shorten URL. Please check your input and try again.");
    throw error;
  }
};

/**
 * Simulates API call to get analytics for a URL
 * @param linkId The ID of the shortened URL
 * @param timeRange The time range for analytics data
 * @returns Promise with the analytics data
 */
export const getLinkAnalytics = async (linkId: string, timeRange: string = "7d") => {
  try {
    // This would be a real API call in production
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Generate fake analytics data
    const days = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90;
    
    // Generate click data
    const clickData = Array.from({ length: days }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (days - i - 1));
      return {
        date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        clicks: Math.floor(Math.random() * 100) + 5,
      };
    });
    
    // Generate device data
    const deviceData = [
      { name: "Desktop", value: Math.floor(Math.random() * 60) + 20 },
      { name: "Mobile", value: Math.floor(Math.random() * 40) + 10 },
      { name: "Tablet", value: Math.floor(Math.random() * 20) + 5 },
    ];
    
    // Generate referrer data
    const referrerData = [
      { name: "Direct", value: Math.floor(Math.random() * 40) + 20 },
      { name: "Google", value: Math.floor(Math.random() * 30) + 15 },
      { name: "Twitter", value: Math.floor(Math.random() * 20) + 10 },
      { name: "Facebook", value: Math.floor(Math.random() * 15) + 5 },
      { name: "Other", value: Math.floor(Math.random() * 10) + 5 },
    ];
    
    return {
      clickData,
      deviceData,
      referrerData,
      totalClicks: clickData.reduce((sum, day) => sum + day.clicks, 0),
    };
  } catch (error) {
    console.error("Error fetching analytics:", error);
    toast.error("Failed to fetch analytics data.");
    throw error;
  }
};

/**
 * Simulates API call to generate a QR code for a URL
 * @param url The URL to generate a QR code for
 * @returns Promise with the QR code data
 */
export const generateQRCode = async (url: string) => {
  try {
    // This would be a real API call in production
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Use a real QR code generation service
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`;
  } catch (error) {
    console.error("Error generating QR code:", error);
    toast.error("Failed to generate QR code.");
    throw error;
  }
};
