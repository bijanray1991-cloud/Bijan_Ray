
import React, { useState } from 'react';
import { Plus, Users, UserPlus, Clock, Wallet } from 'lucide-react';
import { LaborRecord } from '../types';

interface Props {
  labor: LaborRecord[];
  updateLabor: (labor: LaborRecord[]) => void;
}

const LaborManagement: React.FC<Props> = ({ labor, updateLabor }) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Omit<LaborRecord, 'id'>>({
    workerName: '',
    date: new Date().toISOString().split('T')[0],
    hours: 8,
    wage: 0,
    task: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newRecord: LaborRecord = {
      ...formData,
      id: Math.random().toString(36).substr(2, 9)
    };
    updateLabor([...labor, newRecord]);
    setShowForm(false);
    setFormData({
      workerName: '',
      date: new Date().toISOString().split('T')[0],
      hours: 8,
      wage: 0,
      task: ''
    });
  };

  const totalLaborCost = labor.reduce((acc, curr) => acc + (curr.hours * curr.wage), 0);

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 rounded-2xl p-8 text-white flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h3 className="text-2xl font-bold flex items-center gap-3">
            <Users className="text-emerald-400" />
            Workforce Management
          </h3>
          <p className="text-slate-400 mt-2">Track worker hours, tasks, and total payroll expenses.</p>
        </div>
        <div className="text-center md:text-right">
          <p className="text-slate-400 text-sm uppercase font-bold">Total Payroll to Date</p>
          <p className="text-4xl font-black text-emerald-400">${totalLaborCost.toLocaleString()}</p>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <h4 className="text-lg font-bold text-slate-800">Daily Labor Log</h4>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 hover:bg-emerald-700 shadow-lg"
        >
          <UserPlus size={20} />
          Log Labor
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xl">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Worker Name</label>
              <input 
                required
                type="text" 
                className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500"
                value={formData.workerName}
                onChange={e => setFormData({...formData, workerName: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Task / Activity</label>
              <input 
                required
                type="text" 
                placeholder="e.g. Feeding, Cleaning, Repair"
                className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500"
                value={formData.task}
                onChange={e => setFormData({...formData, task: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Date</label>
              <input 
                type="date" 
                className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500"
                value={formData.date}
                onChange={e => setFormData({...formData, date: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Hours Worked</label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  required
                  type="number" 
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500"
                  value={formData.hours}
                  onChange={e => setFormData({...formData, hours: parseFloat(e.target.value)})}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Hourly Wage ($)</label>
              <div className="relative">
                <Wallet className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  required
                  type="number" 
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500"
                  value={formData.wage}
                  onChange={e => setFormData({...formData, wage: parseFloat(e.target.value)})}
                />
              </div>
            </div>
            <div className="flex items-end">
              <button type="submit" className="w-full bg-emerald-600 text-white font-bold py-2 rounded-lg hover:bg-emerald-700 shadow-md">
                Add to Log
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold">
            <tr>
              <th className="px-6 py-4">Worker</th>
              <th className="px-6 py-4">Task</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Duration</th>
              <th className="px-6 py-4 text-right">Total Pay</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {[...labor].reverse().map(entry => (
              <tr key={entry.id}>
                <td className="px-6 py-4 font-semibold text-slate-800">{entry.workerName}</td>
                <td className="px-6 py-4 text-slate-600">{entry.task}</td>
                <td className="px-6 py-4 text-slate-500 text-sm">{new Date(entry.date).toLocaleDateString()}</td>
                <td className="px-6 py-4 text-slate-500">{entry.hours} hrs</td>
                <td className="px-6 py-4 text-right font-bold text-slate-900">${(entry.hours * entry.wage).toFixed(2)}</td>
              </tr>
            ))}
            {labor.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-400">No labor records found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LaborManagement;
