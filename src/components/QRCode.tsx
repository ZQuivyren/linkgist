
import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { toast } from "sonner";

interface QRCodeProps {
  url: string;
  isOpen: boolean;
  onClose: () => void;
}

const QRCode: React.FC<QRCodeProps> = ({ url, isOpen, onClose }) => {
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isOpen && url) {
      setIsLoading(true);
      // In a real implementation, we would generate a QR code here
      // For now, we'll simulate it with a timeout
      const timeoutId = setTimeout(() => {
        // This is a placeholder QR code image URL
        setQrCode(`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`);
        setIsLoading(false);
      }, 1000);

      return () => clearTimeout(timeoutId);
    }
  }, [isOpen, url]);

  const handleDownload = () => {
    if (qrCode) {
      const link = document.createElement("a");
      link.href = qrCode;
      link.download = "linkgist-qrcode.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("QR Code downloaded successfully!");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>QR Code for your shortened URL</DialogTitle>
          <DialogDescription>
            Use this QR code to share your link offline or in print materials.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center p-6">
          {isLoading ? (
            <div className="h-[200px] w-[200px] flex items-center justify-center bg-gray-100 rounded-md animate-pulse">
              <div className="text-sm text-muted-foreground">Generating QR Code...</div>
            </div>
          ) : (
            <>
              <div className="border-4 border-white shadow-md rounded-md overflow-hidden mb-4">
                <img src={qrCode || ""} alt="QR Code" width={200} height={200} />
              </div>
              <p className="text-sm text-muted-foreground mb-4 text-center">
                Scan this QR code to open: <span className="font-medium">{url}</span>
              </p>
              <Button onClick={handleDownload} className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Download QR Code
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QRCode;
