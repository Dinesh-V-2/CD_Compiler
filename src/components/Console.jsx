import React, { useState } from 'react';
import { Terminal, Trash2, ChevronUp, ChevronDown } from 'lucide-react';

export default function Console({ logs = [], onClearConsole }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="compiler-console" style={{ height: collapsed ? '36px' : '150px', transition: 'height 0.2s ease' }}>
      <div className="panel-header" style={{ padding: '6px 16px', backgroundColor: 'var(--bg-card)' }}>
        <div className="panel-title" style={{ fontSize: '0.8rem' }}>
          <Terminal size={14} className="text-accent-green" />
          <span>Compiler Event Stream Console ({logs.length} events)</span>
        </div>

        <div className="panel-actions">
          <button className="btn btn-secondary btn-icon" onClick={onClearConsole} title="Clear Console">
            <Trash2 size={12} />
          </button>
          <button 
            className="btn btn-secondary btn-icon" 
            onClick={() => setCollapsed(!collapsed)} 
            title={collapsed ? 'Expand Console' : 'Collapse Console'}
          >
            {collapsed ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </button>
        </div>
      </div>

      {!collapsed && (
        <div className="console-logs">
          {logs.length > 0 ? (
            logs.map((log, idx) => (
              <div key={idx} className="log-entry">
                <span className="log-time">[{log.timestamp}]</span>
                <span className={`log-type-${log.type}`}>[{log.type}]</span>
                <span style={{ color: 'var(--text-primary)' }}>{log.message}</span>
              </div>
            ))
          ) : (
            <div style={{ color: 'var(--text-muted)' }}>[INFO] Console ready. Awaiting compilation commands...</div>
          )}
        </div>
      )}
    </div>
  );
}
