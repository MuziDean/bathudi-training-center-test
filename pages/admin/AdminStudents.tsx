import React, { useState } from 'react';
import { Student, StudentStatus, FeeStatus } from '../../types';

const AdminStudents: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const mockStudents: Student[] = [
    { 
      id: 101,
      name: 'James', 
      surname: 'Hlope', 
      course: 1,
      course_title: 'Engine Fitter',
      student_id: 'STU-101',
      status: StudentStatus.Active, 
      fees_status: FeeStatus.Paid,
      feesStatus: FeeStatus.Paid,
      date_registered: '2023-01-15',
      dateRegistered: '2023-01-15',
      email: 'j.hlope@email.com', 
      phone: '0712345678',
      address: '123 Main St',
      profile_image: '',
      profileImage: ''
    },
    { 
      id: 102,
      name: 'Emily', 
      surname: 'Johnson', 
      course: 2,
      course_title: 'Suspension Repairer',
      student_id: 'STU-102',
      status: StudentStatus.Active, 
      fees_status: FeeStatus.Outstanding,
      feesStatus: FeeStatus.Outstanding,
      date_registered: '2023-03-10',
      dateRegistered: '2023-03-10',
      email: 'e.johnson@email.com', 
      phone: '0823456789',
      address: '456 Oak Ave',
      profile_image: '',
      profileImage: ''
    },
    { 
      id: 103,
      name: 'Samuel', 
      surname: 'Sithole', 
      course: 3,
      course_title: 'Workshop Assistant',
      student_id: 'STU-103',
      status: StudentStatus.Inactive, 
      fees_status: FeeStatus.Partial,
      feesStatus: FeeStatus.Partial,
      date_registered: '2022-11-20',
      dateRegistered: '2022-11-20',
      email: 's.sithole@email.com', 
      phone: '0634567890',
      address: '789 Pine Rd',
      profile_image: '',
      profileImage: ''
    },
  ];

  // Filter students based on search term
  const filteredStudents = mockStudents.filter(student => {
    const searchLower = searchTerm.toLowerCase();
    const studentIdString = student.id.toString();
    const studentIdNumber = student.student_id?.toLowerCase() || '';
    const courseTitle = student.course_title?.toLowerCase() || '';
    
    return (
      student.name.toLowerCase().includes(searchLower) ||
      student.surname.toLowerCase().includes(searchLower) ||
      studentIdString.includes(searchLower) ||
      studentIdNumber.includes(searchLower) ||
      courseTitle.includes(searchLower)
    );
  });

  // Get fee status with fallback
  const getFeeStatus = (student: Student): FeeStatus => {
    return student.fees_status || student.feesStatus || FeeStatus.Pending;
  };

  // Get fee status color
  const getFeeStatusColor = (status: FeeStatus): string => {
    switch(status) {
      case FeeStatus.Paid:
        return 'bg-blue-500/20 text-blue-400';
      case FeeStatus.Partial:
        return 'bg-yellow-500/20 text-yellow-400';
      case FeeStatus.Outstanding:
        return 'bg-red-500/20 text-red-400';
      case FeeStatus.Pending:
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-orbitron font-bold text-white mb-2">Student Registry</h1>
          <p className="text-gray-400">Manage, track, and update enrolled students and their fee records.</p>
        </div>
        <div className="flex items-center space-x-4">
          <button className="px-6 py-3 glass hover:bg-white/10 rounded-xl text-sm font-bold border border-white/10">
            Bulk Upload CSV
          </button>
          <button className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-600/20">
            + New Student
          </button>
        </div>
      </header>

      {/* Filter Bar */}
      <div className="glass p-4 rounded-2xl flex flex-col md:flex-row gap-4 items-center border border-white/5">
        <div className="relative flex-grow">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">🔍</span>
          <input 
            type="text" 
            placeholder="Search by name, ID or course..." 
            className="w-full bg-slate-800/50 border border-white/5 rounded-xl pl-12 pr-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select className="bg-slate-800/50 border border-white/5 rounded-xl px-4 py-3 text-sm text-white focus:outline-none">
          <option>All Courses</option>
          {['Engine Fitter', 'Suspension Repairer', 'Workshop Assistant'].map(c => <option key={c}>{c}</option>)}
        </select>
        <select className="bg-slate-800/50 border border-white/5 rounded-xl px-4 py-3 text-sm text-white focus:outline-none">
          <option>All Statuses</option>
          <option>Active</option>
          <option>Inactive</option>
        </select>
      </div>

      {/* Students Table */}
      <div className="glass rounded-3xl border border-white/5 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/5 border-b border-white/5">
                <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider text-gray-400">Student Info</th>
                <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider text-gray-400">Course</th>
                <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider text-gray-400">Status</th>
                <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider text-gray-400 text-center">Fees Record</th>
                <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider text-gray-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredStudents.map((student) => {
                const feeStatus = getFeeStatus(student);
                const courseDisplay = student.course_title || `Course #${student.course}`;
                
                return (
                  <tr key={student.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-blue-600/10 text-blue-400 flex items-center justify-center font-bold">
                          {student.name[0]}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white">{student.name} {student.surname}</p>
                          <p className="text-[10px] text-gray-500 uppercase tracking-widest">
                            ID: #{student.student_id || student.id}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-sm text-gray-300">{courseDisplay}</p>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase ${
                        student.status === StudentStatus.Active 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {student.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <div className="flex flex-col items-center">
                        <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase mb-1 ${getFeeStatusColor(feeStatus)}`}>
                          {feeStatus}
                        </span>
                        <button className="text-[9px] text-gray-500 hover:text-white flex items-center font-bold uppercase tracking-tighter">
                          <span className="mr-1">📁</span> View Records
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button className="p-2 glass hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors" title="View Profile">
                          👁️
                        </button>
                        <button className="p-2 glass hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors" title="Edit Details">
                          ✏️
                        </button>
                        <button className="p-2 glass hover:bg-red-500/20 rounded-lg text-gray-400 hover:text-red-400 transition-colors" title="Deactivate">
                          🚫
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          
          {filteredStudents.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400">No students found matching your search.</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
        <div className="glass p-4 rounded-xl border border-white/5">
          <p className="text-xs text-gray-400 uppercase">Total Students</p>
          <p className="text-2xl font-bold text-white">{mockStudents.length}</p>
        </div>
        <div className="glass p-4 rounded-xl border border-white/5">
          <p className="text-xs text-gray-400 uppercase">Active Students</p>
          <p className="text-2xl font-bold text-green-400">
            {mockStudents.filter(s => s.status === StudentStatus.Active).length}
          </p>
        </div>
        <div className="glass p-4 rounded-xl border border-white/5">
          <p className="text-xs text-gray-400 uppercase">Fees Paid</p>
          <p className="text-2xl font-bold text-blue-400">
            {mockStudents.filter(s => getFeeStatus(s) === FeeStatus.Paid).length}
          </p>
        </div>
        <div className="glass p-4 rounded-xl border border-white/5">
          <p className="text-xs text-gray-400 uppercase">Outstanding</p>
          <p className="text-2xl font-bold text-yellow-400">
            {mockStudents.filter(s => getFeeStatus(s) === FeeStatus.Outstanding).length}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminStudents;