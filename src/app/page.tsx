'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative w-full h-[60vh] bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white p-4"
      >
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold tracking-tight">Vestiga: Your Journey, Simplified.</h1>
          <p className="text-xl max-w-2xl mx-auto">
            Seamless applications, secure payments, and instant confirmations. Experience the future of online interactions.
          </p>
          <Button asChild className="mt-6 px-8 py-3 text-lg">
            <Link href="/apply">Get Started</Link>
          </Button>
        </div>
      </motion.section>

      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl font-bold text-gray-800 dark:text-white mb-12"
          >
            Features Designed for You
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card className="h-full flex flex-col">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold">Easy Applications</CardTitle>
                </CardHeader>
                <CardContent>
                  Fill out forms quickly and efficiently with our intuitive interface.
                </CardContent>
              </Card>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <Card className="h-full flex flex-col">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold">Secure Payments</CardTitle>
                </CardHeader>
                <CardContent>
                  Powered by PayU, your transactions are safe and secure.
                </CardContent>
              </Card>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <Card className="h-full flex flex-col">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold">Instant Confirmations</CardTitle>
                </CardHeader>
                <CardContent>
                  Receive immediate updates via WhatsApp and email after successful actions.
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1 }}
        className="py-20 bg-blue-700 text-white text-center"
      >
        <div className="container mx-auto px-4 space-y-6">
          <h2 className="text-4xl font-bold">Ready to Get Started?</h2>
          <p className="text-xl">Join thousands of satisfied users experiencing seamless online processes.</p>
          <Button asChild className="mt-6 px-10 py-4 text-xl bg-white text-blue-700 hover:bg-gray-100">
            <Link href="/apply">Apply Today</Link>
          </Button>
        </div>
      </motion.section>

      <footer className="bg-gray-800 text-white p-6 text-center">
        <div className="container mx-auto">
          <p>&copy; 2025 Vestiga. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
