
import React, { useState } from 'react';
import { Plus, HeartPulse, History, AlertCircle } from 'lucide-react';
import { HealthRecord, Animal, AnimalStatus } from '../types';

interface Props {
  records: HealthRecord[];
  animals: Animal[];
  updateRecords: (records: HealthRecord[]) => void;
}

const HealthTracking: React.FC<Props> = ({ records, animals, updateRecords }) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Omit<HealthRecord, 'id'>>({
    animalId: '',
    symptoms: '',
    treatment: '',
    cost: 0,
    date: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newRecord: HealthRecord = {
      ...formData,
      id: Math.random().toString(36).substr(2, 9)
    };
    updateRecords([...records, newRecord]);
    setShowForm(false);
    setFormData({
      animalId: '',
      symptoms: '',
      treatment: '',
      cost: 0,
      date: new Date().toISOString().split('T')[0]
    });
  };

  const sickAnimals = animals.filter(a => a.status === AnimalStatus.SICK);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-slate-800">Medical Logs</h3>
          <p className="text-sm text-slate-500">Track treatments and medical expenses</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-rose-600 text-white px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 hover:bg-rose-700 transition-all shadow-lg shadow-rose-600/20"
        >
          <Plus size={20} />
          New Treatment
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xl">
          <h4 className="text-lg font-bold mb-6 flex items-center gap-2">
            <HeartPulse className="text-rose-600" size={20} />
            Add Health Record
          </h4>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Select Animal</label>
              <select 
                required
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none"
                value={formData.animalId}
                onChange={e => setFormData({...formData, animalId: e.target.value})}
              >
                <option value="">Choose an animal...</option>
                {animals.map(a => <option key={a.id} value={a.id}>{a.name} ({a.species})</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Cost of Treatment ($)</label>
              <input 
                required
                type="number" 
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none"
                value={formData.cost}
                onChange={e => setFormData({...formData, cost: parseFloat(e.target.value)})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Symptoms</label>
              <textarea 
                required
                rows={2}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none"
                value={formData.symptoms}
                onChange={e => setFormData({...formData, symptoms: e.target.value})}
              ></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Treatment / Notes</label>
              <textarea 
                required
                rows={2}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none"
                value={formData.treatment}
                onChange={e => setFormData({...formData, treatment: e.target.value})}
              ></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Date</label>
              <input 
                required
                type="date" 
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none"
                value={formData.date}
                onChange={e => setFormData({...formData, date: e.target.value})}
              />
            </div>
            <div className="md:col-span-2 flex justify-end gap-3">
              <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2">Cancel</button>
              <button type="submit" className="px-8 py-2 bg-rose-600 text-white font-bold rounded-lg shadow-lg">Save Record</button>
            </div>
          </form>
        </div>
      )}

      {/* Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-bold flex items-center gap-2 text-slate-800">
              <AlertCircle size={20} className="text-rose-500" />
              Active Cases
            </h4>
            <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-1 rounded">Attention Needed</span>
          </div>
          <div className="space-y-4">
            {sickAnimals.length > 0 ? sickAnimals.map(a => (
              <div key={a.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                <div>
                  <p className="font-semibold text-sm">{a.name}</p>
                  <p className="text-xs text-slate-500">{a.species}</p>
                </div>
                <button className="text-xs font-bold text-emerald-600 hover:underline">Mark Healthy</button>
              </div>
            )) : <p className="text-center py-4 text-slate-400 text-sm">No sick animals currently.</p>}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-bold flex items-center gap-2 text-slate-800">
              <History size={20} className="text-blue-500" />
              Treatment History
            </h4>
            <span className="text-xs text-slate-500">Last 3 Records</span>
          </div>
          <div className="space-y-4">
            {records.slice(-3).reverse().map(r => {
              const animal = animals.find(a => a.id === r.animalId);
              return (
                <div key={r.id} className="flex justify-between items-center p-3 border border-slate-100 rounded-xl">
                  <div>
                    <p className="font-semibold text-sm">{animal?.name || 'Unknown'}</p>
                    <p className="text-xs text-slate-500">{r.symptoms}</p>
                  </div>
                  <p className="text-sm font-bold text-rose-600">-${r.cost}</p>
                </div>
              );
            })}
            {records.length === 0 && <p className="text-center py-4 text-slate-400 text-sm">No historical records found.</p>}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold">
            <tr>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Animal</th>
              <th className="px-6 py-4">Symptoms</th>
              <th className="px-6 py-4">Treatment</th>
              <th className="px-6 py-4 text-right">Cost</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {[...records].reverse().map(record => {
              const animal = animals.find(a => a.id === record.animalId);
              return (
                <tr key={record.id}>
                  <td className="px-6 py-4 text-sm text-slate-500">{new Date(record.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 font-medium">{animal?.name || 'N/A'}</td>
                  <td className="px-6 py-4 text-slate-600">{record.symptoms}</td>
                  <td className="px-6 py-4 text-slate-600">{record.treatment}</td>
                  <td className="px-6 py-4 text-right font-bold text-rose-600">${record.cost.toFixed(2)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HealthTracking;
