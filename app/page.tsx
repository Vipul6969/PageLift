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
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Line,
  CartesianGrid,
  Area,
  AreaChart,
  LineChart,
  Legend,
} from "recharts";
import { jsPDF } from "jspdf";
import {
  Copy,
  Download,
  ArrowRight,
  Sun,
  Moon,
  Search,
  ExternalLink,
  AlertCircle,
  BarChart2,
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
  Gauge,
  Plus,
  Star,
  X,
  TrendingUp,
  Maximize,
  Minimize,
  LineChart as LineChartIcon,
  Target,
  Hexagon,
  Activity,
  Radar,
  Crosshair,
  Bolt,
  Wand2,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

// Ultra-modern color palette
const COLORS = {
  primary: "#6366F1",
  primaryLight: "#818CF8",
  primaryDark: "#4F46E5",
  secondary: "#EC4899",
  secondaryLight: "#F472B6",
  secondaryDark: "#DB2777",
  accent: "#10B981",
  accentLight: "#34D399",
  accentDark: "#059669",
  warning: "#F59E0B",
  warningLight: "#FBBF24",
  warningDark: "#D97706",
  danger: "#EF4444",
  dangerLight: "#F87171",
  dangerDark: "#DC2626",
  info: "#0EA5E9",
  infoLight: "#38BDF8",
  infoDark: "#0284C7",
  success: "#22C55E",
  successLight: "#4ADE80",
  successDark: "#16A34A",
  neutral: "#6B7280",
  neutralLight: "#9CA3AF",
  neutralDark: "#4B5563",
  background: "#FFFFFF",
  backgroundDark: "#0F172A",
  surface: "#F8FAFC",
  surfaceDark: "#1E293B",
};

// Gradient definitions
const GRADIENTS = {
  primary: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryLight} 100%)`,
  secondary: `linear-gradient(135deg, ${COLORS.secondary} 0%, ${COLORS.secondaryLight} 100%)`,
  accent: `linear-gradient(135deg, ${COLORS.accent} 0%, ${COLORS.accentLight} 100%)`,
  info: `linear-gradient(135deg, ${COLORS.info} 0%, ${COLORS.infoLight} 100%)`,
  success: `linear-gradient(135deg, ${COLORS.success} 0%, ${COLORS.successLight} 100%)`,
  warning: `linear-gradient(135deg, ${COLORS.warning} 0%, ${COLORS.warningLight} 100%)`,
  danger: `linear-gradient(135deg, ${COLORS.danger} 0%, ${COLORS.dangerLight} 100%)`,
  neutral: `linear-gradient(135deg, ${COLORS.neutral} 0%, ${COLORS.neutralLight} 100%)`,
  rainbow: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.info} 25%, ${COLORS.accent} 50%, ${COLORS.warning} 75%, ${COLORS.secondary} 100%)`,
  cosmic: `linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #D946EF 100%)`,
  sunset: `linear-gradient(135deg, #F43F5E 0%, #EC4899 50%, #8B5CF6 100%)`,
  ocean: `linear-gradient(135deg, #0EA5E9 0%, #06B6D4 50%, #0891B2 100%)`,
  forest: `linear-gradient(135deg, #10B981 0%, #059669 50%, #047857 100%)`,
};

// Chart color arrays
const CHART_COLORS = [
  COLORS.primary,
  COLORS.secondary,
  COLORS.accent,
  COLORS.info,
  COLORS.warning,
  COLORS.danger,
];

// Animation variants
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const slideUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const slideRight = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
};

const scale = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 },
};

