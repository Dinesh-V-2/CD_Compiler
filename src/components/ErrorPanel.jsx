import React from 'react';
import { AlertTriangle, XCircle } from 'lucide-react';

export default function ErrorPanel({ error }) {
  if (!error) return null;

  return (
    <div className="error-banner">
      <div className="error-title">
        <AlertTriangle size={18} />
        <span>{error.name}: Compilation Failed</span>
      </div>

      <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
        {error.message}
      </div>

      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
        Location: Line <strong>{error.line}</strong>, Column <strong>{error.column}</strong>
      </div>

      {error.expected && error.expected.length > 0 && (
        <div style={{ fontSize: '0.75rem', color: 'var(--accent-amber)' }}>
          Expected token types: {error.expected.join(' | ')}
        </div>
      )}
    </div>
  );
}
