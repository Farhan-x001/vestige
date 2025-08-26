'use client';

import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import PolicyContent from '@/components/PolicyContent';

export default function PolicyPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const sectionContent = [
    {
      title: "Privacy Policy",
      content: "Your privacy is important to us. This policy explains how we collect, use, and protect your personal data. We are committed to ensuring the confidentiality and security of the information you provide us.",
    },
    {
      title: "Terms of Service",
      content: "These terms govern your use of the Vestiga application. By accessing or using our services, you agree to be bound by these terms. Please read them carefully before proceeding.",
    },
    {
      title: "Refund Policy",
      content: "Our refund policy outlines the conditions under which refunds may be issued. All requests are subject to review and must comply with the criteria specified herein.",
    },
    {
      title: "Data Security",
      content: "We employ industry-standard security measures to protect your data from unauthorized access, alteration, disclosure, or destruction. Your trust is paramount, and we strive to maintain the highest level of data integrity.",
    },
  ];

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="container mx-auto px-4 py-12"
    >
      <Card className="shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-4xl font-extrabold text-gray-900">Our Policies</CardTitle>
          <CardDescription className="text-lg text-gray-600 mt-2">Transparency and Trust</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {sectionContent.map((section, index) => (
            <PolicyContent key={index} title={section.title} content={section.content} />
          ))}
        </CardContent>
      </Card>
    </motion.div>
  );
}
