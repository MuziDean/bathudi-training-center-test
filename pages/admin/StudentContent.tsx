import React, { useState, useEffect } from 'react';
import { Page, StudentAnnouncement } from '../../types';

interface StudentContentProps {
  onNavigate: (page: Page) => void;
}

const StudentContent: React.FC<StudentContentProps> = ({ onNavigate }) => {
  const [announcements, setAnnouncements] = useState<StudentAnnouncement[]>([
    {
      id: 1,
      title: 'New Workshop Safety Protocols',
      content: 'All students must adhere to the new safety protocols effective immediately. Please review the updated safety manual.',
      date: '2024-10-25',
      is_important: true
    },
    {
      id: 2,
      title: 'Exam Schedule for November',
      content: 'The November exam schedule has been released. Check your student portal for details.',
      date: '2024-10-20',
      is_important: false
    },
    {
      id: 3,
      title: 'Holiday Closure Notice',
      content: 'The training center will be closed from December 23rd to January 3rd for the holiday season.',
      date: '2024-10-15',
      is_important: false
    }
  ]);

  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    content: '',
    is_important: false,
    target: 'all' as 'all' | 'course' | 'specific'
  });

  const [selectedCourse, setSelectedCourse] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    important: 0,
    recent: 0,
    unread: 0
  });

  useEffect(() => {
    // Calculate stats
    const total = announcements.length;
    const important = announcements.filter(a => a.is_important).length;
    const recent = announcements.filter(a => {
      const date = new Date(a.date);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - date.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 7;
    }).length;
    
    setStats({ total, important, recent, unread: 0 });
  }, [announcements]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnnouncement.title.trim() || !newAnnouncement.content.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    const newAnn: StudentAnnouncement = {
      id: announcements.length + 1,
      title: newAnnouncement.title,
      content: newAnnouncement.content,
      date: new Date().toISOString().split('T')[0],
      is_important: newAnnouncement.is_important
    };

    setAnnouncements([newAnn, ...announcements]);
    setNewAnnouncement({ title: '', content: '', is_important: false, target: 'all' });
    setShowForm(false);
    
    // In a real app, you would send this to your backend
    console.log('Announcement created:', newAnn);
    alert('Announcement created successfully!');
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this announcement?')) {
      setAnnouncements(announcements.filter(a => a.id !== id));
    }
  };

  const filteredAnnouncements = announcements.filter(announcement =>
    announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    announcement.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const courses = [
    { id: 'engine', name: 'Engine Fitting' },
    { id: 'electrical', name: 'Auto Electrical' },
    { id: 'diagnostics', name: 'Vehicle Diagnostics' },
    { id: 'mechanical', name: 'Mechanical Repair' }
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-orbitron font-bold text-white mb-2">
            Student Content Management
          </h1>
          <p className="text-gray-400">
            Create and manage announcements, notifications, and messages for students
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white rounded-xl font-bold transition-all shadow-xl shadow-red-600/20 flex items-center space-x-2"
        >
          <span>+</span>
          <span>New Announcement</span>
        </button>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass p-4 rounded-xl border border-white/5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">
                Total Announcements
              </h3>
              <p className="text-2xl font-bold text-white">{stats.total}</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center text-red-400 text-xl">
              📢
            </div>
          </div>
        </div>

        <div className="glass p-4 rounded-xl border border-white/5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">
                Important
              </h3>
              <p className="text-2xl font-bold text-white">{stats.important}</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center text-yellow-400 text-xl">
              ⚠️
            </div>
          </div>
        </div>

        <div className="glass p-4 rounded-xl border border-white/5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">
                Recent (7 days)
              </h3>
              <p className="text-2xl font-bold text-white">{stats.recent}</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center text-green-400 text-xl">
              🆕
            </div>
          </div>
        </div>

        <div className="glass p-4 rounded-xl border border-white/5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">
                Unread by Students
              </h3>
              <p className="text-2xl font-bold text-white">{stats.unread}</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400 text-xl">
              👁️
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-grow">
          <div className="relative">
            <input
              type="text"
              placeholder="Search announcements..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
            />
            <div className="absolute right-3 top-3 text-gray-500">
              🔍
            </div>
          </div>
        </div>
        <select
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
          className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
        >
          <option value="">All Courses</option>
          {courses.map(course => (
            <option key={course.id} value={course.id}>
              {course.name}
            </option>
          ))}
        </select>
      </div>

      {/* Create Announcement Form (Modal) */}
      {showForm && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass rounded-2xl border border-white/10 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Create New Announcement</h2>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={newAnnouncement.title}
                    onChange={(e) => setNewAnnouncement({...newAnnouncement, title: e.target.value})}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                    placeholder="Enter announcement title"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Content *
                  </label>
                  <textarea
                    value={newAnnouncement.content}
                    onChange={(e) => setNewAnnouncement({...newAnnouncement, content: e.target.value})}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 min-h-[150px]"
                    placeholder="Enter announcement content"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Target Audience
                    </label>
                    <select
                      value={newAnnouncement.target}
                      onChange={(e) => setNewAnnouncement({...newAnnouncement, target: e.target.value as any})}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                    >
                      <option value="all">All Students</option>
                      <option value="course">Specific Course</option>
                      <option value="specific">Specific Students</option>
                    </select>
                  </div>

                  {newAnnouncement.target === 'course' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Select Course
                      </label>
                      <select
                        value={selectedCourse}
                        onChange={(e) => setSelectedCourse(e.target.value)}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                      >
                        <option value="">Select a course</option>
                        {courses.map(course => (
                          <option key={course.id} value={course.id}>
                            {course.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="important"
                    checked={newAnnouncement.is_important}
                    onChange={(e) => setNewAnnouncement({...newAnnouncement, is_important: e.target.checked})}
                    className="w-4 h-4 rounded bg-white/5 border border-white/10 focus:ring-red-500"
                  />
                  <label htmlFor="important" className="text-sm text-gray-400">
                    Mark as Important (Will be highlighted for students)
                  </label>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-6 py-3 border border-white/10 text-gray-400 hover:text-white hover:border-white/20 rounded-xl font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white rounded-xl font-bold transition-all shadow-xl shadow-red-600/20"
                  >
                    Publish Announcement
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Announcements List */}
      <div className="glass rounded-xl border border-white/5 overflow-hidden">
        <div className="p-6 border-b border-white/5">
          <h2 className="text-lg font-bold text-white">Recent Announcements</h2>
          <p className="text-sm text-gray-400 mt-1">
            {filteredAnnouncements.length} announcement(s) found
          </p>
        </div>

        <div className="divide-y divide-white/5">
          {filteredAnnouncements.length === 0 ? (
            <div className="p-8 text-center">
              <div className="w-16 h-16 mx-auto bg-white/5 rounded-full flex items-center justify-center text-gray-400 text-2xl mb-4">
                📭
              </div>
              <p className="text-gray-400">No announcements found</p>
              <p className="text-sm text-gray-500 mt-1">
                {searchTerm ? 'Try a different search term' : 'Create your first announcement'}
              </p>
            </div>
          ) : (
            filteredAnnouncements.map((announcement) => (
              <div key={announcement.id} className="p-6 hover:bg-white/5 transition-colors">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  <div className="flex-grow">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-white">{announcement.title}</h3>
                      {announcement.is_important && (
                        <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs font-bold rounded">
                          IMPORTANT
                        </span>
                      )}
                      <span className="text-sm text-gray-500">{announcement.date}</span>
                    </div>
                    <p className="text-gray-400">{announcement.content}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleDelete(announcement.id)}
                      className="px-3 py-1.5 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg text-sm font-medium transition-colors"
                    >
                      Delete
                    </button>
                    <button className="px-3 py-1.5 bg-white/5 text-gray-400 hover:bg-white/10 rounded-lg text-sm font-medium transition-colors">
                      Edit
                    </button>
                    <button className="px-3 py-1.5 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 rounded-lg text-sm font-medium transition-colors">
                      View Stats
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass p-4 rounded-xl border border-white/5">
          <h3 className="font-bold text-white mb-3">Send Quick Notification</h3>
          <p className="text-sm text-gray-400 mb-4">
            Send an instant notification to selected students
          </p>
          <button className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white rounded-lg font-medium transition-all">
            Send Notification
          </button>
        </div>

        <div className="glass p-4 rounded-xl border border-white/5">
          <h3 className="font-bold text-white mb-3">Schedule Announcement</h3>
          <p className="text-sm text-gray-400 mb-4">
            Schedule announcements for future dates
          </p>
          <button className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white rounded-lg font-medium transition-all">
            Schedule
          </button>
        </div>

        <div className="glass p-4 rounded-xl border border-white/5">
          <h3 className="font-bold text-white mb-3">View Analytics</h3>
          <p className="text-sm text-gray-400 mb-4">
            See how students engage with your content
          </p>
          <button className="w-full py-2.5 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white rounded-lg font-medium transition-all">
            View Analytics
          </button>
        </div>
      </div>

      <style>{`
        .glass {
          backdrop-filter: blur(16px) saturate(180%);
          -webkit-backdrop-filter: blur(16px) saturate(180%);
          background-color: rgba(17, 25, 40, 0.75);
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out forwards;
        }
        
        .font-orbitron {
          font-family: 'Orbitron', sans-serif;
        }
      `}</style>
    </div>
  );
};

export default StudentContent;
