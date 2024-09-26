"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, DollarSign, BarChart, PieChart, TrendingUp } from "lucide-react"

interface AdvisorSummary {
  name: string
  quickSummary: string
  mainPoints: string[]
  offered: string[]
  analysis: string
}

interface SummaryProps {
  advisors: AdvisorSummary[]
}

export function FintechConversationSummary({ advisors }: SummaryProps) {
  const [activeAdvisor, setActiveAdvisor] = useState(0)
  const [activeSection, setActiveSection] = useState<string | null>(null)

  const toggleSection = (section: string) => {
    setActiveSection(activeSection === section ? null : section)
  }

  const sectionVariants = {
    open: { opacity: 1, height: "auto" },
    closed: { opacity: 0, height: 0 }
  }

  return (
    <div className="max-w-4xl mx-auto p-4 font-['Fira_Sans'] text-[#222222]">
      <div className="flex mb-6 border-b border-[#ECF0F3]">
        {advisors.map((advisor, index) => (
          <button
            key={index}
            className={`px-4 py-2 text-lg ${activeAdvisor === index ? 'text-[#5C59E4] border-b-2 border-[#5C59E4]' : 'text-[#9CABC2]'}`}
            onClick={() => setActiveAdvisor(index)}
          >
            {advisor.name}
          </button>
        ))}
      </div>
      
      <AnimatePresence mode="wait">
        <motion.div
          key={activeAdvisor}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <div className="space-y-6">
            <motion.div 
              className="bg-[#ECF0F3] rounded-lg p-6 cursor-pointer"
              onClick={() => toggleSection('summary')}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-[#2E2C72] flex items-center">
                  <DollarSign className="mr-2" />
                  Quick Summary
                </h2>
                <ChevronDown className={`transform transition-transform ${activeSection === 'summary' ? 'rotate-180' : ''}`} />
              </div>
              <motion.div
                variants={sectionVariants}
                initial="closed"
                animate={activeSection === 'summary' ? "open" : "closed"}
              >
                <p className="mt-4">{advisors[activeAdvisor].quickSummary}</p>
              </motion.div>
            </motion.div>

            <motion.div 
              className="bg-[#ECF0F3] rounded-lg p-6 cursor-pointer"
              onClick={() => toggleSection('mainPoints')}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-[#2E2C72] flex items-center">
                  <BarChart className="mr-2" />
                  Main Points Discussed
                </h2>
                <ChevronDown className={`transform transition-transform ${activeSection === 'mainPoints' ? 'rotate-180' : ''}`} />
              </div>
              <motion.div
                variants={sectionVariants}
                initial="closed"
                animate={activeSection === 'mainPoints' ? "open" : "closed"}
              >
                <ul className="mt-4 space-y-2">
                  {advisors[activeAdvisor].mainPoints.map((point, index) => (
                    <li key={index} className="flex items-start">
                      <span className="inline-block w-2 h-2 rounded-full bg-[#5C59E4] mt-2 mr-2"></span>
                      {point}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </motion.div>

            <motion.div 
              className="bg-[#ECF0F3] rounded-lg p-6 cursor-pointer"
              onClick={() => toggleSection('offered')}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-[#2E2C72] flex items-center">
                  <PieChart className="mr-2" />
                  Services Offered
                </h2>
                <ChevronDown className={`transform transition-transform ${activeSection === 'offered' ? 'rotate-180' : ''}`} />
              </div>
              <motion.div
                variants={sectionVariants}
                initial="closed"
                animate={activeSection === 'offered' ? "open" : "closed"}
              >
                <ul className="mt-4 space-y-2">
                  {advisors[activeAdvisor].offered.map((service, index) => (
                    <li key={index} className="flex items-start">
                      <span className="inline-block w-2 h-2 rounded-full bg-[#5C59E4] mt-2 mr-2"></span>
                      {service}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </motion.div>

            <motion.div 
              className="bg-[#ECF0F3] rounded-lg p-6 cursor-pointer"
              onClick={() => toggleSection('analysis')}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-[#2E2C72] flex items-center">
                  <TrendingUp className="mr-2" />
                  Analysis
                </h2>
                <ChevronDown className={`transform transition-transform ${activeSection === 'analysis' ? 'rotate-180' : ''}`} />
              </div>
              <motion.div
                variants={sectionVariants}
                initial="closed"
                animate={activeSection === 'analysis' ? "open" : "closed"}
              >
                <p className="mt-4">{advisors[activeAdvisor].analysis}</p>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>
      
      <p className="mt-8 text-sm italic text-[#9CABC2]">
        Disclaimer: This summary is for informational purposes only and does not constitute financial advice.
      </p>
    </div>
  )
}