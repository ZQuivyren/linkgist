
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative overflow-hidden py-20 md:py-32">
      {/* Background decorations */}
      <div className="absolute top-[20%] right-[15%] w-[30vw] h-[30vw] max-w-[600px] max-h-[600px] bg-brand-blue opacity-[0.03] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[10%] left-[10%] w-[20vw] h-[20vw] max-w-[400px] max-h-[400px] bg-brand-lightBlue opacity-[0.03] rounded-full blur-3xl pointer-events-none" />

      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-[85%] md:max-w-[65%]"
          >
            <div className="inline-block rounded-full bg-brand-gray px-3 py-1 text-sm font-medium mb-6 text-brand-blue">
              Introducing linkgist
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-balance mb-6">
              Sleek & powerful <span className="text-brand-blue">URL shortening</span> for modern web
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-[600px] mx-auto">
              Create, customize, and track short links with an elegant, intuitive experience built for performance.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Button size="lg" className="rounded-full" asChild>
                <Link to="/login">
                  Get started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="rounded-full">
                Learn more
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-16 w-full max-w-5xl"
          >
            <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-blue to-brand-lightBlue"></div>
              <div className="flex items-center px-4 py-2 border-b border-gray-100">
                <div className="flex space-x-2">
                  <div className="h-3 w-3 rounded-full bg-red-400"></div>
                  <div className="h-3 w-3 rounded-full bg-yellow-400"></div>
                  <div className="h-3 w-3 rounded-full bg-green-400"></div>
                </div>
                <div className="mx-auto pr-8 text-sm text-gray-400">linkgist.lovable.app</div>
              </div>
              <div className="p-4 sm:p-8">
                <div className="text-xl font-medium mb-4 text-left">Dashboard Preview</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="bg-gray-50 rounded-xl p-4 shadow-sm border border-gray-100">
                      <div className="h-2 w-16 bg-brand-blue/20 rounded mb-2"></div>
                      <div className="h-4 w-36 bg-gray-200 rounded mb-3"></div>
                      <div className="space-y-2">
                        <div className="h-3 w-full bg-gray-200 rounded"></div>
                        <div className="h-3 w-4/5 bg-gray-200 rounded"></div>
                      </div>
                      <div className="mt-4 flex justify-between">
                        <div className="h-6 w-16 bg-gray-200 rounded"></div>
                        <div className="h-6 w-6 bg-brand-blue/20 rounded-full"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
