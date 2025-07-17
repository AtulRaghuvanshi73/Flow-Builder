"use client"

import { ArrowLeft } from "lucide-react"
import { motion } from "motion/react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

import { Node } from "@xyflow/react"

interface SettingsPanelProps {
  selectedNode: Node | null
  onClose: () => void
  onUpdateNode: (nodeId: string, updates: Partial<Node> & { data?: Record<string, unknown> }) => void
  onSave: () => Promise<void>
  hasUnsavedChanges?: boolean
}

export default function SettingsPanel({ 
  selectedNode, 
  onClose, 
  onUpdateNode,
  onSave,
  hasUnsavedChanges = false
}: SettingsPanelProps) {
  const [messageContent, setMessageContent] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (selectedNode) {
      const msg = typeof selectedNode.data?.message === "string" ? selectedNode.data.message : ""
      setMessageContent(msg)
    }
  }, [selectedNode])

  const handleContentChange = (value: string) => {
    setMessageContent(value)
    if (selectedNode) {
      onUpdateNode(selectedNode.id, {
        data: {
          ...selectedNode.data,
          message: value
        }
      })
    }
  }

  const handleSave = async () => {
    if (isLoading) return
    
    setIsLoading(true)
    
    try {
      await onSave()
    } catch (err) {
      // Error handling is done in parent component
      console.error("Save failed:", err)
    } finally {
      setIsLoading(false)
    }
  }

  if (!selectedNode) return null

  return (
    <motion.div
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 300, opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="fixed right-0 top-0 h-full w-[300px] bg-white border-l border-gray-200 shadow-lg z-50 flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-gray-200">
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-lg font-semibold text-gray-900">Message</h2>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 space-y-4">
        <div className="space-y-2">
          <Label 
            htmlFor="message-content" 
            className="text-sm font-medium text-gray-700"
          >
            Text
          </Label>
          <Textarea
            id="message-content"
            placeholder="Enter your message content..."
            value={messageContent}
            onChange={(e) => handleContentChange(e.target.value)}
            className="min-h-[200px] resize-none border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg"
            autoFocus
          />
        </div>
      </div>

      {/* Footer with Save Button */}
      <div className="p-4 border-t border-gray-200">
        <Button
          onClick={handleSave}
          disabled={isLoading || !hasUnsavedChanges}
          className="w-full bg-[#3B82F6] hover:bg-[#3B82F6]/90 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              Saving...
            </div>
          ) : (
            "Save Changes"
          )}
        </Button>
      </div>
    </motion.div>
  )
}