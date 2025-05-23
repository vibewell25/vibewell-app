'use client';

import { CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export function VerifiedBadge() {
  return (
    <motion.div
      className="flex justify-center"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="bg-green-50 text-green-600 rounded-full p-2 inline-flex items-center">
        <CheckCircle className="h-12 w-12" />
        <span className="ml-2 text-lg font-semibold">Verified</span>
      </div>
    </motion.div>
  );
} 