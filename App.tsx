
import React, { useState, useEffect, useMemo } from 'react';
import { 
  LayoutDashboard, 
  Dog, 
  Stethoscope, 
  Wallet, 
  Users, 
  BarChart3,
  Plus,
  Trash2,
  TrendingUp,
  TrendingDown,
  Activity
} from 'lucide-react';
import { Animal, HealthRecord, FinancialEntry, LaborRecord, AnimalStatus, FarmData } from './types';
import Dashboard from './components/Dashboard';
import AnimalInventory from './components/AnimalInventory';
import HealthTracking from './components/HealthTracking';
import FinancialLedger from './components/FinancialLedger';
import LaborManagement from './components/LaborManagement';

const STORAGE_KEY = 'agroflow_data';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'animals' | 'health' | 'finance' | 'labor'>('dashboard');
  const [data, setData] = useState<FarmData>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : {
      animals: [],
      healthRecords: [],
      finances: [],
      labor: []
    };
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const updateData = (newData: Partial<FarmData>) => {
    setData(prev => ({ ...prev, ...newData }));
  };

  const navItems = [
    { id: 'dashboard', label: 'ড্যাশবোর্ড', icon: LayoutDashboard },
    { id: 'animals', label: 'পশু তালিকা', icon: Dog },
    { id: 'health', label: 'স্বাস্থ্যসেবা', icon: Stethoscope },
    { id: 'finance', label: 'আর্থিক হিসাব', icon: Wallet },
    { id: 'labor', label: 'শ্রম ব্যবস্থাপনা', icon: Users },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard data={data} />;
      case 'animals': return <AnimalInventory animals={data.animals} updateAnimals={(animals) => updateData({ animals })} />;
      case 'health': return <HealthTracking records={data.healthRecords} animals={data.animals} updateRecords={(healthRecords) => updateData({ healthRecords })} />;
      case 'finance': return <FinancialLedger finances={data.finances} updateFinances={(finances) => updateData({ finances })} />;
      case 'labor': return <LaborManagement labor={data.labor} updateLabor={(labor) => updateData({ labor })} />;
      default: return <Dashboard data={data} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex-shrink-0 hidden md:flex flex-col sticky top-0 h-screen">
        <div className="p-6 flex items-center gap-3">
          <div className="bg-emerald-500 p-2 rounded-lg">
            <Activity className="text-white" size={24} />
          </div>
          <h1 className="text-xl font-bold tracking-tight">অ্যাগ্রো-ফ্লো</h1>
        </div>
        
        <nav className="flex-1 px-4 py-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === item.id 
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/20' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-slate-800">
          <div className="bg-slate-800/50 rounded-xl p-4">
            <p className="text-xs text-slate-400 uppercase font-semibold mb-2">খামারের অবস্থা</p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              <span className="text-sm">অনলাইন এবং সিঙ্ক হচ্ছে</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-auto">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
          <h2 className="text-lg font-semibold text-slate-800 capitalize">
            {navItems.find(i => i.id === activeTab)?.label}
          </h2>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-slate-700">গ্রিন ভ্যালি ফার্ম</p>
              <p className="text-xs text-slate-500">মালিকানা প্যানেল</p>
            </div>
            <img 
              src="https://picsum.photos/seed/farm/40/40" 
              className="w-10 h-10 rounded-full border-2 border-slate-100" 
              alt="Profile" 
            />
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto w-full">
          {renderContent()}
        </div>

        {/* Mobile Navigation */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around p-3 z-20">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`flex flex-col items-center gap-1 ${
                activeTab === item.id ? 'text-emerald-600' : 'text-slate-400'
              }`}
            >
              <item.icon size={20} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
      </main>
    </div>
  );
};

export default App;
