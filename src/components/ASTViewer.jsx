import React, { useState } from 'react';
import { GitCommit, ZoomIn, ZoomOut, RefreshCw, Info, ChevronRight, ChevronDown } from 'lucide-react';

function TreeNode({ node, depth = 0, onSelectNode, selectedId }) {
  const [collapsed, setCollapsed] = useState(false);
  if (!node) return null;

  const hasChildren = node.children && node.children.length > 0;
  const isSelected = selectedId === node.id;

  const getNodeStyle = (type) => {
    switch (type) {
      case 'Assignment': return { borderColor: '#2563eb', backgroundColor: '#eff6ff' };
      case 'BinaryOp': return { borderColor: '#7c3aed', backgroundColor: '#f5f3ff' };
      case 'UnaryOp': return { borderColor: '#d97706', backgroundColor: '#fffbeb' };
      case 'Identifier': return { borderColor: '#0284c7', backgroundColor: '#f0f9ff' };
      case 'Number': return { borderColor: '#16a34a', backgroundColor: '#f0fdf4' };
      default: return { borderColor: '#cbd5e1', backgroundColor: '#f8fafc' };
    }
  };

  const style = getNodeStyle(node.type);

  return (
    <div style={{ marginLeft: `${depth * 24}px`, marginTop: '6px' }}>
      <div
        className="tree-node-card"
        style={{
          border: isSelected ? '2px solid var(--accent-blue)' : `1px solid ${style.borderColor}`,
          backgroundColor: isSelected ? '#dbeafe' : style.backgroundColor
        }}
        onClick={(e) => {
          e.stopPropagation();
          onSelectNode(node);
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {hasChildren && (
            <span 
              onClick={(e) => {
                e.stopPropagation();
                setCollapsed(!collapsed);
              }}
              style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            >
              {collapsed ? <ChevronRight size={14} /> : <ChevronDown size={14} />}
            </span>
          )}
          <span style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-primary)' }}>
            {node.label}
          </span>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>[{node.type}]</span>
        </div>
      </div>

      {hasChildren && !collapsed && (
        <div style={{ borderLeft: '2px dashed var(--border-highlight)', marginLeft: '14px', paddingLeft: '8px' }}>
          {node.children.map(child => (
            <TreeNode
              key={child.id}
              node={child}
              depth={0}
              onSelectNode={onSelectNode}
              selectedId={selectedId}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function ASTViewer({ astTree, astRaw }) {
  const [selectedNode, setSelectedNode] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.15, 1.8));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.15, 0.6));
  const handleResetZoom = () => setZoomLevel(1);

  return (
    <div className="panel">
      <div className="panel-header">
        <div className="panel-title">
          <GitCommit size={16} className="text-accent-blue" />
          <span>Interactive Abstract Syntax Tree (AST) Visualizer</span>
        </div>

        <div className="panel-actions">
          <button className="btn btn-secondary btn-icon" onClick={handleZoomIn} title="Zoom In">
            <ZoomIn size={14} />
          </button>
          <button className="btn btn-secondary btn-icon" onClick={handleZoomOut} title="Zoom Out">
            <ZoomOut size={14} />
          </button>
          <button className="btn btn-secondary btn-icon" onClick={handleResetZoom} title="Reset View">
            <RefreshCw size={14} />
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        <div 
          className="ast-tree-container" 
          style={{ flex: 1, transform: `scale(${zoomLevel})`, transformOrigin: 'top left', transition: 'transform 0.2s ease' }}
        >
          {astTree ? (
            <div style={{ width: '100%' }}>
              <TreeNode
                node={astTree}
                onSelectNode={setSelectedNode}
                selectedId={selectedNode ? selectedNode.id : null}
              />
            </div>
          ) : (
            <div style={{ color: 'var(--text-muted)', textAlign: 'center', marginTop: '40px' }}>
              No AST generated yet. Click Compile.
            </div>
          )}
        </div>

        {selectedNode && (
          <div 
            style={{ 
              width: '290px', 
              borderLeft: '1px solid var(--border-color)', 
              padding: '18px',
              backgroundColor: 'var(--bg-card)',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, fontSize: '0.9rem', color: 'var(--accent-blue)' }}>
              <Info size={16} />
              <span>Node Inspector Properties</span>
            </div>

            <div style={{ fontSize: '0.82rem', display: 'flex', flexDirection: 'column', gap: '6px', color: 'var(--text-primary)' }}>
              <div><strong>Node ID:</strong> <span style={{ fontFamily: 'var(--font-mono)' }}>{selectedNode.id}</span></div>
              <div><strong>Node Type:</strong> <span className="badge badge-op">{selectedNode.type}</span></div>
              <div><strong>Label:</strong> {selectedNode.label}</div>
              <div><strong>Details:</strong> {selectedNode.details}</div>
              <div><strong>Children Count:</strong> {selectedNode.children ? selectedNode.children.length : 0}</div>
            </div>

            <div style={{ marginTop: '10px' }}>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Raw Subtree JSON:</label>
              <pre style={{ fontSize: '0.72rem', backgroundColor: '#ffffff', border: '1px solid var(--border-color)', padding: '10px', borderRadius: '6px', overflowX: 'auto', maxH: '130px' }}>
                {JSON.stringify(selectedNode.rawNode, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
