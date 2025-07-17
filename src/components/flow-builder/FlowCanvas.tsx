"use client"

import React, { useCallback, useRef, useState } from 'react'
import {
  ReactFlow,
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  BackgroundVariant,
  Connection,
  Edge,
  Node,
  NodeTypes,
  MarkerType,
  ConnectionMode,
  Panel,
  useReactFlow,
  OnNodesChange,
  OnEdgesChange,
  OnConnect
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'

// Node components
import MessageNode from './MessageNode'

// Types
export interface FlowCanvasProps {
  selectedNode: Node | null
  onNodeSelect: (node: Node | null) => void
  onFlowChange: (nodes: Node[], edges: Edge[]) => void
  onUpdateNode?: (nodeId: string, updates: Partial<Node> & { data?: Record<string, unknown> }) => void
  updateNodeRef?: React.MutableRefObject<((nodeId: string, updates: Partial<Node> & { data?: Record<string, unknown> }) => void) | null>
}

const nodeTypes: NodeTypes = {
  messageNode: MessageNode,
}

const initialNodes: Node[] = [
  {
    id: 'node-1',
    type: 'messageNode',
    position: { x: 100, y: 100 },
    data: { 
      message: 'Hello! Welcome to our chatbot.',
    },
  },
]

const initialEdges: Edge[] = []

const defaultEdgeOptions = {
  animated: true,
  style: {
    stroke: '#10B981',
    strokeWidth: 2,
  },
  markerEnd: {
    type: MarkerType.ArrowClosed,
    width: 20,
    height: 20,
    color: '#10B981',
  },
}

function FlowCanvasContent({ selectedNode, onNodeSelect, onFlowChange, onUpdateNode, updateNodeRef }: FlowCanvasProps) {
  const reactFlowWrapper = useRef<HTMLDivElement>(null)
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const idCounterRef = useRef(1) // Start at 1 since initial node is 'node-1'
  const { screenToFlowPosition } = useReactFlow()

  const getNextNodeId = useCallback(() => {
    idCounterRef.current += 1
    return `node-${idCounterRef.current}`
  }, [])

  // Handle node updates
  const handleUpdateNode = useCallback((nodeId: string, updates: Partial<Node> & { data?: Record<string, unknown> }) => {
    setNodes((nds) => 
      nds.map(node => 
        node.id === nodeId 
          ? { ...node, ...updates }
          : node
      )
    )
  }, [setNodes])

  // Set the ref so parent can call this function
  React.useEffect(() => {
    if (updateNodeRef) {
      updateNodeRef.current = handleUpdateNode
    }
  }, [handleUpdateNode, updateNodeRef])

  // Expose the update function to parent
  React.useEffect(() => {
    if (onUpdateNode) {
      // This is a workaround to pass the function up to the parent
      // In a real app, you'd use a ref or context
      (window as unknown as { updateNode?: typeof handleUpdateNode }).updateNode = handleUpdateNode
    }
  }, [handleUpdateNode, onUpdateNode])

  // Simplified nodes change handler
  const handleNodesChange: OnNodesChange = useCallback((changes) => {
    onNodesChange(changes)
  }, [onNodesChange])

  // Simplified edges change handler
  const handleEdgesChange: OnEdgesChange = useCallback((changes) => {
    onEdgesChange(changes)
  }, [onEdgesChange])

  // Notify parent of changes after state updates
  React.useEffect(() => {
    onFlowChange(nodes, edges)
  }, [nodes, edges, onFlowChange])

  const handleConnect: OnConnect = useCallback((connection: Connection) => {
    // Validate connection
    if (!connection.source || !connection.target) return
    
    // Prevent self-connections
    if (connection.source === connection.target) return
    
    // Check if connection already exists
    const existingConnection = edges.find(
      edge => edge.source === connection.source && edge.target === connection.target
    )
    if (existingConnection) return

    const newEdge: Edge = {
      ...connection,
      id: `${connection.source}-${connection.target}`,
      type: 'smoothstep',
      animated: true,
      style: {
        stroke: '#10B981',
        strokeWidth: 2,
      },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 20,
        height: 20,
        color: '#10B981',
      },
    }

    setEdges((eds) => addEdge({ ...newEdge, type: newEdge.type ?? 'default' }, eds.map(e => ({ ...e, type: e.type ?? 'default' }))))
  }, [edges, setEdges])

  const handleNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    event.stopPropagation()
    onNodeSelect(node)
  }, [onNodeSelect])

  const handlePaneClick = useCallback(() => {
    onNodeSelect(null)
  }, [onNodeSelect])

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

  const onDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    event.stopPropagation()

    try {
      const type = event.dataTransfer.getData('application/reactflow')
      if (!type) {
        return
      }

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      })

      const newNodeId = getNextNodeId()

      const newNode: Node = {
        id: newNodeId,
        type,
        position,
        data: getNodeData(type),
      }

      setNodes((prevNodes) => [...prevNodes, newNode])

    } catch (error) {
      console.error('Error in onDrop:', error)
    }
  }, [screenToFlowPosition, setNodes, getNextNodeId])

  const getNodeData = (type: string) => {
    switch (type) {
      case 'messageNode':
        return {
          message: 'Enter your message here...',
        }
      default:
        return { message: 'Enter your message here...' }
    }
  }

  return (
    <div 
      className="w-full h-full bg-[var(--color-canvas-bg)]" 
      ref={reactFlowWrapper}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={handleNodesChange}
        onEdgesChange={handleEdgesChange}
        onConnect={handleConnect}
        onNodeClick={handleNodeClick}
        onPaneClick={handlePaneClick}
        nodeTypes={nodeTypes}
        connectionMode={ConnectionMode.Loose}
        defaultEdgeOptions={defaultEdgeOptions}
        fitView
        attributionPosition="bottom-left"
        onDragOver={onDragOver}
        onDrop={onDrop}
        className="bg-[var(--color-canvas-bg)]"
        style={{ backgroundColor: 'var(--color-canvas-bg)' }}
      >
        <Background 
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1}
          color="#D1D5DB"
        />
        <Controls 
          className="bg-white border border-[var(--color-border)] rounded-lg shadow-sm"
        />
        <Panel position="top-right">
          <div className="bg-white rounded-lg shadow-sm border border-[var(--color-border)] p-3">
            <div className="text-sm font-medium text-[var(--color-text-primary)] mb-2">
              Flow Canvas
            </div>
            <div className="text-xs text-[var(--color-text-secondary)]">
              Drag nodes from the panel to build your flow
            </div>
          </div>
        </Panel>
      </ReactFlow>
    </div>
  )
}

export default function FlowCanvas({ selectedNode, onNodeSelect, onFlowChange, onUpdateNode, updateNodeRef }: FlowCanvasProps) {
  return (
    <ReactFlowProvider>
      <FlowCanvasContent 
        selectedNode={selectedNode}
        onNodeSelect={onNodeSelect}
        onFlowChange={onFlowChange}
        onUpdateNode={onUpdateNode}
        updateNodeRef={updateNodeRef}
      />
    </ReactFlowProvider>
  )
}