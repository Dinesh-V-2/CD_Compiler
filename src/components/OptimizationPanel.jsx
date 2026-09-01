import React, { useState } from 'react';
import { Zap, CheckSquare, Square, Sliders, ArrowRight, Layers, ListOrdered } from 'lucide-react';
import QuadrupleTable from './QuadrupleTable.jsx';
import TripleTable from './TripleTable.jsx';

export default function OptimizationPanel({
  optimizationSettings,
  setOptimizationSettings,
  originalTAC,
  optimizationResult,
  onReoptimize
}) {
  const [activeSubTab, setActiveSubTab] = useState('tac');

  const toggleSetting = (key) => {
    const updated = { ...optimizationSettings, [key]: !optimizationSettings[key] };
    setOptimizationSettings(updated);
  };

  const handleApplyAll = () => {
    const allOn = { constantFolding: true, commonSubexpression: true, deadCodeElimination: true };
    setOptimizationSettings(allOn);
    onReoptimize(allOn);
  };

  const handleApplySelected = () => {
    onReoptimize(optimizationSettings);
  };

  const logs = optimizationResult ? optimizationResult.logs : [];
  const optTAC = optimizationResult ? optimizationResult.optimizedTAC : [];
  const optQuads = optimizationResult ? optimizationResult.optimizedQuadruples : [];
  const optTriples = optimizationResult ? optimizationResult.optimizedTriples : [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Optimization Settings Panel */}
      <div className="panel">
        <div className="panel-header">
          <div className="panel-title">
            <Sliders size={16} className="text-accent-amber" />
            <span>Optimization Algorithms & Controls</span>
          </div>

          <div className="panel-actions">
            <button className="btn btn-secondary" onClick={handleApplySelected}>
              <span>Apply Selected</span>
            </button>
            <button className="btn btn-success" onClick={handleApplyAll}>
              <Zap size={14} />
              <span>Apply All</span>
            </button>
          </div>
        </div>

        <div style={{ padding: '16px', display: 'flex', flexWrap: 'wrap', gap: '20px', backgroundColor: 'var(--bg-card)' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.85rem' }}>
            <input
              type="checkbox"
              checked={optimizationSettings.constantFolding}
              onChange={() => toggleSetting('constantFolding')}
              style={{ width: '16px', height: '16px', accentColor: 'var(--accent-cyan)' }}
            />
            <span style={{ fontWeight: 600, color: 'var(--accent-cyan)' }}>Constant Folding & Algebraic Simplification</span>
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.85rem' }}>
            <input
              type="checkbox"
              checked={optimizationSettings.commonSubexpression}
              onChange={() => toggleSetting('commonSubexpression')}
              style={{ width: '16px', height: '16px', accentColor: 'var(--accent-purple)' }}
            />
            <span style={{ fontWeight: 600, color: 'var(--accent-purple)' }}>Common Subexpression Elimination (CSE)</span>
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.85rem' }}>
            <input
              type="checkbox"
              checked={optimizationSettings.deadCodeElimination}
              onChange={() => toggleSetting('deadCodeElimination')}
              style={{ width: '16px', height: '16px', accentColor: 'var(--accent-rose)' }}
            />
            <span style={{ fontWeight: 600, color: 'var(--accent-rose)' }}>Dead Code Elimination (DCE)</span>
          </label>
        </div>
      </div>

      {/* Step-by-Step Optimization Log */}
      <div className="panel">
        <div className="panel-header">
          <div className="panel-title">
            <Zap size={16} className="text-accent-green" />
            <span>Optimization Transformation Log ({logs.length} operations detected)</span>
          </div>
        </div>

        <div className="table-wrapper">
          <table className="compiler-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Technique</th>
                <th>Pattern / Expression</th>
                <th>Original Instruction</th>
                <th>Optimized Result</th>
                <th>Explanation</th>
              </tr>
            </thead>
            <tbody>
              {logs.length > 0 ? (
                logs.map((log, idx) => (
                  <tr key={idx}>
                    <td style={{ color: 'var(--text-muted)' }}>{idx + 1}</td>
                    <td>
                      <span className="badge badge-op">{log.technique}</span>
                    </td>
                    <td style={{ fontWeight: 600, color: 'var(--accent-amber)' }}>{log.pattern}</td>
                    <td className="diff-removed">{log.original}</td>
                    <td className="diff-retained">{log.optimized}</td>
                    <td style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{log.explanation}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '20px' }}>
                    No optimizations triggered for this expression or selected settings.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sub-tabs for Optimized Outputs */}
      <div className="panel">
        <div className="panel-header">
          <div className="nav-tabs" style={{ padding: 0, border: 'none', background: 'transparent' }}>
            <button
              className={`nav-tab ${activeSubTab === 'tac' ? 'active' : ''}`}
              onClick={() => setActiveSubTab('tac')}
            >
              <span>Optimized TAC Comparison</span>
            </button>
            <button
              className={`nav-tab ${activeSubTab === 'quads' ? 'active' : ''}`}
              onClick={() => setActiveSubTab('quads')}
            >
              <span>Optimized Quadruples</span>
            </button>
            <button
              className={`nav-tab ${activeSubTab === 'triples' ? 'active' : ''}`}
              onClick={() => setActiveSubTab('triples')}
            >
              <span>Optimized Triples</span>
            </button>
          </div>
        </div>

        {activeSubTab === 'tac' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1px', backgroundColor: 'var(--border-color)' }}>
            <div style={{ backgroundColor: 'var(--bg-panel)', padding: '12px' }}>
              <div style={{ fontWeight: 600, marginBottom: '8px', color: 'var(--accent-rose)', fontSize: '0.85rem' }}>
                Original TAC ({originalTAC ? originalTAC.length : 0} instructions)
              </div>
              <div className="table-wrapper">
                <table className="compiler-table">
                  <thead>
                    <tr><th>#</th><th>Instruction</th></tr>
                  </thead>
                  <tbody>
                    {(originalTAC || []).map(i => (
                      <tr key={i.id}>
                        <td style={{ color: 'var(--text-muted)' }}>{i.id}</td>
                        <td style={{ fontFamily: 'var(--font-mono)' }}>{i.text}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div style={{ backgroundColor: 'var(--bg-panel)', padding: '12px' }}>
              <div style={{ fontWeight: 600, marginBottom: '8px', color: 'var(--accent-green)', fontSize: '0.85rem' }}>
                Optimized TAC ({optTAC.length} instructions)
              </div>
              <div className="table-wrapper">
                <table className="compiler-table">
                  <thead>
                    <tr><th>#</th><th>Instruction</th></tr>
                  </thead>
                  <tbody>
                    {optTAC.map(i => (
                      <tr key={i.id}>
                        <td style={{ color: 'var(--text-muted)' }}>{i.id}</td>
                        <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-green)', fontWeight: 600 }}>{i.text}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeSubTab === 'quads' && (
          <QuadrupleTable quadruples={optQuads} title="Optimized Quadruple Representation" />
        )}

        {activeSubTab === 'triples' && (
          <TripleTable triples={optTriples} title="Optimized Triple Representation" />
        )}
      </div>
    </div>
  );
}
