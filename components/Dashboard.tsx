
import React, { useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, AreaChart, Area 
} from 'recharts';
import { 
  Users, Dog, Wallet, Stethoscope, 
  TrendingUp, TrendingDown, DollarSign, Activity 
} from 'lucide-react';
import { FarmData, AnimalStatus } from '../types';

const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#6366f1'];

const Dashboard: React.FC<{ data: FarmData }> = ({ data }) => {
  const stats = useMemo(() => {
    const totalIncome = data.finances
      .filter(f => f.type === 'INCOME')
      .reduce((acc, curr) => acc + curr.amount, 0);
    const totalExpenses = data.finances
      .filter(f => f.type === 'EXPENSE')
      .reduce((acc, curr) => acc + curr.amount, 0) + 
      data.healthRecords.reduce((acc, curr) => acc + curr.cost, 0) +
      data.labor.reduce((acc, curr) => acc + (curr.hours * curr.wage), 0);

    const activeAnimals = data.animals.filter(a => a.status !== AnimalStatus.SOLD).length;
    const sickAnimals = data.animals.filter(a => a.status === AnimalStatus.SICK).length;

    return {
      totalIncome,
      totalExpenses,
      balance: totalIncome - totalExpenses,
      activeAnimals,
      sickAnimals,
    };
  }, [data]);

  const speciesData = useMemo(() => {
    const counts: Record<string, number> = {};
    data.animals.forEach(a => {
      counts[a.species] = (counts[a.species] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [data.animals]);

  const financialChartData = useMemo(() => {
    const sortedFinances = [...data.finances].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    return sortedFinances.slice(-7).map(f => ({
      date: new Date(f.date).toLocaleDateString('bn-BD', { month: 'short', day: 'numeric' }),
      amount: f.type === 'INCOME' ? f.amount : -f.amount,
    }));
  }, [data.finances]);

  return (
    <div className="space-y-8 pb-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="মোট পশু" 
          value={stats.activeAnimals} 
          icon={<Dog className="text-emerald-600" size={24} />}
          trend={`${data.animals.length}টি নিবন্ধিত`}
          bgColor="bg-emerald-50"
        />
        <StatCard 
          title="মোট ব্যালেন্স" 
          value={`৳${stats.balance.toLocaleString()}`} 
          icon={<DollarSign className="text-blue-600" size={24} />}
          trend={stats.balance >= 0 ? "লাভে আছে" : "লোকসানে আছে"}
          trendColor={stats.balance >= 0 ? "text-emerald-500" : "text-red-500"}
          bgColor="bg-blue-50"
        />
        <StatCard 
          title="অসুস্থ পশু" 
          value={stats.sickAnimals} 
          icon={<Stethoscope className="text-amber-600" size={24} />}
          trend={`${stats.sickAnimals > 0 ? 'দ্রুত চিকিৎসা প্রয়োজন' : 'সব সুস্থ আছে'}`}
          trendColor={stats.sickAnimals > 0 ? "text-amber-600" : "text-emerald-500"}
          bgColor="bg-amber-50"
        />
        <StatCard 
          title="সাম্প্রতিক খরচ" 
          value={`৳${stats.totalExpenses.toLocaleString()}`} 
          icon={<TrendingDown className="text-rose-600" size={24} />}
          trend="চিকিৎসা ও মজুরি সহ"
          bgColor="bg-rose-50"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-800">আর্থিক লেনদেন চিত্র</h3>
            <span className="text-sm text-slate-500">শেষ ৭টি লেনদেন</span>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={financialChartData}>
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip />
                <Area type="monotone" dataKey="amount" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorAmount)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6">প্রজাতি অনুযায়ী বিন্যাস</h3>
          <div className="h-72 flex flex-col items-center justify-center">
            {speciesData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={speciesData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {speciesData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-slate-400 text-sm">কোনো তথ্য নেই</p>
            )}
            <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 w-full">
              {speciesData.map((s, idx) => (
                <div key={s.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></div>
                  <span className="text-xs text-slate-600 truncate">{s.name} ({s.value})</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-800">অসুস্থ পশুর তালিকা</h3>
          <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-full">জরুরি নজরদারি</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
              <tr>
                <th className="px-6 py-4">পশুর নাম</th>
                <th className="px-6 py-4">প্রজাতি</th>
                <th className="px-6 py-4">শেষ উপসর্গ</th>
                <th className="px-6 py-4">অবস্থা</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.animals.filter(a => a.status === AnimalStatus.SICK).slice(0, 5).map(animal => {
                const lastHealth = [...data.healthRecords]
                  .filter(r => r.animalId === animal.id)
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
                return (
                  <tr key={animal.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium">{animal.name}</td>
                    <td className="px-6 py-4 text-slate-500">{animal.species}</td>
                    <td className="px-6 py-4 text-slate-500">{lastHealth?.symptoms || 'কোনো রেকর্ড নেই'}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-rose-100 text-rose-700 text-[10px] font-bold uppercase rounded">অসুস্থ</span>
                    </td>
                  </tr>
                );
              })}
              {data.animals.filter(a => a.status === AnimalStatus.SICK).length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-slate-400">অভিনন্দন! সব পশু সুস্থ আছে।</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode; trend: string; trendColor?: string; bgColor: string }> = ({ 
  title, value, icon, trend, trendColor = "text-slate-400", bgColor 
}) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-slate-500 text-sm font-medium">{title}</p>
        <h4 className="text-2xl font-bold text-slate-900 mt-1">{value}</h4>
      </div>
      <div className={`p-3 rounded-xl ${bgColor}`}>
        {icon}
      </div>
    </div>
    <div className="mt-4 pt-4 border-t border-slate-50">
      <p className={`text-xs font-medium ${trendColor}`}>{trend}</p>
    </div>
  </div>
);

export default Dashboard;
