import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export function InstructionComparisonChart({ originalCount, optimizedCount }) {
  const data = [
    {
      name: 'Instructions',
      Original: originalCount,
      Optimized: optimizedCount
    }
  ];

  return (
    <div style={{ width: '100%', height: 260 }}>
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="name" stroke="#475569" fontWeight={600} />
          <YAxis stroke="#475569" allowDecimals={false} fontWeight={600} />
          <Tooltip
            contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', color: '#0f172a', borderRadius: '6px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
          />
          <Legend wrapperStyle={{ color: '#0f172a', fontWeight: 600 }} />
          <Bar dataKey="Original" fill="#dc2626" radius={[4, 4, 0, 0]} />
          <Bar dataKey="Optimized" fill="#16a34a" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function OptimizationBreakdownChart({ breakdown }) {
  const data = [
    { name: 'Constant Folding', value: breakdown.constantFolding || 0, color: '#0284c7' },
    { name: 'Common Subexpression', value: breakdown.commonSubexpression || 0, color: '#7c3aed' },
    { name: 'Dead Code Elimination', value: breakdown.deadCodeElimination || 0, color: '#dc2626' }
  ].filter(d => d.value > 0);

  // Fallback if 0 instructions saved
  const displayData = data.length > 0 ? data : [
    { name: 'No Savings', value: 1, color: '#94a3b8' }
  ];

  return (
    <div style={{ width: '100%', height: 260 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={displayData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={5}
            dataKey="value"
            label={({ name, value }) => `${name}: ${value}`}
          >
            {displayData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', color: '#0f172a', borderRadius: '6px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
          />
          <Legend wrapperStyle={{ color: '#0f172a', fontWeight: 600 }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
