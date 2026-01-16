
import React, { useState } from 'react';
import { Plus, Trash2, Search, Filter, Dog } from 'lucide-react';
import { Animal, AnimalStatus } from '../types';

interface Props {
  animals: Animal[];
  updateAnimals: (animals: Animal[]) => void;
}

const AnimalInventory: React.FC<Props> = ({ animals, updateAnimals }) => {
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [formData, setFormData] = useState<Omit<Animal, 'id'>>({
    name: '',
    species: '',
    status: AnimalStatus.HEALTHY,
    entryDate: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newAnimal: Animal = {
      ...formData,
      id: Math.random().toString(36).substr(2, 9)
    };
    updateAnimals([...animals, newAnimal]);
    setShowForm(false);
    setFormData({
      name: '',
      species: '',
      status: AnimalStatus.HEALTHY,
      entryDate: new Date().toISOString().split('T')[0]
    });
  };

  const deleteAnimal = (id: string) => {
    if (confirm('আপনি কি নিশ্চিত যে এই পশুটি তালিকা থেকে মুছে ফেলতে চান?')) {
      updateAnimals(animals.filter(a => a.id !== id));
    }
  };

  const filteredAnimals = animals.filter(a => 
    a.name.toLowerCase().includes(search.toLowerCase()) || 
    a.species.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="নাম বা প্রজাতি দিয়ে খুঁজুন..." 
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 w-full sm:w-auto justify-center"
        >
          <Plus size={20} />
          নতুন পশু যুক্ত করুন
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xl animate-in fade-in slide-in-from-top-4">
          <h3 className="text-lg font-bold mb-6">নতুন পশুর তথ্য দিন</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">নাম / ট্যাগ আইডি</label>
              <input 
                required
                type="text" 
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">প্রজাতি</label>
              <input 
                required
                type="text" 
                placeholder="যেমন: গরু, ছাগল, হাঁস"
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                value={formData.species}
                onChange={e => setFormData({...formData, species: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">বর্তমান অবস্থা</label>
              <select 
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                value={formData.status}
                onChange={e => setFormData({...formData, status: e.target.value as AnimalStatus})}
              >
                <option value={AnimalStatus.HEALTHY}>সুস্থ</option>
                <option value={AnimalStatus.SICK}>অসুস্থ</option>
                <option value={AnimalStatus.RECOVERING}>সুস্থ হচ্ছে</option>
                <option value={AnimalStatus.SOLD}>বিক্রিত</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">যুক্ত করার তারিখ</label>
              <input 
                required
                type="date" 
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                value={formData.entryDate}
                onChange={e => setFormData({...formData, entryDate: e.target.value})}
              />
            </div>
            <div className="md:col-span-2 flex justify-end gap-3 mt-4">
              <button 
                type="button" 
                onClick={() => setShowForm(false)}
                className="px-6 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-lg transition-all"
              >
                বাতিল
              </button>
              <button 
                type="submit" 
                className="px-8 py-2 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 transition-all shadow-md"
              >
                সংরক্ষণ করুন
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold tracking-wider">
              <tr>
                <th className="px-6 py-4">নাম/আইডি</th>
                <th className="px-6 py-4">প্রজাতি</th>
                <th className="px-6 py-4">অবস্থা</th>
                <th className="px-6 py-4">তারিখ</th>
                <th className="px-6 py-4 text-right">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAnimals.map(animal => (
                <tr key={animal.id} className="hover:bg-slate-50/80 transition-all">
                  <td className="px-6 py-4 font-semibold text-slate-800">{animal.name}</td>
                  <td className="px-6 py-4 text-slate-600">{animal.species}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded-full ${
                      animal.status === AnimalStatus.HEALTHY ? 'bg-emerald-100 text-emerald-700' :
                      animal.status === AnimalStatus.SICK ? 'bg-rose-100 text-rose-700' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {animal.status === AnimalStatus.HEALTHY ? 'সুস্থ' : 
                       animal.status === AnimalStatus.SICK ? 'অসুস্থ' : 
                       animal.status === AnimalStatus.SOLD ? 'বিক্রিত' : 'সুস্থ হচ্ছে'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500 text-sm">
                    {new Date(animal.entryDate).toLocaleDateString('bn-BD')}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => deleteAnimal(animal.id)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredAnimals.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-2 text-slate-400">
                      <Dog size={48} className="opacity-20" />
                      <p>কোনো পশুর তথ্য পাওয়া যায়নি।</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AnimalInventory;
