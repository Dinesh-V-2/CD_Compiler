import React, { useState } from 'react';
import { Layers, Copy, Check } from 'lucide-react';

export default function QuadrupleTable({ quadruples, title = 'Quadruple Representation' }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!quadruples) return;
    const text = quadruples.map(q => `(${q.index}) op: ${q.op} | arg1: ${q.arg1} | arg2: ${q.arg2} | result: ${q.result}`).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="panel">
      <div className="panel-header">
        <div className="panel-title">
          <Layers size={16} className="text-accent-purple" />
          <span>{title} (op, arg1, arg2, result)</span>
        </div>

        <div className="panel-actions">
          <button className="btn btn-secondary" onClick={handleCopy}>
            {copied ? <Check size={14} className="text-accent-green" /> : <Copy size={14} />}
            <span>{copied ? 'Copied!' : 'Copy Quadruples'}</span>
          </button>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="compiler-table">
          <thead>
            <tr>
              <th style={{ width: '60px' }}>#</th>
              <th>Operator (op)</th>
              <th>Argument 1 (arg1)</th>
              <th>Argument 2 (arg2)</th>
              <th>Result</th>
            </tr>
          </thead>
          <tbody>
            {quadruples && quadruples.length > 0 ? (
              quadruples.map((q) => (
                <tr key={q.index}>
                  <td style={{ color: 'var(--text-muted)' }}>{q.index}</td>
                  <td>
                    <span className="badge badge-op">{q.op}</span>
                  </td>
                  <td style={{ color: 'var(--text-primary)' }}>{q.arg1 || '-'}</td>
                  <td style={{ color: 'var(--text-primary)' }}>{q.arg2 || '-'}</td>
                  <td style={{ fontWeight: 600, color: 'var(--accent-cyan)' }}>{q.result}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '20px' }}>
                  No Quadruple records generated yet. Click Compile.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
