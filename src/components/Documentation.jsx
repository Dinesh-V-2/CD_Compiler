import React from 'react';
import { BookOpen, Layers, Code, Zap, Cpu } from 'lucide-react';

export default function Documentation() {
  return (
    <div className="panel" style={{ padding: '24px', overflowY: 'auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
        <BookOpen size={24} className="text-accent-cyan" />
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700 }}>Compiler Design Documentation & Concepts Guide</h2>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', lineHeight: 1.6 }}>

        <section style={{ backgroundColor: 'var(--bg-card)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
          <h3 style={{ color: 'var(--accent-cyan)', marginBottom: '8px' }}>1. Lexical Analysis (Scanner)</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            The Lexer breaks the continuous character stream of the input expression into a sequence of meaningful atomic units called <strong>Tokens</strong>.
          </p>
          <pre style={{ backgroundColor: 'var(--bg-input)', padding: '10px', borderRadius: '4px', marginTop: '8px', fontSize: '0.8rem', color: 'var(--accent-green)' }}>
{`Input: "finalValue = principal * 10"
Tokens: 
  1. [IDENTIFIER] finalValue
  2. [ASSIGN]     =
  3. [IDENTIFIER] principal
  4. [MULTIPLY]   *
  5. [NUMBER]     10`}
          </pre>
        </section>

        <section style={{ backgroundColor: 'var(--bg-card)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
          <h3 style={{ color: 'var(--accent-blue)', marginBottom: '8px' }}>2. Syntax Analysis (Parser)</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Implements a <strong>Recursive-Descent Parser</strong> validating the linear token stream against context-free grammar rules and operator precedence rules:
            <br />
            <code>() &gt; ^ (right-assoc) &gt; * / % &gt; + - &gt; =</code>
          </p>
        </section>

        <section style={{ backgroundColor: 'var(--bg-card)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
          <h3 style={{ color: 'var(--accent-purple)', marginBottom: '8px' }}>3. Abstract Syntax Tree (AST)</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            An abstract tree representation of the syntactic structure of the source code. Operator nodes form internal tree nodes, while variables and numerical constants form leaf nodes.
          </p>
        </section>

        <section style={{ backgroundColor: 'var(--bg-card)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
          <h3 style={{ color: 'var(--accent-amber)', marginBottom: '8px' }}>4. Three Address Code (TAC)</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            An Intermediate Representation (IR) where each instruction has at most three operands (two inputs and one destination result).
          </p>
          <pre style={{ backgroundColor: 'var(--bg-input)', padding: '10px', borderRadius: '4px', marginTop: '8px', fontSize: '0.8rem', color: 'var(--accent-cyan)' }}>
{`t1 = principal * rate
t2 = t1 * time
t3 = t2 / 100
finalValue = t3`}
          </pre>
        </section>

        <section style={{ backgroundColor: 'var(--bg-card)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
          <h3 style={{ color: 'var(--accent-green)', marginBottom: '8px' }}>5. Quadruple Representation</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            A record structure containing four explicit fields: <code>(operator, arg1, arg2, result)</code>. Easy to reorder and optimize.
          </p>
        </section>

        <section style={{ backgroundColor: 'var(--bg-card)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
          <h3 style={{ color: 'var(--accent-rose)', marginBottom: '8px' }}>6. Triple Representation</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Avoids explicit temporary variable names by referencing previous instructions by their position index <code>(0), (1), (2)</code>.
          </p>
        </section>

        <section style={{ backgroundColor: 'var(--bg-card)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
          <h3 style={{ color: 'var(--accent-cyan)', marginBottom: '8px' }}>7. Constant Folding</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Evaluates constant arithmetic operations at compile time rather than execution time (e.g. <code>10 * 20</code> becomes <code>200</code>). Also simplifies identity operations (<code>x + 0</code> -&gt; <code>x</code>).
          </p>
        </section>

        <section style={{ backgroundColor: 'var(--bg-card)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
          <h3 style={{ color: 'var(--accent-purple)', marginBottom: '8px' }}>8. Common Subexpression Elimination (CSE)</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Identifies identical subexpressions computed multiple times (e.g., <code>a + b</code> in <code>(a + b) * (a + b)</code>) and reuses the previously calculated temporary result.
          </p>
        </section>

        <section style={{ backgroundColor: 'var(--bg-card)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
          <h3 style={{ color: 'var(--accent-rose)', marginBottom: '8px' }}>9. Dead Code Elimination (DCE)</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Performs liveness analysis to detect and remove computations whose values are never read or used in any subsequent output statements.
          </p>
        </section>

        <section style={{ backgroundColor: 'var(--bg-card)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
          <h3 style={{ color: 'var(--accent-emerald)', marginBottom: '8px' }}>10. Performance Analysis</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Measures instruction reduction efficiency using the formula:
            <br />
            <code>Reduction % = ((Original Count - Optimized Count) / Original Count) * 100</code>
          </p>
        </section>

      </div>
    </div>
  );
}
