
"use client"

import React from "react"
import { MessageSquare } from "lucide-react"
import { useDnD } from "@/hook/useDnD"

interface NodeType {
  id: string
  type: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  description?: string
}

const nodeTypes: NodeType[] = [
  {
    id: "message",
    type: "messageNode",
    label: "Message",
    icon: MessageSquare,
    description: "Send a message to users"
  }
]

interface NodePanelProps {
  isVisible?: boolean
}

export default function NodePanel({ isVisible = true }: NodePanelProps) {
  const { setDragType } = useDnD()

  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    setDragType(nodeType)
    event.dataTransfer.setData('application/reactflow', nodeType)
    event.dataTransfer.effectAllowed = 'move'
  }

  if (!isVisible) return null

  return (
    <div className="fixed right-0 top-0 h-screen w-80 bg-card border-l border-border shadow-lg z-10 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground">Nodes Panel</h2>
        <p className="text-sm text-muted-foreground mt-1 pt-5">
          Drag nodes to the canvas to build your flow
        </p>
      </div>

      {/* Node Types */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-foreground mb-3">Basic Nodes</h3>
            <div className="grid grid-cols-2 gap-3">
              {nodeTypes.map((nodeType) => {
                const IconComponent = nodeType.icon
                return (
                  <div
                    key={nodeType.id}
                    draggable
                    onDragStart={(event) => onDragStart(event, nodeType.type)}
                    className="group flex flex-col items-center p-4 border border-border rounded-lg bg-card hover:bg-accent/5 hover:border-accent/30 cursor-grab transition-all duration-200 hover:shadow-sm active:cursor-grabbing"
                  >
                    <div className="w-8 h-8 mb-2 text-muted-foreground group-hover:text-accent transition-colors duration-200">
                      <IconComponent className="w-full h-full" />
                    </div>
                    <span className="text-sm font-medium text-foreground text-center">
                      {nodeType.label}
                    </span>
                    {nodeType.description && (
                      <span className="text-xs text-muted-foreground text-center mt-1">
                        {nodeType.description}
                      </span>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 border-t border-border">
        <p className="text-xs text-muted-foreground">
          More node types coming soon
        </p>
      </div>
    </div>
  )
}