"use client"

import React, { useState, useCallback, useRef, useEffect } from "react"
import { Node, Edge } from "@xyflow/react"
import FlowCanvas from "@/components/flow-builder/FlowCanvas"
import NodePanel from "@/components/flow-builder/NodePanel"
import SettingsPanel from "@/components/flow-builder/SettingsPanel"
import TopBar from "@/components/flow-builder/TopBar"
import { DnDProvider } from "@/hook/useDnD"

export default function FlowBuilderApp() {
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const [currentFlow, setCurrentFlow] = useState<{ nodes: Node[], edges: Edge[] }>({ nodes: [], edges: [] })
  type NodeUpdate = Partial<Node> & { data?: Record<string, unknown> }
  const updateNodeRef = useRef<((nodeId: string, updates: NodeUpdate) => void) | null>(null)

  // Fix hydration issue by only rendering on client
  useEffect(() => {
    setIsClient(true)
  }, [])

  const handleNodeSelect = useCallback((node: Node | null) => {
    setSelectedNode(node)
  }, [])

  const handleFlowChange = useCallback((updatedNodes: Node[], updatedEdges: Edge[]) => {
    setCurrentFlow({ nodes: updatedNodes, edges: updatedEdges })
    setHasUnsavedChanges(true)
  }, [])

  const handleUpdateNode = useCallback((nodeId: string, updates: NodeUpdate) => {
    if (updateNodeRef.current) {
      updateNodeRef.current(nodeId, updates)
    }
    setHasUnsavedChanges(true)
  }, [])

  const handleSave = useCallback(async () => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    try {
      // Save the current flow to localStorage
      const flowData = {
        nodes: currentFlow.nodes,
        edges: currentFlow.edges,
        savedAt: new Date().toISOString()
      }
      
      localStorage.setItem('flowBuilder-data', JSON.stringify(flowData))
      
      // Mark as saved
      setHasUnsavedChanges(false)
      
      console.log('Flow saved successfully:', flowData)
      
    } catch (error) {
      console.error('Failed to save flow:', error)
      throw error // Re-throw to trigger error handling in TopBar/SettingsPanel
    }
  }, [currentFlow])

  const handleCloseSettings = useCallback(() => {
    setSelectedNode(null)
  }, [])

  // Show loading state during hydration
  if (!isClient) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-emerald-500 rounded-full animate-spin"></div>
          <div className="text-gray-600 text-sm font-medium">Loading Flow Builder...</div>
        </div>
      </div>
    )
  }

  return (
    <DnDProvider>
      <div className="h-screen w-full flex flex-col bg-gray-50">
        {/* Top Bar */}
        <TopBar 
          onSave={handleSave}
          hasUnsavedChanges={hasUnsavedChanges}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex relative" style={{ marginTop: '60px' }}>
          {/* Flow Canvas */}
          <div className="flex-1 relative">
            <FlowCanvas
              selectedNode={selectedNode}
              onNodeSelect={handleNodeSelect}
              onFlowChange={handleFlowChange}
              onUpdateNode={handleUpdateNode}
              updateNodeRef={updateNodeRef}
            />
          </div>

          {/* Node Panel - Hidden when settings panel is open */}
          <NodePanel isVisible={!selectedNode} />

          {/* Settings Panel - Shows when node is selected */}
          {selectedNode && (
            <SettingsPanel
              selectedNode={selectedNode}
              onClose={handleCloseSettings}
              onUpdateNode={handleUpdateNode}
              onSave={handleSave}
              hasUnsavedChanges={hasUnsavedChanges}
            />
          )}
        </div>
      </div>
    </DnDProvider>
  )
}