const stagger = {
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

// Custom components
const GlowingBadge = ({
  children,
  color = "primary",
}: {
  children: React.ReactNode;
  color?: string;
}) => {
  const colorMap: Record<string, string> = {
    primary: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20",
    secondary: "bg-pink-500/10 text-pink-500 border-pink-500/20",
    accent: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    info: "bg-sky-500/10 text-sky-500 border-sky-500/20",
    warning: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    danger: "bg-red-500/10 text-red-500 border-red-500/20",
    success: "bg-green-500/10 text-green-500 border-green-500/20",
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${colorMap[color]} shadow-sm`}
    >
      {children}
    </span>
  );
};

const GlassCard = ({
  children,
  className = "",
  glowColor = "indigo",
  hoverEffect = true,
}: {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  hoverEffect?: boolean;
}) => {
  const hoverClass = hoverEffect ? "hover:shadow-lg hover:-translate-y-1" : "";

  return (
    <div
      className={`relative backdrop-blur-md bg-white/80 dark:bg-slate-900/80 rounded-2xl border border-white/20 dark:border-slate-700/30 shadow-md overflow-hidden transition-all duration-300 ${hoverClass} ${className}`}
      style={{
        boxShadow: `0 0 20px -5px ${
          COLORS[glowColor as keyof typeof COLORS]
        }20`,
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/20 dark:from-slate-800/5 dark:to-slate-800/20 pointer-events-none"></div>
      <div className="relative z-10">{children}</div>
    </div>
  );
};

const NeumorphicIcon = ({
  icon: Icon,
  color = "primary",
  size = 20,
  className = "",
}: {
  icon: any;
  color?: string;
  size?: number;
  className?: string;
}) => {
  const colorMap: Record<string, string> = {
    primary: "text-indigo-500 dark:text-indigo-400",
    secondary: "text-pink-500 dark:text-pink-400",
    accent: "text-emerald-500 dark:text-emerald-400",
    info: "text-sky-500 dark:text-sky-400",
    warning: "text-amber-500 dark:text-amber-400",
    danger: "text-red-500 dark:text-red-400",
    success: "text-green-500 dark:text-green-400",
    neutral: "text-gray-500 dark:text-gray-400",
  };

  return (
    <div
      className={`flex items-center justify-center p-2 rounded-xl bg-white dark:bg-slate-800 shadow-sm ${className}`}
    >
      <Icon size={size} className={colorMap[color]} />
    </div>
  );
};

const GradientButton = ({
  children,
  onClick,
  gradient = "primary",
  className = "",
  icon: Icon = null,
  disabled = false,
}: {
  children: React.ReactNode;
  onClick?: (e: React.FormEvent) => void;
  gradient?: string;
  className?: string;
  icon?: any;
  disabled?: boolean;
}) => {
  const gradientMap: Record<string, string> = {
    primary:
      "from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700",
    secondary:
      "from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700",
    accent:
      "from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700",
    info: "from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700",
    warning:
      "from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700",
    danger: "from-red-500 to-red-600 hover:from-red-600 hover:to-red-700",
    success:
      "from-green-500 to-green-600 hover:from-green-600 hover:to-green-700",
    cosmic:
      "from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600",
    ocean:
      "from-sky-500 via-cyan-500 to-blue-500 hover:from-sky-600 hover:via-cyan-600 hover:to-blue-600",
    sunset:
      "from-red-500 via-orange-500 to-yellow-500 hover:from-red-600 hover:via-orange-600 hover:to-yellow-600",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`relative group overflow-hidden px-6 py-3 rounded-xl font-medium text-white shadow-md transition-all duration-300 
      bg-gradient-to-r ${gradientMap[gradient]} disabled:opacity-70 disabled:cursor-not-allowed ${className}`}
    >
      <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
      <span className="relative flex items-center justify-center gap-2">
        {Icon && <Icon size={18} />}
        {children}
      </span>
    </button>
  );
};

const AnimatedNumber = ({
  value,
  duration = 2000,
}: {
  value: number;
  duration?: number;
}) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const updateValue = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setDisplayValue(Math.floor(progress * value));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(updateValue);
      }
    };

    animationFrame = requestAnimationFrame(updateValue);

    return () => cancelAnimationFrame(animationFrame);
  }, [value, duration]);

  return <span>{displayValue}</span>;
};

const CircularProgress = ({
  value,
  size = 120,
  strokeWidth = 8,
  color = "primary",
  showValue = true,
  className = "",
}: {
  value: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  showValue?: boolean;
  className?: string;
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progress = value / 100;
  const strokeDashoffset = circumference - progress * circumference;

  const colorMap: Record<string, string> = {
    primary: "#6366F1",
    secondary: "#EC4899",
    accent: "#10B981",
    info: "#0EA5E9",
    warning: "#F59E0B",
    danger: "#EF4444",
    success: "#22C55E",
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return colorMap.success;
    if (score >= 60) return colorMap.accent;
    if (score >= 40) return colorMap.warning;
    return colorMap.danger;
  };

  const strokeColor = color === "auto" ? getScoreColor(value) : colorMap[color];

  return (
    <div
      className={`relative ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-gray-200 dark:text-gray-700"
        />

        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>

      {showValue && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold">
            <AnimatedNumber value={value} />
          </span>
        </div>
      )}
    </div>
  );
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
  const [expandedSuggestion, setExpandedSuggestion] = useState<number | null>(
    null
  );
  const [showCompetitorInput, setShowCompetitorInput] = useState(false);
  const [fullscreenSection, setFullscreenSection] = useState<string | null>(
    null
  );

  // Animated values for radial progress
  const scoreProgress = useMotionValue(0);
  const scoreDisplay = useTransform(scoreProgress, (value) =>
    Math.round(value)
  );
  const scoreSpring = useSpring(scoreProgress, { stiffness: 100, damping: 30 });

  // Mock data for page speed and readability scores
  const pageSpeedScore = data?.pageSpeed?.performance || 75;
  const competitorPageSpeedScore = competitorData?.pageSpeed?.performance || 75;

  const readabilityScore = data?.readability.readabilityScore || 75;
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
      // Start fetching the user SEO data
      const userSeoUrl = `https://pagelift-app.azurewebsites.net/api/seo-analyzer?url=${encodeURIComponent(
        url
      )}`;

      const userRequest = fetch(userSeoUrl);

      // Fetch competitor SEO data if competitorUrl exists
      const competitorRequest = competitorUrl
        ? fetch(
            `https://pagelift-app.azurewebsites.net/api/seo-analyzer?url=${encodeURIComponent(
              competitorUrl
            )}`
          )
        : null;

      // Wait for both the user and competitor requests to resolve (in parallel)
      const [userRes, competitorRes] = await Promise.all([
        userRequest,
        competitorRequest,
      ]);

      // Handle user SEO data
      if (!userRes.ok) throw new Error("Failed to fetch SEO data");
      const userResult = await userRes.json();
      setData(userResult);
      console.log(userResult);
      setActiveSection("overview");

      // Handle competitor SEO data, if competitor data exists
      if (competitorRes && competitorRes.ok) {
        const competitorResult = await competitorRes.json();
        setCompetitorData(competitorResult);
      } else if (competitorUrl) {
        // If competitor URL is provided but the response was not okay
        throw new Error("Failed to fetch competitor SEO data");
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
      return keyword
        ? keyword.charAt(0).toUpperCase() + keyword.slice(1)
        : null;
    } catch (error) {
      // If URL is invalid
      return null;
    }
  }

  const handleCopy = () => {
    const formatData = (obj: any, indent = ""): string => {
      if (obj === null || obj === undefined) return "";
      if (typeof obj !== "object") return `${obj}`;

      if (Array.isArray(obj)) {
        return obj
          .map((item, index) => {
            if (typeof item === "object" && item !== null) {
              return `${indent}-\n${formatData(item, indent + "  ")}`;
            }
            return `${indent}- ${item}`;
          })
          .join("\n");
      }

      return Object.entries(obj)
        .map(([key, value]) => {
          if (typeof value === "object" && value !== null) {
            return `${indent}${key}:\n${formatData(value, indent + "  ")}`;
          }
          return `${indent}${key}: ${value}`;
        })
        .join("\n");
    };

    if (data && typeof data === "object") {
      const plainText = formatData(data);
      navigator.clipboard.writeText(plainText);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  const handleDownload = () => {
    const formatData = (obj: any, indent = ""): string => {
      if (obj === null || obj === undefined) return "";
      if (typeof obj !== "object") return `${obj}`;

      if (Array.isArray(obj)) {
        return obj
          .map((item) => {
            if (typeof item === "object" && item !== null) {
              return `${indent}-\n${formatData(item, indent + "  ")}`;
            }
            return `${indent}- ${item}`;
          })
          .join("\n");
      }

      return Object.entries(obj)
        .map(([key, value]) => {
          if (typeof value === "object" && value !== null) {
            return `${indent}${key}:\n${formatData(value, indent + "  ")}`;
          }
          return `${indent}${key}: ${value}`;
        })
        .join("\n");
    };

    if (data && typeof data === "object") {
      const doc = new jsPDF();
      const marginLeft = 10;
      const marginTop = 10;
      const lineHeight = 8;
      const pageHeight = doc.internal.pageSize.height;

      const plainText = formatData(data);
      const lines = doc.splitTextToSize(plainText, 180); // wraps at 180mm width

      let y = marginTop;

      lines.forEach((line: string | string[]) => {
        if (y + lineHeight > pageHeight - 10) {
          doc.addPage();
          y = marginTop;
        }
        doc.text(line, marginLeft, y);
        y += lineHeight;
      });

      doc.save("seo-analysis.pdf");
    }
  };

  const toggleSection = (section: string) => {
    setActiveSection(activeSection === section ? null : section);
  };

  const toggleFullscreen = (section: string | null) => {
    setFullscreenSection(section);
    // If entering fullscreen, also make sure the section is active
    if (section) {
      setActiveSection(section);
    }
  };

  const chartData =
    data && data.user?.seoScore
      ? [
          {
            name: "Your Site",
            value: data.user.seoScore,
            fill: CHART_COLORS[0],
          },
          ...data.competitors.map((c: any, i: number) => ({
            name: `${extractKeywordFromUrl(c.url)} `,
            value: c.seoScore?.score || 0,
            fill: CHART_COLORS[(i + 1) % CHART_COLORS.length],
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
    {
      name: "SEO Score",
      value: data?.user?.seoScore || 0,
      fill: CHART_COLORS[0],
    },
    { name: "Page Speed", value: pageSpeedScore, fill: CHART_COLORS[1] },
    { name: "Readability", value: readabilityScore, fill: CHART_COLORS[2] },
  ];

  const competitorPerformanceData = [
    {
      name: "SEO Score",
      value: competitorData?.user?.seoScore || 0,
      fill: CHART_COLORS[0],
    },
    {
      name: "Page Speed",
      value: competitorPageSpeedScore,
      fill: CHART_COLORS[1],
    },
    {
      name: "Readability",
      value: competitorReadabilityScore,
      fill: CHART_COLORS[2],
    },
  ];

  // Generate some mock time-series data for the area chart
  const generateTimeSeriesData = (baseValue: number, points = 7) => {
    const result = [];
    const now = new Date();

    for (let i = points - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(now.getDate() - i);

      // Generate a value that fluctuates around the base value
      const fluctuation = Math.random() * 20 - 10; // -10 to +10
      const value = Math.max(0, Math.min(100, baseValue + fluctuation));

      result.push({
        date: date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        value: Math.round(value),
      });
    }

    return result;
  };

  const seoTrendData = data?.user?.seoScore
    ? generateTimeSeriesData(data.user.seoScore)
    : [];

  const competitorTrendData = competitorData?.user?.seoScore
    ? generateTimeSeriesData(competitorData.user.seoScore)
    : [];

  const processContent = () => {
    if (!data?.suggestions?.suggestion) return { intro: "", items: [] };

    // Clean up the text and remove any quotes at the beginning and end
    const fullText = data?.suggestions?.suggestion.replace(/^"|"$/g, "");

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

  // Get score rating text and color
  const getScoreRating = (score: number) => {
    if (score > 80) return { text: "Excellent", color: "success" };
    if (score > 60) return { text: "Good", color: "accent" };
    if (score > 40) return { text: "Average", color: "warning" };
    return { text: "Needs Improvement", color: "danger" };
  };

  const userScoreRating = getScoreRating(data?.user?.seoScore || 0);
  const competitorScoreRating = getScoreRating(
    competitorData?.user?.seoScore || 0
  );

  const currentScore = data?.user?.seoScore || 0;
  const growthPercentage = data?.estimationGrowth || 0;

  // Calculate how much the score should grow
  const growthValue = (currentScore * growthPercentage) / 100;

  // Add the growth to the current score, but cap it at 100
  const estimatedScore = Math.min(currentScore + growthValue, 100);

  const formattedData = [
    { time: "Current", value: currentScore },
    { time: "Estimated", value: estimatedScore },
  ];

  // Determine if a section is fullscreen
  const isFullscreen = fullscreenSection !== null;

  return (
    <>
      <main
        className={`min-h-screen bg-gradient-to-br from-indigo-50/50 via-white to-sky-50/50 dark:from-slate-950 dark:via-gray-900 dark:to-indigo-950/30 text-gray-900 dark:text-white transition-colors duration-300 ${
          isFullscreen ? "overflow-hidden" : ""
        }`}
      >
        {/* Animated Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
          {/* Gradient Orbs */}
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-500/5 rounded-full blur-3xl animate-pulse"></div>
          <div
            className="absolute top-1/3 -right-24 w-96 h-96 bg-sky-500/10 dark:bg-sky-500/5 rounded-full blur-3xl animate-pulse"
            style={{ animationDuration: "15s" }}
          ></div>
          <div
            className="absolute -bottom-24 left-1/3 w-96 h-96 bg-emerald-500/10 dark:bg-emerald-500/5 rounded-full blur-3xl animate-pulse"
            style={{ animationDuration: "20s" }}
          ></div>

          {/* Floating Particles */}
          <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-indigo-400/30 rounded-full animate-float"></div>
          <div
            className="absolute top-1/3 right-1/3 w-6 h-6 bg-sky-400/20 rounded-full animate-float"
            style={{ animationDelay: "1s", animationDuration: "15s" }}
          ></div>
          <div
            className="absolute bottom-1/4 right-1/4 w-5 h-5 bg-emerald-400/20 rounded-full animate-float"
            style={{ animationDelay: "2s", animationDuration: "20s" }}
          ></div>
          <div
            className="absolute top-2/3 left-1/2 w-3 h-3 bg-pink-400/20 rounded-full animate-float"
            style={{ animationDelay: "1.5s", animationDuration: "18s" }}
          ></div>
          <div
            className="absolute top-1/2 left-1/5 w-4 h-4 bg-amber-400/20 rounded-full animate-float"
            style={{ animationDelay: "0.7s", animationDuration: "12s" }}
          ></div>

          {/* Grid Pattern */}
          <div className="absolute inset-0 bg-grid-pattern bg-[length:50px_50px] opacity-[0.02] dark:opacity-[0.03]"></div>
        </div>

        <div
          className={`relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 transition-all duration-500 ${
            isFullscreen ? "h-screen overflow-hidden" : ""
          }`}
        >
          {/* Header */}
          <AnimatePresence>
            {!isFullscreen && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6 }}
                className="flex flex-col md:flex-row justify-between items-center gap-6 mb-16"
              >
                <div className="flex items-center gap-4">
                  <motion.div
                    className="relative"
                    whileHover={{ scale: 1.05, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <div className="absolute inset-0 bg-indigo-600 rounded-2xl blur-lg opacity-30 animate-pulse"></div>
                    <div className="relative bg-gradient-to-br from-indigo-500 to-violet-600 text-white p-4 rounded-2xl shadow-lg">
                      <Hexagon size={32} />
                    </div>
                  </motion.div>
                  <div>
                    <motion.h1
                      className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-500 via-blue-500 to-violet-600 bg-clip-text text-transparent"
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
                    <Moon size={22} className="text-indigo-600" />
                  )}
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <AnimatePresence>
            {!isFullscreen && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="mb-16"
              >
                <GlassCard className="p-8">
                  <motion.h2
                    className="text-2xl font-semibold mb-6 flex items-center gap-3 text-indigo-600 dark:text-indigo-300"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                  >
                    <NeumorphicIcon icon={Search} color="primary" />
                    Analyze Your Website
                  </motion.h2>
                  <div className="mb-5">
                    <span className="text-gray-500 dark:text-gray-400 mb-6">
                      Enter your website's URL to analyze your website's SEO
                      performance and provide actionable insights to improve
                      your search engine rankings.
                    </span>
                  </div>

                  <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div
                      className={`flex ${
                        showCompetitorInput
                          ? "flex-col gap-4"
                          : "items-center gap-4"
                      }`}
                    >
                      {/* Main URL Input */}
                      <motion.div
                        className="flex-1 relative"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.3 }}
                      >
                        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-indigo-400 dark:text-indigo-500">
                          <Globe size={20} />
                        </div>
                        <input
                          type="url"
                          placeholder="Enter a website URL (e.g., https://example.com)"
                          value={url}
                          onChange={(e) => setUrl(e.target.value)}
                          required
                          className="w-full pl-12 pr-5 py-4 rounded-xl border border-indigo-100 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-slate-900/80 dark:text-white transition-all duration-200 text-base shadow-sm"
                        />
                      </motion.div>

                      {/* Analyze Button (Initially in line) */}
                      {!showCompetitorInput && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: 0.4 }}
                        >
                          <GradientButton
                            onClick={handleSubmit}
                            disabled={loading}
                            gradient="cosmic"
                            icon={loading ? null : Bolt}
                          >
                            {loading ? (
                              <>
                                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                                <span>Analyzing...</span>
                              </>
                            ) : (
                              "Analyze"
                            )}
                          </GradientButton>
                        </motion.div>
                      )}
                    </div>

                    {/* Add Competitor Button */}
                    {!showCompetitorInput && (
                      <motion.button
                        type="button"
                        onClick={() => setShowCompetitorInput(true)}
                        className="flex items-center gap-2 text-indigo-600 dark:text-indigo-300 font-medium transition-all duration-200 hover:text-indigo-500 w-fit"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.5 }}
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
                        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-indigo-400 dark:text-indigo-500">
                          <Users size={20} />
                        </div>
                        <input
                          type="url"
                          placeholder="Enter competitor website URL (optional)"
                          value={competitorUrl}
                          onChange={(e) => setCompetitorUrl(e.target.value)}
                          className="w-full pl-12 pr-10 py-4 rounded-xl border border-indigo-100 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-slate-900/80 dark:text-white transition-all duration-200 text-base shadow-sm"
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
                        <GradientButton
                          onClick={handleSubmit}
                          disabled={loading}
                          gradient="cosmic"
                          icon={loading ? null : TrendingUp}
                        >
                          {loading ? (
                            <>
                              <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                              <span>Comparing...</span>
                            </>
                          ) : (
                            "Compare"
                          )}
                        </GradientButton>
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
                          <span className="text-indigo-600 dark:text-indigo-400 font-medium text-wrap text-center">
                            {url}
                          </span>
                          {competitorUrl && (
                            <>
                              {" "}
                              vs.{" "}
                              <span className="text-indigo-600 dark:text-indigo-400 font-medium">
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
                            <GlowingBadge color="primary">
                              {formatPurposeText(
                                data.purpose.charAt(0).toUpperCase() +
                                  data.purpose.slice(1)
                              )}
                            </GlowingBadge>
                          )}
                        </motion.div>
                      ) : null}
                    </>
                  )}
                </GlassCard>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error */}
          <AnimatePresence>
            {error && !isFullscreen && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="mb-12"
              >
                <GlassCard className="p-6" glowColor="danger">
                  <div className="flex items-start gap-4">
                    <NeumorphicIcon icon={AlertCircle} color="danger" />
                    <div>
                      <h3 className="font-semibold text-red-600 dark:text-red-400 mb-1">
                        Analysis Failed
                      </h3>
                      <p className="text-gray-700 dark:text-gray-300">
                        {error}
                      </p>
                    </div>
                  </div>
                </GlassCard>
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
                className={`space-y-10 ${
                  isFullscreen ? "h-full overflow-auto" : ""
                }`}
                ref={resultsRef}
              >
                {/* Overview Section */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className={`${
                    isFullscreen && fullscreenSection !== "overview"
                      ? "hidden"
                      : ""
                  } ${
                    isFullscreen && fullscreenSection === "overview"
                      ? "h-full overflow-auto"
                      : ""
                  }`}
                  ref={overviewRef}
                >
                  <GlassCard className="overflow-hidden">
                    <div
                      className="p-6 cursor-pointer flex justify-between items-center"
                      onClick={() => toggleSection("overview")}
                    >
                      <h2 className="text-xl font-semibold flex items-center gap-3 text-indigo-600 dark:text-indigo-300">
                        <NeumorphicIcon icon={BarChart2} color="primary" />
                        Overview
                      </h2>
                      <div className="flex items-center gap-2">
                        {!isFullscreen ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFullscreen("overview");
                            }}
                            className="p-1.5 rounded-lg text-gray-500 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors"
                          >
                            <Maximize size={18} />
                          </button>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFullscreen(null);
                            }}
                            className="p-1.5 rounded-lg text-gray-500 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors"
                          >
                            <Minimize size={18} />
                          </button>
                        )}
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
                      >
                        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
                          {/* Score Card */}
                          <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            whileHover={{
                              y: -5,
                              boxShadow:
                                "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
                            }}
                          >
                            <GlassCard className="p-6" glowColor="accent">
                              <div className="flex items-center gap-3 mb-4">
                                <NeumorphicIcon icon={Award} color="accent" />
                                <h3 className="font-semibold text-emerald-700 dark:text-emerald-300">
                                  Your SEO Score
                                </h3>
                              </div>
                              <div className="flex flex-col items-center">
                                <CircularProgress
                                  value={data?.user?.seoScore || 0}
                                  color="auto"
                                  size={160}
                                  className="mb-4"
                                />
                                <GlowingBadge color={userScoreRating.color}>
                                  {userScoreRating.text}
                                </GlowingBadge>
                              </div>

                              {/* Trend Chart */}
                              <div className="mt-6 h-32">
                                <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 flex items-center gap-2">
                                  <LineChartIcon
                                    size={14}
                                    className="text-emerald-500"
                                  />
                                  Score Trend
                                </h4>
                                <ResponsiveContainer width="100%" height="100%">
                                  <AreaChart data={seoTrendData}>
                                    <defs>
                                      <linearGradient
                                        id="seoGradient"
                                        x1="0"
                                        y1="0"
                                        x2="0"
                                        y2="1"
                                      >
                                        <stop
                                          offset="5%"
                                          stopColor={COLORS.accent}
                                          stopOpacity={0.8}
                                        />
                                        <stop
                                          offset="95%"
                                          stopColor={COLORS.accent}
                                          stopOpacity={0}
                                        />
                                      </linearGradient>
                                    </defs>
                                    <XAxis
                                      dataKey="date"
                                      tick={{ fontSize: 10 }}
                                    />
                                    <YAxis domain={[0, 100]} hide />
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
                                        padding: "8px 12px",
                                      }}
                                      formatter={(value) => [
                                        `${value}`,
                                        "Score",
                                      ]}
                                    />
                                    <Area
                                      type="monotone"
                                      dataKey="value"
                                      stroke={COLORS.accent}
                                      fillOpacity={1}
                                      fill="url(#seoGradient)"
                                    />
                                  </AreaChart>
                                </ResponsiveContainer>
                              </div>
                            </GlassCard>
                          </motion.div>

                          {/* Chart Card */}
                          {!competitorUrl && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.5, delay: 0.5 }}
                              whileHover={{
                                y: -5,
                                boxShadow:
                                  "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
                              }}
                            >
                              <GlassCard className="p-6" glowColor="info">
                                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-800 dark:text-gray-200">
                                  <NeumorphicIcon icon={Radar} color="info" />
                                  SEO Score Comparison
                                </h3>
                                <div>
                                  <ResponsiveContainer
                                    width="100%"
                                    height={350}
                                  >
                                    <BarChart
                                      layout="vertical"
                                      data={chartData}
                                      margin={{
                                        top: 20,
                                        right: 30,
                                        left: 40,
                                        bottom: 10,
                                      }}
                                    >
                                      {/* Define linear gradients for bar colors */}
                                      <defs>
                                        {CHART_COLORS.map((color, index) => (
                                          <linearGradient
                                            key={index}
                                            id={`colorGradient${index}`}
                                            x1="0"
                                            y1="0"
                                            x2="1"
                                            y2="0"
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

                                      {/* X-axis - represents values (horizontal) */}
                                      <XAxis
                                        type="number"
                                        domain={[0, 100]}
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{
                                          fill: darkMode ? "white" : "#0f172a",
                                          fontSize: 12,
                                          fontWeight: 500,
                                        }}
                                      />

                                      {/* Y-axis - represents category labels (vertical) */}
                                      <YAxis
                                        type="category"
                                        dataKey="name"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{
                                          fill: darkMode ? "white" : "#0f172a",
                                          fontSize: 13,
                                          fontWeight: 600,
                                        }}
                                      />

                                      {/* Tooltip with dark/light theme adaptation */}
                                      <Tooltip
                                        cursor={{ fill: "transparent" }}
                                        contentStyle={{
                                          backgroundColor: darkMode
                                            ? "#1e293b"
                                            : "#ffffff",
                                          borderRadius: "12px",
                                          border: "none",
                                          boxShadow:
                                            "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
                                          color: darkMode
                                            ? "#ffffff"
                                            : "#000000",
                                          padding: "12px 16px",
                                          fontSize: 14,
                                        }}
                                      />

                                      {/* Chart Legend */}
                                      <Legend
                                        layout="horizontal"
                                        verticalAlign="bottom"
                                        align="center"
                                        wrapperStyle={{
                                          paddingTop: "10px",
                                          color: darkMode ? "white" : "#0f172a",
                                          fontWeight: 500,
                                        }}
                                      />

                                      {/* Bars with individual gradient fills */}
                                      <Bar
                                        dataKey="value"
                                        barSize={18}
                                        radius={[10, 10, 10, 10]} // rounded corners for better aesthetics
                                      >
                                        {chartData.map((entry, index) => (
                                          <Cell
                                            key={`cell-${index}`}
                                            fill={`url(#colorGradient${index})`}
                                          />
                                        ))}
                                      </Bar>
                                    </BarChart>
                                  </ResponsiveContainer>
                                </div>
                              </GlassCard>
                            </motion.div>
                          )}

                          {/* Competitor Score Card */}
                          {competitorData && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.5, delay: 0.4 }}
                              whileHover={{
                                y: -5,
                                boxShadow:
                                  "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
                              }}
                            >
                              <GlassCard className="p-6" glowColor="secondary">
                                <div className="flex items-center gap-3 mb-4">
                                  <NeumorphicIcon
                                    icon={Target}
                                    color="secondary"
                                  />
                                  <h3 className="font-semibold text-pink-600 dark:text-pink-300">
                                    Competitor SEO Score
                                  </h3>
                                </div>
                                <div className="flex flex-col items-center">
                                  <CircularProgress
                                    value={competitorData?.user?.seoScore || 0}
                                    color="auto"
                                    size={160}
                                    className="mb-4"
                                  />
                                  <GlowingBadge
                                    color={competitorScoreRating.color}
                                  >
                                    {competitorScoreRating.text}
                                  </GlowingBadge>
                                </div>

                                {/* Trend Chart */}
                                <div className="mt-6 h-32">
                                  <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 flex items-center gap-2">
                                    <LineChartIcon
                                      size={14}
                                      className="text-pink-500"
                                    />
                                    Score Trend
                                  </h4>
                                  <ResponsiveContainer
                                    width="100%"
                                    height="100%"
                                  >
                                    <AreaChart data={competitorTrendData}>
                                      <defs>
                                        <linearGradient
                                          id="compSeoGradient"
                                          x1="0"
                                          y1="0"
                                          x2="0"
                                          y2="1"
                                        >
                                          <stop
                                            offset="5%"
                                            stopColor={COLORS.secondary}
                                            stopOpacity={0.8}
                                          />
                                          <stop
                                            offset="95%"
                                            stopColor={COLORS.secondary}
                                            stopOpacity={0}
                                          />
                                        </linearGradient>
                                      </defs>
                                      <XAxis
                                        dataKey="date"
                                        tick={{ fontSize: 10 }}
                                      />
                                      <YAxis domain={[0, 100]} hide />
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
                                          padding: "8px 12px",
                                        }}
                                        formatter={(value) => [
                                          `${value}`,
                                          "Score",
                                        ]}
                                      />
                                      <Area
                                        type="monotone"
                                        dataKey="value"
                                        stroke={COLORS.secondary}
                                        fillOpacity={1}
                                        fill="url(#compSeoGradient)"
                                      />
                                    </AreaChart>
                                  </ResponsiveContainer>
                                </div>
                              </GlassCard>
                            </motion.div>
                          )}
                        </div>

                        {/* Performance Metrics */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: 0.6 }}
                          className="mt-6"
                        >
                          <GlassCard className="p-6" glowColor="info">
                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-800 dark:text-gray-200">
                              <NeumorphicIcon icon={Gauge} color="info" />
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
                                  <Bar dataKey="value" radius={[8, 8, 0, 0]}>
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
                                <div className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
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
                          </GlassCard>
                        </motion.div>

                        {competitorData && (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.6 }}
                            className="mt-6"
                          >
                            <GlassCard className="p-6" glowColor="secondary">
                              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-800 dark:text-gray-200">
                                <NeumorphicIcon
                                  icon={Activity}
                                  color="secondary"
                                />
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
                                    <Bar dataKey="value" radius={[8, 8, 0, 0]}>
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
                                  <div className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
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
                            </GlassCard>
                          </motion.div>
                        )}
                      </motion.div>
                    )}
                  </GlassCard>
                </motion.div>

                {!competitorUrl && (
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className={`${
                      isFullscreen && fullscreenSection !== "competitors"
                        ? "hidden"
                        : ""
                    } ${
                      isFullscreen && fullscreenSection === "competitors"
                        ? "h-full overflow-auto"
                        : ""
                    }`}
                  >
                    <GlassCard className="overflow-hidden">
                      {/* Section Header */}
                      <div
                        className="p-6 cursor-pointer flex justify-between items-center"
                        onClick={() => toggleSection("competitors")}
                      >
                        <h2 className="text-xl font-semibold flex items-center gap-3 text-indigo-600 dark:text-indigo-300">
                          <NeumorphicIcon icon={Users} color="primary" />
                          Competitor Analysis
                        </h2>
                        <div className="flex items-center gap-2">
                          {!isFullscreen ? (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleFullscreen("competitors");
                              }}
                              className="p-1.5 rounded-lg text-gray-500 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors"
                            >
                              <Maximize size={18} />
                            </button>
                          ) : (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleFullscreen(null);
                              }}
                              className="p-1.5 rounded-lg text-gray-500 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors"
                            >
                              <Minimize size={18} />
                            </button>
                          )}
                          <span className="text-sm text-gray-500 dark:text-gray-400 hidden md:inline-block">
                            {activeSection === "competitors"
                              ? "Hide details"
                              : "Show details"}
                          </span>
                          <div className="text-gray-400">
                            {activeSection === "competitors" ? (
                              <ChevronUp size={20} />
                            ) : (
                              <ChevronDown size={20} />
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Competitor Cards */}
                      {activeSection === "competitors" && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="px-6 pb-6"
                        >
                          <div className="grid gap-6 md:grid-cols-2">
                            {data.competitors.map(
                              (
                                comp: {
                                  url:
                                    | string
                                    | number
                                    | bigint
                                    | boolean
                                    | React.ReactElement<
                                        unknown,
                                        | string
                                        | React.JSXElementConstructor<any>
                                      >
                                    | Iterable<React.ReactNode>
                                    | Promise<
                                        | string
                                        | number
                                        | bigint
                                        | boolean
                                        | React.ReactPortal
                                        | React.ReactElement<
                                            unknown,
                                            | string
                                            | React.JSXElementConstructor<any>
                                          >
                                        | Iterable<React.ReactNode>
                                        | null
                                        | undefined
                                      >
                                    | null
                                    | undefined;
                                  seoScore: { score: any; explanation: any };
                                },
                                idx: React.Key | null | undefined
                              ) => (
                                <motion.div
                                  key={idx}
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{
                                    duration: 0.4,
                                    delay: (Number(idx) || 0) * 0.1,
                                  }}
                                  whileHover={{
                                    y: -5,
                                    boxShadow:
                                      "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
                                  }}
                                >
                                  <GlassCard
                                    className="overflow-hidden"
                                    glowColor="info"
                                  >
                                    <div className="h-2 bg-gradient-to-r from-indigo-500 via-blue-500 to-violet-600"></div>
                                    <div className="p-6">
                                      <div className="flex items-start gap-3 mb-4">
                                        <NeumorphicIcon
                                          icon={Crosshair}
                                          color="info"
                                        />
                                        <div>
                                          <h3 className="font-medium text-gray-900 dark:text-white">
                                            {" "}
                                            {typeof comp?.url === "string"
                                              ? extractKeywordFromUrl(comp.url)
                                              : `Competitor ${
                                                  Number(idx ?? 0) + 1
                                                }`}
                                          </h3>
                                          <a
                                            href={
                                              typeof comp.url === "string"
                                                ? comp.url
                                                : undefined
                                            } // Ensure href is a string
                                            className="text-indigo-500 text-sm hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors flex items-center gap-1 truncate"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                          >
                                            <span className="truncate max-w-[200px]">
                                              {comp.url}
                                            </span>
                                            <ExternalLink size={12} />
                                          </a>
                                        </div>
                                      </div>

                                      {/* SEO Score Section */}
                                      <div className="space-y-4">
                                        <div>
                                          <div className="flex justify-between items-center mb-2">
                                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                              SEO Score
                                            </span>
                                            <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                                              {comp.seoScore?.score || "0"}
                                            </span>
                                          </div>
                                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
                                            <motion.div
                                              className="bg-gradient-to-r from-indigo-500 via-blue-500 to-violet-600 h-2.5 rounded-full"
                                              initial={{ width: 0 }}
                                              animate={{
                                                width: `${
                                                  comp.seoScore?.score || 0
                                                }%`,
                                              }}
                                              transition={{
                                                duration: 1,
                                                delay: 0.5,
                                              }}
                                            />
                                          </div>
                                        </div>

                                        {/* Explanation Section */}
                                        <div className="bg-white/80 dark:bg-slate-900/80 p-4 rounded-xl border border-gray-100 dark:border-gray-800">
                                          <span className="text-sm text-gray-600 dark:text-gray-400 block mb-2">
                                            Explanation:
                                          </span>
                                          <p className="text-sm text-gray-800 dark:text-gray-200">
                                            {comp.seoScore?.explanation ||
                                              "No explanation provided."}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  </GlassCard>
                                </motion.div>
                              )
                            )}
                          </div>
                        </motion.div>
                      )}
                    </GlassCard>
                  </motion.div>
                )}

                {/* Metadata Section */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className={`${
                    isFullscreen && fullscreenSection !== "metadata"
                      ? "hidden"
                      : ""
                  } ${
                    isFullscreen && fullscreenSection === "metadata"
                      ? "h-full overflow-auto"
                      : ""
                  }`}
                >
                  <GlassCard className="overflow-hidden">
                    <div
                      className="p-6 cursor-pointer flex justify-between items-center"
                      onClick={() => toggleSection("metadata")}
                    >
                      <h2 className="text-xl font-semibold flex items-center gap-3 text-indigo-600 dark:text-indigo-300">
                        <NeumorphicIcon icon={FileText} color="primary" />
                        Metadata
                      </h2>
                      <div className="flex items-center gap-2">
                        {!isFullscreen ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFullscreen("metadata");
                            }}
                            className="p-1.5 rounded-lg text-gray-500 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors"
                          >
                            <Maximize size={18} />
                          </button>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFullscreen(null);
                            }}
                            className="p-1.5 rounded-lg text-gray-500 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors"
                          >
                            <Minimize size={18} />
                          </button>
                        )}
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
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            whileHover={{
                              y: -5,
                              boxShadow:
                                "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
                            }}
                          >
                            <GlassCard className="p-6" glowColor="info">
                              <h3 className="font-medium text-indigo-700 dark:text-indigo-300 mb-3 flex items-center gap-2">
                                <FileText
                                  size={16}
                                  className="text-indigo-500"
                                />
                                Title
                              </h3>
                              <div className="bg-white/80 dark:bg-slate-900/80 p-4 rounded-xl border border-indigo-100/50 dark:border-indigo-900/30">
                                <p className="text-gray-800 dark:text-gray-200 font-medium">
                                  {data.user?.metadata?.title || "N/A"}
                                </p>
                              </div>
                            </GlassCard>
                          </motion.div>

                          {competitorData && (
                            <motion.div
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.5, delay: 0.3 }}
                              whileHover={{
                                y: -5,
                                boxShadow:
                                  "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
                              }}
                            >
                              <GlassCard className="p-6" glowColor="secondary">
                                <h3 className="font-medium text-pink-700 dark:text-pink-300 mb-3 flex items-center gap-2">
                                  <FileText
                                    size={16}
                                    className="text-pink-500"
                                  />
                                  Competitor Title
                                </h3>
                                <div className="bg-white/80 dark:bg-slate-900/80 p-4 rounded-xl border border-pink-100/50 dark:border-pink-900/30">
                                  <p className="text-gray-800 dark:text-gray-200 font-medium">
                                    {competitorData.user?.metadata?.title ||
                                      "N/A"}
                                  </p>
                                </div>
                              </GlassCard>
                            </motion.div>
                          )}

                          <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            whileHover={{
                              y: -5,
                              boxShadow:
                                "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
                            }}
                          >
                            <GlassCard className="p-6" glowColor="info">
                              <h3 className="font-medium text-indigo-700 dark:text-indigo-300 mb-3 flex items-center gap-2">
                                <FileText
                                  size={16}
                                  className="text-indigo-500"
                                />
                                Description
                              </h3>
                              <div className="bg-white/80 dark:bg-slate-900/80 p-4 rounded-xl border border-indigo-100/50 dark:border-indigo-900/30">
                                <p className="text-gray-800 dark:text-gray-200">
                                  {data.user?.metadata?.description ||
                                    "No description provided."}
                                </p>
                              </div>
                            </GlassCard>
                          </motion.div>

                          {competitorData && (
                            <motion.div
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.5, delay: 0.4 }}
                              whileHover={{
                                y: -5,
                                boxShadow:
                                  "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
                              }}
                            >
                              <GlassCard className="p-6" glowColor="secondary">
                                <h3 className="font-medium text-pink-700 dark:text-pink-300 mb-3 flex items-center gap-2">
                                  <FileText
                                    size={16}
                                    className="text-pink-500"
                                  />
                                  Competitor Description
                                </h3>
                                <div className="bg-white/80 dark:bg-slate-900/80 p-4 rounded-xl border border-pink-100/50 dark:border-pink-900/30">
                                  <p className="text-gray-800 dark:text-gray-200">
                                    {competitorData.user?.metadata
                                      ?.description ||
                                      "No description provided."}
                                  </p>
                                </div>
                              </GlassCard>
                            </motion.div>
                          )}

                          <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.5 }}
                            whileHover={{
                              y: -5,
                              boxShadow:
                                "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
                            }}
                          >
                            <GlassCard className="p-6" glowColor="info">
                              <h3 className="font-medium text-indigo-700 dark:text-indigo-300 mb-3 flex items-center gap-2">
                                <LinkIcon
                                  size={16}
                                  className="text-indigo-500"
                                />
                                Links
                              </h3>
                              <div className="bg-white/80 dark:bg-slate-900/80 p-4 rounded-xl border border-indigo-100/50 dark:border-indigo-900/30">
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
                                          <div className="bg-indigo-100 dark:bg-indigo-900/30 p-1.5 rounded-lg group-hover:bg-indigo-200 dark:group-hover:bg-indigo-800/30 transition-colors">
                                            <ExternalLink
                                              size={14}
                                              className="text-indigo-600 dark:text-indigo-400"
                                            />
                                          </div>
                                          <a
                                            href={link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors truncate text-sm"
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
                            </GlassCard>
                          </motion.div>

                          {competitorData && (
                            <motion.div
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.5, delay: 0.5 }}
                              whileHover={{
                                y: -5,
                                boxShadow:
                                  "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
                              }}
                            >
                              <GlassCard className="p-6" glowColor="secondary">
                                <h3 className="font-medium text-pink-700 dark:text-pink-300 mb-3 flex items-center gap-2">
                                  <LinkIcon
                                    size={16}
                                    className="text-pink-500"
                                  />
                                  Competitor Links
                                </h3>
                                <div className="bg-white/80 dark:bg-slate-900/80 p-4 rounded-xl border border-pink-100/50 dark:border-pink-900/30">
                                  {competitorData.user?.metadata?.links
                                    ?.length > 0 ? (
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
                                            <div className="bg-pink-100 dark:bg-pink-900/30 p-1.5 rounded-lg group-hover:bg-pink-200 dark:group-hover:bg-pink-800/30 transition-colors">
                                              <ExternalLink
                                                size={14}
                                                className="text-pink-600 dark:text-pink-400"
                                              />
                                            </div>
                                            <a
                                              href={link}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="text-pink-600 dark:text-pink-400 hover:text-pink-800 dark:hover:text-pink-300 transition-colors truncate text-sm"
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
                              </GlassCard>
                            </motion.div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </GlassCard>
                </motion.div>

                {/* Suggestions Section */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                >
                  <GlassCard className="overflow-hidden">
                    <div
                      className="p-6 cursor-pointer flex justify-between items-center"
                      onClick={() => toggleSection("suggestions")}
                    >
                      <h2 className="text-xl font-semibold flex items-center gap-3 text-indigo-600 dark:text-indigo-300">
                        <NeumorphicIcon icon={Lightbulb} color="primary" />
                        Suggestions
                      </h2>
                      <div className="flex items-center gap-2">
                        {!isFullscreen ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFullscreen("suggestions");
                            }}
                            className="p-1.5 rounded-lg text-gray-500 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors"
                          >
                            <Maximize size={18} />
                          </button>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFullscreen(null);
                            }}
                            className="p-1.5 rounded-lg text-gray-500 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors"
                          >
                            <Minimize size={18} />
                          </button>
                        )}
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
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5 }}
                          whileHover={{
                            y: -5,
                            boxShadow:
                              "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
                          }}
                        >
                          <GlassCard className="p-6" glowColor="accent">
                            <div className="flex items-center gap-3 mb-6">
                              <NeumorphicIcon icon={Wand2} color="accent" />
                              <h3 className="font-medium text-emerald-700 dark:text-emerald-300">
                                SEO Improvement Suggestions
                              </h3>
                            </div>

                            {intro && (
                              <div className="text-gray-700 dark:text-gray-300 text-base mb-6 leading-relaxed">
                                {intro}
                              </div>
                            )}

                            {items?.length > 0 ? (
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
                                        ? "border-emerald-300 dark:border-emerald-700"
                                        : "border-emerald-100/50 dark:border-emerald-900/30 hover:border-emerald-300 dark:hover:border-emerald-700"
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
                          </GlassCard>
                        </motion.div>
                      </motion.div>
                    )}
                  </GlassCard>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                >
                  <GlassCard className="overflow-hidden">
                    {/* Header Section */}
                    <div
                      className="p-6 cursor-pointer flex justify-between items-center"
                      onClick={() => toggleSection("estimatedGrowth")}
                    >
                      <h2 className="text-xl font-semibold flex items-center gap-3 text-indigo-600 dark:text-indigo-300">
                        <NeumorphicIcon icon={Lightbulb} color="primary" />
                        Estimated Growth
                      </h2>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFullscreen(
                              isFullscreen ? null : "estimatedGrowth"
                            );
                          }}
                          className="p-1.5 rounded-lg text-gray-500 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors"
                        >
                          {isFullscreen ? (
                            <Minimize size={18} />
                          ) : (
                            <Maximize size={18} />
                          )}
                        </button>

                        <span className="text-sm text-gray-500 dark:text-gray-400 hidden md:inline-block">
                          {activeSection === "estimatedGrowth"
                            ? "Hide details"
                            : "Show details"}
                        </span>

                        <div className="text-gray-400">
                          {activeSection === "estimatedGrowth" ? (
                            <ChevronUp size={20} />
                          ) : (
                            <ChevronDown size={20} />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Expandable Content */}
                    {activeSection === "estimatedGrowth" && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="px-6 pb-6"
                      >
                        <ResponsiveContainer width="100%" height={300}>
                          <LineChart data={formattedData}>
                            <defs>
                              <linearGradient
                                id="colorGradientLine"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                              >
                                <stop
                                  offset="0%"
                                  stopColor="#4f46e5"
                                  stopOpacity={0.8}
                                />
                                <stop
                                  offset="100%"
                                  stopColor="#4f46e5"
                                  stopOpacity={0}
                                />
                              </linearGradient>
                            </defs>

                            <XAxis
                              dataKey="time"
                              tick={{
                                fill: darkMode ? "white" : "#334155",
                                fontSize: 12,
                              }}
                              axisLine={false}
                              tickLine={false}
                            />
                            <YAxis
                              domain={[
                                (dataMin: number) => dataMin - 5,
                                (dataMax: number) => dataMax + 5,
                              ]}
                              tick={{
                                fill: darkMode ? "white" : "#334155",
                                fontSize: 12,
                              }}
                              axisLine={false}
                              tickLine={false}
                            />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: darkMode ? "#1e293b" : "#fff",
                                border: "none",
                                borderRadius: 10,
                                boxShadow: "0 0 10px rgba(0,0,0,0.1)",
                              }}
                              labelStyle={{
                                color: darkMode ? "#fff" : "#0f172a",
                                fontWeight: 500,
                              }}
                              formatter={(value) => [`${value}%`, "SEO Score"]}
                            />
                            <CartesianGrid
                              strokeDasharray="3 3"
                              vertical={false}
                              strokeOpacity={0.1}
                            />
                            <Line
                              type="monotone"
                              dataKey="value"
                              stroke="url(#colorGradientLine)"
                              strokeWidth={3}
                              dot={false}
                              activeDot={{
                                r: 6,
                                fill: "#6366f1",
                                stroke: "#1e40af",
                                strokeWidth: 2,
                              }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </motion.div>
                    )}
                  </GlassCard>
                </motion.div>

                {/* Action Buttons */}
                <AnimatePresence>
                  {!isFullscreen && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.6, delay: 0.6 }}
                      className="flex flex-wrap gap-4 justify-end mt-8"
                    >
                      <GradientButton
                        onClick={handleCopy}
                        gradient="accent"
                        icon={copied ? CheckCircle : Copy}
                      >
                        {copied ? "Copied!" : "Copy Suggestions"}
                      </GradientButton>
                      <GradientButton
                        onClick={handleDownload}
                        gradient="cosmic"
                        icon={Download}
                      >
                        Download Suggestions
                      </GradientButton>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Custom Scrollbar Styles */}
        {/* Custom Scrollbar Styles */}
        <style jsx global>{`
          @keyframes float {
            0% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-10px);
            }
            100% {
              transform: translateY(0px);
            }
          }

          .animate-float {
            animation: float 10s ease-in-out infinite;
          }

          .bg-grid-pattern {
            background-image: linear-gradient(
                to right,
                rgba(99, 102, 241, 0.1) 1px,
                transparent 1px
              ),
              linear-gradient(
                to bottom,
                rgba(99, 102, 241, 0.1) 1px,
                transparent 1px
              );
          }

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
              ? "rgba(99, 102, 241, 0.5)"
              : "rgba(99, 102, 241, 0.3)"};
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: ${darkMode
              ? "rgba(99, 102, 241, 0.7)"
              : "rgba(99, 102, 241, 0.5)"};
          }
        `}</style>
      </main>
    </>
  );
}
