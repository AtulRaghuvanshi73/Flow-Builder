"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { Button } from "@/components/ui/button"

interface TopBarProps {
  onSave: () => Promise<void>
  hasUnsavedChanges?: boolean
}

export default function TopBar({ onSave, hasUnsavedChanges = false }: TopBarProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSave = async () => {
    if (isLoading) return
    
    setIsLoading(true)
    setError(null)
    
    try {
      await onSave()
    } catch (err) {
      console.log(err)
      setError("Cannot save Flow")
      setTimeout(() => setError(null), 5000) // Auto-hide error after 5 seconds
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-border h-[60px] flex items-center justify-between px-6">
      {/* Left section - Logo/Title area */}
      <div className="flex items-center">
        <h1 className="text-lg font-semibold text-foreground">Flow Builder</h1>
      </div>

      {/* Center section - Error message */}
      <div className="flex-1 flex justify-center">
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.9 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="bg-destructive text-destructive-foreground px-4 py-2 rounded-md text-sm font-medium shadow-sm"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Right section - Save button */}
      <div className="flex items-center">
        <Button
          variant="outline"
          onClick={handleSave}
          disabled={isLoading || !hasUnsavedChanges}
          className="border-[#3B82F6] text-[#3B82F6] hover:bg-[#3B82F6] hover:text-white transition-colors duration-200 rounded-md px-4 py-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              Saving...
            </div>
          ) : (
            "Save Changes"
          )}
        </Button>
      </div>
    </div>
  )
}