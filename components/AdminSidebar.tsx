import React from 'react';
import { Page } from '../types';

interface AdminSidebarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  onLogout: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ currentPage, onNavigate, onLogout }) => {
  // Main navigation items
  const mainNavItems = [
    { id: Page.AdminDashboard, label: 'Dashboard', icon: '📊' },
    { id: Page.AdminStudents, label: 'Students', icon: '👥' },
    { id: Page.AdminApplications, label: 'Applications', icon: '📝' },
  ];

  // Content Management items
  const contentNavItems = [
    { id: Page.AdminCMS, label: 'Website Content', icon: '🌐' },
    { id: 'student-announcements' as Page, label: 'Student Content', icon: '📢', badge: 'New' },
  ];

  // Settings items
  const settingsNavItems = [
    { id: 'student-notifications' as Page, label: 'Push Notifications', icon: '🔔' },
    { id: 'broadcast-messages' as Page, label: 'Broadcast Messages', icon: '📣' },
  ];

  return (
    <aside className="w-64 lg:w-72 bg-slate-900 border-r border-white/10 flex flex-col h-screen sticky top-0 overflow-hidden">
      {/* Logo Section */}
      <div className="p-6 border-b border-white/5">
        <div className="flex items-center space-x-3">
          <img 
            src="bathudi logo.png" 
            alt="Logo" 
            className="h-10 w-auto"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://picsum.photos/100/100';
            }}
          />
          <div className="flex flex-col">
            <span className="font-orbitron font-bold text-sm text-white leading-none">BATHUDI</span>
            <span className="text-[10px] text-red-400 font-medium tracking-widest uppercase">Admin Control Panel</span>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-grow overflow-y-auto">
        {/* Main Section */}
        <div className="p-4">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-3 px-3">MAIN</h3>
          <div className="space-y-1">
            {mainNavItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-300 group ${
                  currentPage === item.id 
                    ? 'bg-red-600 shadow-lg shadow-red-600/20 text-white' 
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{item.icon}</span>
                  <span className="font-semibold text-sm">{item.label}</span>
                </div>
                {currentPage === item.id && (
                  <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Content Management Section */}
        <div className="p-4 border-t border-white/5">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-3 px-3">CONTENT</h3>
          <div className="space-y-1">
            {contentNavItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-300 group ${
                  currentPage === item.id 
                    ? 'bg-red-600 shadow-lg shadow-red-600/20 text-white' 
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{item.icon}</span>
                  <span className="font-semibold text-sm">{item.label}</span>
                </div>
                <div className="flex items-center space-x-2">
                  {item.badge && (
                    <span className="text-[9px] bg-red-500 text-white px-1.5 py-0.5 rounded">
                      {item.badge}
                    </span>
                  )}
                  {currentPage === item.id && (
                    <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Communication Section */}
        <div className="p-4 border-t border-white/5">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-3 px-3">COMMUNICATION</h3>
          <div className="space-y-1">
            {settingsNavItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-300 group ${
                  currentPage === item.id 
                    ? 'bg-red-600 shadow-lg shadow-red-600/20 text-white' 
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{item.icon}</span>
                  <span className="font-semibold text-sm">{item.label}</span>
                </div>
                {currentPage === item.id && (
                  <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                )}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Footer - Admin Profile & Logout */}
      <div className="p-4 border-t border-white/5 space-y-3">
        {/* Admin Profile */}
        <div className="flex items-center space-x-3 p-3 glass rounded-xl group cursor-pointer hover:bg-white/5 transition-colors">
          <div className="relative">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center font-bold text-white text-sm">
              A
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-slate-900 rounded-full animate-pulse"></div>
          </div>
          <div className="flex flex-col overflow-hidden flex-grow">
            <span className="text-xs font-bold text-white truncate">System Administrator</span>
            <span className="text-[9px] text-gray-400 truncate">admin@bathuditraining.co.za</span>
          </div>
          <svg className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        {/* Logout Button */}
        <button 
          onClick={onLogout}
          className="w-full py-2.5 border border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-white rounded-lg text-sm font-bold transition-all duration-300 flex items-center justify-center space-x-2 group"
        >
          <svg className="w-4 h-4 group-hover:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span>Logout</span>
        </button>

        {/* Quick Stats */}
        <div className="pt-2 border-t border-white/5">
          <div className="grid grid-cols-2 gap-2">
            <div className="text-center p-2 rounded bg-white/5">
              <div className="text-xs text-gray-400">Online</div>
              <div className="text-sm font-bold text-green-400">24</div>
            </div>
            <div className="text-center p-2 rounded bg-white/5">
              <div className="text-xs text-gray-400">Alerts</div>
              <div className="text-sm font-bold text-yellow-400">3</div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .glass {
          backdrop-filter: blur(16px) saturate(180%);
          -webkit-backdrop-filter: blur(16px) saturate(180%);
          background-color: rgba(255, 255, 255, 0.05);
        }
        
        .font-orbitron {
          font-family: 'Orbitron', sans-serif;
        }
        
        /* Scrollbar styling */
        nav::-webkit-scrollbar {
          width: 4px;
        }
        
        nav::-webkit-scrollbar-track {
          background: transparent;
        }
        
        nav::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        
        nav::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </aside>
  );
};

export default AdminSidebar;