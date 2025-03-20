"use client";

import { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { FiCopy, FiDownload } from "react-icons/fi";
import { clsx } from "clsx";

const COLORS = ["#3B82F6", "#10B981"];

export default function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const calculateSeoScore = (meta: any, links: string[]) => {
    let score = 0;
    if (meta.title) score += 20;
    if (meta.description) score += 20;
    if (meta.canonical) score += 10;
    if (meta.ogTitle) score += 7.5;
    if (meta.ogDescription) score += 7.5;
    if (links.length > 0) score += 15;
    return Math.round(score);
  };

  const estimateSuggestedScore = (aiSuggestions: any) => {
    try {
      const match = aiSuggestions.suggestion.match(/\{[\s\S]*?\}/);
      if (!match) throw new Error("No valid JSON object found");

      const parsed = JSON.parse(match[0]);
      let score = 0;

      if (parsed.title) score += 20;
      if (parsed.description) score += 20;
      if (parsed.canonical) score += 10;
      if (parsed.ogTitle) score += 7.5;
      if (parsed.ogDescription) score += 7.5;
      if (parsed.links && parsed.links.length > 0) score += 15;

      return Math.min(100, Math.round(score));
    } catch (err) {
      console.error("Failed to parse AI suggestion:", err);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const res = await fetch(
        `http://localhost:7071/api/seo-analyzer?url=${encodeURIComponent(url)}`
      );
      if (!res.ok) throw new Error("Failed to fetch SEO data");
      const result = await res.json();
      setData(result);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const currentScore = data ? calculateSeoScore(data.metaTags, data.links) : 0;
  const suggestedScore =
    data && data.aiSuggestions?.suggestion
      ? estimateSuggestedScore(data.aiSuggestions)
      : null;

  const chartData =
    suggestedScore !== null
      ? [
          { name: "Current", value: currentScore },
          { name: "Suggested", value: suggestedScore },
        ]
      : [];

  const handleCopy = () => {
    if (data?.aiSuggestions?.suggestion) {
      navigator.clipboard.writeText(data.aiSuggestions.suggestion);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  const handleDownloadJSON = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "seo-report.json";
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const DataCard = ({
    title,
    children,
    content,
  }: {
    title: string;
    children?: React.ReactNode;
    content?: React.ReactNode;
  }) => (
    <motion.div
      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg rounded-2xl p-6"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-bold text-indigo-700 dark:text-indigo-400 mb-4">
        {title}
      </h2>
      {content || children}
    </motion.div>
  );

  const ProgressBar = ({ value }: { value: number }) => (
    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 mt-4">
      <div
        className="bg-green-500 h-4 rounded-full transition-all duration-700"
        style={{ width: `${value}%` }}
      />
    </div>
  );

  return (
    <main
      className={clsx(
        "min-h-screen font-sans transition-colors duration-300",
        darkMode
          ? "bg-gray-900 text-gray-100"
          : "bg-gradient-to-br from-[#e0f2fe] via-[#e0e7ff] to-[#e0f7fa] text-gray-800"
      )}
    >
      {/* DARK MODE TOGGLE */}
      <div className="absolute top-4 right-6">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="flex items-center gap-2 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white px-4 py-2 rounded-full shadow hover:scale-105 transition"
          aria-label="Toggle dark mode"
        >
          {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>
      </div>

      {/* HERO SECTION */}
      <section className="max-w-4xl mx-auto py-20 px-6 text-center">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-6xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-sky-500"
        >
          SEO Optimizer
        </motion.h1>
        <p className="mt-4 text-lg md:text-xl text-gray-700 dark:text-gray-300">
          Boost your website's performance with smart, AI-powered SEO analysis
        </p>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4"
        >
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter your website URL"
            required
            className="w-full sm:w-[400px] px-5 py-3 rounded-full border border-gray-300 dark:border-gray-600 shadow focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:bg-gray-800 dark:text-white"
            aria-label="Website URL"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-3 rounded-full shadow-lg transition disabled:opacity-50"
          >
            {loading ? "Analyzing..." : "Analyze"}
          </button>
        </form>

        {error && (
          <div className="mt-4 text-red-500 text-sm font-medium">
            <p>{error}</p>
            <button
              onClick={handleSubmit}
              className="underline text-indigo-500 hover:text-indigo-700"
            >
              Retry
            </button>
          </div>
        )}
      </section>

      {/* RESULTS */}
      <AnimatePresence>
        {data && (
          <motion.section
            className="max-w-5xl mx-auto px-6 pb-20 space-y-12"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            <DataCard title="🔗 Website URL" content={<p>{data.url}</p>} />

            <DataCard title="📄 Meta Tags">
              <ul className="space-y-2 text-sm">
                {Object.entries(data.metaTags)
                  .filter(([key]) => key !== "keywords")
                  .map(([key, value]) => (
                    <li key={key}>
                      <strong className="capitalize">{key}:</strong>{" "}
                      {typeof value === "string" ||
                      typeof value === "number" ? (
                        value
                      ) : (
                        <em className="text-gray-500">N/A</em>
                      )}
                    </li>
                  ))}
              </ul>
            </DataCard>

            <DataCard title="🔗 Top 10 Links">
              <ul className="list-disc ml-6 text-blue-600 dark:text-blue-400 text-sm space-y-1">
                {data.links.slice(0, 10).map((link: string, i: number) => (
                  <li key={i}>
                    <a
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </DataCard>

         <DataCard title="💡 AI SEO Suggestions">
  <div className="relative text-sm max-w-full break-words">
    <div className="prose dark:prose-invert whitespace-pre-wrap break-words max-w-none overflow-auto">
      <ReactMarkdown>
        {data.aiSuggestions?.suggestion}
      </ReactMarkdown>
    </div>

    <div className="flex flex-wrap items-center gap-3 mt-4">
      <button
        onClick={handleCopy}
        className="flex items-center gap-2 px-4 py-2 rounded bg-indigo-500 hover:bg-indigo-600 text-white transition"
      >
        <FiCopy />
        {copied ? "Copied!" : "Copy"}
      </button>
      <button
        onClick={handleDownloadJSON}
        className="flex items-center gap-2 px-4 py-2 rounded bg-green-500 hover:bg-green-600 text-white transition"
      >
        <FiDownload />
        Download JSON
      </button>
    </div>
  </div>
</DataCard>


            <DataCard title="📊 SEO Score Comparison">
              {suggestedScore !== null && (
                <>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={chartData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#8884d8"
                        label
                      >
                        {chartData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                  <ProgressBar value={suggestedScore} />
                </>
              )}
            </DataCard>
          </motion.section>
        )}
      </AnimatePresence>
    </main>
  );
}
