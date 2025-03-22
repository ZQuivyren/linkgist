
import React from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Copy, ExternalLink, QrCode, BarChart, Clock } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface LinkCardProps {
  id: string;
  originalUrl: string;
  shortUrl: string;
  createdAt: string;
  clicks: number;
  expiresAt?: string;
  onViewAnalytics: (id: string) => void;
  onViewQRCode: (id: string) => void;
}

const LinkCard: React.FC<LinkCardProps> = ({
  id,
  originalUrl,
  shortUrl,
  createdAt,
  clicks,
  expiresAt,
  onViewAnalytics,
  onViewQRCode,
}) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl);
    toast.success("Copied to clipboard!");
  };

  const formatUrl = (url: string) => {
    try {
      const parsed = new URL(url);
      return `${parsed.hostname}${parsed.pathname.substring(0, 15)}${
        parsed.pathname.length > 15 ? "..." : ""
      }`;
    } catch (e) {
      return url;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      <Card className="overflow-hidden border-gray-100 shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="p-4 bg-gray-50 border-b">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="bg-brand-blue/10 text-brand-blue border-brand-blue/20">
                {new URL(shortUrl).pathname.substring(1)}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {new Date(createdAt).toLocaleDateString()}
              </span>
            </div>
            <Badge variant="outline" className="flex items-center gap-1">
              <BarChart className="h-3 w-3" />
              {clicks} clicks
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-3">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Original URL</p>
              <a
                href={originalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium truncate block hover:underline text-foreground flex items-center"
              >
                {formatUrl(originalUrl)}
                <ExternalLink className="h-3 w-3 ml-1 inline" />
              </a>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Short URL</p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-brand-blue truncate flex-1">
                  {shortUrl}
                </span>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button size="icon" variant="ghost" onClick={handleCopy} className="h-8 w-8">
                      <Copy className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Copy URL</TooltipContent>
                </Tooltip>
              </div>
            </div>
            {expiresAt && (
              <div className="flex items-center text-xs text-muted-foreground">
                <Clock className="h-3 w-3 mr-1" />
                Expires: {new Date(expiresAt).toLocaleDateString()}
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex justify-between gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => onViewAnalytics(id)}
          >
            <BarChart className="h-4 w-4 mr-2" />
            Analytics
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => onViewQRCode(id)}
          >
            <QrCode className="h-4 w-4 mr-2" />
            QR Code
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default LinkCard;
