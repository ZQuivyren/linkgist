
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Shortens a URL using our Supabase Edge Function
 * @param url The original URL to shorten
 * @param customSlug Optional custom slug for the short URL
 * @param recaptchaToken Optional reCAPTCHA token for anonymous users
 * @returns Object containing the shortened URL and other details
 */
export async function shortenUrl(
  url: string, 
  customSlug?: string,
  recaptchaToken?: string
): Promise<{ shortUrl: string, shortCode: string, originalUrl: string, id: string }> {
  try {
    const payload: { url: string; custom_slug?: string; recaptcha_token?: string } = { url };
    
    if (customSlug) {
      payload.custom_slug = customSlug;
    }
    
    if (recaptchaToken) {
      payload.recaptcha_token = recaptchaToken;
    }

    const { data, error } = await supabase.functions.invoke('create-link', {
      body: payload,
    });

    if (error) {
      console.error("Error invoking create-link function:", error);
      toast.error(error.message || "Failed to create short link");
      throw new Error(error.message || "Failed to create short link");
    }

    if (!data || !data.short_url) {
      toast.error("Invalid response from server");
      throw new Error("Invalid response from server");
    }

    return {
      shortUrl: data.short_url,
      shortCode: data.short_code,
      originalUrl: data.original_url,
      id: data.id
    };
  } catch (error: any) {
    console.error("Error shortening URL:", error);
    toast.error(error.message || "Failed to create short link");
    throw error;
  }
}
