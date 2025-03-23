
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { generateQRCode } from "./qrCode";

/**
 * Creates a shortened URL and stores it in Supabase
 * @param originalUrl The URL to be shortened
 * @param customSlug Optional custom slug for the shortened URL
 * @param recaptchaToken reCAPTCHA token for verification
 * @returns Promise with the shortened URL data
 */
export const shortenUrl = async (originalUrl: string, customSlug?: string, recaptchaToken?: string) => {
  try {
    // Validate URL
    new URL(originalUrl);
    
    // If recaptcha token is provided, verify it first
    if (recaptchaToken) {
      const recaptchaResponse = await verifyRecaptcha(recaptchaToken);
      if (!recaptchaResponse.success) {
        toast.error("reCAPTCHA verification failed. Please try again.");
        throw new Error("reCAPTCHA verification failed");
      }
    }

    // Generate a random slug if custom slug is not provided
    const slug = customSlug || generateRandomSlug();
    
    // Domain for the shortened URL
    const domain = "linkgist.lovable.app";
    const shortUrl = `https://${domain}/${slug}`;
    
    // Get current user (if authenticated)
    const { data: { user } } = await supabase.auth.getUser();
    
    // Generate QR code for the short URL
    const qrCodeUrl = await generateQRCode(shortUrl);
    
    // Store the link in the database
    const { data, error } = await supabase
      .from('links')
      .insert({
        short_code: slug,
        original_url: originalUrl,
        user_id: user?.id || null,
        qr_code: qrCodeUrl,
        is_custom: !!customSlug
      })
      .select()
      .single();
    
    if (error) {
      console.error("Error saving URL:", error);
      
      // Check if the error is due to a unique constraint violation (slug already exists)
      if (error.code === "23505" && customSlug) {
        toast.error("Custom slug already exists. Please choose another one.");
        throw new Error("Custom slug already exists");
      } else {
        toast.error("Failed to shorten URL. Please try again.");
        throw error;
      }
    }
    
    return {
      id: data.id,
      originalUrl,
      shortUrl,
      shortCode: slug,
      createdAt: data.created_at,
      clicks: 0,
      qrCode: qrCodeUrl
    };
  } catch (error) {
    console.error("Error shortening URL:", error);
    if ((error as Error).message !== "Custom slug already exists" && 
        (error as Error).message !== "reCAPTCHA verification failed") {
      toast.error("Failed to shorten URL. Please check your input and try again.");
    }
    throw error;
  }
};

/**
 * Verifies a reCAPTCHA token
 * @param token The reCAPTCHA token to verify
 * @returns Promise with verification result
 */
export const verifyRecaptcha = async (token: string) => {
  try {
    const { data, error } = await supabase.functions.invoke('verify-recaptcha', {
      body: { token }
    });
    
    if (error) {
      console.error("Error verifying reCAPTCHA:", error);
      return { success: false };
    }
    
    return data;
  } catch (error) {
    console.error("Error verifying reCAPTCHA:", error);
    return { success: false };
  }
};

/**
 * Generates a random string for the shortened URL slug
 * @returns Random string of 6 characters
 */
const generateRandomSlug = () => {
  return Math.random().toString(36).substring(2, 8);
};

/**
 * Gets analytics for a URL
 * @param linkId The ID of the shortened URL
 * @param timeRange The time range for analytics data
 * @returns Promise with the analytics data
 */
export const getLinkAnalytics = async (linkId: string, timeRange: string = "7d") => {
  try {
    // Get the link details
    const { data: link, error: linkError } = await supabase
      .from('links')
      .select('*')
      .eq('id', linkId)
      .single();
    
    if (linkError) {
      console.error("Error fetching link:", linkError);
      toast.error("Failed to fetch link data.");
      throw linkError;
    }
    
    // Calculate date range
    const endDate = new Date();
    let startDate = new Date();
    
    switch (timeRange) {
      case "7d":
        startDate.setDate(endDate.getDate() - 7);
        break;
      case "30d":
        startDate.setDate(endDate.getDate() - 30);
        break;
      case "90d":
        startDate.setDate(endDate.getDate() - 90);
        break;
      default:
        startDate.setDate(endDate.getDate() - 7);
    }
    
    // Get click data for the link
    const { data: clicks, error: clicksError } = await supabase
      .from('clicks')
      .select('*')
      .eq('link_id', linkId)
      .gte('clicked_at', startDate.toISOString())
      .lte('clicked_at', endDate.toISOString())
      .order('clicked_at', { ascending: true });
    
    if (clicksError) {
      console.error("Error fetching clicks:", clicksError);
      toast.error("Failed to fetch analytics data.");
      throw clicksError;
    }
    
    // Process clicks data for charts
    const clickData = processClicksForTimeChart(clicks || [], startDate, endDate);
    const deviceData = processClicksForDeviceChart(clicks || []);
    const referrerData = processClicksForReferrerChart(clicks || []);
    const browserData = processClicksForBrowserChart(clicks || []);
    
    return {
      clickData,
      deviceData,
      referrerData,
      browserData,
      totalClicks: clicks ? clicks.length : 0
    };
  } catch (error) {
    console.error("Error fetching analytics:", error);
    toast.error("Failed to fetch analytics data.");
    throw error;
  }
};

