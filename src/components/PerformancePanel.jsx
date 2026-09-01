import React from 'react';
import { Gauge, Clock, ArrowDownRight, Award, PieChartIcon, BarChart3 } from 'lucide-react';
import { InstructionComparisonChart, OptimizationBreakdownChart } from './Charts.jsx';

export default function PerformancePanel({ metrics }) {
  if (!metrics) {
    return (
      <div className="panel" style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)' }}>
        No performance metrics available. Click "Compile & Optimize" to analyze performance.
      </div>
    );
  }

  const {
    originalInstructionCount,
    optimizedInstructionCount,
    instructionsRemoved,
    reductionPercentage,
    breakdown,
    timing
  } = metrics;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Metrics Cards Grid */}
      <div className="metrics-grid">
        <div className="metric-card">
          <span className="metric-label">Original Instructions</span>
          <span className="metric-value" style={{ color: 'var(--accent-rose)' }}>{originalInstructionCount}</span>
          <span className="metric-sub" style={{ color: 'var(--text-muted)' }}>Baseline TAC count</span>
        </div>

        <div className="metric-card">
          <span className="metric-label">Optimized Instructions</span>
          <span className="metric-value" style={{ color: 'var(--accent-green)' }}>{optimizedInstructionCount}</span>
          <span className="metric-sub">Reduced intermediate code</span>
        </div>

        <div className="metric-card">
          <span className="metric-label">Instructions Saved</span>
          <span className="metric-value" style={{ color: 'var(--accent-amber)' }}>{instructionsRemoved}</span>
          <span className="metric-sub">Instructions eliminated</span>
        </div>

        <div className="metric-card">
          <span className="metric-label">Reduction Efficiency</span>
          <span className="metric-value" style={{ color: 'var(--accent-cyan)' }}>{reductionPercentage}%</span>
          <span className="metric-sub">((Orig - Opt) / Orig) * 100</span>
        </div>

        <div className="metric-card">
          <span className="metric-label">Total Execution Time</span>
          <span className="metric-value" style={{ color: 'var(--accent-purple)' }}>{timing ? timing.totalTimeMs : 0} ms</span>
          <span className="metric-sub">Parse: {timing ? timing.parseTimeMs : 0}ms | Opt: {timing ? timing.optTimeMs : 0}ms</span>
        </div>
      </div>

      {/* Interactive Performance Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div className="panel">
          <div className="panel-header">
            <div className="panel-title">
              <BarChart3 size={16} className="text-accent-cyan" />
              <span>Original vs Optimized Instructions</span>
            </div>
          </div>
          <div style={{ padding: '16px' }}>
            <InstructionComparisonChart
              originalCount={originalInstructionCount}
              optimizedCount={optimizedInstructionCount}
            />
          </div>
        </div>

        <div className="panel">
          <div className="panel-header">
            <div className="panel-title">
              <PieChartIcon size={16} className="text-accent-purple" />
              <span>Instructions Saved by Technique</span>
            </div>
          </div>
          <div style={{ padding: '16px' }}>
            <OptimizationBreakdownChart breakdown={breakdown || {}} />
          </div>
        </div>
      </div>
    </div>
  );
}
