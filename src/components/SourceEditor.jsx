import React from 'react';
import { Play, Zap, RotateCcw, Trash2, Code, History } from 'lucide-react';

export const EXAMPLES = [
  {
    id: 'ex1',
    name: 'Example 1: Complex Finance Formula',
    expr: 'finalValue = ((principal * rate * time) / 100) + (principal * (1 + rate/100)^time) - fees'
  },
  {
    id: 'ex2',
    name: 'Example 2: Constant Folding (10 * 20 + 5 * 4)',
    expr: 'x = (10 * 20) + (5 * 4)'
  },
  {
    id: 'ex3',
    name: 'Example 3: Common Subexpression ((a+b)*(a+b))',
    expr: 'x = (a + b) * (a + b)'
  },
  {
    id: 'ex4',
    name: 'Example 4: Dead Code Elimination',
    expr: 'x = a + b\ny = c * d\nz = x + 10'
  },
  {
    id: 'ex5',
    name: 'Example 5: Nested CSE & Distributive',
    expr: 'result = ((a + b) * c) + ((a + b) * d)'
  },
  {
    id: 'ex6',
    name: 'Example 6: Acceptance Test (CF + CSE + DCE)',
    expr: 'x = (a + b) * (a + b) + (10 * 20)'
  }
];

export default function SourceEditor({
  expression,
  setExpression,
  onCompile,
  onCompileAndOptimize,
  onReset,
  onClear,
  recentExpressions = []
}) {
  const handleExampleChange = (e) => {
    const selected = EXAMPLES.find(ex => ex.id === e.target.value);
    if (selected) {
      setExpression(selected.expr);
    }
  };

  const handleRecentChange = (e) => {
    if (e.target.value) {
      setExpression(e.target.value);
    }
  };

  return (
    <div className="panel">
      <div className="panel-header">
        <div className="panel-title">
          <Code size={16} className="text-accent-cyan" />
          <span>Source Arithmetic Expression</span>
        </div>
        
        <div className="example-selector">
          <label htmlFor="example-select">Preset Examples:</label>
          <select id="example-select" className="select-input" onChange={handleExampleChange} defaultValue="">
            <option value="" disabled>-- Select Example --</option>
            {EXAMPLES.map(ex => (
              <option key={ex.id} value={ex.id}>{ex.name}</option>
            ))}
          </select>

          {recentExpressions.length > 0 && (
            <select className="select-input" onChange={handleRecentChange} defaultValue="">
              <option value="" disabled>-- Recent --</option>
              {recentExpressions.map((expr, idx) => (
                <option key={idx} value={expr}>{expr.slice(0, 30)}...</option>
              ))}
            </select>
          )}
        </div>
      </div>

      <div className="editor-container" style={{ padding: '8px' }}>
        <textarea
          className="editor-textarea"
          value={expression}
          onChange={(e) => setExpression(e.target.value)}
          placeholder="Enter high-level arithmetic expression (e.g. finalValue = ((principal * rate * time) / 100) + ...)"
          rows={3}
          spellCheck="false"
        />

        <div className="controls-bar">
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn btn-primary" onClick={() => onCompile(false)}>
              <Play size={14} />
              <span>Compile</span>
            </button>

            <button className="btn btn-success" onClick={() => onCompileAndOptimize(true)}>
              <Zap size={14} />
              <span>Compile & Optimize</span>
            </button>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn btn-secondary" onClick={onReset} title="Reset to Default">
              <RotateCcw size={14} />
              <span>Reset</span>
            </button>

            <button className="btn btn-danger" onClick={onClear} title="Clear Editor">
              <Trash2 size={14} />
              <span>Clear</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
