
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.29.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  console.log("Received create-link request");
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    // Ensure request method is POST
    if (req.method !== 'POST') {
      console.error("Invalid request method:", req.method);
      return new Response(
        JSON.stringify({ error: "Method not allowed" }),
        { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Parse request body
    const requestData = await req.json().catch(error => {
      console.error("Error parsing request body:", error);
      throw new Error("Invalid JSON in request body");
    });
    
    // Validate URL
    if (!requestData.url) {
      console.error("Missing URL in request");
      return new Response(
        JSON.stringify({ error: "URL is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Normalize URL (add protocol if missing)
    let originalUrl = requestData.url.trim();
    if (!originalUrl.startsWith('http://') && !originalUrl.startsWith('https://')) {
      originalUrl = 'http://' + originalUrl;
    }
    
    // Validate URL format
    try {
      new URL(originalUrl);
    } catch (error) {
      console.error("Invalid URL format:", originalUrl);
      return new Response(
        JSON.stringify({ error: "Invalid URL format" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
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
    
    // Generate a unique short code
    let shortCode = "";
    let isUnique = false;
    const maxAttempts = 10;
    let attempts = 0;
    
    while (!isUnique && attempts < maxAttempts) {
      attempts++;
      // Generate random alphanumeric string (6 characters)
      shortCode = generateRandomCode(6);
      
      console.log(`Checking if short code "${shortCode}" is unique (attempt ${attempts})`);
      
      // Check if code already exists
      const { data, error } = await supabase
        .from('links')
        .select('id')
        .eq('short_code', shortCode)
        .maybeSingle();
      
      if (error) {
        console.error("Error checking short code uniqueness:", error);
        throw new Error("Database error when checking short code");
      }
      
      // If no data returned, the code is unique
      isUnique = !data;
    }
    
    if (!isUnique) {
      console.error("Failed to generate unique short code after maximum attempts");
      return new Response(
        JSON.stringify({ error: "Failed to generate unique short code" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    console.log(`Generated unique short code: ${shortCode}`);
    
    // Insert new link into database
    const { data: newLink, error: insertError } = await supabase
      .from('links')
      .insert({
        short_code: shortCode,
        original_url: originalUrl,
        clicks: 0,
        is_custom: false
      })
      .select()
      .single();
    
    if (insertError) {
      console.error("Error inserting link:", insertError);
      return new Response(
        JSON.stringify({ error: "Failed to create short link", details: insertError.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Generate the full short URL (using linkgist.lovable.app as the domain)
    const domain = "linkgist.lovable.app";
    const shortUrl = `https://${domain}/${shortCode}`;
    
    console.log(`Created short link: ${shortUrl} -> ${originalUrl}`);
    
    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        short_url: shortUrl,
        short_code: shortCode,
        original_url: originalUrl,
        id: newLink.id
      }),
      { 
        status: 201, 
        headers: { 
          ...corsHeaders, 
          "Content-Type": "application/json" 
        } 
      }
    );
    
  } catch (error) {
    console.error("Error creating short link:", error);
    return new Response(
      JSON.stringify({ error: "Server error", details: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

// Helper function to generate random alphanumeric string
function generateRandomCode(length: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const charactersLength = chars.length;
  
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * charactersLength));
  }
  
  return result;
}
