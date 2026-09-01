import React, { useState } from 'react';
import { Code2, Copy, Check } from 'lucide-react';

export default function TACTable({ tacInstructions, title = 'Three Address Code (TAC)' }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!tacInstructions) return;
    const text = tacInstructions.map(i => `${i.id}. ${i.text}`).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="panel">
      <div className="panel-header">
        <div className="panel-title">
          <Code2 size={16} className="text-accent-cyan" />
          <span>{title} ({tacInstructions ? tacInstructions.length : 0} instructions)</span>
        </div>

        <div className="panel-actions">
          <button className="btn btn-secondary" onClick={handleCopy}>
            {copied ? <Check size={14} className="text-accent-green" /> : <Copy size={14} />}
            <span>{copied ? 'Copied!' : 'Copy TAC'}</span>
          </button>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="compiler-table">
          <thead>
            <tr>
              <th style={{ width: '60px' }}>#</th>
              <th>Three Address Code Instruction</th>
              <th>Operation Type</th>
            </tr>
          </thead>
          <tbody>
            {tacInstructions && tacInstructions.length > 0 ? (
              tacInstructions.map((inst) => (
                <tr key={inst.id}>
                  <td style={{ color: 'var(--text-muted)' }}>{inst.id}</td>
                  <td style={{ fontWeight: 600, color: 'var(--accent-cyan)' }}>{inst.text}</td>
                  <td>
                    <span className={inst.type === 'assign' ? 'badge badge-ident' : 'badge badge-op'}>
                      {inst.type}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '20px' }}>
                  No Three Address Code generated yet. Click Compile.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
