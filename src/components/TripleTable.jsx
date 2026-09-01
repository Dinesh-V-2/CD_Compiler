import React, { useState } from 'react';
import { ListOrdered, Copy, Check } from 'lucide-react';

export default function TripleTable({ triples, title = 'Triple Representation' }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!triples) return;
    const text = triples.map(t => `(${t.index}) op: ${t.op} | arg1: ${t.arg1} | arg2: ${t.arg2}`).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="panel">
      <div className="panel-header">
        <div className="panel-title">
          <ListOrdered size={16} className="text-accent-amber" />
          <span>{title} (op, arg1, arg2)</span>
        </div>

        <div className="panel-actions">
          <button className="btn btn-secondary" onClick={handleCopy}>
            {copied ? <Check size={14} className="text-accent-green" /> : <Copy size={14} />}
            <span>{copied ? 'Copied!' : 'Copy Triples'}</span>
          </button>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="compiler-table">
          <thead>
            <tr>
              <th style={{ width: '80px' }}>Triple #</th>
              <th>Operator (op)</th>
              <th>Argument 1 (arg1)</th>
              <th>Argument 2 (arg2)</th>
              <th>Assigned Target</th>
            </tr>
          </thead>
          <tbody>
            {triples && triples.length > 0 ? (
              triples.map((t) => (
                <tr key={t.index}>
                  <td style={{ fontWeight: 700, color: 'var(--accent-amber)' }}>{t.resultRef}</td>
                  <td>
                    <span className="badge badge-op">{t.op}</span>
                  </td>
                  <td style={{ color: t.arg1.startsWith('(') ? 'var(--accent-amber)' : 'var(--text-primary)' }}>
                    {t.arg1 || '-'}
                  </td>
                  <td style={{ color: t.arg2.startsWith('(') ? 'var(--accent-amber)' : 'var(--text-primary)' }}>
                    {t.arg2 || '-'}
                  </td>
                  <td style={{ color: 'var(--accent-cyan)' }}>{t.targetVar || '-'}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '20px' }}>
                  No Triple records generated yet. Click Compile.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
