"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  useSpring,
  useInView,
} from "framer-motion";
import {
  Cell,
  Tooltip,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  PieChart,
  Pie,
  Legend,
} from "recharts";
import {
  Copy,
  Download,
  ArrowRight,
  Sun,
  Moon,
  Badge,
  Search,
  ExternalLink,
  AlertCircle,
  BarChart2,
  Target,
  FileText,
  Users,
  Lightbulb,
  CheckCircle,
  Globe,
  ChevronDown,
  ChevronUp,
  LinkIcon,
  Award,
  CheckSquare,
  Info,
  Sparkles,
  Gauge,
  Plus,
  Star,
  X,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

// Modern color palette
const COLORS = [
  "#0EA5E9",
  "#10B981",
  "#F59E0B",
  "#F43F5E",
  "#8B5CF6",
  "#EC4899",
];
const GRADIENTS = {
  blue: ["#0EA5E9", "#38BDF8"],
  teal: ["#14B8A6", "#2DD4BF"],
  indigo: ["#6366F1", "#818CF8"],
  purple: ["#8B5CF6", "#A78BFA"],
  emerald: ["#10B981", "#34D399"],
  amber: ["#F59E0B", "#FBBF24"],
  rose: ["#F43F5E", "#FB7185"],
};

export default function Home() {
  const [url, setUrl] = useState("");
  const [competitorUrl, setCompetitorUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [competitorData, setCompetitorData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const overviewRef = useRef<HTMLDivElement>(null);
  const isOverviewInView = useInView(overviewRef, { once: true, amount: 0.3 });
  // const [competitorUrl, setCompetitorUrl] = useState("");
  const [expandedSuggestion, setExpandedSuggestion] = useState<number | null>(
    null
  );

  const [showCompetitorInput, setShowCompetitorInput] = useState(false);

  // Animated values for radial progress
  const scoreProgress = useMotionValue(0);
  const scoreDisplay = useTransform(scoreProgress, (value) =>
    Math.round(value)
  );
  const scoreSpring = useSpring(scoreProgress, { stiffness: 100, damping: 30 });

  // Mock data for page speed and readability scores
  const pageSpeedScore = data?.pageSpeed?.performance || 75;
  const competitorPageSpeedScore = competitorData?.pageSpeed?.performance || 75;

  const readabilityScore = data?.readabilityScore || 75;
  const competitorReadabilityScore = competitorData?.readabilityScore || 75;

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  useEffect(() => {
    if (data && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [data]);

  useEffect(() => {
    if (data && data.user?.seoScore) {
      scoreProgress.set(0);
      setTimeout(() => {
        scoreProgress.set(data.user.seoScore);
      }, 500);
    }
  }, [data, scoreProgress]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setData(null);
    setCompetitorData(null);
    try {
      const res = await fetch(
        `http://localhost:7071/api/seo-analyzer?url=${encodeURIComponent(url)}`
      );
      if (!res.ok) throw new Error("Failed to fetch SEO data");
      const result = await res.json();
      setData(result);
      console.log(result);
      setActiveSection("overview");

      if (competitorUrl) {
        const competitorRes = await fetch(
          `http://localhost:7071/api/seo-analyzer?url=${encodeURIComponent(
            competitorUrl
          )}`
        );
        if (!competitorRes.ok)
          throw new Error("Failed to fetch competitor SEO data");
        const competitorResult = await competitorRes.json();
        setCompetitorData(competitorResult);
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  function extractKeywordFromUrl(url: string): string | null {
    if (!url || typeof url !== "string") {
      return null;
    }

    try {
      const hostname = new URL(url).hostname;
      // Remove 'www.' prefix if it exists
      const cleaned = hostname.startsWith("www.")
        ? hostname.slice(4)
        : hostname;
      // Take the domain without TLD (e.g., 'example.com' -> 'example')
      const keyword = cleaned.split(".")[0];
      return keyword || null;
    } catch (error) {
      // If URL is invalid
      return null;
    }
  }

  const handleCopy = () => {
    if (data) {
      navigator.clipboard.writeText(JSON.stringify(data, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "seo-analysis.json";
    link.click();
  };

  const toggleSection = (section: string) => {
    setActiveSection(activeSection === section ? null : section);
  };

  const chartData =
    data && data.user?.seoScore
      ? [
          { name: "Your Site", value: data.user.seoScore, fill: COLORS[0] },
          ...data.competitors.map((c: any, i: number) => ({
            name: `${extractKeywordFromUrl(c.url)} `,
            value: c.seoScore?.score || 0,
            fill: COLORS[(i + 1) % COLORS.length],
          })),
        ]
      : [];

  // Parse suggestions into a checklist format if possible
  const parseSuggestions = (suggestionText: string) => {
    if (!suggestionText) return [];

    // Try to split by numbered items, bullet points, or new lines
    const lines = suggestionText.split(/\n+/);

    return lines
      .filter((line) => line.trim().length > 0)
      .map((line) => {
        // Remove any leading numbers, dashes, asterisks, etc.
        return line.trim().replace(/^[\d\-*•.]+\s*/, "");
      });
  };

  const suggestions = data?.suggestions?.suggestion
    ? parseSuggestions(data.suggestions.suggestion)
    : [];

  // Format purpose text with better readability
  const formatPurposeText = (text: string) => {
    if (!text) return "";

    // Split by sentences or periods
    const sentences = text.split(/(?<=[.!?])\s+/);

    return sentences.map((sentence, index) => (
      <p key={index} className={index > 0 ? "mt-2" : ""}>
        {sentence}
      </p>
    ));
  };

  const performanceData = [
    { name: "SEO Score", value: data?.user?.seoScore || 0, fill: "#0EA5E9" },
    { name: "Page Speed", value: pageSpeedScore, fill: "#10B981" }, // ✅ Now it's a number
    { name: "Readability", value: readabilityScore, fill: "#8B5CF6" },
  ];

  const competitorPerformanceData = [
    {
      name: "SEO Score",
      value: competitorData?.user?.seoScore || 0,
      fill: "#0EA5E9",
    },
    { name: "Page Speed", value: competitorPageSpeedScore, fill: "#10B981" }, // ✅ Now it's a number
    { name: "Readability", value: competitorReadabilityScore, fill: "#8B5CF6" },
  ];

  const processContent = () => {
    if (!data?.suggestions?.suggestion) return { intro: "", items: [] };

    // Clean up the text and remove any quotes at the beginning and end
    const fullText = data.suggestions.suggestion.replace(/^"|"$/g, "");

    // Extract the introduction (text before the first numbered point)
    const introEndIndex = fullText.indexOf("\n\n1.");
    const intro =
      introEndIndex > -1 ? fullText.substring(0, introEndIndex).trim() : "";

    // Extract each numbered suggestion
    const items = [];
    const suggestionRegex =
      /\n\n(\d+)\.\s+\*\*(.*?)\*\*:([\s\S]*?)(?=\n\n\d+\.|$)/g;

    let match;
    while ((match = suggestionRegex.exec(fullText + "\n\n")) !== null) {
      const number = match[1];
      // Remove all markdown formatting from title
      const title = match[2].replace(/\*\*/g, "").trim();

      // Process the content to extract description and actionable step
      const content = match[3].trim();

      // Extract actionable step if present
      const actionStepIndex = content.indexOf("**Actionable Step:**");
      let description = content;
      let actionableStep = "";

      if (actionStepIndex > -1) {
        description = content.substring(0, actionStepIndex).trim();
        actionableStep = content
          .substring(actionStepIndex + "**Actionable Step:**".length)
          .trim();
      }

      // Remove any remaining markdown formatting
      description = description.replace(/\*\*/g, "").trim();
      actionableStep = actionableStep.replace(/\*\*/g, "").trim();

      items.push({
        number,
        title,
        description,
        actionableStep,
      });
    }

    // Extract competitor analysis if present
    const competitorAnalysisIndex = fullText.indexOf("Competitor Analysis:");
    let competitorAnalysis = "";

    if (competitorAnalysisIndex > -1) {
      competitorAnalysis = fullText
        .substring(competitorAnalysisIndex + "Competitor Analysis:".length)
        .trim();
      // Remove any markdown formatting
      competitorAnalysis = competitorAnalysis.replace(/\*\*/g, "").trim();
    }

    return { intro, items, competitorAnalysis };
  };

  const toggleExpand = (index: number) => {
    if (expandedSuggestion === index) {
      setExpandedSuggestion(null);
    } else {
      setExpandedSuggestion(index);
    }
  };

  const { intro, items, competitorAnalysis } = processContent();

  return (
    <>
      <main className="min-h-screen bg-gradient-to-br from-sky-50/50 via-white to-violet-50/50 dark:from-slate-950 dark:via-gray-900 dark:to-sky-950/30 text-gray-900 dark:text-white transition-colors duration-300">
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-sky-500/10 dark:bg-sky-500/5 rounded-full blur-3xl"></div>
          <div className="absolute top-1/3 -right-24 w-96 h-96 bg-violet-500/10 dark:bg-violet-500/5 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 left-1/3 w-96 h-96 bg-teal-500/10 dark:bg-teal-500/5 rounded-full blur-3xl"></div>

          {/* Additional decorative elements */}
          <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-sky-400/30 rounded-full animate-pulse"></div>
          <div
            className="absolute top-1/3 right-1/3 w-6 h-6 bg-violet-400/20 rounded-full animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="absolute bottom-1/4 right-1/4 w-5 h-5 bg-teal-400/20 rounded-full animate-pulse"
            style={{ animationDelay: "2s" }}
          ></div>
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
              <motion.div
                className="bg-gradient-to-br from-sky-500 to-violet-500 text-white p-4 rounded-2xl shadow-lg"
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Globe size={32} />
              </motion.div>
              <div>
                <motion.h1
                  className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-sky-500 to-violet-500 bg-clip-text text-transparent"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  SEO Analyzer
                </motion.h1>
                <motion.p
                  className="text-gray-600 dark:text-gray-300 mt-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  Analyze and optimize your website's SEO performance
                </motion.p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05, rotate: 15 }}
              whileTap={{ scale: 0.95 }}
              className="p-3 rounded-full bg-white dark:bg-slate-800 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-gray-700"
              onClick={() => setDarkMode(!darkMode)}
              title="Toggle Theme"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              {darkMode ? (
                <Sun size={22} className="text-amber-400" />
              ) : (
                <Moon size={22} className="text-sky-600" />
              )}
            </motion.button>
          </motion.div>

          {/* Form */}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-16 bg-white dark:bg-slate-800/90 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-gray-100 dark:border-gray-700/50"
          >
            <motion.h2
              className="text-2xl font-semibold mb-6 flex items-center gap-3 text-sky-600 dark:text-sky-300"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <Search className="text-sky-500" size={24} />
              Analyze Your Website
            </motion.h2>
            <div className="mb-5">
              <span className="text-gray-500 dark:text-gray-400 mb-6">
                Purpose of this tool is to analyze your website's SEO
                performance and provide actionable insights to improve your
                search engine rankings.
              </span>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div
                className={`flex ${
                  showCompetitorInput ? "flex-col gap-4" : "items-center gap-4"
                }`}
              >
                {/* Main URL Input */}
                <motion.div
                  className="flex-1 relative"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                >
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
                    <Globe size={20} />
                  </div>
                  <input
                    type="url"
                    placeholder="Enter a website URL (e.g., https://example.com)"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    required
                    className="w-full pl-12 pr-5 py-4 rounded-xl border border-gray-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500 dark:bg-slate-900/80 dark:text-white transition-all duration-200 text-base"
                  />
                </motion.div>

                {/* Analyze Button (Initially in line) */}
                {!showCompetitorInput && (
                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-gradient-to-r from-sky-500 to-violet-500 hover:from-sky-600 hover:to-violet-600 
       text-white font-semibold px-8 py-4 rounded-xl shadow-md transition-all duration-300 
       hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center 
       justify-center gap-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.4 }}
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
                )}
              </div>

              {/* Add Competitor Button */}
              {!showCompetitorInput && (
                <motion.button
                  type="button"
                  onClick={() => setShowCompetitorInput(true)}
                  className="flex items-center gap-2 text-sky-600 dark:text-sky-300 font-medium transition-all duration-200 hover:text-sky-500"
                >
                  <Plus size={18} />
                  Add Competitor
                </motion.button>
              )}

              {/* Competitor URL Input */}
              {showCompetitorInput && (
                <motion.div
                  className="flex-1 relative"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                >
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
                    <Users size={20} />
                  </div>
                  <input
                    type="url"
                    placeholder="Enter competitor website URL (optional)"
                    value={competitorUrl}
                    onChange={(e) => setCompetitorUrl(e.target.value)}
                    className="w-full pl-12 pr-10 py-4 rounded-xl border border-gray-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500 dark:bg-slate-900/80 dark:text-white transition-all duration-200 text-base"
                  />
                  {/* Close (X) Icon */}
                  <button
                    type="button"
                    onClick={() => {
                      setShowCompetitorInput(false);
                      setCompetitorUrl(""); // Clear competitor URL
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-red-500 transition-all duration-200"
                  >
                    <X size={18} />
                  </button>
                </motion.div>
              )}

              {/* Analyze Button (When Competitor is added, move it below the inputs) */}
              {showCompetitorInput && (
                <div className="flex justify-end">
                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-gradient-to-r from-sky-500 to-violet-500 hover:from-sky-600 hover:to-violet-600 
       text-white font-semibold px-8 py-4 rounded-xl shadow-md transition-all duration-300 
       hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center 
       justify-center gap-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.4 }}
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                        <span>Comparing...</span>
                      </>
                    ) : (
                      <>
                        <Search size={18} />
                        <span>Compare</span>
                      </>
                    )}
                  </motion.button>
                </div>
              )}
            </form>

            {/* Comparison Info */}
            {url && (
              <>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.5 }}
                  className="mt-4 flex flex-wrap items-center gap-2 text-sm text-gray-500 dark:text-gray-400"
                >
                  <Info size={14} />
                  <span>
                    Analyzing:{" "}
                    <span className="text-sky-600 dark:text-sky-400 font-medium text-wrap text-center">
                      {url}
                    </span>
                    {competitorUrl && (
                      <>
                        {" "}
                        vs.{" "}
                        <span className="text-sky-600 dark:text-sky-400 font-medium">
                          {competitorUrl}
                        </span>
                      </>
                    )}
                  </span>
                </motion.div>
                {data ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.5 }}
                    className="mt-4 flex flex-wrap items-center gap-2 text-sm text-gray-500 dark:text-gray-400"
                  >
                    <Star size={14} />
                    Based on:
                    {data?.purpose && (
                      <span className="px-3 py-1 rounded-full bg-sky-100 dark:bg-sky-900 text-sky-600 dark:text-sky-400 font-medium text-sm">
                        {formatPurposeText(
                          data.purpose.charAt(0).toUpperCase() +
                            data.purpose.slice(1)
                        )}
                      </span>
                    )}
                  </motion.div>
                ) : null}
              </>
            )}
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
                  <h3 className="font-semibold text-red-700 dark:text-red-300 mb-1">
                    Analysis Failed
                  </h3>
                  <p>{error}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Results */}
          <AnimatePresence>
            {(data || competitorData) && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="space-y-10"
                ref={resultsRef}
              >
                {/* Overview Section */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="bg-white dark:bg-slate-800/90 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700/50 overflow-hidden"
                  ref={overviewRef}
                >
                  <div
                    className="p-6 cursor-pointer flex justify-between items-center"
                    onClick={() => toggleSection("overview")}
                  >
                    <h2 className="text-xl font-semibold flex items-center gap-3 text-sky-600 dark:text-sky-300">
                      <div className="bg-sky-100 dark:bg-sky-900/30 p-2 rounded-lg">
                        <BarChart2
                          className="text-sky-600 dark:text-sky-400"
                          size={22}
                        />
                      </div>
                      Overview
                    </h2>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500 dark:text-gray-400 hidden md:inline-block">
                        {activeSection === "overview"
                          ? "Hide details"
                          : "Show details"}
                      </span>
                      <div className="text-gray-400">
                        {activeSection === "overview" ? (
                          <ChevronUp size={20} />
                        ) : (
                          <ChevronDown size={20} />
                        )}
                      </div>
                    </div>
                  </div>

                  {activeSection === "overview" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="px-6 pb-6"
                    ></motion.div>
                  )}

                  {activeSection === "overview" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="px-6 pb-6"
                    >
                      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
                        {/* Score Card */}
                        <motion.div
                          className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-slate-900 dark:to-emerald-950/20 p-6 rounded-2xl border border-emerald-100 dark:border-emerald-900/30"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.5, delay: 0.4 }}
                          whileHover={{
                            y: -5,
                            boxShadow:
                              "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
                          }}
                        >
                          <div className="flex items-center gap-3 mb-4">
                            <div className="bg-emerald-100 dark:bg-emerald-900/50 p-2 rounded-lg">
                              <Award
                                className="text-emerald-600 dark:text-emerald-400"
                                size={20}
                              />
                            </div>
                            <h3 className="font-semibold text-emerald-700 dark:text-emerald-300">
                              Your SEO Score
                            </h3>
                          </div>
                          <div className="flex items-center justify-center">
                            <div className="relative w-32 h-32">
                              <div className="absolute inset-0 flex items-center justify-center">
                                <motion.span className="text-4xl font-bold text-emerald-700 dark:text-emerald-400">
                                  {scoreDisplay}
                                </motion.span>
                              </div>
                              <ResponsiveContainer width="100%" height="100%">
                                <RadialBarChart
                                  innerRadius="70%"
                                  outerRadius="100%"
                                  data={[
                                    {
                                      name: "Score",
                                      value: 100,
                                      fill: "url(#scoreGradient)",
                                    },
                                  ]}
                                  startAngle={90}
                                  endAngle={-270}
                                >
                                  <defs>
                                    <linearGradient
                                      id="scoreGradient"
                                      x1="0"
                                      y1="0"
                                      x2="0"
                                      y2="1"
                                    >
                                      <stop
                                        offset="0%"
                                        stopColor="#10B981"
                                        stopOpacity={0.8}
                                      />
                                      <stop
                                        offset="100%"
                                        stopColor="#34D399"
                                        stopOpacity={0.8}
                                      />
                                    </linearGradient>
                                  </defs>
                                  <RadialBar
                                    background
                                    dataKey="value"
                                    cornerRadius={30}
                                    fill="#10B981"
                                  />
                                  <RadialBar
                                    background={false}
                                    dataKey="value"
                                    cornerRadius={30}
                                    fill="url(#scoreGradient)"
                                    // @ts-ignore - custom prop for animation
                                    animationBegin={0}
                                    animationDuration={1500}
                                    // @ts-ignore - using motion value for custom animation
                                    data={[
                                      {
                                        name: "Score",
                                        value: scoreSpring.get(),
                                        fill: "url(#scoreGradient)",
                                      },
                                    ]}
                                  />
                                </RadialBarChart>
                              </ResponsiveContainer>
                            </div>
                          </div>
                          <div className="mt-2 text-center text-sm text-emerald-600 dark:text-emerald-400">
                            {data.user?.seoScore > 80
                              ? "Excellent"
                              : data.user?.seoScore > 60
                              ? "Good"
                              : data.user?.seoScore > 40
                              ? "Average"
                              : "Needs Improvement"}
                          </div>
                        </motion.div>

                        {/* Chart Card */}
                        <motion.div
                          className="bg-white dark:bg-slate-900/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-800"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.5, delay: 0.5 }}
                          whileHover={{
                            y: -5,
                            boxShadow:
                              "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
                          }}
                        >
                          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-800 dark:text-gray-200">
                            <BarChart2 className="text-sky-500" size={20} />
                            SEO Score Comparison
                          </h3>
                          <div className="h-[220px]">
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                <defs>
                                  {COLORS.map((color, index) => (
                                    <linearGradient
                                      key={index}
                                      id={`colorGradient${index}`}
                                      x1="0"
                                      y1="0"
                                      x2="0"
                                      y2="1"
                                    >
                                      <stop
                                        offset="0%"
                                        stopColor={color}
                                        stopOpacity={0.8}
                                      />
                                      <stop
                                        offset="100%"
                                        stopColor={color}
                                        stopOpacity={0.9}
                                      />
                                    </linearGradient>
                                  ))}
                                </defs>
                                <Pie
                                  data={chartData}
                                  dataKey="value"
                                  nameKey="name"
                                  cx="50%"
                                  cy="50%"
                                  outerRadius={70}
                                  // label={({ name, value }) =>
                                  //   `${name}: ${value}`
                                  // }
                                  labelLine={false}
                                  animationDuration={1000}
                                  animationBegin={200}
                                >
                                  {chartData.map((entry, index) => (
                                    <Cell
                                      key={`cell-${index}`}
                                      fill={`url(#colorGradient${index})`}
                                      className="drop-shadow-md"
                                    />
                                  ))}
                                </Pie>
                                <Tooltip
                                  contentStyle={{
                                    backgroundColor: darkMode
                                      ? "#1e293b"
                                      : "white",
                                    borderRadius: "0.75rem",
                                    border: "none",
                                    boxShadow:
                                      "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
                                    color: darkMode ? "white" : "black",
                                    padding: "12px 16px",
                                  }}
                                />
                                <Legend
                                  layout="horizontal"
                                  verticalAlign="bottom"
                                  align="center"
                                  wrapperStyle={{ paddingTop: "10px" }}
                                />
                              </PieChart>
                            </ResponsiveContainer>
                          </div>
                        </motion.div>

                        {/* Competitor Score Card */}
                        {competitorData && (
                          <motion.div
                            className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-slate-900 dark:to-emerald-950/20 p-6 rounded-2xl border border-emerald-100 dark:border-emerald-900/30"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            whileHover={{
                              y: -5,
                              boxShadow:
                                "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
                            }}
                          >
                            <div className="flex items-center gap-3 mb-4">
                              <div className="bg-emerald-100 dark:bg-emerald-900/50 p-2 rounded-lg">
                                <Award
                                  className="text-emerald-600 dark:text-emerald-400"
                                  size={20}
                                />
                              </div>
                              <h3 className="font-semibold text-emerald-700 dark:text-emerald-300">
                                Competitor SEO Score
                              </h3>
                            </div>
                            <div className="flex items-center justify-center">
                              <div className="relative w-32 h-32">
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <motion.span className="text-4xl font-bold text-emerald-700 dark:text-emerald-400">
                                    {competitorData.user?.seoScore}
                                  </motion.span>
                                </div>
                                <ResponsiveContainer width="100%" height="100%">
                                  <RadialBarChart
                                    innerRadius="70%"
                                    outerRadius="100%"
                                    data={[
                                      {
                                        name: "Score",
                                        value: 100,
                                        fill: "url(#scoreGradient)",
                                      },
                                    ]}
                                    startAngle={90}
                                    endAngle={-270}
                                  >
                                    <defs>
                                      <linearGradient
                                        id="scoreGradient"
                                        x1="0"
                                        y1="0"
                                        x2="0"
                                        y2="1"
                                      >
                                        <stop
                                          offset="0%"
                                          stopColor="#10B981"
                                          stopOpacity={0.8}
                                        />
                                        <stop
                                          offset="100%"
                                          stopColor="#34D399"
                                          stopOpacity={0.8}
                                        />
                                      </linearGradient>
                                    </defs>
                                    <RadialBar
                                      background
                                      dataKey="value"
                                      cornerRadius={30}
                                      fill="#10B981"
                                    />
                                    <RadialBar
                                      background={false}
                                      dataKey="value"
                                      cornerRadius={30}
                                      fill="url(#scoreGradient)"
                                      // @ts-ignore - custom prop for animation
                                      animationBegin={0}
                                      animationDuration={1500}
                                      // @ts-ignore - using motion value for custom animation
                                      data={[
                                        {
                                          name: "Score",
                                          value: scoreSpring.get(),
                                          fill: "url(#scoreGradient)",
                                        },
                                      ]}
                                    />
                                  </RadialBarChart>
                                </ResponsiveContainer>
                              </div>
                            </div>
                            <div className="mt-2 text-center text-sm text-emerald-600 dark:text-emerald-400">
                              {competitorData.user?.seoScore > 80
                                ? "Excellent"
                                : competitorData.user?.seoScore > 60
                                ? "Good"
                                : competitorData.user?.seoScore > 40
                                ? "Average"
                                : "Needs Improvement"}
                            </div>
                          </motion.div>
                        )}
                      </div>

                      {/* Performance Metrics */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                        className="mt-6 bg-white dark:bg-slate-900/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-800"
                      >
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-800 dark:text-gray-200">
                          <Gauge className="text-sky-500" size={20} />
                          Performance Metrics
                        </h3>
                        <div className="h-[220px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                              data={performanceData}
                              margin={{
                                top: 20,
                                right: 30,
                                left: 20,
                                bottom: 5,
                              }}
                            >
                              <CartesianGrid
                                strokeDasharray="3 3"
                                opacity={0.1}
                              />
                              <XAxis dataKey="name" />
                              <YAxis domain={[0, 100]} />
                              <Tooltip
                                contentStyle={{
                                  backgroundColor: darkMode
                                    ? "#1e293b"
                                    : "white",
                                  borderRadius: "0.75rem",
                                  border: "none",
                                  boxShadow:
                                    "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
                                  color: darkMode ? "white" : "black",
                                  padding: "12px 16px",
                                }}
                              />
                              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                {performanceData.map((entry, index) => (
                                  <Cell
                                    key={`cell-${index}`}
                                    fill={entry.fill}
                                  />
                                ))}
                              </Bar>
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                        <div className="grid grid-cols-3 gap-4 mt-4">
                          <div className="flex flex-col items-center">
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              SEO Score
                            </div>
                            <div className="text-xl font-bold text-sky-600 dark:text-sky-400">
                              {data?.user?.seoScore || 0}/100
                            </div>
                          </div>
                          <div className="flex flex-col items-center">
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              Page Speed
                            </div>
                            <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                              {pageSpeedScore}/100
                            </div>
                          </div>
                          <div className="flex flex-col items-center">
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              Readability
                            </div>
                            <div className="text-xl font-bold text-purple-600 dark:text-purple-400">
                              {readabilityScore}/100
                            </div>
                          </div>
                        </div>
                      </motion.div>

                      {competitorData && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: 0.6 }}
                          className="mt-6 bg-white dark:bg-slate-900/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-800"
                        >
                          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-800 dark:text-gray-200">
                            <Gauge className="text-sky-500" size={20} />
                            Competitor Performance Metrics
                          </h3>
                          <div className="h-[220px]">
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart
                                data={competitorPerformanceData}
                                margin={{
                                  top: 20,
                                  right: 30,
                                  left: 20,
                                  bottom: 5,
                                }}
                              >
                                <CartesianGrid
                                  strokeDasharray="3 3"
                                  opacity={0.1}
                                />
                                <XAxis dataKey="name" />
                                <YAxis domain={[0, 100]} />
                                <Tooltip
                                  contentStyle={{
                                    backgroundColor: darkMode
                                      ? "#1e293b"
                                      : "white",
                                    borderRadius: "0.75rem",
                                    border: "none",
                                    boxShadow:
                                      "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
                                    color: darkMode ? "white" : "black",
                                    padding: "12px 16px",
                                  }}
                                />
                                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                  {competitorPerformanceData.map(
                                    (entry, index) => (
                                      <Cell
                                        key={`cell-${index}`}
                                        fill={entry.fill}
                                      />
                                    )
                                  )}
                                </Bar>
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                          <div className="grid grid-cols-3 gap-4 mt-4">
                            <div className="flex flex-col items-center">
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                SEO Score
                              </div>
                              <div className="text-xl font-bold text-sky-600 dark:text-sky-400">
                                {competitorData?.user?.seoScore || 0}/100
                              </div>
                            </div>
                            <div className="flex flex-col items-center">
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                Page Speed
                              </div>
                              <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                                {competitorPageSpeedScore}/100
                              </div>
                            </div>
                            <div className="flex flex-col items-center">
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                Readability
                              </div>
                              <div className="text-xl font-bold text-purple-600 dark:text-purple-400">
                                {competitorReadabilityScore}/100
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  )}
                </motion.div>

                {/* Metadata Section */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="bg-white dark:bg-slate-800/90 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700/50 overflow-hidden"
                >
                  <div
                    className="p-6 cursor-pointer flex justify-between items-center"
                    onClick={() => toggleSection("metadata")}
                  >
                    <h2 className="text-xl font-semibold flex items-center gap-3 text-sky-600 dark:text-sky-300">
                      <div className="bg-sky-100 dark:bg-sky-900/30 p-2 rounded-lg">
                        <FileText
                          className="text-sky-600 dark:text-sky-400"
                          size={22}
                        />
                      </div>
                      Metadata
                    </h2>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500 dark:text-gray-400 hidden md:inline-block">
                        {activeSection === "metadata"
                          ? "Hide details"
                          : "Show details"}
                      </span>
                      <div className="text-gray-400">
                        {activeSection === "metadata" ? (
                          <ChevronUp size={20} />
                        ) : (
                          <ChevronDown size={20} />
                        )}
                      </div>
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
                        <motion.div
                          className="bg-gradient-to-r from-sky-50 to-sky-100/30 dark:from-slate-900 dark:to-sky-950/10 p-6 rounded-2xl border border-sky-100 dark:border-sky-900/30"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5, delay: 0.3 }}
                          whileHover={{
                            y: -5,
                            boxShadow:
                              "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
                          }}
                        >
                          <h3 className="font-medium text-sky-700 dark:text-sky-300 mb-3 flex items-center gap-2">
                            <FileText size={16} className="text-sky-500" />
                            Title
                          </h3>
                          <div className="bg-white/80 dark:bg-slate-900/80 p-4 rounded-xl border border-sky-100/50 dark:border-sky-900/30">
                            <p className="text-gray-800 dark:text-gray-200 font-medium">
                              {data.user?.metadata?.title || "N/A"}
                            </p>
                          </div>
                        </motion.div>

                        {competitorData && (
                          <motion.div
                            className="bg-gradient-to-r from-sky-50 to-sky-100/30 dark:from-slate-900 dark:to-sky-950/10 p-6 rounded-2xl border border-sky-100 dark:border-sky-900/30"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            whileHover={{
                              y: -5,
                              boxShadow:
                                "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
                            }}
                          >
                            <h3 className="font-medium text-sky-700 dark:text-sky-300 mb-3 flex items-center gap-2">
                              <FileText size={16} className="text-sky-500" />
                              Competitor Title
                            </h3>
                            <div className="bg-white/80 dark:bg-slate-900/80 p-4 rounded-xl border border-sky-100/50 dark:border-sky-900/30">
                              <p className="text-gray-800 dark:text-gray-200 font-medium">
                                {competitorData.user?.metadata?.title || "N/A"}
                              </p>
                            </div>
                          </motion.div>
                        )}

                        <motion.div
                          className="bg-gradient-to-r from-sky-50 to-sky-100/30 dark:from-slate-900 dark:to-sky-950/10 p-6 rounded-2xl border border-sky-100 dark:border-sky-900/30"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5, delay: 0.4 }}
                          whileHover={{
                            y: -5,
                            boxShadow:
                              "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
                          }}
                        >
                          <h3 className="font-medium text-sky-700 dark:text-sky-300 mb-3 flex items-center gap-2">
                            <FileText size={16} className="text-sky-500" />
                            Description
                          </h3>
                          <div className="bg-white/80 dark:bg-slate-900/80 p-4 rounded-xl border border-sky-100/50 dark:border-sky-900/30">
                            <p className="text-gray-800 dark:text-gray-200">
                              {data.user?.metadata?.description ||
                                "No description provided."}
                            </p>
                          </div>
                        </motion.div>

                        {competitorData && (
                          <motion.div
                            className="bg-gradient-to-r from-sky-50 to-sky-100/30 dark:from-slate-900 dark:to-sky-950/10 p-6 rounded-2xl border border-sky-100 dark:border-sky-900/30"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            whileHover={{
                              y: -5,
                              boxShadow:
                                "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
                            }}
                          >
                            <h3 className="font-medium text-sky-700 dark:text-sky-300 mb-3 flex items-center gap-2">
                              <FileText size={16} className="text-sky-500" />
                              Competitor Description
                            </h3>
                            <div className="bg-white/80 dark:bg-slate-900/80 p-4 rounded-xl border border-sky-100/50 dark:border-sky-900/30">
                              <p className="text-gray-800 dark:text-gray-200">
                                {competitorData.user?.metadata?.description ||
                                  "No description provided."}
                              </p>
                            </div>
                          </motion.div>
                        )}

                        <motion.div
                          className="bg-gradient-to-r from-sky-50 to-sky-100/30 dark:from-slate-900 dark:to-sky-950/10 p-6 rounded-2xl border border-sky-100 dark:border-sky-900/30"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5, delay: 0.5 }}
                          whileHover={{
                            y: -5,
                            boxShadow:
                              "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
                          }}
                        >
                          <h3 className="font-medium text-sky-700 dark:text-sky-300 mb-3 flex items-center gap-2">
                            <LinkIcon size={16} className="text-sky-500" />
                            Links
                          </h3>
                          <div className="bg-white/80 dark:bg-slate-900/80 p-4 rounded-xl border border-sky-100/50 dark:border-sky-900/30">
                            {data.user?.metadata?.links?.length > 0 ? (
                              <ul className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                                {data.user?.metadata?.links?.map(
                                  (link: string, index: number) => (
                                    <motion.li
                                      key={index}
                                      className="flex items-center gap-2 group"
                                      initial={{ opacity: 0, x: -10 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      transition={{
                                        duration: 0.3,
                                        delay: 0.1 * index,
                                      }}
                                      whileHover={{ x: 5 }}
                                    >
                                      <div className="bg-sky-100 dark:bg-sky-900/30 p-1.5 rounded-lg group-hover:bg-sky-200 dark:group-hover:bg-sky-800/30 transition-colors">
                                        <ExternalLink
                                          size={14}
                                          className="text-sky-600 dark:text-sky-400"
                                        />
                                      </div>
                                      <a
                                        href={link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sky-600 dark:text-sky-400 hover:text-sky-800 dark:hover:text-sky-300 transition-colors truncate text-sm"
                                      >
                                        {link}
                                      </a>
                                    </motion.li>
                                  )
                                )}
                              </ul>
                            ) : (
                              <p className="text-gray-500 dark:text-gray-400">
                                No links found
                              </p>
                            )}
                          </div>
                        </motion.div>

                        {competitorData && (
                          <motion.div
                            className="bg-gradient-to-r from-sky-50 to-sky-100/30 dark:from-slate-900 dark:to-sky-950/10 p-6 rounded-2xl border border-sky-100 dark:border-sky-900/30"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.5 }}
                            whileHover={{
                              y: -5,
                              boxShadow:
                                "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
                            }}
                          >
                            <h3 className="font-medium text-sky-700 dark:text-sky-300 mb-3 flex items-center gap-2">
                              <LinkIcon size={16} className="text-sky-500" />
                              Competitor Links
                            </h3>
                            <div className="bg-white/80 dark:bg-slate-900/80 p-4 rounded-xl border border-sky-100/50 dark:border-sky-900/30">
                              {competitorData.user?.metadata?.links?.length >
                              0 ? (
                                <ul className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                                  {competitorData.user?.metadata?.links?.map(
                                    (link: string, index: number) => (
                                      <motion.li
                                        key={index}
                                        className="flex items-center gap-2 group"
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{
                                          duration: 0.3,
                                          delay: 0.1 * index,
                                        }}
                                        whileHover={{ x: 5 }}
                                      >
                                        <div className="bg-sky-100 dark:bg-sky-900/30 p-1.5 rounded-lg group-hover:bg-sky-200 dark:group-hover:bg-sky-800/30 transition-colors">
                                          <ExternalLink
                                            size={14}
                                            className="text-sky-600 dark:text-sky-400"
                                          />
                                        </div>
                                        <a
                                          href={link}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-sky-600 dark:text-sky-400 hover:text-sky-800 dark:hover:text-sky-300 transition-colors truncate text-sm"
                                        >
                                          {link}
                                        </a>
                                      </motion.li>
                                    )
                                  )}
                                </ul>
                              ) : (
                                <p className="text-gray-500 dark:text-gray-400">
                                  No links found
                                </p>
                              )}
                            </div>
                          </motion.div>
                        )}
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
                    <h2 className="text-xl font-semibold flex items-center gap-3 text-sky-600 dark:text-sky-300">
                      <div className="bg-sky-100 dark:bg-sky-900/30 p-2 rounded-lg">
                        <Lightbulb
                          className="text-sky-600 dark:text-sky-400"
                          size={22}
                        />
                      </div>
                      Suggestions
                    </h2>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500 dark:text-gray-400 hidden md:inline-block">
                        {activeSection === "suggestions"
                          ? "Hide details"
                          : "Show details"}
                      </span>
                      <div className="text-gray-400">
                        {activeSection === "suggestions" ? (
                          <ChevronUp size={20} />
                        ) : (
                          <ChevronDown size={20} />
                        )}
                      </div>
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
                      <motion.div
                        className="bg-gradient-to-r from-sky-50 via-white to-violet-50 dark:from-slate-900 dark:via-slate-900 dark:to-violet-950/10 p-6 rounded-2xl border border-sky-100 dark:border-sky-900/30"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        whileHover={{
                          y: -5,
                          boxShadow:
                            "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
                        }}
                      >
                        <div className="flex items-center gap-3 mb-6">
                          <div className="bg-sky-100 dark:bg-sky-900/50 p-2 rounded-lg">
                            <Sparkles
                              size={18}
                              className="text-sky-600 dark:text-sky-400"
                            />
                          </div>
                          <h3 className="font-medium text-sky-700 dark:text-sky-300">
                            SEO Improvement Suggestions
                          </h3>
                        </div>

                        {intro && (
                          <div className="text-gray-700 dark:text-gray-300 text-base mb-6 leading-relaxed">
                            {intro}
                          </div>
                        )}

                        {items.length > 0 ? (
                          <div className="space-y-4">
                            {items.map((item, index) => (
                              <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{
                                  duration: 0.4,
                                  delay: index * 0.1,
                                }}
                                className={`bg-white/80 dark:bg-slate-900/80 rounded-xl border ${
                                  expandedSuggestion === index
                                    ? "border-sky-300 dark:border-sky-700"
                                    : "border-sky-100/50 dark:border-sky-900/30 hover:border-sky-300 dark:hover:border-sky-700"
                                } transition-colors group overflow-hidden`}
                              >
                                <div
                                  className="p-5 cursor-pointer"
                                  onClick={() => toggleExpand(index)}
                                >
                                  <div className="flex items-start gap-3">
                                    <div className="mt-0.5 bg-emerald-100 dark:bg-emerald-900/30 p-1.5 rounded-lg group-hover:bg-emerald-200 dark:group-hover:bg-emerald-800/30 transition-colors flex-shrink-0">
                                      <CheckSquare
                                        size={18}
                                        className="text-emerald-500 dark:text-emerald-400"
                                      />
                                    </div>
                                    <div className="flex-1">
                                      <div className="flex justify-between items-center">
                                        <h4 className="text-gray-800 dark:text-gray-200 font-semibold text-lg">
                                          {item.number}. {item.title}
                                        </h4>
                                        {expandedSuggestion === index ? (
                                          <ChevronUp className="h-5 w-5 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                                        ) : (
                                          <ChevronDown className="h-5 w-5 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                                        )}
                                      </div>

                                      {expandedSuggestion !== index && (
                                        <p className="text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                                          {item.description}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                {expandedSuggestion === index && (
                                  <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.3 }}
                                  >
                                    <Separator className="w-full" />
                                    <div className="p-5 pt-4">
                                      <div className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                        {item.description}
                                      </div>

                                      {item.actionableStep && (
                                        <div className="mt-4 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800/30">
                                          <div className="flex items-center gap-2 mb-2">
                                            <ArrowRight
                                              size={16}
                                              className="text-blue-600 dark:text-blue-400"
                                            />
                                            <h5 className="text-blue-700 dark:text-blue-300 font-medium">
                                              Actionable Step
                                            </h5>
                                          </div>
                                          <p className="text-gray-700 dark:text-gray-300 pl-6">
                                            {item.actionableStep}
                                          </p>
                                        </div>
                                      )}
                                    </div>
                                  </motion.div>
                                )}
                              </motion.div>
                            ))}
                          </div>
                        ) : (
                          <div className="bg-white/80 dark:bg-slate-900/80 p-5 rounded-xl border border-sky-100/50 dark:border-sky-900/30">
                            <p className="text-gray-800 dark:text-gray-200">
                              No suggestions available.
                            </p>
                          </div>
                        )}

                        {competitorAnalysis && (
                          <div className="mt-6 pt-6 border-t border-sky-100/50 dark:border-sky-900/30">
                            <h4 className="text-gray-800 dark:text-gray-200 font-semibold mb-3">
                              Competitor Analysis
                            </h4>
                            <div className="text-gray-700 dark:text-gray-300 leading-relaxed">
                              {competitorAnalysis}
                            </div>
                          </div>
                        )}
                      </motion.div>
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
                      "Copy Suggestions"
                    )}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleDownload}
                    className="flex items-center gap-2 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    <Download size={18} />
                    Download Suggestions
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
            background: ${darkMode
              ? "rgba(30, 41, 59, 0.5)"
              : "rgba(241, 245, 249, 0.5)"};
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: ${darkMode
              ? "rgba(14, 165, 233, 0.5)"
              : "rgba(14, 165, 233, 0.3)"};
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: ${darkMode
              ? "rgba(14, 165, 233, 0.7)"
              : "rgba(14, 165, 233, 0.5)"};
          }
        `}</style>
      </main>
    </>
  );
}
