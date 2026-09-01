import React from 'react';
import { Cpu, Terminal, Sparkles, CheckCircle } from 'lucide-react';

export default function Header({ activeTab, setActiveTab }) {
  return (
    <header className="ide-header">
      <div className="brand-section">
        <div className="brand-icon">
          <Cpu size={20} />
        </div>
        <div>
          <div className="brand-title">
            SMART INTERMEDIATE CODE GENERATOR
            <span className="brand-subtitle">• Compiler Design</span>
          </div>
        </div>
      </div>

      <div className="header-status">
        <div className="status-badge">
          <span className="status-dot"></span>
          <span>● LOCAL COMPILER ACTIVE</span>
        </div>

        <div className="env-pills">
          <span className="env-pill">Node.js</span>
          <span className="env-pill">JavaScript Engine</span>
          <span className="env-pill">Vite</span>
          <span className="env-pill">React</span>
        </div>
      </div>
    </header>
  );
}
