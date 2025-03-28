
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.29.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  console.log("Received redirect request:", req.url);
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const path = url.pathname.split('/').pop() || '';
    
    console.log("Redirect requested for path:", path);
    
    if (!path) {
      console.error("No path provided");
      return new Response(
        JSON.stringify({ error: "Invalid link" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Create Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY") || "";
    
    if (!supabaseUrl || !supabaseKey) {
      console.error("Missing Supabase credentials");
      return new Response(
        JSON.stringify({ error: "Server configuration error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log("Looking up short_code:", path);

    // Lookup the short_code in the database
    const { data: link, error } = await supabase
      .from('links')
      .select('*')
      .eq('short_code', path)
      .single();

    if (error) {
      console.error("Database error when looking up link:", error);
      return new Response(
        JSON.stringify({ error: "Error looking up link", details: error.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!link) {
      console.error("Link not found:", path);
      return new Response(
        JSON.stringify({ error: "Link not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Link found:", link);
    console.log("Original URL:", link.original_url);

    // Ensure we have a valid URL to redirect to
    let redirectUrl = link.original_url;
    
    // Add protocol if missing
    if (!redirectUrl.startsWith('http://') && !redirectUrl.startsWith('https://')) {
      redirectUrl = 'https://' + redirectUrl;
    }
    
    // Update the click count in the background
    // We don't await this to avoid delaying the redirect
    supabase
      .from('links')
      .update({ clicks: link.clicks + 1 })
      .eq('id', link.id)
      .then(({ error }) => {
        if (error) {
          console.error("Error updating click count:", error);
        }
      });

    // Track analytics data in the background
    const userAgent = req.headers.get('user-agent') || '';
    const referer = req.headers.get('referer') || '';
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '';

    supabase
      .from('clicks')
      .insert({
        link_id: link.id,
        referrer: referer,
        ip: ip.split(',')[0].trim(), // Get first IP if multiple are provided
        browser: getBrowser(userAgent),
        device: getDevice(userAgent),
        os: getOS(userAgent)
      })
      .then(({ error: clickError }) => {
        if (clickError) {
          console.error("Error logging click:", clickError);
        }
      });

    // Perform redirection to the original URL
    console.log("Redirecting to:", redirectUrl);
    
    return new Response(null, {
      status: 302, // HTTP 302 Found (temporary redirect)
      headers: {
        ...corsHeaders,
        "Location": redirectUrl,
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "Pragma": "no-cache",
        "Expires": "0"
      }
    });
  } catch (error) {
    console.error("Error during redirection:", error);
    return new Response(
      JSON.stringify({ error: "Server error", details: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

// Helper functions to parse user agent
function getBrowser(userAgent: string): string {
  if (userAgent.includes("Chrome") && !userAgent.includes("Edg")) return "Chrome";
  if (userAgent.includes("Firefox")) return "Firefox";
  if (userAgent.includes("Safari") && !userAgent.includes("Chrome")) return "Safari";
  if (userAgent.includes("Edg")) return "Edge";
  if (userAgent.includes("MSIE") || userAgent.includes("Trident/")) return "Internet Explorer";
  return "Other";
}

function getDevice(userAgent: string): string {
  if (userAgent.includes("Mobile")) return "Mobile";
  if (userAgent.includes("Tablet")) return "Tablet";
  return "Desktop";
}

function getOS(userAgent: string): string {
  if (userAgent.includes("Windows")) return "Windows";
  if (userAgent.includes("Mac OS")) return "MacOS";
  if (userAgent.includes("Linux")) return "Linux";
  if (userAgent.includes("Android")) return "Android";
  if (userAgent.includes("iOS") || userAgent.includes("iPhone") || userAgent.includes("iPad")) return "iOS";
  return "Other";
}
