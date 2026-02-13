import React, { useState, useEffect } from 'react';
import { Student, StudentStatus, FeeStatus } from '../../types';

// API Base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

interface NewStudentForm {
  name: string;
  surname: string;
  email: string;
  phone: string;
  address: string;
  id_number: string;
  age: string;
  country: string;
  education_level: string;
  previous_school: string;
  course_id: number;
  course_title: string;
  status: StudentStatus;
  fees_status: FeeStatus;
  // Document checkboxes
  documents: {
    id: boolean;
    matric: boolean;
    pop: boolean;
    additional: boolean;
  };
}

const AdminStudents: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [availableCourses, setAvailableCourses] = useState<any[]>([]);
  const [processing, setProcessing] = useState(false);
  
  // New student form state
  const [newStudent, setNewStudent] = useState<NewStudentForm>({
    name: '',
    surname: '',
    email: '',
    phone: '',
    address: '',
    id_number: '',
    age: '',
    country: 'South Africa',
    education_level: '',
    previous_school: '',
    course_id: 1,
    course_title: 'Engine Fitter',
    status: StudentStatus.Active,
    fees_status: FeeStatus.Pending,
    documents: {
      id: false,
      matric: false,
      pop: false,
      additional: false
    }
  });

  // Fetch students from API
  useEffect(() => {
    fetchStudents();
    fetchCourses();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/students/`);
      if (response.ok) {
        const data = await response.json();
        setStudents(data);
      } else {
        console.error('Failed to fetch students');
      }
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/courses/`);
      if (response.ok) {
        const data = await response.json();
        setAvailableCourses(data);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'course_id') {
      const selectedCourse = availableCourses.find(c => c.id === parseInt(value));
      setNewStudent(prev => ({
        ...prev,
        course_id: parseInt(value),
        course_title: selectedCourse?.title || 'Unknown Course'
      }));
    } else {
      setNewStudent(prev => ({ ...prev, [name]: value }));
    }
  };

  // Handle document checkbox changes
  const handleDocumentChange = (docType: 'id' | 'matric' | 'pop' | 'additional') => {
    setNewStudent(prev => ({
      ...prev,
      documents: {
        ...prev.documents,
        [docType]: !prev.documents[docType]
      }
    }));
  };

  // Handle form submission
  const handleEnrollStudent = async () => {
    // Validate required fields
    if (!newStudent.name || !newStudent.surname || !newStudent.email || !newStudent.phone) {
      alert('Please fill in all required fields');
      return;
    }

    setProcessing(true);

    try {
      // Prepare student data for API
      const studentData = {
        name: newStudent.name,
        surname: newStudent.surname,
        email: newStudent.email,
        phone: newStudent.phone,
        address: newStudent.address,
        id_number: newStudent.id_number,
        age: parseInt(newStudent.age) || 0,
        country: newStudent.country,
        education_level: newStudent.education_level,
        previous_school: newStudent.previous_school,
        course: newStudent.course_id,
        status: newStudent.status,
        fees_status: newStudent.fees_status,
        // Document status
        documents_status: {
          id: newStudent.documents.id,
          matric: newStudent.documents.matric,
          pop: newStudent.documents.pop,
          additional: newStudent.documents.additional
        }
      };

      const response = await fetch(`${API_BASE_URL}/students/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(studentData),
      });

      if (response.ok) {
        alert(`✅ Student ${newStudent.name} ${newStudent.surname} enrolled successfully!`);
        setShowAddModal(false);
        // Reset form
        setNewStudent({
          name: '',
          surname: '',
          email: '',
          phone: '',
          address: '',
          id_number: '',
          age: '',
          country: 'South Africa',
          education_level: '',
          previous_school: '',
          course_id: 1,
          course_title: 'Engine Fitter',
          status: StudentStatus.Active,
          fees_status: FeeStatus.Pending,
          documents: {
            id: false,
            matric: false,
            pop: false,
            additional: false
          }
        });
        fetchStudents(); // Refresh student list
      } else {
        const error = await response.json();
        alert(`❌ Failed to enroll student: ${error.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error enrolling student:', error);
      alert('❌ Network error. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  // Filter students based on search term
  const filteredStudents = students.filter(student => {
    const searchLower = searchTerm.toLowerCase();
    const studentIdString = student.id?.toString() || '';
    const studentIdNumber = student.student_id?.toLowerCase() || '';
    const courseTitle = student.course_title?.toLowerCase() || '';
    
    return (
      student.name.toLowerCase().includes(searchLower) ||
      student.surname.toLowerCase().includes(searchLower) ||
      studentIdString.includes(searchLower) ||
      studentIdNumber.includes(searchLower) ||
      courseTitle.includes(searchLower) ||
      student.email.toLowerCase().includes(searchLower)
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-white flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
          <div>Loading students...</div>
        </div>
      </div>
    );
  }

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
          <button 
            onClick={() => setShowAddModal(true)}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-600/20"
          >
            + Enroll New Student
          </button>
        </div>
      </header>

      {/* Add Student Modal - FIXED: Increased z-index and improved dropdown styling */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[9999] p-4">
          <div className="glass p-6 md:p-8 rounded-3xl border border-white/5 max-w-4xl w-full max-h-[90vh] overflow-y-auto" style={{ zIndex: 10000 }}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">📝 Enroll New Student</h2>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-white text-2xl transition-colors"
              >
                ×
              </button>
            </div>

            <div className="space-y-6">
              {/* Personal Information */}
              <div className="p-6 rounded-xl bg-slate-900/50 border border-white/5">
                <h3 className="text-lg font-bold text-white mb-4">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">First Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={newStudent.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500"
                      placeholder="Enter first name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Last Name *</label>
                    <input
                      type="text"
                      name="surname"
                      value={newStudent.surname}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500"
                      placeholder="Enter last name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={newStudent.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500"
                      placeholder="student@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Phone *</label>
                    <input
                      type="text"
                      name="phone"
                      value={newStudent.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500"
                      placeholder="0712345678"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">ID/Passport Number</label>
                    <input
                      type="text"
                      name="id_number"
                      value={newStudent.id_number}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500"
                      placeholder="Enter ID number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Age</label>
                    <input
                      type="number"
                      name="age"
                      value={newStudent.age}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500"
                      placeholder="Age"
                      min="16"
                      max="65"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Country</label>
                    <select
                      name="country"
                      value={newStudent.country}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white appearance-none cursor-pointer"
                      style={{ color: 'white' }}
                    >
                      <option value="South Africa" className="bg-gray-800 text-white">South Africa</option>
                      <option value="Lesotho" className="bg-gray-800 text-white">Lesotho</option>
                      <option value="Botswana" className="bg-gray-800 text-white">Botswana</option>
                      <option value="Eswatini" className="bg-gray-800 text-white">Eswatini</option>
                      <option value="Zimbabwe" className="bg-gray-800 text-white">Zimbabwe</option>
                      <option value="Mozambique" className="bg-gray-800 text-white">Mozambique</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm text-gray-400 mb-1">Address</label>
                    <textarea
                      name="address"
                      value={newStudent.address}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500"
                      placeholder="Physical address"
                      rows={2}
                    />
                  </div>
                </div>
              </div>

              {/* Education Information - FIXED: Dropdowns now visible with proper colors */}
              <div className="p-6 rounded-xl bg-slate-900/50 border border-white/5">
                <h3 className="text-lg font-bold text-white mb-4">Education & Course</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Education Level</label>
                    <select
                      name="education_level"
                      value={newStudent.education_level}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white appearance-none cursor-pointer"
                      style={{ color: 'white' }}
                    >
                      <option value="" className="bg-gray-800 text-white">Select Education Level</option>
                      <option value="Grade 10" className="bg-gray-800 text-white">Grade 10</option>
                      <option value="Grade 11" className="bg-gray-800 text-white">Grade 11</option>
                      <option value="Grade 12 (Matric)" className="bg-gray-800 text-white">Grade 12 (Matric)</option>
                      <option value="N3" className="bg-gray-800 text-white">N3</option>
                      <option value="N4" className="bg-gray-800 text-white">N4</option>
                      <option value="Certificate" className="bg-gray-800 text-white">Certificate</option>
                      <option value="Diploma" className="bg-gray-800 text-white">Diploma</option>
                      <option value="Degree" className="bg-gray-800 text-white">Degree</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Previous School</label>
                    <input
                      type="text"
                      name="previous_school"
                      value={newStudent.previous_school}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500"
                      placeholder="Previous school/institution"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm text-gray-400 mb-1">Course *</label>
                    <select
                      name="course_id"
                      value={newStudent.course_id}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white appearance-none cursor-pointer"
                      style={{ color: 'white' }}
                    >
                      {availableCourses.map(course => (
                        <option key={course.id} value={course.id} className="bg-gray-800 text-white">
                          {course.title}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Documents & Status */}
              <div className="p-6 rounded-xl bg-slate-900/50 border border-white/5">
                <h3 className="text-lg font-bold text-white mb-4">Documents & Status</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm text-gray-400 mb-3">Document Availability (Check if available)</h4>
                    <div className="space-y-3">
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={newStudent.documents.id}
                          onChange={() => handleDocumentChange('id')}
                          className="w-5 h-5 rounded bg-gray-800 border-gray-600 text-blue-600"
                        />
                        <span className="text-white">ID Document Available</span>
                      </label>
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={newStudent.documents.matric}
                          onChange={() => handleDocumentChange('matric')}
                          className="w-5 h-5 rounded bg-gray-800 border-gray-600 text-blue-600"
                        />
                        <span className="text-white">Matric Certificate Available</span>
                      </label>
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={newStudent.documents.pop}
                          onChange={() => handleDocumentChange('pop')}
                          className="w-5 h-5 rounded bg-gray-800 border-gray-600 text-blue-600"
                        />
                        <span className="text-white">Proof of Payment Available (R661.25)</span>
                      </label>
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={newStudent.documents.additional}
                          onChange={() => handleDocumentChange('additional')}
                          className="w-5 h-5 rounded bg-gray-800 border-gray-600 text-blue-600"
                        />
                        <span className="text-white">Additional Documents Available</span>
                      </label>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm text-gray-400 mb-3">Status</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">Fee Status</label>
                        <select
                          value={newStudent.fees_status}
                          onChange={(e) => setNewStudent({...newStudent, fees_status: e.target.value as FeeStatus})}
                          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white appearance-none cursor-pointer"
                          style={{ color: 'white' }}
                        >
                          <option value={FeeStatus.Pending} className="bg-gray-800 text-white">Pending</option>
                          <option value={FeeStatus.Paid} className="bg-gray-800 text-white">Paid</option>
                          <option value={FeeStatus.Partial} className="bg-gray-800 text-white">Partial</option>
                          <option value={FeeStatus.Outstanding} className="bg-gray-800 text-white">Outstanding</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-4 pt-6 border-t border-white/5">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-bold transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEnrollStudent}
                  disabled={processing}
                  className="px-8 py-3 bg-green-600 hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-bold transition-all shadow-lg shadow-green-600/20 flex items-center"
                >
                  {processing ? (
                    <>
                      <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></span>
                      Enrolling...
                    </>
                  ) : (
                    '✓ Enroll Student'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
          {availableCourses.map(c => <option key={c.id}>{c.title}</option>)}
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
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                    No students found. Click "Enroll New Student" to add your first student.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => {
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
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
        <div className="glass p-4 rounded-xl border border-white/5">
          <p className="text-xs text-gray-400 uppercase">Total Students</p>
          <p className="text-2xl font-bold text-white">{students.length}</p>
        </div>
        <div className="glass p-4 rounded-xl border border-white/5">
          <p className="text-xs text-gray-400 uppercase">Active Students</p>
          <p className="text-2xl font-bold text-green-400">
            {students.filter(s => s.status === StudentStatus.Active).length}
          </p>
        </div>
        <div className="glass p-4 rounded-xl border border-white/5">
          <p className="text-xs text-gray-400 uppercase">Fees Paid</p>
          <p className="text-2xl font-bold text-blue-400">
            {students.filter(s => getFeeStatus(s) === FeeStatus.Paid).length}
          </p>
        </div>
        <div className="glass p-4 rounded-xl border border-white/5">
          <p className="text-xs text-gray-400 uppercase">Outstanding</p>
          <p className="text-2xl font-bold text-yellow-400">
            {students.filter(s => getFeeStatus(s) === FeeStatus.Outstanding).length}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminStudents;