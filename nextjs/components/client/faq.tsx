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

  // FAQ data
  const faqs: FAQItem[] = [
    {
      question: "Are the Agents/Advisors on the platform affiliated with MoneyFitt in any way?",
      answer: "The insurance agents and financial advisors on this platform are not employed by MoneyFitt or affiliated with it in any way. All agents and advisors apply to be on the platform. They are either captive insurance agents (belonging to one insurance company), independent insurance agents, or financial advisors (including independent financial advisors)."
    },
    {
      question: "Does MoneyFitt make a commission if I buy a product with a listed advisor?",
      answer: "No. MoneyFitt does not take any commission or a fee from actions taken through experts, ensuring a transparent and hassle-free experience."
    },
    {
      question: "Why did MoneyFitt build this platform?",
      answer: "We built this platform so Singaporeans can choose a new or additional advisor on their own terms. We recognise that the financial adviser we use is often passed down from our parents or recommended by friends. But we are all unique, with our own money needs. Therefore, our current advisor may not be best suited for us. Our mission is to deliver a transparent, reliable platform where users can confidently connect with vetted financial professionals, helping them save time and reduce uncertainty. We aim to remove the overwhelming number of options and misinformation in the market, ensuring you get personalised advice and education that fits your life and goals."
    },
    {
      question: "Are you regulated by the MAS?",
      answer: "Because we are not providing financial or other professional recommendations or advice, MoneyFitt is not required to be regulated."
    },
    {
      question: "How does MoneyFitt ensure the quality of professionals on the platform?",
      answer: "All agents and advisors listed on the platform are MAS-licensed professionals with an RNF Reference Number that can be checked in the MAS Register of Representatives to see if they are currently licensed and in good standing. Minimum requirements include age, \"fit and proper\" status, educational level, and passing licensing examinations. We also encourage user feedback to maintain high standards of service, which you can send to feedback@moneyfitt.co."
    },
    {
      question: "Is my personal information secure on the MoneyFitt platform?",
      answer: "Your data is absolutely secure. We are fully PDPA and GDPR compliant. And, of course, you can easily erase all your data should you wish to."
    },
    {
      question: "How many leads can advisors get and how do you share the leads amongst different advisors?",
      answer: "We've developed a points-based system where the top three scoring advisors will be your first three matches. Very soon, users will be able to hit refresh on their three matched advisors once every 24 hours. If multiple advisors score the same, the leads will be distributed randomly to ensure fairness."
    },
    {
      question: "Can I delete my MoneyFitt account?",
      answer: "You can delete your MoneyFitt account at any time by sending an email to feedback@moneyfitt.co from the email address associated with your account. We aim to process account deletion requests within 30 days. All personal data associated with your account will be permanently removed, except where legal obligations require us to retain certain information. Please note that if you change your mind after deletion, you will need to create a new account to access our services again. If you have further questions, feel free to reach out to us at the same email address."
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