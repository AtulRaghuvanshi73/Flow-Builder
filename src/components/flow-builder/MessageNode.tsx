"use client"

import React, { useState, useEffect, useRef } from 'react'
import { Handle, Position } from '@xyflow/react'
import { MessageCircle } from 'lucide-react'

interface MessageNodeProps {
  id: string
  data: {
    message: string
    onMessageChange?: (id: string, message: string) => void
  }
  selected?: boolean
}

const MessageNode: React.FC<MessageNodeProps> = ({ id, data, selected }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [message, setMessage] = useState(data.message || 'Enter your message here...')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus()
      textareaRef.current.select()
    }
  }, [isEditing])

  const handleContentClick = () => {
    if (selected) {
      setIsEditing(true)
    }
  }

  const handleBlur = () => {
    setIsEditing(false)
    if (data.onMessageChange) {
      data.onMessageChange(id, message)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleBlur()
    }
    if (e.key === 'Escape') {
      setIsEditing(false)
      setMessage(data.message || 'Enter your message here...')
    }
  }

  return (
    <div className={`w-[200px] bg-white rounded-lg shadow-md border border-gray-200 ${selected ? 'ring-2 ring-blue-500' : ''}`}>
      {/* Target Handle */}
      <Handle
        type="target"
        position={Position.Left}
        style={{
          width: 8,
          height: 8,
          backgroundColor: '#6B7280',
          border: '2px solid #FFFFFF',
          borderRadius: '50%',
          left: -4,
          top: '50%',
          transform: 'translateY(-50%)',
        }}
      />

      {/* Header Section */}
      <div className="bg-primary px-3 py-2 rounded-t-lg flex items-center space-x-2">
        <MessageCircle className="w-4 h-4 text-white" />
        <span className="text-sm font-medium text-white">Send Message</span>
      </div>

      {/* Content Section */}
      <div className="p-3 bg-white rounded-b-lg">
        {isEditing ? (
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className="w-full min-h-[3rem] p-2 text-sm border border-gray-200 rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your message here..."
          />
        ) : (
          <div
            onClick={handleContentClick}
            className={`min-h-[3rem] p-2 text-sm text-gray-800 cursor-text whitespace-pre-wrap ${
              selected ? 'bg-gray-50 border border-gray-200 rounded' : ''
            }`}
          >
            {message || 'Enter your message here...'}
          </div>
        )}
      </div>

      {/* Source Handle */}
      <Handle
        type="source"
        position={Position.Right}
        style={{
          width: 8,
          height: 8,
          backgroundColor: '#6B7280',
          border: '2px solid #FFFFFF',
          borderRadius: '50%',
          right: -4,
          top: '50%',
          transform: 'translateY(-50%)',
        }}
      />
    </div>
  )
}

export default MessageNode