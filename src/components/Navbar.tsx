'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const navVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.nav
      initial="hidden"
      animate="visible"
      variants={navVariants}
      className="bg-white shadow-md sticky top-0 z-50"
    >
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-gray-800">
          Vestiga
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <motion.div variants={itemVariants}>
            <Link href="/" className="text-gray-600 hover:text-gray-900 transition-colors duration-300">
              Home
            </Link>
          </motion.div>
          <motion.div variants={itemVariants}>
            <Link href="/about" className="text-gray-600 hover:text-gray-900 transition-colors duration-300">
              About
            </Link>
          </motion.div>
          <motion.div variants={itemVariants}>
            <Link href="/policy" className="text-gray-600 hover:text-gray-900 transition-colors duration-300">
              Policy
            </Link>
          </motion.div>
          <motion.div variants={itemVariants}>
            <Link href="/admin" className="text-gray-600 hover:text-gray-900 transition-colors duration-300">
              Admin
            </Link>
          </motion.div>
          <motion.div variants={itemVariants}>
            <Button asChild>
              <Link href="/apply">Apply Now</Link>
            </Button>
          </motion.div>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Button variant="ghost" onClick={toggleMenu}>
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="md:hidden bg-white shadow-lg pb-4"
        >
          <motion.div variants={navVariants} className="flex flex-col space-y-2 px-4">
            <motion.div variants={itemVariants}>
              <Link href="/" className="block py-2 text-gray-600 hover:text-gray-900 transition-colors duration-300" onClick={toggleMenu}>
                Home
              </Link>
            </motion.div>
            <motion.div variants={itemVariants}>
              <Link href="/about" className="block py-2 text-gray-600 hover:text-gray-900 transition-colors duration-300" onClick={toggleMenu}>
                About
              </Link>
            </motion.div>
            <motion.div variants={itemVariants}>
              <Link href="/policy" className="block py-2 text-gray-600 hover:text-gray-900 transition-colors duration-300" onClick={toggleMenu}>
                Policy
              </Link>
            </motion.div>
            <motion.div variants={itemVariants}>
              <Link href="/admin" className="block py-2 text-gray-600 hover:text-gray-900 transition-colors duration-300" onClick={toggleMenu}>
                Admin
              </Link>
            </motion.div>
            <motion.div variants={itemVariants}>
              <Button asChild className="w-full">
                <Link href="/apply" onClick={toggleMenu}>Apply Now</Link>
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </motion.nav>
  );
}
