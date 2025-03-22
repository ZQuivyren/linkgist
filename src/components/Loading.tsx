
import React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const LoadingSpinner = ({ className }: { className?: string }) => (
  <div className={cn("relative", className)}>
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
      className="w-10 h-10 border-4 border-t-brand-blue border-r-transparent border-b-transparent border-l-transparent rounded-full"
    />
    <motion.div
      animate={{ rotate: -360 }}
      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      className="absolute top-1 left-1 w-8 h-8 border-4 border-t-transparent border-r-brand-lightBlue border-b-transparent border-l-transparent rounded-full"
    />
  </div>
);

const Loading = ({ className }: { className?: string }) => {
  return (
    <div className={cn("flex h-[70vh] w-full items-center justify-center", className)}>
      <div className="flex flex-col items-center">
        <LoadingSpinner />
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-4 text-brand-blue font-medium"
        >
          Loading...
        </motion.p>
      </div>
    </div>
  );
};

export default Loading;
