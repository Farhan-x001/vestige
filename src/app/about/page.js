'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function AboutPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="container mx-auto px-4 py-12"
    >
      <Card className="shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-4xl font-extrabold text-gray-900">About Vestiga</CardTitle>
          <CardDescription className="text-lg text-gray-600 mt-2">Our Mission, Vision, and Values</CardDescription>
        </CardHeader>
        <CardContent className="space-y-12">
          <section>
            <motion.h2 variants={itemVariants} className="text-3xl font-bold text-gray-800 mb-4 border-b-2 border-primary pb-2">
              Our Mission
            </motion.h2>
            <motion.p variants={itemVariants} className="text-gray-700 leading-relaxed text-lg">
              At Vestiga, our mission is to simplify and secure the application and payment processes for our users. We leverage cutting-edge technology to provide a seamless, efficient, and transparent platform that empowers individuals and organizations alike.
            </motion.p>
          </section>

          <section>
            <motion.h2 variants={itemVariants} className="text-3xl font-bold text-gray-800 mb-4 border-b-2 border-primary pb-2">
              Our Vision
            </motion.h2>
            <motion.p variants={itemVariants} className="text-gray-700 leading-relaxed text-lg">
              We envision a world where digital transactions and application submissions are effortless, reliable, and accessible to everyone. By continuously innovating and focusing on user needs, we aim to be the leading platform in digital service delivery.
            </motion.p>
          </section>

          <section>
            <motion.h2 variants={itemVariants} className="text-3xl font-bold text-gray-800 mb-4 border-b-2 border-primary pb-2">
              Why Choose Us?
            </motion.h2>
            <ul className="space-y-4 text-gray-700 text-lg">
              <motion.li variants={itemVariants} className="flex items-start">
                <span className="text-primary mr-2 text-xl">✔</span>
                <strong>User-Friendly Interface:</strong> Our platform is designed with simplicity in mind, ensuring a smooth experience for all users.
              </motion.li>
              <motion.li variants={itemVariants} className="flex items-start">
                <span className="text-primary mr-2 text-xl">✔</span>
                <strong>Secure Transactions:</strong> We prioritize your security with robust encryption and payment gateway integrations.
              </motion.li>
              <motion.li variants={itemVariants} className="flex items-start">
                <span className="text-primary mr-2 text-xl">✔</span>
                <strong>Efficient Processing:</strong> Automated workflows reduce delays, getting your applications processed faster.
              </motion.li>
              <motion.li variants={itemVariants} className="flex items-start">
                <span className="text-primary mr-2 text-xl">✔</span>
                <strong>Reliable Support:</strong> Our dedicated team is always ready to assist you with any queries or issues.
              </motion.li>
            </ul>
          </section>
        </CardContent>
      </Card>
    </motion.div>
  );
}
