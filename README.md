# Smart Intermediate Code Generator and Optimization Compiler

A complete, fully functional, local JavaScript web application and mini-compiler for college Compiler Design projects.

## 🚀 Features

- **Localhost Execution**: Runs 100% locally on Node.js / Vite / React. No cloud dependencies, external APIs, Python backend, or remote services.
- **Dynamic Lexical Analyzer**: Scans input expressions and emits a detailed Token Table (`#`, `Lexeme`, `Token Type`, `Position`, `Line:Column`). Detects illegal characters and lexical errors.
- **Recursive-Descent Parser**: Builds an Abstract Syntax Tree (AST) respecting operator precedence:
  ```text
  () > ^ (right-associative) > * / % > + - > =
  ```
- **Interactive AST Visualizer**: Color-coded, expandable/collapsible syntax tree with zoom/pan/fit view and node property inspector.
- **Three Address Code (TAC)**: Dynamically generates intermediate code instructions with temporary variables (`t1`, `t2`, ...).
- **Quadruple Representation**: Converts TAC into explicit `(op, arg1, arg2, result)` records.
- **Triple Representation**: Converts TAC into instruction-referenced `(op, arg1, arg2)` records using positional references `(0)`, `(1)`, `(2)`.
- **Optimization Engine**:
  - **Constant Folding & Algebraic Simplification**: Evaluates constant math operations at compile-time (e.g. `10 * 20` $\rightarrow$ `200`) and simplifies identity operations (`x + 0` $\rightarrow$ `x`, `x * 1` $\rightarrow$ `x`, `x ^ 0` $\rightarrow$ `1`).
  - **Common Subexpression Elimination (CSE)**: Detects repeated subexpressions (e.g., `a + b` in `(a + b) * (a + b)`) and reuses previous temporary results.
  - **Dead Code Elimination (DCE)**: Eliminates dead computations and unused temporary assignments.
- **Performance Analytics & Interactive Charts**:
  - Instruction reduction percentage: `((Original - Optimized) / Original) * 100`
  - Recharts bar and pie charts comparing original vs. optimized code and savings per technique.
- **Compiler Event Console**: Real-time log streaming with timestamped compiler stage events.
- **Local Report Export**: Download complete compiler analysis as `.txt` or `.json`.
- **Preset Examples**: Pre-loaded with 6 complex arithmetic test cases including finance formulas and acceptance expressions.

---

## 📁 Folder Architecture

```text
smart-intermediate-code-compiler/
├── package.json
├── vite.config.js
├── index.html
├── README.md
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── compiler/
│   │   ├── lexer.js
│   │   ├── parser.js
│   │   ├── ast.js
│   │   ├── tacGenerator.js
│   │   ├── quadrupleGenerator.js
│   │   ├── tripleGenerator.js
│   │   ├── constantFolding.js
│   │   ├── commonSubexpression.js
│   │   ├── deadCodeElimination.js
│   │   ├── optimizer.js
│   │   └── performanceAnalyzer.js
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── SourceEditor.jsx
│   │   ├── TokenTable.jsx
│   │   ├── ASTViewer.jsx
│   │   ├── TACTable.jsx
│   │   ├── QuadrupleTable.jsx
│   │   ├── TripleTable.jsx
│   │   ├── OptimizationPanel.jsx
│   │   ├── PerformancePanel.jsx
│   │   ├── Charts.jsx
│   │   ├── Console.jsx
│   │   ├── ErrorPanel.jsx
│   │   ├── Documentation.jsx
│   │   └── ExportModal.jsx
│   ├── services/
│   │   ├── compilerService.js
│   │   └── storageService.js
│   └── styles/
│       └── compiler.css
└── tests/
    ├── lexer.test.js
    ├── parser.test.js
    ├── tac.test.js
    ├── optimizer.test.js
    └── acceptance.test.js
```

---

## 🛠 Installation & Running on Localhost

### Prerequisites
- Node.js (v18+ recommended)
- npm

### 1. Installation
In the project root directory, run:

```bash
npm install
```

### 2. Run Local Development Server

```bash
npm run dev
```

Open your browser and navigate to:
```text
http://localhost:5173
```

---

## 🧪 Automated Unit & Acceptance Testing

Run the Vitest unit test suite to verify compiler algorithms:

```bash
npm test
```

All 15 test suites verify:
1. Lexer tokenization & position handling
2. Recursive-descent parser & precedence rules (`*` over `+`, right-associative `^`)
3. TAC, Quadruple, and Triple generation
4. Constant Folding (`x = (10 * 20) + (5 * 4)` $\rightarrow$ `220`)
5. Common Subexpression Elimination (`x = (a + b) * (a + b)`)
6. Dead Code Elimination (`y = c * d` removal when unused)
7. Full Acceptance Tests (`x = (a + b) * (a + b) + (10 * 20)` & complex finance formula)

---

## 💻 Tech Stack

- **Frontend**: React 18, Vite
- **Compiler Core**: 100% Pure Vanilla JavaScript (ES6 Modules)
- **Styling**: Modern Custom CSS with Dark IDE Design Tokens
- **Icons & Charts**: Lucide React, Recharts
- **Testing**: Vitest
