
import React from 'react';
import { ViewMode } from '../types';

interface NavbarProps {
  currentView: ViewMode;
  setView: (view: ViewMode) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, setView }) => {
  return (
    <nav className="sticky top-0 z-[100] glass-effect border-b border-slate-200/50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center gap-10">
            <div 
              className="text-2xl font-black text-slate-900 cursor-pointer flex items-center gap-2 group"
              onClick={() => setView(ViewMode.HOME)}
            >
              <div className="w-8 h-8 bg-blue-600 rounded-lg group-hover:rotate-12 transition-transform shadow-lg shadow-blue-500/20" />
              EliteBlog
            </div>
            
            <div className="hidden md:flex items-center gap-8">
              {[
                { label: 'الرئيسية', value: ViewMode.HOME },
                { label: 'مخطط الأعمال', value: ViewMode.BUSINESS_PLAN },
                { label: 'الرؤى والتحليلات', value: ViewMode.DASHBOARD },
              ].map((item) => (
                <button
                  key={item.value}
                  onClick={() => setView(item.value)}
                  className={`text-sm font-bold transition-all relative py-2 ${
                    currentView === item.value ? 'text-blue-600' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {item.label}
                  {currentView === item.value && (
                    <span className="absolute bottom-0 right-0 w-full h-0.5 bg-blue-600 rounded-full" />
                  )}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <button
              onClick={() => setView(ViewMode.EDITOR)}
              className="bg-slate-900 text-white px-6 py-3 rounded-2xl text-sm font-bold shadow-xl shadow-slate-200 hover:bg-blue-600 transition-all active:scale-95"
            >
              اكتب مقالاً
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
