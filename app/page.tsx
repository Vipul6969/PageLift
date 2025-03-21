"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, RadialBarChart, RadialBar } from "recharts"
import {
  Copy,
  Download,
  Sun,
  Moon,
  Search,
  ExternalLink,
  AlertCircle,
  Target,
  BarChart2,
  FileText,
  Users,
  Lightbulb,
  CheckCircle,
  Globe,
  ChevronDown,
  ChevronUp,
  LinkIcon,
} from "lucide-react"

const COLORS = ["#6366F1", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899"]

export default function Home() {
  const [url, setUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const resultsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode)
  }, [darkMode])

  useEffect(() => {
    if (data && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [data])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setData(null)
    try {
      const res = await fetch(`http://localhost:7071/api/seo-analyzer?url=${encodeURIComponent(url)}`)
      if (!res.ok) throw new Error("Failed to fetch SEO data")
      const result = await res.json()
      setData(result)
      setActiveSection("overview")
    } catch (err: any) {
      setError(err.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = () => {
    if (data) {
      navigator.clipboard.writeText(JSON.stringify(data, null, 2))
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    }
  }

  const handleDownload = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = "seo-analysis.json"
    link.click()
  }

  const toggleSection = (section: string) => {
    setActiveSection(activeSection === section ? null : section)
  }

  const chartData =
    data && data.user?.seoScore
      ? [
          { name: "Your SEO Score", value: data.user.seoScore, fill: "#6366F1" },
          ...data.competitors.map((c: any, i: number) => ({
            name: `Competitor ${i + 1}`,
            value: c.seoScore?.score || 0,
            fill: COLORS[(i + 1) % COLORS.length],
          })),
        ]
      : []

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50/50 via-white to-purple-50/50 dark:from-slate-950 dark:via-gray-900 dark:to-indigo-950/30 text-gray-900 dark:text-white transition-colors duration-300">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-500/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 -right-24 w-96 h-96 bg-purple-500/10 dark:bg-purple-500/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 left-1/3 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row justify-between items-center gap-6 mb-16"
        >
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white p-4 rounded-2xl shadow-lg">
              <Globe size={32} />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                SEO Analyzer
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Analyze and optimize your website's SEO performance
              </p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-3 rounded-full bg-white dark:bg-slate-800 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-gray-700"
            onClick={() => setDarkMode(!darkMode)}
            title="Toggle Theme"
          >
            {darkMode ? <Sun size={22} className="text-amber-400" /> : <Moon size={22} className="text-indigo-600" />}
          </motion.button>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-16 bg-white dark:bg-slate-800/90 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-gray-100 dark:border-gray-700/50"
        >
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3 text-indigo-700 dark:text-indigo-300">
            <Search className="text-indigo-500" size={24} />
            Analyze Your Website
          </h2>
          <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
                <Globe size={20} />
              </div>
              <input
                type="url"
                placeholder="Enter a website URL (e.g., https://example.com)"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
                className="w-full pl-12 pr-5 py-4 rounded-xl border border-gray-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-slate-900/80 dark:text-white transition-all duration-200 text-base"
              />
            </div>
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold px-8 py-4 rounded-xl shadow-md transition-all duration-300 hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-w-[180px]"
            >
              {loading ? (
                <>
                  <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <Search size={18} />
                  <span>Analyze</span>
                </>
              )}
            </motion.button>
          </form>
        </motion.div>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800/50 rounded-2xl p-6 mb-12 shadow-md flex items-start gap-4 backdrop-blur-sm"
            >
              <div className="bg-red-100 dark:bg-red-800/30 p-3 rounded-full">
                <AlertCircle className="text-red-500" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-red-700 dark:text-red-300 mb-1">Analysis Failed</h3>
                <p>{error}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        <AnimatePresence>
          {data && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
              ref={resultsRef}
            >
              {/* Overview Section */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-white dark:bg-slate-800/90 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700/50 overflow-hidden"
              >
                <div
                  className="p-6 cursor-pointer flex justify-between items-center"
                  onClick={() => toggleSection("overview")}
                >
                  <h2 className="text-xl font-semibold flex items-center gap-3 text-indigo-700 dark:text-indigo-300">
                    <div className="bg-indigo-100 dark:bg-indigo-900/30 p-2 rounded-lg">
                      <BarChart2 className="text-indigo-600 dark:text-indigo-400" size={22} />
                    </div>
                    Overview
                  </h2>
                  <div className="text-gray-400">
                    {activeSection === "overview" ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                </div>

                {activeSection === "overview" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="px-6 pb-6"
                  >
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {/* Purpose Card */}
                      <div className="bg-gradient-to-br from-indigo-50 to-indigo-100/50 dark:from-slate-900 dark:to-indigo-950/20 p-6 rounded-2xl border border-indigo-100 dark:border-indigo-900/30">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="bg-indigo-100 dark:bg-indigo-900/50 p-2 rounded-lg">
                            <Target className="text-indigo-600 dark:text-indigo-400" size={20} />
                          </div>
                          <h3 className="font-semibold text-indigo-700 dark:text-indigo-300">Purpose</h3>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300">{data.purpose}</p>
                      </div>

                      {/* Score Card */}
                      <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-slate-900 dark:to-emerald-950/20 p-6 rounded-2xl border border-emerald-100 dark:border-emerald-900/30">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="bg-emerald-100 dark:bg-emerald-900/50 p-2 rounded-lg">
                            <CheckCircle className="text-emerald-600 dark:text-emerald-400" size={20} />
                          </div>
                          <h3 className="font-semibold text-emerald-700 dark:text-emerald-300">Your SEO Score</h3>
                        </div>
                        <div className="flex items-center justify-center">
                          <div className="relative w-32 h-32">
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-4xl font-bold text-emerald-700 dark:text-emerald-400">
                                {data.user?.seoScore || 0}
                              </span>
                            </div>
                            <ResponsiveContainer width="100%" height="100%">
                              <RadialBarChart
                                innerRadius="70%"
                                outerRadius="100%"
                                data={[{ name: "Score", value: data.user?.seoScore || 0, fill: "#10B981" }]}
                                startAngle={90}
                                endAngle={-270}
                              >
                                <RadialBar background dataKey="value" cornerRadius={30} fill="#10B981" />
                              </RadialBarChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      </div>

                      {/* URL Card */}
                      <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-slate-900 dark:to-purple-950/20 p-6 rounded-2xl border border-purple-100 dark:border-purple-900/30">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="bg-purple-100 dark:bg-purple-900/50 p-2 rounded-lg">
                            <Globe className="text-purple-600 dark:text-purple-400" size={20} />
                          </div>
                          <h3 className="font-semibold text-purple-700 dark:text-purple-300">Analyzed URL</h3>
                        </div>
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 transition-colors truncate"
                        >
                          <LinkIcon size={16} />
                          <span className="truncate">{url}</span>
                        </a>
                      </div>
                    </div>

                    {/* Chart */}
                    <div className="mt-8 bg-white dark:bg-slate-900/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-800">
                      <h3 className="text-lg font-semibold mb-6 flex items-center gap-2 text-gray-800 dark:text-gray-200">
                        <BarChart2 className="text-indigo-500" size={20} />
                        SEO Score Comparison
                      </h3>
                      <div className="h-80">
                        <ResponsiveContainer>
                          <PieChart>
                            <Pie
                              data={chartData}
                              dataKey="value"
                              nameKey="name"
                              outerRadius={120}
                              label
                              animationDuration={1000}
                              animationBegin={200}
                            >
                              {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} className="drop-shadow-md" />
                              ))}
                            </Pie>
                            <Tooltip
                              contentStyle={{
                                backgroundColor: darkMode ? "#1e293b" : "white",
                                borderRadius: "0.75rem",
                                border: "none",
                                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
                                color: darkMode ? "white" : "black",
                                padding: "12px 16px",
                              }}
                            />
                            <Legend
                              layout="horizontal"
                              verticalAlign="bottom"
                              align="center"
                              wrapperStyle={{ paddingTop: "20px" }}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>

              {/* Metadata Section */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-white dark:bg-slate-800/90 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700/50 overflow-hidden"
              >
                <div
                  className="p-6 cursor-pointer flex justify-between items-center"
                  onClick={() => toggleSection("metadata")}
                >
                  <h2 className="text-xl font-semibold flex items-center gap-3 text-indigo-700 dark:text-indigo-300">
                    <div className="bg-indigo-100 dark:bg-indigo-900/30 p-2 rounded-lg">
                      <FileText className="text-indigo-600 dark:text-indigo-400" size={22} />
                    </div>
                    Metadata
                  </h2>
                  <div className="text-gray-400">
                    {activeSection === "metadata" ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                </div>

                {activeSection === "metadata" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="px-6 pb-6"
                  >
                    <div className="space-y-6">
                      <div className="bg-gradient-to-r from-indigo-50 to-indigo-100/30 dark:from-slate-900 dark:to-indigo-950/10 p-6 rounded-2xl border border-indigo-100 dark:border-indigo-900/30">
                        <h3 className="font-medium text-indigo-700 dark:text-indigo-300 mb-3 flex items-center gap-2">
                          <FileText size={16} className="text-indigo-500" />
                          Title
                        </h3>
                        <div className="bg-white/80 dark:bg-slate-900/80 p-4 rounded-xl border border-indigo-100/50 dark:border-indigo-900/30">
                          <p className="text-gray-800 dark:text-gray-200 font-medium">
                            {data.user?.metadata?.title || "N/A"}
                          </p>
                        </div>
                      </div>

                      <div className="bg-gradient-to-r from-indigo-50 to-indigo-100/30 dark:from-slate-900 dark:to-indigo-950/10 p-6 rounded-2xl border border-indigo-100 dark:border-indigo-900/30">
                        <h3 className="font-medium text-indigo-700 dark:text-indigo-300 mb-3 flex items-center gap-2">
                          <FileText size={16} className="text-indigo-500" />
                          Description
                        </h3>
                        <div className="bg-white/80 dark:bg-slate-900/80 p-4 rounded-xl border border-indigo-100/50 dark:border-indigo-900/30">
                          <p className="text-gray-800 dark:text-gray-200">
                            {data.user?.metadata?.description || "No description provided."}
                          </p>
                        </div>
                      </div>

                      <div className="bg-gradient-to-r from-indigo-50 to-indigo-100/30 dark:from-slate-900 dark:to-indigo-950/10 p-6 rounded-2xl border border-indigo-100 dark:border-indigo-900/30">
                        <h3 className="font-medium text-indigo-700 dark:text-indigo-300 mb-3 flex items-center gap-2">
                          <LinkIcon size={16} className="text-indigo-500" />
                          Links
                        </h3>
                        <div className="bg-white/80 dark:bg-slate-900/80 p-4 rounded-xl border border-indigo-100/50 dark:border-indigo-900/30">
                          {data.user?.metadata?.links?.length > 0 ? (
                            <ul className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                              {data.user?.metadata?.links?.map((link: string, index: number) => (
                                <li key={index} className="flex items-center gap-2 group">
                                  <div className="bg-indigo-100 dark:bg-indigo-900/30 p-1.5 rounded-lg group-hover:bg-indigo-200 dark:group-hover:bg-indigo-800/30 transition-colors">
                                    <ExternalLink size={14} className="text-indigo-600 dark:text-indigo-400" />
                                  </div>
                                  <a
                                    href={link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors truncate text-sm"
                                  >
                                    {link}
                                  </a>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-gray-500 dark:text-gray-400">No links found</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>

              {/* Competitors Section */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="bg-white dark:bg-slate-800/90 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700/50 overflow-hidden"
              >
                <div
                  className="p-6 cursor-pointer flex justify-between items-center"
                  onClick={() => toggleSection("competitors")}
                >
                  <h2 className="text-xl font-semibold flex items-center gap-3 text-indigo-700 dark:text-indigo-300">
                    <div className="bg-indigo-100 dark:bg-indigo-900/30 p-2 rounded-lg">
                      <Users className="text-indigo-600 dark:text-indigo-400" size={22} />
                    </div>
                    Competitor Analysis
                  </h2>
                  <div className="text-gray-400">
                    {activeSection === "competitors" ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                </div>

                {activeSection === "competitors" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="px-6 pb-6"
                  >
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {data.competitors.map((comp: any, idx: number) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: idx * 0.1 }}
                          className="bg-gradient-to-br from-white to-indigo-50/30 dark:from-slate-900 dark:to-indigo-950/10 rounded-2xl border border-indigo-100 dark:border-indigo-900/30 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
                          whileHover={{ y: -5 }}
                        >
                          <div className="bg-indigo-600 h-2"></div>
                          <div className="p-6">
                            <div className="flex items-start gap-3 mb-4">
                              <div className="bg-indigo-100 dark:bg-indigo-900/50 p-2 rounded-lg">
                                <Users size={18} className="text-indigo-600 dark:text-indigo-400" />
                              </div>
                              <div>
                                <h3 className="font-medium text-gray-900 dark:text-white">Competitor {idx + 1}</h3>
                                <a
                                  href={comp.url}
                                  className="text-indigo-500 text-sm hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors flex items-center gap-1 truncate"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <span className="truncate max-w-[200px]">{comp.url}</span>
                                  <ExternalLink size={12} />
                                </a>
                              </div>
                            </div>

                            <div className="space-y-4">
                              <div>
                                <div className="flex justify-between items-center mb-2">
                                  <span className="text-sm text-gray-600 dark:text-gray-400">SEO Score</span>
                                  <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                                    {comp.seoScore?.score || "0"}
                                  </span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                                  <div
                                    className="bg-indigo-600 h-2.5 rounded-full"
                                    style={{ width: `${comp.seoScore?.score || 0}%` }}
                                  ></div>
                                </div>
                              </div>

                              <div className="bg-white/80 dark:bg-slate-900/80 p-4 rounded-xl border border-gray-100 dark:border-gray-800">
                                <span className="text-sm text-gray-600 dark:text-gray-400 block mb-2">
                                  Explanation:
                                </span>
                                <p className="text-sm text-gray-800 dark:text-gray-200">
                                  {comp.seoScore?.explanation || "No explanation provided."}
                                </p>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </motion.div>

              {/* Suggestions Section */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="bg-white dark:bg-slate-800/90 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700/50 overflow-hidden"
              >
                <div
                  className="p-6 cursor-pointer flex justify-between items-center"
                  onClick={() => toggleSection("suggestions")}
                >
                  <h2 className="text-xl font-semibold flex items-center gap-3 text-indigo-700 dark:text-indigo-300">
                    <div className="bg-indigo-100 dark:bg-indigo-900/30 p-2 rounded-lg">
                      <Lightbulb className="text-indigo-600 dark:text-indigo-400" size={22} />
                    </div>
                    Suggestions
                  </h2>
                  <div className="text-gray-400">
                    {activeSection === "suggestions" ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                </div>

                {activeSection === "suggestions" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="px-6 pb-6"
                  >
                    <div className="bg-gradient-to-r from-indigo-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-900 dark:to-purple-950/10 p-6 rounded-2xl border border-indigo-100 dark:border-indigo-900/30">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="bg-indigo-100 dark:bg-indigo-900/50 p-2 rounded-lg">
                          <Lightbulb size={18} className="text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <h3 className="font-medium text-indigo-700 dark:text-indigo-300">Improvement Suggestions</h3>
                      </div>
                      <div className="bg-white/80 dark:bg-slate-900/80 p-5 rounded-xl border border-indigo-100/50 dark:border-indigo-900/30">
                        <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 dark:text-gray-200 custom-scrollbar max-h-96 overflow-y-auto pr-2">
                          {data.suggestions?.suggestion}
                        </pre>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="flex flex-wrap gap-4 justify-end mt-8"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCopy}
                  className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
                >
                  <Copy size={18} />
                  {copied ? (
                    <span className="flex items-center gap-1">
                      <CheckCircle size={16} />
                      Copied!
                    </span>
                  ) : (
                    "Copy JSON"
                  )}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleDownload}
                  className="flex items-center gap-2 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
                >
                  <Download size={18} />
                  Download JSON
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: ${darkMode ? "rgba(30, 41, 59, 0.5)" : "rgba(241, 245, 249, 0.5)"};
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: ${darkMode ? "rgba(99, 102, 241, 0.5)" : "rgba(99, 102, 241, 0.3)"};
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: ${darkMode ? "rgba(99, 102, 241, 0.7)" : "rgba(99, 102, 241, 0.5)"};
        }
      `}</style>
    </main>
  )
}

