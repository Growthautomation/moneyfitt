"use client";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  DollarSign,
  BarChart,
  PieChart,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";

export default function SummaryDisplay({
  services = [],
  mainPoints = [],
  quickSummary = "No analysis available yet. Start a conversation to generate insights.",
  analysis = "No analysis available yet. Start a conversation to generate insights.",
}) {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const sectionVariants = {
    open: { opacity: 1, height: "auto" },
    closed: { opacity: 0, height: 0 },
  };

  const toggleSection = (section: string) => {
    setActiveSection(activeSection === section ? null : section);
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="space-y-4"
      >
        <motion.div
          className="bg-white rounded-lg p-3 cursor-pointer shadow-md border-l-4 border-[#5C59E4]"
          onClick={() => toggleSection("summary")}
          whileHover={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-[#2E2C72] flex items-center">
              <DollarSign className="mr-2 text-[#5C59E4]" />
              Quick Summary
            </h2>
            <ChevronDown
              className={`transform transition-transform text-[#5C59E4] ${
                activeSection === "summary" ? "rotate-180" : ""
              }`}
            />
          </div>
          <motion.div
            variants={sectionVariants}
            initial="closed"
            animate={activeSection === "summary" ? "open" : "closed"}
          >
            <p className="mt-4 text-[#222222]">
              {quickSummary}
            </p>
          </motion.div>
        </motion.div>

        <motion.div
          className="bg-white rounded-lg p-3 cursor-pointer shadow-md border-l-4 border-[#5C59E4]"
          onClick={() => toggleSection("mainPoints")}
          whileHover={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-[#2E2C72] flex items-center">
              <BarChart className="mr-2 text-[#5C59E4]" />
              Main Points Discussed
            </h2>
            <ChevronDown
              className={`transform transition-transform text-[#5C59E4] ${
                activeSection === "mainPoints" ? "rotate-180" : ""
              }`}
            />
          </div>
          <motion.div
            variants={sectionVariants}
            initial="closed"
            animate={activeSection === "mainPoints" ? "open" : "closed"}
          >
            <ul className="mt-4 space-y-2">
              {mainPoints.length > 0 ? (
                mainPoints.map((point, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-[#5C59E4]"></span>
                    <span className="text-[#222222]">{point}</span>
                  </li>
                ))
              ) : (
                <li className="text-[#222222]">
                  No analysis available yet. Start a conversation to generate insights.
                </li>
              )}
            </ul>
          </motion.div>
        </motion.div>

        <motion.div
          className="bg-white rounded-lg p-3 cursor-pointer shadow-md border-l-4 border-[#5C59E4]"
          onClick={() => toggleSection("offered")}
          whileHover={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-[#2E2C72] flex items-center">
              <PieChart className="mr-2 text-[#5C59E4]" />
              Services Offered
            </h2>
            <ChevronDown
              className={`transform transition-transform text-[#5C59E4] ${
                activeSection === "offered" ? "rotate-180" : ""
              }`}
            />
          </div>
          <motion.div
            variants={sectionVariants}
            initial="closed"
            animate={activeSection === "offered" ? "open" : "closed"}
          >
            <ul className="mt-4 space-y-2">
              {services.length > 0 ? (
                services.map((service, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-[#5C59E4]"></span>
                    <span className="text-[#222222]">{service}</span>
                  </li>
                ))
              ) : (
                <li className="text-[#222222]">
                  No analysis available yet. Start a conversation to generate insights.
                </li>
              )}
            </ul>
          </motion.div>
        </motion.div>

        <motion.div
          className="bg-white rounded-lg p-3 cursor-pointer shadow-md border-l-4 border-[#5C59E4]"
          onClick={() => toggleSection("analysis")}
          whileHover={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-[#2E2C72] flex items-center">
              <TrendingUp className="mr-2 text-[#5C59E4]" />
              Analysis
            </h2>
            <ChevronDown
              className={`transform transition-transform text-[#5C59E4] ${
                activeSection === "analysis" ? "rotate-180" : ""
              }`}
            />
          </div>
          <motion.div
            variants={sectionVariants}
            initial="closed"
            animate={activeSection === "analysis" ? "open" : "closed"}
          >
            <ul className="mt-4 space-y-2">
              {Array.isArray(analysis) && analysis.length > 0 ? (
                analysis.map((point, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-[#5C59E4]"></span>
                    <span className="text-[#222222]">{point}</span>
                  </li>
                ))
              ) : (
                <li className="text-[#222222]">
                  {typeof analysis === 'string' ? analysis : "No analysis available yet. Start a conversation to generate insights."}
                </li>
              )}
            </ul>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
