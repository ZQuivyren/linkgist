
import React from "react";
import Hero from "@/components/Hero";
import UrlShortener from "@/components/UrlShortener";
import Features from "@/components/Features";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Share2, Shield, Zap } from "lucide-react";

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <Hero />

      {/* URL Shortener Section */}
      <section className="py-16 relative bg-gray-50">
        <div className="container">
          <div className="text-center mb-8">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-3xl font-bold tracking-tight"
            >
              Shorten your URL in seconds
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-muted-foreground mt-2"
            >
              Create a shortened link, QR code, and track your results
            </motion.p>
          </div>
          <UrlShortener />
        </div>
      </section>

      {/* Features Section */}
      <Features />

      {/* Trust Banner */}
      <section className="py-12 bg-white">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
            <div className="flex items-center gap-3">
              <Zap className="h-6 w-6 text-brand-blue" />
              <span className="font-medium">Lightning Fast</span>
            </div>
            <div className="flex items-center gap-3">
              <Shield className="h-6 w-6 text-brand-blue" />
              <span className="font-medium">100% Secure</span>
            </div>
            <div className="flex items-center gap-3">
              <Share2 className="h-6 w-6 text-brand-blue" />
              <span className="font-medium">Easy Sharing</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-brand-blue text-white">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              Ready to transform your links?
            </h2>
            <p className="text-xl text-white/80 max-w-[600px]">
              Join thousands of professionals using linkgist to create, manage, and track their links.
            </p>
            <Button size="lg" variant="secondary" className="mt-6" asChild>
              <Link to="/login">
                Get started for free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
