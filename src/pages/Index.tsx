
import React from "react";
import UrlShortener from "@/components/UrlShortener";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Share2, Shield, Zap, ChevronRight, BarChart, Smartphone, Globe } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* URL Shortener Section (Moved to top) */}
      <section className="bg-gradient-to-b from-white to-gray-50 py-16">
        <div className="container max-w-6xl mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Shorten your URL in seconds
            </h2>
            <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
              Create a shortened link, QR code, and track your results
            </p>
          </motion.div>
          <UrlShortener />
        </div>
      </section>

      {/* Introduction Section (Below Shortener) */}
      <section className="py-20 bg-white">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
                Introducing linkgist
              </h2>
              <p className="text-xl text-muted-foreground">
                Sleek & powerful URL shortening for the modern web.
              </p>
              <p className="text-muted-foreground">
                Create, customize, and track short links with an elegant, intuitive experience built for performance.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <Button size="lg" asChild>
                  <Link to="/login">
                    Get Started <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <a href="#features">
                    Learn More <ChevronRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-video rounded-lg bg-gray-100 shadow-lg overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
                  alt="URL Shortening" 
                  className="w-full h-full object-cover" 
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-blue-500 text-white p-4 rounded-lg shadow-lg">
                <Share2 className="h-6 w-6" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Dashboard Preview Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold tracking-tight"
            >
              Powerful Analytics Dashboard
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-muted-foreground mt-2 max-w-2xl mx-auto"
            >
              Track clicks, locations, devices, and referrers in real-time
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10"
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Total Clicks</p>
                    <div className="text-2xl font-bold">12,456</div>
                  </div>
                  <div className="rounded-full p-3 bg-primary/10">
                    <BarChart className="h-5 w-5 text-brand-blue" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Mobile Visits</p>
                    <div className="text-2xl font-bold">7,231</div>
                  </div>
                  <div className="rounded-full p-3 bg-primary/10">
                    <Smartphone className="h-5 w-5 text-brand-blue" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Countries Reached</p>
                    <div className="text-2xl font-bold">93</div>
                  </div>
                  <div className="rounded-full p-3 bg-primary/10">
                    <Globe className="h-5 w-5 text-brand-blue" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
            className="relative rounded-xl overflow-hidden shadow-2xl"
          >
            <img 
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
              alt="Dashboard Preview" 
              className="w-full h-auto rounded-xl" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end">
              <div className="p-8 text-white">
                <h3 className="text-2xl font-bold mb-2">Comprehensive Analytics</h3>
                <p className="mb-4 max-w-md">Track everything about your links with our powerful dashboard</p>
                <Button variant="default" asChild>
                  <Link to="/login">Try it for free</Link>
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

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
