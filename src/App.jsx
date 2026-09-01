import React, { useState, useEffect } from 'react';
import Header from './components/Header.jsx';
import SourceEditor from './components/SourceEditor.jsx';
import TokenTable from './components/TokenTable.jsx';
import ASTViewer from './components/ASTViewer.jsx';
import TACTable from './components/TACTable.jsx';
import QuadrupleTable from './components/QuadrupleTable.jsx';
import TripleTable from './components/TripleTable.jsx';
import OptimizationPanel from './components/OptimizationPanel.jsx';
import PerformancePanel from './components/PerformancePanel.jsx';
import Console from './components/Console.jsx';
import ErrorPanel from './components/ErrorPanel.jsx';
import Documentation from './components/Documentation.jsx';
import ExportModal from './components/ExportModal.jsx';

import { runFullCompilation } from './services/compilerService.js';
import { storageService } from './services/storageService.js';

import { Download, Cpu, Layers, ListOrdered, Code2, Zap, BarChart3, BookOpen } from 'lucide-react';
import './styles/compiler.css';

const DEFAULT_EXPRESSION = 'finalValue = ((principal * rate * time) / 100) + (principal * (1 + rate/100)^time) - fees';

export default function App() {
  const [expression, setExpression] = useState(() => storageService.getLastExpression(DEFAULT_EXPRESSION));
  const [activeTab, setActiveTab] = useState('compiler');
  const [optimizationSettings, setOptimizationSettings] = useState(() => 
    storageService.getOptimizationSettings({
      constantFolding: true,
      commonSubexpression: true,
      deadCodeElimination: true
    })
  );
  const [recentExpressions, setRecentExpressions] = useState(() => storageService.getRecentExpressions());
  const [compilationResult, setCompilationResult] = useState(null);
  const [consoleLogs, setConsoleLogs] = useState([]);
  const [showExportModal, setShowExportModal] = useState(false);

  const executeCompilation = (shouldOptimize = true, settings = optimizationSettings, currentExpr = expression) => {
    const result = runFullCompilation(currentExpr, {
      optimize: shouldOptimize,
      optimizationSettings: settings
    });

    setCompilationResult(result);
    setConsoleLogs(result.consoleLogs);

    if (result.success) {
      storageService.saveLastExpression(currentExpr);
      setRecentExpressions(storageService.getRecentExpressions());
    }
  };

  // Initial compilation on mount
  useEffect(() => {
    executeCompilation(true, optimizationSettings, expression);
  }, []);

  const handleCompile = (optimize = false) => {
    executeCompilation(optimize, optimizationSettings, expression);
  };

  const handleCompileAndOptimize = () => {
    executeCompilation(true, optimizationSettings, expression);
  };

  const handleReset = () => {
    setExpression(DEFAULT_EXPRESSION);
    executeCompilation(true, optimizationSettings, DEFAULT_EXPRESSION);
  };

  const handleClear = () => {
    setExpression('');
    setCompilationResult(null);
  };

  const handleReoptimize = (newSettings) => {
    setOptimizationSettings(newSettings);
    storageService.saveOptimizationSettings(newSettings);
    executeCompilation(true, newSettings, expression);
  };

  return (
    <div className="app-container">
      {/* Header */}
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Navigation Tabs */}
      <div className="nav-tabs">
        <button
          className={`nav-tab ${activeTab === 'compiler' ? 'active' : ''}`}
          onClick={() => setActiveTab('compiler')}
        >
          <Cpu size={14} />
          <span>Compiler Dashboard</span>
        </button>

        <button
          className={`nav-tab ${activeTab === 'ast' ? 'active' : ''}`}
          onClick={() => setActiveTab('ast')}
        >
          <Code2 size={14} />
          <span>AST Visualizer</span>
        </button>

        <button
          className={`nav-tab ${activeTab === 'tac' ? 'active' : ''}`}
          onClick={() => setActiveTab('tac')}
        >
          <Code2 size={14} />
          <span>Three Address Code</span>
          {compilationResult?.tac && <span className="tab-badge">{compilationResult.tac.length}</span>}
        </button>

        <button
          className={`nav-tab ${activeTab === 'quads' ? 'active' : ''}`}
          onClick={() => setActiveTab('quads')}
        >
          <Layers size={14} />
          <span>Quadruples</span>
        </button>

        <button
          className={`nav-tab ${activeTab === 'triples' ? 'active' : ''}`}
          onClick={() => setActiveTab('triples')}
        >
          <ListOrdered size={14} />
          <span>Triples</span>
        </button>

        <button
          className={`nav-tab ${activeTab === 'optimization' ? 'active' : ''}`}
          onClick={() => setActiveTab('optimization')}
        >
          <Zap size={14} />
          <span>Optimization Engine</span>
          {compilationResult?.optimizationResult?.logs && (
            <span className="tab-badge">{compilationResult.optimizationResult.logs.length}</span>
          )}
        </button>

        <button
          className={`nav-tab ${activeTab === 'performance' ? 'active' : ''}`}
          onClick={() => setActiveTab('performance')}
        >
          <BarChart3 size={14} />
          <span>Performance & Charts</span>
          {compilationResult?.performanceMetrics && (
            <span className="tab-badge" style={{ backgroundColor: 'var(--accent-green)', color: '#000' }}>
              {compilationResult.performanceMetrics.reductionPercentage}%
            </span>
          )}
        </button>

        <button
          className={`nav-tab ${activeTab === 'docs' ? 'active' : ''}`}
          onClick={() => setActiveTab('docs')}
        >
          <BookOpen size={14} />
          <span>Documentation</span>
        </button>

        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', paddingRight: '8px' }}>
          <button 
            className="btn btn-secondary" 
            onClick={() => setShowExportModal(true)}
            disabled={!compilationResult || !compilationResult.success}
          >
            <Download size={14} />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="ide-main">
        <div className="ide-workspace">
          {/* Source Expression Editor - Always visible at top of workspace */}
          <SourceEditor
            expression={expression}
            setExpression={setExpression}
            onCompile={handleCompile}
            onCompileAndOptimize={handleCompileAndOptimize}
            onReset={handleReset}
            onClear={handleClear}
            recentExpressions={recentExpressions}
          />

          {/* Compilation Error Display if failed */}
          {compilationResult && !compilationResult.success && (
            <ErrorPanel error={compilationResult.error} />
          )}

          {/* Active Tab View Rendering */}
          {activeTab === 'compiler' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <TokenTable tokens={compilationResult?.tokens} />
              <TACTable tacInstructions={compilationResult?.tac} />
            </div>
          )}

          {activeTab === 'ast' && (
            <ASTViewer astTree={compilationResult?.astTree} astRaw={compilationResult?.ast} />
          )}

          {activeTab === 'tac' && (
            <TACTable tacInstructions={compilationResult?.tac} />
          )}

          {activeTab === 'quads' && (
            <QuadrupleTable quadruples={compilationResult?.quadruples} />
          )}

          {activeTab === 'triples' && (
            <TripleTable triples={compilationResult?.triples} />
          )}

          {activeTab === 'optimization' && (
            <OptimizationPanel
              optimizationSettings={optimizationSettings}
              setOptimizationSettings={setOptimizationSettings}
              originalTAC={compilationResult?.tac}
              optimizationResult={compilationResult?.optimizationResult}
              onReoptimize={handleReoptimize}
            />
          )}

          {activeTab === 'performance' && (
            <PerformancePanel metrics={compilationResult?.performanceMetrics} />
          )}

          {activeTab === 'docs' && (
            <Documentation />
          )}
        </div>
      </div>

      {/* Bottom Console Event Stream */}
      <Console logs={consoleLogs} onClearConsole={() => setConsoleLogs([])} />

      {/* Export Modal */}
      {showExportModal && (
        <ExportModal
          compilationData={compilationResult}
          expression={expression}
          onClose={() => setShowExportModal(false)}
        />
      )}
    </div>
  );
}
