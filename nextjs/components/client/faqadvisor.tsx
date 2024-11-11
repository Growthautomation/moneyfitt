"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Minus } from 'lucide-react'

// Define the FAQ item interface
interface FAQItem {
  question: string
  answer: string
}

export function Faq() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const toggleQuestion = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index)
  }

  // Updated FAQ data
  const faqs: FAQItem[] = [
    {
      question: "Will a Professional's Profile on MoneyFitt Be Publicly Available on the Web?",
      answer: "MoneyFitt does not publicly display the profiles of professionals on the platform. Visibility is only granted after a match with a user, where the user will be able to see your full profile."
    },
    {
      question: "How Does MoneyFitt Generate Qualified Leads for Financial Advisors?",
      answer: "All leads generated through MoneyFitt are pre-qualified, meaning that all users are potential clients who have shown genuine interest in financial services via our onboarding process and meet our determined criteria that align with your offerings and specialisations. This might include a user knowing they need a specific product or service (such as life insurance, retirement and CPF planning, expat financial planning), or MoneyFitt examining their financial health in line with MAS financial planning guides and indicating where they may be unprepared. By supplying only qualified leads, MoneyFitt helps save time by reducing the effort spent on prospects who aren't a good fit or ready to engage."
    },
    {
      question: "Once a User and Professional Are Matched, How Will Contact Be Established?",
      answer: "After matching, we leave it open for either side to spark conversation. For both sides, MoneyFitt produces prompts for suggested conversation, helping both sides know how to best approach the conversation in case they feel unprepared. Conversation remains on our platform until the user shares their contact information, an event we declare as a lead generated."
    },
    {
      question: "What Is the Cost for Financial Advisors and Insurance Agents to Join MoneyFitt?",
      answer: "MoneyFitt is not charging professionals a subscription fee or per-lead fee for the pilot project allocation (still accepting applicants). No advisor onboarded under this allocation will be moved to the full launch version without their permission."
    },
    {
      question: "How Many Leads Can Advisors Get and How Do You Share the Leads Amongst Different Advisors?",
      answer: "There's no cap on the number of leads an advisor can receive. We're developing a points-based system where the top three scoring advisors will receive the first matches. If multiple advisors score the same, the leads will be distributed randomly to ensure fairness. This way, every qualified advisor has an equal chance to be matched."
    },
    {
      question: "How Many Advisors Will Users Be Matched With?",
      answer: "Users will be matched with three advisors based on their financial needs and personal preferences. Users can also refresh one match every 24 hours. This feature helps users choose the advisor(s) they feel most comfortable working with. It is in the best interest of all advisors to offer transparent, honest advice and provide prompt service; otherwise, they risk losing their matched users."
    }
  ];

  return (
    <div className="w-full mt-8">
      <div className="space-y-6">
        {faqs.map((faq, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
            <button
              className="w-full text-left p-6 focus:outline-none focus:ring-2 focus:ring-[#5C59E4] focus:ring-opacity-50 rounded-lg flex justify-between items-center"
              onClick={() => toggleQuestion(index)}
            >
              <h3 className="text-lg font-semibold text-[#2E2C72] pr-4">{faq.question}</h3>
              {activeIndex === index ? (
                <Minus className="w-5 h-5 text-[#5C59E4] flex-shrink-0" />
              ) : (
                <Plus className="w-5 h-5 text-[#5C59E4] flex-shrink-0" />
              )}
            </button>
            <AnimatePresence>
              {activeIndex === index && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="px-6 pb-6 pt-4 text-[#222222] border-t border-[#ECF0F3]">
                    <p>{faq.answer}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  )
}