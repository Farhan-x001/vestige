'use client';

import { motion } from 'framer-motion';


export default function PolicyContent({ title, content }) {
  const itemVariants = {
    hidden{ opacity, y },
    visible{ opacity, y },
  };

  return (
    <motion.div variants={itemVariants} className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-2xl font-semibold text-gray-800 mb-3 border-b pb-2">{title}</h2>
      <p className="text-gray-700 leading-relaxed">{content}</p>
    </motion.div>
  );
}
