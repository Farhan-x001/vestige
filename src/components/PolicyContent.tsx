'use client';

import { motion } from 'framer-motion';

interface PolicyContentProps {
  title: string;
  content: string;
}

export default function PolicyContent({ title, content }: PolicyContentProps) {
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div variants={itemVariants} className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-2xl font-semibold text-gray-800 mb-3 border-b pb-2">{title}</h2>
      <p className="text-gray-700 leading-relaxed">{content}</p>
    </motion.div>
  );
}
