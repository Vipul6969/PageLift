"use client"

import { motion } from "framer-motion"

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-gray-800 shadow-md mt-auto"
    >
      <div className="container mx-auto px-4 py-4 text-center text-gray-600 dark:text-gray-300">
        <p>&copy; 2025 SEO AI Optimizer. All rights reserved.</p>
      </div>
    </motion.footer>
  )
}

