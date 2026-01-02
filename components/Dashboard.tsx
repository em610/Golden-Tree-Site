
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const progressData = [
  { name: 'SCOPE', planned: 100, actual: 98 },
  { name: 'QUAL', planned: 100, actual: 82 },
  { name: 'SCHED', planned: 80, actual: 65 },
  { name: 'COST', planned: 40, actual: 42 },
  { name: 'PROC', planned: 90, actual: 75 },
];

const riskData = [
  { name: 'QUALITY', value: 45 },
  { name: 'SUPPLY', value: 30 },
  { name: 'DESIGN', value: 15 },
  { name: 'SAFETY', value: 10 },
];

const COLORS = ['#00f3ff', '#10b981', '#ffb800', '#ff00ff'];

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'CRITICAL_PATH_ANOMALY', value: '4 VECTORS', icon: 'fa-triangle-exclamation', color: 'text-red-500', borderColor: 'border-red-500/30' },
          { label: 'HOLD_POINTS_OPEN', value: '12 ACTIVE', icon: 'fa-hand', color: 'text-amber-500', borderColor: 'border-amber-500/20' },
          { label: 'PROCUREMENT_LOOKAHEAD', value: '6 WEEKS', icon: 'fa-truck-fast', color: 'text-cyan-400', borderColor: 'border-cyan-500/30' },
          { label: 'MOCKUP_APPROVALS', value: '88%', icon: 'fa-check-double', color: 'text-emerald-400', borderColor: 'border-emerald-500/20' },
        ].map((stat, i) => (
          <div key={i} className={`cyber-panel p-6 border ${stat.borderColor} relative overflow-hidden group hover:scale-[1.02] transition-transform`}>
            <div className={`w-8 h-8 border border-current ${stat.color} flex items-center justify-center mb-4`}>
              <i className={`fas ${stat.icon} text-xs`}></i>
            </div>
            <p className="text-slate-500 text-[9px] mono font-bold mb-1 tracking-widest">{stat.label}</p>
            <p className={`text-2xl font-bold ${stat.color} mono tracking-tight`}>{stat.value}</p>
            <div className="absolute top-0 right-0 p-1">
               <div className={`w-1 h-1 ${stat.color} animate-pulse`}></div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="cyber-panel p-8 border border-cyan-500/20 bg-black/40">
          <div className="flex justify-between items-center mb-8 border-b border-cyan-500/10 pb-4">
            <h3 className="text-[10px] mono font-bold text-cyan-400 tracking-widest uppercase">Industrial_Loop_Telemetry</h3>
            <span className="text-[8px] mono text-cyan-800">REF: BASELINE_V1.0</span>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={progressData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#334155" fontSize={9} tickLine={false} axisLine={false} />
                <YAxis stroke="#334155" fontSize={9} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#000', border: '1px solid #00f3ff', fontSize: '9px', fontFamily: 'JetBrains Mono' }}
                  itemStyle={{ color: '#00f3ff' }}
                />
                <Bar dataKey="planned" fill="rgba(0, 243, 255, 0.05)" stroke="#00f3ff" strokeWidth={1} radius={[1, 1, 0, 0]} name="Baseline" />
                <Bar dataKey="actual" fill="#00f3ff" radius={[1, 1, 0, 0]} name="Actual" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="cyber-panel p-8 border border-cyan-500/20 bg-black/40">
          <div className="flex justify-between items-center mb-8 border-b border-cyan-500/10 pb-4">
            <h3 className="text-[10px] mono font-bold text-cyan-400 tracking-widest uppercase">Critical_Vector_Distribution</h3>
            <span className="text-[8px] mono text-red-500 animate-pulse">SLA_VIOLATION_DETECTED</span>
          </div>
          <div className="h-72 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={riskData} cx="50%" cy="50%" innerRadius={70} outerRadius={90} paddingAngle={10} dataKey="value" stroke="none">
                  {riskData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#000', border: '1px solid #00f3ff', fontSize: '9px', fontFamily: 'JetBrains Mono' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-3 ml-6">
              {riskData.map((d, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5" style={{ backgroundColor: COLORS[i], boxShadow: `0 0 10px ${COLORS[i]}` }}></div>
                  <span className="text-[9px] mono text-slate-500 uppercase">{d.name}: {d.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