/**
 * Process clicks data for time chart
 */
const processClicksForTimeChart = (clicks: any[], startDate: Date, endDate: Date) => {
  const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const dateMap = new Map();
  
  // Initialize all dates with 0 clicks
  for (let i = 0; i < days; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    const dateStr = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    dateMap.set(dateStr, 0);
  }
  
  // Count clicks per day
  clicks.forEach(click => {
    const clickDate = new Date(click.clicked_at);
    const dateStr = clickDate.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    dateMap.set(dateStr, (dateMap.get(dateStr) || 0) + 1);
  });
  
  return Array.from(dateMap.entries()).map(([date, clicks]) => ({
    date,
    clicks
  }));
};

/**
 * Process clicks data for device chart
 */
const processClicksForDeviceChart = (clicks: any[]) => {
  const deviceMap = new Map();
  
  clicks.forEach(click => {
    const device = click.device || "Unknown";
    deviceMap.set(device, (deviceMap.get(device) || 0) + 1);
  });
  
  return Array.from(deviceMap.entries()).map(([name, value]) => ({
    name,
    value
  }));
};

/**
 * Process clicks data for referrer chart
 */
const processClicksForReferrerChart = (clicks: any[]) => {
  const referrerMap = new Map();
  
  clicks.forEach(click => {
    let referrer = "Direct";
    
    if (click.referrer) {
      try {
        const referrerUrl = new URL(click.referrer);
        referrer = referrerUrl.hostname;
      } catch (e) {
        // If referrer is not a valid URL, use the raw value
        referrer = click.referrer;
      }
    }
    
    referrerMap.set(referrer, (referrerMap.get(referrer) || 0) + 1);
  });
  
  // Get top 4 referrers and combine the rest as "Other"
  const sortedReferrers = Array.from(referrerMap.entries())
    .sort((a, b) => b[1] - a[1]);
  
  if (sortedReferrers.length <= 5) {
    return sortedReferrers.map(([name, value]) => ({ name, value }));
  }
  
  const topReferrers = sortedReferrers.slice(0, 4);
  const otherValue = sortedReferrers.slice(4).reduce((sum, [_, value]) => sum + value, 0);
  
  return [
    ...topReferrers.map(([name, value]) => ({ name, value })),
    { name: "Other", value: otherValue }
  ];
};

/**
 * Process clicks data for browser chart
 */
const processClicksForBrowserChart = (clicks: any[]) => {
  const browserMap = new Map();
  
  clicks.forEach(click => {
    const browser = click.browser || "Unknown";
    browserMap.set(browser, (browserMap.get(browser) || 0) + 1);
  });
  
  return Array.from(browserMap.entries()).map(([name, value]) => ({
    name,
    value
  }));
};

/**
 * Gets all links for the current user
 * @returns Promise with the user's links
 */
export const getUserLinks = async () => {
  try {
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return [];
    }
    
    const { data, error } = await supabase
      .from('links')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error("Error fetching links:", error);
      toast.error("Failed to fetch your links.");
      throw error;
    }
    
    return data.map(link => ({
      id: link.id,
      originalUrl: link.original_url,
      shortUrl: `https://linkgist.lovable.app/${link.short_code}`,
      shortCode: link.short_code,
      createdAt: link.created_at,
      expiresAt: link.expires_at,
      clicks: link.clicks,
      qrCode: link.qr_code
    }));
  } catch (error) {
    console.error("Error fetching links:", error);
    throw error;
  }
};
