
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loading from "@/components/Loading";

const RedirectHandler = () => {
  const { shortCode } = useParams<{ shortCode: string }>();
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (!shortCode) return;

    // Determine the correct redirect URL based on environment
    // For production, use the Supabase Edge Function URL directly
    const redirectUrl = import.meta.env.PROD 
      ? `https://ppgabecfmbwfvqqkyqdb.supabase.co/functions/v1/redirect/${shortCode}`
      : `/api/redirect/${shortCode}`;
      
    console.log(`Redirecting to: ${redirectUrl}`);
    
    // Perform the redirection by navigating to the URL
    window.location.href = redirectUrl;
  }, [shortCode]);

  // If redirection takes too long, show an error after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setError("Redirection is taking longer than expected. Please try again.");
    }, 5000);
    
    return () => clearTimeout(timer);
  }, []);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Redirection Error</h1>
        <p className="text-gray-600 mb-4">{error}</p>
        <a href="/" className="text-blue-500 hover:underline">
          Return to homepage
        </a>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <Loading />
      <p className="mt-4 text-gray-600">Redirecting...</p>
    </div>
  );
};

export default RedirectHandler;
