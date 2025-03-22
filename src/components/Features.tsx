
import { motion } from "framer-motion";
import { Link2, BarChart2, QrCode, Shield, Clock, LineChart } from "lucide-react";
import { cn } from "@/lib/utils";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  className?: string;
}

const FeatureCard = ({ icon, title, description, className }: FeatureCardProps) => (
  <motion.div
    whileHover={{ y: -5, transition: { duration: 0.2 } }}
    className={cn(
      "rounded-xl p-6 bg-white border border-gray-100 shadow-sm",
      className
    )}
  >
    <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
      {icon}
    </div>
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <p className="text-muted-foreground">{description}</p>
  </motion.div>
);

const Features = () => {
  const features = [
    {
      icon: <Link2 className="h-6 w-6 text-brand-blue" />,
      title: "Custom Short Links",
      description: "Create memorable, branded short links with custom slugs that reflect your content.",
    },
    {
      icon: <BarChart2 className="h-6 w-6 text-brand-blue" />,
      title: "Detailed Analytics",
      description: "Track clicks, locations, devices, and referrers with our comprehensive analytics dashboard.",
    },
    {
      icon: <QrCode className="h-6 w-6 text-brand-blue" />,
      title: "QR Code Generation",
      description: "Generate QR codes for your links instantly for seamless offline to online experiences.",
    },
    {
      icon: <Shield className="h-6 w-6 text-brand-blue" />,
      title: "Secure & Private",
      description: "Enterprise-grade security with SSL encryption and privacy-focused link management.",
    },
    {
      icon: <Clock className="h-6 w-6 text-brand-blue" />,
      title: "Link Expiration",
      description: "Set expiration dates for temporary links or keep them permanent based on your needs.",
    },
    {
      icon: <LineChart className="h-6 w-6 text-brand-blue" />,
      title: "Performance Insights",
      description: "Gain valuable insights with conversion tracking and campaign performance monitoring.",
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Everything you need to manage your links
          </h2>
          <p className="mt-4 text-xl text-muted-foreground max-w-2xl mx-auto">
            Powerful features designed for professionals and casual users alike
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
