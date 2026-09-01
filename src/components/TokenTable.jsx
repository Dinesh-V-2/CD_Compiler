import React, { useState } from 'react';
import { Table, Search, Copy, Check } from 'lucide-react';

export default function TokenTable({ tokens }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [copied, setCopied] = useState(false);

  const filteredTokens = (tokens || []).filter(t => 
    t.lexeme.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCopy = () => {
    const text = JSON.stringify(tokens, null, 2);
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getBadgeStyle = (type) => {
    if (type === 'IDENTIFIER') return 'badge badge-ident';
    if (type === 'NUMBER') return 'badge badge-num';
    return 'badge badge-op';
  };

  return (
    <div className="panel">
      <div className="panel-header">
        <div className="panel-title">
          <Table size={16} className="text-accent-cyan" />
          <span>Lexical Analysis — Token Table ({tokens ? tokens.length : 0} tokens)</span>
        </div>

        <div className="panel-actions">
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Search size={14} style={{ position: 'absolute', left: '8px', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search lexeme/type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="select-input"
              style={{ paddingLeft: '28px', width: '160px' }}
            />
          </div>

          <button className="btn btn-secondary btn-icon" onClick={handleCopy} title="Copy Tokens JSON">
            {copied ? <Check size={14} className="text-accent-green" /> : <Copy size={14} />}
          </button>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="compiler-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Lexeme</th>
              <th>Token Type</th>
              <th>Line : Column</th>
              <th>Pos</th>
            </tr>
          </thead>
          <tbody>
            {filteredTokens.length > 0 ? (
              filteredTokens.map((t, idx) => (
                <tr key={idx}>
                  <td style={{ color: 'var(--text-muted)' }}>{t.id}</td>
                  <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{t.lexeme}</td>
                  <td>
                    <span className={getBadgeStyle(t.type)}>{t.type}</span>
                  </td>
                  <td style={{ color: 'var(--text-secondary)' }}>{t.line} : {t.column}</td>
                  <td style={{ color: 'var(--text-muted)' }}>{t.position}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '20px' }}>
                  No tokens generated yet. Click Compile.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
