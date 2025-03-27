
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Fetches all links created by the current authenticated user
 * @returns Array of user's links with their details
 */
export async function getUserLinks(): Promise<any[]> {
  try {
    const { data: links, error } = await supabase
      .from('links')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error("Error fetching user links:", error);
      toast.error("Failed to fetch your links");
      throw error;
    }
    
    return links || [];
  } catch (error: any) {
    console.error("Error in getUserLinks:", error);
    toast.error(error.message || "Failed to fetch your links");
    throw error;
  }
}

/**
 * Fetches analytics data for a specific link
 * @param linkId The ID of the link to get analytics for
 * @param timeRange The time range for analytics data (e.g., '7d', '30d', '90d')
 * @returns Object with analytics data for the link
 */
export async function getLinkAnalytics(linkId: string, timeRange = '7d'): Promise<any> {
  try {
    // Get the link details first
    const { data: link, error: linkError } = await supabase
      .from('links')
      .select('*')
      .eq('id', linkId)
      .single();
    
    if (linkError) {
      console.error("Error fetching link details:", linkError);
      toast.error("Failed to fetch link details");
      throw linkError;
    }

    // Calculate the date range based on the timeRange
    const endDate = new Date();
    const startDate = new Date();
    
    switch (timeRange) {
      case '7d':
        startDate.setDate(endDate.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(endDate.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(endDate.getDate() - 90);
        break;
      default:
        startDate.setDate(endDate.getDate() - 7);
    }

    // Get the clicks for this link within the date range
    const { data: clicks, error: clicksError } = await supabase
      .from('clicks')
      .select('*')
      .eq('link_id', linkId)
      .gte('clicked_at', startDate.toISOString())
      .lte('clicked_at', endDate.toISOString())
      .order('clicked_at', { ascending: true });
    
    if (clicksError) {
      console.error("Error fetching clicks data:", clicksError);
      toast.error("Failed to fetch analytics data");
      throw clicksError;
    }

    // Process the clicks data to generate the required analytics
    // Daily clicks data for the chart
    const dailyClicks: { [date: string]: number } = {};
    const deviceMap: { [device: string]: number } = {};
    const browserMap: { [browser: string]: number } = {};
    const referrerMap: { [referrer: string]: number } = {};

    // Initialize daily clicks with 0 for each day in the range
    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const dateStr = currentDate.toISOString().split('T')[0];
      dailyClicks[dateStr] = 0;
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Fill in the actual clicks data
    (clicks || []).forEach((click) => {
      const clickDate = new Date(click.clicked_at).toISOString().split('T')[0];
      
      // Increment daily clicks
      dailyClicks[clickDate] = (dailyClicks[clickDate] || 0) + 1;
      
      // Track device types
      const device = click.device || 'Unknown';
      deviceMap[device] = (deviceMap[device] || 0) + 1;
      
      // Track browsers
      const browser = click.browser || 'Unknown';
      browserMap[browser] = (browserMap[browser] || 0) + 1;
      
      // Track referrers
      const referrer = click.referrer || 'Direct';
      referrerMap[referrer] = (referrerMap[referrer] || 0) + 1;
    });

    // Convert daily clicks to array format for the chart
    const clickData = Object.keys(dailyClicks).map(date => ({
      date,
      clicks: dailyClicks[date]
    }));

    // Convert maps to array format for pie charts
    const deviceData = Object.keys(deviceMap).map(name => ({
      name,
      value: deviceMap[name]
    }));

    const browserData = Object.keys(browserMap).map(name => ({
      name,
      value: browserMap[name]
    }));

    const referrerData = Object.keys(referrerMap).map(name => ({
      name,
      value: referrerMap[name]
    }));

    return {
      clickData,
      deviceData,
      browserData,
      referrerData,
      totalClicks: link.clicks || 0
    };
  } catch (error: any) {
    console.error("Error in getLinkAnalytics:", error);
    toast.error(error.message || "Failed to fetch analytics data");
    throw error;
  }
}
