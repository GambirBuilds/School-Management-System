import React, { useState } from 'react';
import {
  Users,
  Search,
  Plus,
  Filter,
  Download,
  Printer,
  Edit2,
  Trash2,
  Eye,
  CheckCircle,
  AlertCircle,
  X,
  Phone,
  MapPin,
  Calendar,
  Receipt,
  Award,
  IdCard,
  UserCheck
} from 'lucide-react';

export default function StudentsView({
  students,
  onAddStudent,
  onUpdateStudent,
  onDeleteStudent,
  schoolInfo,
  onCollectFeeForStudent
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('All');
  const [selectedSection, setSelectedSection] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [formError, setFormError] = useState('');

  const [formData, setFormData] = useState({
    admissionNo: '',
    fullName: '',
    grade: 'Class 10',
    section: 'A',
    rollNo: '',
    dob: '2066-01-01',
    gender: 'Male',
    bloodGroup: 'B+',
    guardianName: '',
    guardianPhone: '',
    address: 'Kathmandu, Nepal',
    admissionDate: '2081-01-10',
    status: 'Active',
    feesDue: 0
  });

  const gradesList = ['All', 'Class 10', 'Class 9', 'Class 8', 'Class 7', 'Class 6', 'Class 5', 'Class 4', 'Class 3', 'Class 2', 'Class 1', 'UKG', 'LKG', 'Nursery'];

  // Filtering
  const filteredStudents = students.filter(student => {
    const matchesSearch =
      student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.admissionNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.rollNo.includes(searchTerm);
    const matchesGrade = selectedGrade === 'All' || student.grade === selectedGrade;
    const matchesSection = selectedSection === 'All' || student.section === selectedSection;
    const matchesStatus = selectedStatus === 'All' || student.status === selectedStatus;
    return matchesSearch && matchesGrade && matchesSection && matchesStatus;
  });

  const handleOpenAdd = () => {
    setEditingStudent(null);
    setFormError('');
    // Auto generate next admission number
    const count = students.length + 1;
    const nextAdm = `SEBS-2081-${String(count).padStart(3, '0')}`;
    setFormData({
      admissionNo: nextAdm,
      fullName: '',
      grade: 'Class 10',
      section: 'A',
      rollNo: String(count),
      dob: '2067-05-15',
      gender: 'Male',
      bloodGroup: 'B+',
      guardianName: '',
      guardianPhone: '+977-98',
      address: 'Kathmandu, Nepal',
      admissionDate: '2081-01-10',
      status: 'Active',
      feesDue: 0
    });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (student) => {
    setEditingStudent(student);
    setFormError('');
    setFormData({ ...student });
    setIsFormOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError('');

    // Duplicate admission check
    const duplicate = students.find(s =>
      s.admissionNo.trim().toLowerCase() === formData.admissionNo.trim().toLowerCase() &&
      (!editingStudent || s.id !== editingStudent.id)
    );

    if (duplicate) {
      setFormError(`Admission number "${formData.admissionNo}" already belongs to ${duplicate.fullName}. Duplicate admission numbers are prevented.`);
      return;
    }

    if (!formData.fullName.trim()) {
      setFormError('Please enter full student name.');
      return;
    }

    if (editingStudent) {
      onUpdateStudent(editingStudent.id, formData);
    } else {
      onAddStudent(formData);
    }
    setIsFormOpen(false);
  };

  const handleExportCSV = () => {
    const headers = ['Admission No', 'Full Name', 'Grade', 'Section', 'Roll No', 'Gender', 'Guardian', 'Contact', 'Status', 'Fees Due (NPR)'];
    const rows = filteredStudents.map(s => [
      s.admissionNo,
      `"${s.fullName}"`,
      s.grade,
      s.section,
      s.rollNo,
      s.gender,
      `"${s.guardianName || ''}"`,
      `"${s.guardianPhone || ''}"`,
      s.status,
      s.feesDue
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Safe_English_School_Students_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl flex items-center gap-2">
            <Users className="h-6 w-6 text-indigo-600" />
            Student Admissions & Records
          </h2>
          <p className="text-xs text-slate-500">
            Manage student registrations, academic standing, guardian details, and fee balances for Safe English Boarding School.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 transition-colors"
          >
            <Download className="h-4 w-4 text-slate-500" />
            Export CSV
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 transition-colors"
          >
            <Printer className="h-4 w-4 text-slate-500" />
            Print List
          </button>
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-indigo-200 hover:bg-indigo-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            New Admission
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs space-y-3">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search by name, roll, or admission no..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-9 pr-3 py-2 text-xs focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Class Filter */}
          <div>
            <select
              value={selectedGrade}
              onChange={e => setSelectedGrade(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              {gradesList.map(g => (
                <option key={g} value={g}>{g === 'All' ? 'All Classes' : g}</option>
              ))}
            </select>
          </div>

          {/* Section Filter */}
          <div>
            <select
              value={selectedSection}
              onChange={e => setSelectedSection(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="All">All Sections (A, B, C)</option>
              <option value="A">Section A</option>
              <option value="B">Section B</option>
              <option value="C">Section C</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active Enrolled</option>
              <option value="Transferred">Transferred</option>
              <option value="Inactive">Inactive / Suspended</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
          <span>Showing <strong>{filteredStudents.length}</strong> of <strong>{students.length}</strong> enrolled students</span>
          {(searchTerm || selectedGrade !== 'All' || selectedSection !== 'All' || selectedStatus !== 'All') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedGrade('All');
                setSelectedSection('All');
                setSelectedStatus('All');
              }}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
            >
              Reset filters
            </button>
          )}
        </div>
      </div>

      {/* Students Data Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/75 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Admission No</th>
                <th className="py-3 px-4">Class & Roll</th>
                <th className="py-3 px-4">Guardian Contact</th>
                <th className="py-3 px-4">Fee Dues</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <Users className="mx-auto h-8 w-8 text-slate-300 mb-2" />
                    No students found matching current filters.
                  </td>
                </tr>
              ) : (
                filteredStudents.map(student => (
                  <tr key={student.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={student.photoUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'}
                          alt={student.fullName}
                          className="h-9 w-9 rounded-full object-cover ring-1 ring-slate-200 shrink-0"
                        />
                        <div>
                          <div className="font-bold text-slate-900">{student.fullName}</div>
                          <div className="text-[11px] text-slate-500">{student.gender} • Blood: {student.bloodGroup}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono font-medium text-slate-700">{student.admissionNo}</td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-800">{student.grade} - {student.section}</div>
                      <div className="text-[11px] text-slate-500">Roll No: #{student.rollNo}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-800">{student.guardianName || 'Guardian'}</div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1">
                        <Phone className="h-3 w-3 text-slate-400" />
                        {student.guardianPhone || 'Not set'}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {Number(student.feesDue) > 0 ? (
                        <span className="font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md">
                          रु {Number(student.feesDue).toLocaleString()}
                        </span>
                      ) : (
                        <span className="font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                          Cleared
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        student.status === 'Active' ? 'bg-emerald-100 text-emerald-800' :
                        student.status === 'Transferred' ? 'bg-amber-100 text-amber-800' :
                        'bg-slate-200 text-slate-700'
                      }`}>
                        {student.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedStudent(student)}
                          className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                          title="View Full Profile"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(student)}
                          className="rounded-lg p-1.5 text-indigo-600 hover:bg-indigo-50 transition-colors"
                          title="Edit Student"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to remove ${student.fullName} (${student.admissionNo})?`)) {
                              onDeleteStudent(student.id);
                            }
                          }}
                          className="rounded-lg p-1.5 text-rose-500 hover:bg-rose-50 transition-colors"
                          title="Delete Record"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Student Details Drawer / Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden">
            {/* Header */}
            <div className="relative bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 p-6 text-white">
              <button
                onClick={() => setSelectedStudent(null)}
                className="absolute top-4 right-4 rounded-full bg-white/10 p-1 text-white hover:bg-white/20 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="flex items-center gap-4">
                <img
                  src={selectedStudent.photoUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'}
                  alt={selectedStudent.fullName}
                  className="h-16 w-16 rounded-xl object-cover ring-2 ring-white/50 shadow-md"
                />
                <div>
                  <h3 className="text-xl font-bold">{selectedStudent.fullName}</h3>
                  <p className="text-xs text-indigo-200 font-mono">Admission No: {selectedStudent.admissionNo}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="rounded bg-white/20 px-2 py-0.5 text-xs font-semibold">
                      {selectedStudent.grade} - {selectedStudent.section} (Roll: #{selectedStudent.rollNo})
                    </span>
                    <span className="rounded bg-emerald-500/30 px-2 py-0.5 text-xs font-semibold text-emerald-200">
                      {selectedStudent.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Content */}
            <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Date of Birth (BS)</span>
                  <strong className="text-slate-800 text-xs">{selectedStudent.dob}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Gender</span>
                  <strong className="text-slate-800 text-xs">{selectedStudent.gender}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Blood Group</span>
                  <strong className="text-slate-800 text-xs">{selectedStudent.bloodGroup}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Guardian Name</span>
                  <strong className="text-slate-800 text-xs">{selectedStudent.guardianName || 'N/A'}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Contact Phone</span>
                  <strong className="text-slate-800 text-xs">{selectedStudent.guardianPhone || 'N/A'}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Admission Date</span>
                  <strong className="text-slate-800 text-xs">{selectedStudent.admissionDate}</strong>
                </div>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Address</span>
                <p className="text-slate-800 font-medium">{selectedStudent.address}</p>
              </div>

              {/* Fee Outstanding Summary */}
              <div className="rounded-xl border border-slate-200 p-4 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Fee Account Status</h4>
                  <p className="text-[11px] text-slate-500">Current active dues under Safe English Boarding School accounts</p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-black text-rose-600">
                    रु {Number(selectedStudent.feesDue).toLocaleString()}
                  </div>
                  <button
                    onClick={() => {
                      setSelectedStudent(null);
                      onCollectFeeForStudent(selectedStudent);
                    }}
                    className="mt-1 inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1 text-[11px] font-bold text-white hover:bg-emerald-700 transition-colors"
                  >
                    <Receipt className="h-3 w-3" /> Collect Fee Now
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  onClick={() => setSelectedStudent(null)}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    handleOpenEdit(selectedStudent);
                    setSelectedStudent(null);
                  }}
                  className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700"
                >
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Student Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-slate-50/75">
              <h3 className="text-base font-bold text-slate-900">
                {editingStudent ? 'Edit Student Details' : 'New Student Admission Entry'}
              </h3>
              <button onClick={() => setIsFormOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
              {formError && (
                <div className="rounded-xl bg-rose-50 p-3 text-rose-700 border border-rose-200 flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Admission Number *</label>
                  <input
                    type="text"
                    required
                    value={formData.admissionNo}
                    onChange={e => setFormData({ ...formData, admissionNo: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 font-mono focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                  <span className="text-[10px] text-slate-400">Must be unique across the school</span>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Full Student Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="e.g. Aayush Thapa"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Class / Grade *</label>
                  <select
                    value={formData.grade}
                    onChange={e => setFormData({ ...formData, grade: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    {gradesList.filter(g => g !== 'All').map(g => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Section *</label>
                    <select
                      value={formData.section}
                      onChange={e => setFormData({ ...formData, section: e.target.value })}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    >
                      <option value="A">Section A</option>
                      <option value="B">Section B</option>
                      <option value="C">Section C</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Roll No *</label>
                    <input
                      type="text"
                      required
                      value={formData.rollNo}
                      onChange={e => setFormData({ ...formData, rollNo: e.target.value })}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Gender</label>
                  <select
                    value={formData.gender}
                    onChange={e => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Blood Group</label>
                  <select
                    value={formData.bloodGroup}
                    onChange={e => setFormData({ ...formData, bloodGroup: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Guardian Name</label>
                  <input
                    type="text"
                    value={formData.guardianName}
                    onChange={e => setFormData({ ...formData, guardianName: e.target.value })}
                    placeholder="Father / Mother name"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Guardian Contact Phone</label>
                  <input
                    type="text"
                    value={formData.guardianPhone}
                    onChange={e => setFormData({ ...formData, guardianPhone: e.target.value })}
                    placeholder="+977-98..."
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Date of Birth (BS)</label>
                  <input
                    type="text"
                    value={formData.dob}
                    onChange={e => setFormData({ ...formData, dob: e.target.value })}
                    placeholder="YYYY-MM-DD (e.g. 2066-04-12)"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Admission Status</label>
                  <select
                    value={formData.status}
                    onChange={e => setFormData({ ...formData, status: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="Active">Active</option>
                    <option value="Transferred">Transferred</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Residential Address</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Street, Ward, Municipality, Kathmandu"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="mt-6 flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="rounded-lg border border-slate-300 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-indigo-600 px-5 py-2 font-bold text-white shadow-xs hover:bg-indigo-700"
                >
                  {editingStudent ? 'Save Changes' : 'Confirm Admission'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
