"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Check, Copy } from "lucide-react"

interface MetaTagPopupProps {
  metaTag: string
  onClose: () => void
}

export default function MetaTagPopup({ metaTag, onClose }: MetaTagPopupProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(metaTag)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">Optimized Meta Tag</h2>
        <pre className="bg-gray-100 dark:bg-gray-700 p-4 rounded mb-4 overflow-x-auto text-sm text-gray-800 dark:text-gray-200">
          {metaTag}
        </pre>
        <div className="flex justify-between">
          <Button onClick={handleCopy} variant="outline" className="flex items-center">
            {copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
            {copied ? "Copied!" : "Copy"}
          </Button>
          <Button onClick={onClose}>Close</Button>
        </div>
      </div>
    </motion.div>
  )
}

