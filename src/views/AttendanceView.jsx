import React, { useState } from 'react';
import {
  CalendarCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Calendar,
  Save,
  Users,
  Filter,
  Check,
  RotateCcw,
  AlertCircle
} from 'lucide-react';

export default function AttendanceView({ students, attendance, onSaveAttendance }) {
  const [selectedGrade, setSelectedGrade] = useState('Class 10');
  const [selectedSection, setSelectedSection] = useState('A');
  const [selectedDate, setSelectedDate] = useState(() => {
    // Current BS date representation
    return '2081-08-12';
  });

  // Filter students for selected class & section
  const sectionStudents = students.filter(
    s => s.grade === selectedGrade && s.section === selectedSection && s.status === 'Active'
  );

  // Check if attendance already exists for this date and section
  const existingRecord = attendance.find(
    a => a.date === selectedDate && a.grade === selectedGrade && a.section === selectedSection
  );

  // Local state for current attendance sheet
  const [records, setRecords] = useState(() => {
    return sectionStudents.map(s => ({
      studentId: s.id,
      name: s.fullName,
      rollNo: s.rollNo,
      status: 'Present',
      remark: ''
    }));
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  // Update records when grade or section changes
  React.useEffect(() => {
    if (existingRecord && existingRecord.records) {
      setRecords(existingRecord.records);
    } else {
      setRecords(
        sectionStudents.map(s => ({
          studentId: s.id,
          name: s.fullName,
          rollNo: s.rollNo,
          status: 'Present',
          remark: ''
        }))
      );
    }
  }, [selectedGrade, selectedSection, selectedDate, existingRecord, sectionStudents.length]);

  const handleStatusChange = (studentId, status) => {
    setRecords(prev => prev.map(r => r.studentId === studentId ? { ...r, status } : r));
  };

  const handleRemarkChange = (studentId, remark) => {
    setRecords(prev => prev.map(r => r.studentId === studentId ? { ...r, remark } : r));
  };

  const handleMarkAll = (status) => {
    setRecords(prev => prev.map(r => ({ ...r, status })));
  };

  const handleSave = () => {
    const presentCount = records.filter(r => r.status === 'Present').length;
    const absentCount = records.filter(r => r.status === 'Absent').length;
    const lateCount = records.filter(r => r.status === 'Late').length;
    const leaveCount = records.filter(r => r.status === 'Leave').length;

    const payload = {
      id: existingRecord ? existingRecord.id : `att-${Date.now()}`,
      date: selectedDate,
      grade: selectedGrade,
      section: selectedSection,
      totalStudents: records.length,
      presentCount,
      absentCount,
      lateCount,
      leaveCount,
      records
    };

    onSaveAttendance(payload);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const presentCount = records.filter(r => r.status === 'Present').length;
  const absentCount = records.filter(r => r.status === 'Absent').length;
  const lateCount = records.filter(r => r.status === 'Late').length;
  const leaveCount = records.filter(r => r.status === 'Leave').length;
  const attendanceRate = records.length > 0 ? Math.round(((presentCount + lateCount) / records.length) * 100) : 100;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl flex items-center gap-2">
            <CalendarCheck className="h-6 w-6 text-indigo-600" />
            Daily Class Attendance
          </h2>
          <p className="text-xs text-slate-500">
            Take roll call, log student presence, and maintain attendance records for Safe English Boarding School.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {savedSuccess && (
            <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
              <CheckCircle2 className="h-4 w-4" /> Attendance Saved!
            </span>
          )}
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-indigo-200 hover:bg-indigo-700 transition-colors"
          >
            <Save className="h-4 w-4" />
            Save Attendance
          </button>
        </div>
      </div>

      {/* Control Strip & Metrics */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">Select Class</label>
            <select
              value={selectedGrade}
              onChange={e => setSelectedGrade(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold focus:border-indigo-500 focus:bg-white focus:outline-none"
            >
              {['Class 10', 'Class 9', 'Class 8', 'Class 7', 'Class 6', 'Class 5', 'Class 4', 'Class 3', 'Class 2', 'Class 1'].map(g => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">Select Section</label>
            <select
              value={selectedSection}
              onChange={e => setSelectedSection(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold focus:border-indigo-500 focus:bg-white focus:outline-none"
            >
              <option value="A">Section A</option>
              <option value="B">Section B</option>
              <option value="C">Section C</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">Attendance Date</label>
            <input
              type="text"
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
              placeholder="YYYY-MM-DD (e.g. 2081-08-12)"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold focus:border-indigo-500 focus:bg-white focus:outline-none"
            />
          </div>
        </div>

        {/* Live Attendance Stats */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3">
          <div className="flex flex-wrap items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5 font-medium text-slate-600">
              Total Enrolled: <strong className="text-slate-900">{records.length}</strong>
            </span>
            <span className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg font-semibold">
              <span className="h-2 w-2 rounded-full bg-emerald-500" /> Present: {presentCount}
            </span>
            <span className="flex items-center gap-1.5 text-rose-700 bg-rose-50 px-2.5 py-1 rounded-lg font-semibold">
              <span className="h-2 w-2 rounded-full bg-rose-500" /> Absent: {absentCount}
            </span>
            <span className="flex items-center gap-1.5 text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg font-semibold">
              <span className="h-2 w-2 rounded-full bg-amber-500" /> Late: {lateCount}
            </span>
            <span className="flex items-center gap-1.5 text-sky-700 bg-sky-50 px-2.5 py-1 rounded-lg font-semibold">
              <span className="h-2 w-2 rounded-full bg-sky-500" /> Leave: {leaveCount}
            </span>
          </div>

          {/* Quick Mark All Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleMarkAll('Present')}
              className="rounded-lg bg-emerald-50 px-3 py-1.5 text-[11px] font-bold text-emerald-700 hover:bg-emerald-100 transition-colors"
            >
              Mark All Present
            </button>
            <button
              onClick={() => handleMarkAll('Absent')}
              className="rounded-lg bg-rose-50 px-3 py-1.5 text-[11px] font-bold text-rose-700 hover:bg-rose-100 transition-colors"
            >
              Clear All
            </button>
          </div>
        </div>
      </div>

      {/* Attendance Register Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/75 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3 px-4 w-16">Roll No</th>
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-4">Class & Section</th>
                <th className="py-3 px-4">Attendance Status</th>
                <th className="py-3 px-4">Notes / Reason</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {records.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    <Users className="mx-auto h-8 w-8 text-slate-300 mb-2" />
                    No students currently registered in {selectedGrade} - Section {selectedSection}.
                  </td>
                </tr>
              ) : (
                records.map(record => (
                  <tr key={record.studentId} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-700">#{record.rollNo}</td>
                    <td className="py-3 px-4 font-bold text-slate-900">{record.name}</td>
                    <td className="py-3 px-4 text-slate-600">{selectedGrade} - {selectedSection}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        {[
                          { status: 'Present', short: 'P', color: 'bg-emerald-600 text-white' },
                          { status: 'Absent', short: 'A', color: 'bg-rose-600 text-white' },
                          { status: 'Late', short: 'L', color: 'bg-amber-500 text-white' },
                          { status: 'Leave', short: 'LV', color: 'bg-sky-600 text-white' }
                        ].map(btn => {
                          const isSelected = record.status === btn.status;
                          return (
                            <button
                              key={btn.status}
                              onClick={() => handleStatusChange(record.studentId, btn.status)}
                              className={`h-7 px-2.5 rounded-lg text-xs font-bold transition-all ${
                                isSelected ? btn.color + ' shadow-xs scale-105' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                              }`}
                            >
                              {btn.short}
                            </button>
                          );
                        })}
                        <span className="text-[11px] font-semibold text-slate-500 ml-2">
                          {record.status}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <input
                        type="text"
                        value={record.remark || ''}
                        onChange={e => handleRemarkChange(record.studentId, e.target.value)}
                        placeholder="Optional remarks..."
                        className="w-full max-w-xs rounded-lg border border-slate-200 bg-slate-50/50 px-2.5 py-1 text-xs focus:border-indigo-500 focus:bg-white focus:outline-none"
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
