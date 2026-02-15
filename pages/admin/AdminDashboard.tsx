import React, { useState, useEffect } from 'react';
import { DashboardStats, RecentApplication, ApplicationStatus } from '../../types';

// FIXED: Use import.meta.env with proper typing
const API_BASE_URL = typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL 
  ? import.meta.env.VITE_API_URL 
  : 'http://localhost:8000/api';

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalStudents: 0,
    activeLearners: 0,
    newApplications: 0,
    pendingApplications: 0,
    revenue: 'R0',
    totalAnnouncements: 0,
    recentContent: 0
  });
  const [recentApps, setRecentApps] = useState<RecentApplication[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [logoError, setLogoError] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      const [appsResponse, studentsResponse, statsResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/applications/?limit=3`),
        fetch(`${API_BASE_URL}/students/`),
        fetch(`${API_BASE_URL}/applications/stats/`)
      ]);

      if (appsResponse.ok && studentsResponse.ok && statsResponse.ok) {
        const [appsData, studentsData, statsData] = await Promise.all([
          appsResponse.json(),
          studentsResponse.json(),
          statsResponse.json()
        ]);

        const totalStudents = studentsData.length || 0;
        const activeLearners = studentsData.filter((s: any) => s.status === 'Active').length || 0;
        const pendingApplications = statsData.pending || 0;
        const revenue = `R${(totalStudents * 200).toLocaleString()}`;

        setStats({
          totalStudents,
          activeLearners,
          newApplications: pendingApplications,
          pendingApplications,
          revenue,
          totalAnnouncements: 3,
          recentContent: 5
        });

        const recentApplications = appsData.results?.slice(0, 3).map((app: any) => ({
          id: app.id,
          name: `${app.name} ${app.surname}`,
          course: app.course_title || app.course || 'Not specified',
          date: app.formatted_date || new Date(app.created_at).toLocaleDateString(),
          status: app.status as ApplicationStatus,
          avatarLetter: app.name?.[0] || '?'
        })) || [];

        setRecentApps(recentApplications);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const dashboardStats = [
    { 
      label: 'Total Students', 
      value: stats.totalStudents.toString(), 
      change: '+12%', 
      icon: '👥', 
      color: 'blue' 
    },
    { 
      label: 'Active Learners', 
      value: stats.activeLearners.toString(), 
      change: '+5%', 
      icon: '🔥', 
      color: 'green' 
    },
    { 
      label: 'New Applications', 
      value: stats.newApplications.toString(), 
      change: `${stats.pendingApplications} Pending`, 
      icon: '📝', 
      color: 'amber' 
    },
    { 
      label: 'Revenue (Fees)', 
      value: stats.revenue, 
      change: 'This Month', 
      icon: '💰', 
      color: 'emerald' 
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-white">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="relative w-12 h-12 rounded-xl overflow-hidden glass border border-white/10">
            {!logoError ? (
              <img 
                src="/images/bathudi logo.png" 
                alt="Bathudi Logo" 
                className="w-full h-full object-contain"
                onError={() => setLogoError(true)}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
                <span className="text-white font-bold text-lg">B</span>
              </div>
            )}
          </div>
          <div>
            <h1 className="text-3xl font-orbitron font-bold text-white mb-1">Management Dashboard</h1>
            <p className="text-gray-400 text-sm">Bathudi Automotive Technical Center</p>
          </div>
        </div>
        <button 
          onClick={fetchDashboardData}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold transition-all flex items-center space-x-2"
        >
          <span>🔄</span>
          <span>Refresh Data</span>
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardStats.map((stat) => (
          <div key={stat.label} className="glass p-6 rounded-2xl border border-white/5 relative overflow-hidden group hover:border-blue-500/30 transition-all">
            <div className="flex items-center justify-between mb-4">
              <span className="text-3xl">{stat.icon}</span>
              <span className={`text-[10px] font-bold px-2 py-1 rounded ${
                stat.color === 'blue' ? 'bg-blue-500/10 text-blue-400' :
                stat.color === 'green' ? 'bg-green-500/10 text-green-400' :
                stat.color === 'amber' ? 'bg-amber-500/10 text-amber-400' :
                'bg-emerald-500/10 text-emerald-400'
              } uppercase`}>
                {stat.change}
              </span>
            </div>
            <h3 className="text-gray-400 text-sm font-semibold uppercase tracking-wider mb-1">{stat.label}</h3>
            <p className="text-3xl font-bold text-white">{stat.value}</p>
            <div className="absolute -bottom-2 -right-2 w-16 h-16 bg-blue-600/5 rounded-full blur-2xl group-hover:scale-150 transition-transform" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass p-8 rounded-3xl border border-white/5">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold font-orbitron">Recent Applications</h2>
            <button className="text-sm text-blue-400 hover:text-blue-300 font-bold">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {recentApps.length === 0 ? (
              <div className="text-center py-8">
                <span className="text-4xl mb-4">📭</span>
                <p className="text-gray-400">No applications yet</p>
              </div>
            ) : (
              recentApps.map((app, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center font-bold text-xs">
                      {app.avatarLetter}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{app.name}</h4>
                      <p className="text-xs text-gray-500">{app.course}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase ${
                      app.status === ApplicationStatus.Approved ? 'bg-green-500/20 text-green-400' :
                      app.status === ApplicationStatus.Rejected ? 'bg-red-500/20 text-red-400' :
                      'bg-amber-500/20 text-amber-400'
                    }`}>
                      {app.status}
                    </span>
                    <p className="text-[10px] text-gray-500 mt-1">{app.date}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="glass p-8 rounded-3xl border border-white/5">
          <h2 className="text-xl font-bold font-orbitron mb-8">System Notifications</h2>
          <div className="space-y-6">
            <div className="flex space-x-4">
              <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 shadow-lg shadow-blue-500/50" />
              <div>
                <p className="text-sm text-white font-medium">Backup completed successfully</p>
                <p className="text-xs text-gray-500">10 minutes ago</p>
              </div>
            </div>
            <div className="flex space-x-4">
              <div className="w-2 h-2 rounded-full bg-amber-500 mt-2 shadow-lg shadow-amber-500/50" />
              <div>
                <p className="text-sm text-white font-medium">
                  {stats.pendingApplications} Document reviews pending
                </p>
                <p className="text-xs text-gray-500">2 hours ago</p>
              </div>
            </div>
            <div className="flex space-x-4">
              <div className="w-2 h-2 rounded-full bg-green-500 mt-2 shadow-lg shadow-green-500/50" />
              <div>
                <p className="text-sm text-white font-medium">System running normally</p>
                <p className="text-xs text-gray-500">All systems operational</p>
              </div>
            </div>
          </div>
          {/* REMOVED: System Settings button */}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;