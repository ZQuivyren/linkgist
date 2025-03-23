
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

const RECAPTCHA_SECRET_KEY = "6LeDafwqAAAAABUDuVATlZS_gMLFM2RJzUgY7hd8";
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { token } = await req.json();
    
    console.log("Verifying reCAPTCHA token:", token ? "token provided" : "no token");

    if (!token) {
      return new Response(
        JSON.stringify({ success: false, message: "Token is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Verify reCAPTCHA token
    const recaptchaResponse = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `secret=${RECAPTCHA_SECRET_KEY}&response=${token}`,
    });

    const recaptchaData = await recaptchaResponse.json();
    
    console.log("reCAPTCHA verification result:", recaptchaData);

    // For reCAPTCHA v3, check the score (0.0 - 1.0)
    // A higher score is more likely to be a human
    // For this application, we'll accept scores above 0.3
    const isHuman = recaptchaData.success && (!recaptchaData.score || recaptchaData.score > 0.3);

    return new Response(
      JSON.stringify({ 
        success: isHuman, 
        score: recaptchaData.score,
        hostname: recaptchaData.hostname,
        challenge_ts: recaptchaData.challenge_ts
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error verifying reCAPTCHA:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Failed to verify reCAPTCHA" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
