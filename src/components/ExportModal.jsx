import React from 'react';
import { Download, FileText, Code2, X } from 'lucide-react';

export default function ExportModal({ compilationData, expression, onClose }) {
  if (!compilationData || !compilationData.success) return null;

  const generateTextReport = () => {
    const { tokens, tac, quadruples, triples, optimizationResult, performanceMetrics } = compilationData;

    let report = `=================================================================\n`;
    report += `SMART INTERMEDIATE CODE GENERATOR & OPTIMIZATION COMPILER REPORT\n`;
    report += `Execution Mode: LOCALHOST | Runtime: Node.js / JavaScript Engine\n`;
    report += `Generated: ${new Date().toLocaleString()}\n`;
    report += `=================================================================\n\n`;

    report += `1. SOURCE ARITHMETIC EXPRESSION:\n`;
    report += `-----------------------------------------------------------------\n`;
    report += `${expression}\n\n`;

    report += `2. TOKENS GENERATED (${tokens.length}):\n`;
    report += `-----------------------------------------------------------------\n`;
    tokens.forEach(t => {
      report += `#${t.id}\t${t.lexeme}\t[${t.type}]\t(Line:${t.line}, Col:${t.column})\n`;
    });
    report += `\n`;

    report += `3. THREE ADDRESS CODE (TAC) (${tac.length} instructions):\n`;
    report += `-----------------------------------------------------------------\n`;
    tac.forEach(inst => {
      report += `${inst.id}.\t${inst.text}\n`;
    });
    report += `\n`;

    report += `4. QUADRUPLE REPRESENTATION (${quadruples.length} records):\n`;
    report += `-----------------------------------------------------------------\n`;
    quadruples.forEach(q => {
      report += `(${q.index})\top: ${q.op}\targ1: ${q.arg1 || '-'}\targ2: ${q.arg2 || '-'}\tresult: ${q.result}\n`;
    });
    report += `\n`;

    report += `5. TRIPLE REPRESENTATION (${triples.length} records):\n`;
    report += `-----------------------------------------------------------------\n`;
    triples.forEach(tr => {
      report += `${tr.resultRef}\top: ${tr.op}\targ1: ${tr.arg1 || '-'}\targ2: ${tr.arg2 || '-'}\n`;
    });
    report += `\n`;

    if (optimizationResult) {
      report += `6. OPTIMIZATION TRANSFORMATION LOG (${optimizationResult.logs.length} operations):\n`;
      report += `-----------------------------------------------------------------\n`;
      optimizationResult.logs.forEach((log, idx) => {
        report += `${idx + 1}. [${log.technique}] Pattern: ${log.pattern}\n`;
        report += `   Original: ${log.original}\n`;
        report += `   Optimized: ${log.optimized}\n`;
        report += `   Explanation: ${log.explanation}\n\n`;
      });

      report += `7. OPTIMIZED THREE ADDRESS CODE (${optimizationResult.optimizedTAC.length} instructions):\n`;
      report += `-----------------------------------------------------------------\n`;
      optimizationResult.optimizedTAC.forEach(inst => {
        report += `${inst.id}.\t${inst.text}\n`;
      });
      report += `\n`;
    }

    if (performanceMetrics) {
      report += `8. PERFORMANCE METRICS & EFFICIENCY GAIN:\n`;
      report += `-----------------------------------------------------------------\n`;
      report += `Original Instructions:   ${performanceMetrics.originalInstructionCount}\n`;
      report += `Optimized Instructions:  ${performanceMetrics.optimizedInstructionCount}\n`;
      report += `Instructions Eliminated: ${performanceMetrics.instructionsRemoved}\n`;
      report += `Reduction Efficiency:    ${performanceMetrics.reductionPercentage}%\n`;
      report += `Total Processing Time:   ${performanceMetrics.timing.totalTimeMs} ms\n`;
    }

    return report;
  };

  const downloadFile = (filename, content, mimeType) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportText = () => {
    const text = generateTextReport();
    downloadFile('compiler_report.txt', text, 'text/plain');
  };

  const handleExportJson = () => {
    const jsonStr = JSON.stringify({
      expression,
      tokens: compilationData.tokens,
      tac: compilationData.tac,
      quadruples: compilationData.quadruples,
      triples: compilationData.triples,
      optimizationResult: compilationData.optimizationResult,
      performanceMetrics: compilationData.performanceMetrics
    }, null, 2);
    downloadFile('compiler_report.json', jsonStr, 'application/json');
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999
    }}>
      <div className="panel" style={{ width: '480px', backgroundColor: 'var(--bg-panel)' }}>
        <div className="panel-header">
          <div className="panel-title">
            <Download size={16} className="text-accent-cyan" />
            <span>Export Compiler Analysis Report</span>
          </div>
          <button className="btn btn-secondary btn-icon" onClick={onClose}>
            <X size={14} />
          </button>
        </div>

        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Export the complete compiler pipeline results (Lexer tokens, AST, TAC, Quadruples, Triples, Optimization Log, Optimized IR, and Performance Analytics) generated locally.
          </p>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="btn btn-primary" style={{ flex: 1, padding: '12px' }} onClick={handleExportText}>
              <FileText size={16} />
              <span>Download (.txt)</span>
            </button>

            <button className="btn btn-success" style={{ flex: 1, padding: '12px' }} onClick={handleExportJson}>
              <Code2 size={16} />
              <span>Download (.json)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
