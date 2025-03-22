
/**
 * Generates a QR code for a URL
 * @param url The URL to generate a QR code for
 * @returns Promise with the QR code URL
 */
export const generateQRCode = async (url: string): Promise<string> => {
  try {
    // Use a real QR code generation service
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`;
  } catch (error) {
    console.error("Error generating QR code:", error);
    throw error;
  }
};
