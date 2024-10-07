'use client'

import { useToast } from "@/hooks/use-toast"
import { X } from "lucide-react"
import { useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

export function Toaster() {
  const { toasts, dismiss } = useToast()

  useEffect(() => {
    toasts.forEach((toast) => {
      if (toast.id) {
        const timer = setTimeout(() => {
          dismiss(toast.id)
        }, 5000) // Dismiss after 5 seconds

        return () => clearTimeout(timer)
      }
    })
  }, [toasts, dismiss])

  return (
    <div className="fixed top-0 right-0 p-4 space-y-4 z-50">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: -50, scale: 0.3 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
            className={`bg-[#D6D5F8] border border-[#5C59E4] rounded-lg shadow-lg p-4 ${toast.className} relative`}
            role="alert"
          >
            {toast.title && <h4 className="font-bold text-[#222222]">{toast.title}</h4>}
            {toast.description && <p className="text-[#222222]">{toast.description}</p>}
            <button
              onClick={() => dismiss(toast.id)}
              className="absolute top-2 right-2 text-[#222222] hover:text-[#5C59E4]"
            >
              <X size={16} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}