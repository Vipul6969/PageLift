"use client"

import { motion } from "framer-motion"
import { Sparkles } from "lucide-react"

export default function Header() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-gray-800 shadow-md"
    >
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <Sparkles className="h-8 w-8 text-primary mr-2" />
          <span className="text-xl font-bold text-gray-800 dark:text-gray-100">SEO AI Optimizer</span>
        </div>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <a href="#" className="text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary-light">
                About
              </a>
            </li>
            <li>
              <a href="#" className="text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary-light">
                Contact
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </motion.header>
  )
}

