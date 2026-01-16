
import React, { useState, useMemo } from 'react';
import { Plus, TrendingUp, TrendingDown, DollarSign, Download } from 'lucide-react';
import { FinancialEntry } from '../types';

interface Props {
  finances: FinancialEntry[];
  updateFinances: (finances: FinancialEntry[]) => void;
}

const FinancialLedger: React.FC<Props> = ({ finances, updateFinances }) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Omit<FinancialEntry, 'id'>>({
    type: 'EXPENSE',
    category: '',
    amount: 0,
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  const totals = useMemo(() => {
    const income = finances.filter(f => f.type === 'INCOME').reduce((a, b) => a + b.amount, 0);
    const expense = finances.filter(f => f.type === 'EXPENSE').reduce((a, b) => a + b.amount, 0);
    return { income, expense, balance: income - expense };
  }, [finances]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newEntry: FinancialEntry = {
      ...formData,
      id: Math.random().toString(36).substr(2, 9)
    };
    updateFinances([...finances, newEntry]);
    setShowForm(false);
    setFormData({
      type: 'EXPENSE',
      category: '',
      amount: 0,
      description: '',
      date: new Date().toISOString().split('T')[0]
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
          <div className="flex items-center gap-3 text-emerald-700 mb-2">
            <TrendingUp size={20} />
            <span className="font-bold">মোট আয়</span>
          </div>
          <p className="text-3xl font-black text-emerald-900">৳{totals.income.toLocaleString()}</p>
        </div>
        <div className="bg-rose-50 p-6 rounded-2xl border border-rose-100">
          <div className="flex items-center gap-3 text-rose-700 mb-2">
            <TrendingDown size={20} />
            <span className="font-bold">মোট খরচ</span>
          </div>
          <p className="text-3xl font-black text-rose-900">৳{totals.expense.toLocaleString()}</p>
        </div>
        <div className={`${totals.balance >= 0 ? 'bg-blue-50 border-blue-100' : 'bg-amber-50 border-amber-100'} p-6 rounded-2xl border`}>
          <div className="flex items-center gap-3 mb-2">
            <DollarSign size={20} className={totals.balance >= 0 ? 'text-blue-700' : 'text-amber-700'} />
            <span className={`font-bold ${totals.balance >= 0 ? 'text-blue-700' : 'text-amber-700'}`}>বর্তমান ব্যালেন্স</span>
          </div>
          <p className={`text-3xl font-black ${totals.balance >= 0 ? 'text-blue-900' : 'text-amber-900'}`}>৳{totals.balance.toLocaleString()}</p>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-slate-800">লেনদেনের ইতিহাস</h3>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-slate-900 text-white px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 hover:bg-slate-800 transition-all shadow-lg"
        >
          <Plus size={20} />
          নতুন লেনদেন লিপিবদ্ধ করুন
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xl">
          <h4 className="text-lg font-bold mb-6">আর্থিক লেনদেনের তথ্য</h4>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">ধরন</label>
              <select 
                className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-slate-400"
                value={formData.type}
                onChange={e => setFormData({...formData, type: e.target.value as 'INCOME' | 'EXPENSE'})}
              >
                <option value="INCOME">আয়</option>
                <option value="EXPENSE">খরচ</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">পরিমাণ (টাকা)</label>
              <input 
                required
                type="number" 
                className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-slate-400"
                value={formData.amount}
                onChange={e => setFormData({...formData, amount: parseFloat(e.target.value)})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">খাত / ক্যাটাগরি</label>
              <input 
                required
                type="text" 
                placeholder="যেমন: বিক্রয়, খাদ্য ক্রয়, জ্বালানি"
                className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-slate-400"
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value})}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">বিবরণ</label>
              <input 
                type="text" 
                className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-slate-400"
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">তারিখ</label>
              <input 
                type="date" 
                className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-slate-400"
                value={formData.date}
                onChange={e => setFormData({...formData, date: e.target.value})}
              />
            </div>
            <div className="md:col-span-3 flex justify-end gap-3 mt-4">
              <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2">বাতিল</button>
              <button type="submit" className="px-8 py-2 bg-slate-900 text-white font-bold rounded-lg">লেনদেন যুক্ত করুন</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold">
            <tr>
              <th className="px-6 py-4">তারিখ</th>
              <th className="px-6 py-4">খাত</th>
              <th className="px-6 py-4">বিবরণ</th>
              <th className="px-6 py-4 text-right">পরিমাণ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {[...finances].reverse().map(entry => (
              <tr key={entry.id}>
                <td className="px-6 py-4 text-sm text-slate-500">{new Date(entry.date).toLocaleDateString('bn-BD')}</td>
                <td className="px-6 py-4">
                  <span className="text-xs font-bold px-2 py-1 bg-slate-100 text-slate-600 rounded uppercase">
                    {entry.category}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-600">{entry.description}</td>
                <td className={`px-6 py-4 text-right font-bold ${entry.type === 'INCOME' ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {entry.type === 'INCOME' ? '+' : '-'}৳{entry.amount.toFixed(2)}
                </td>
              </tr>
            ))}
            {finances.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-slate-400">এখনো কোনো লেনদেন রেকর্ড করা হয়নি।</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FinancialLedger;
