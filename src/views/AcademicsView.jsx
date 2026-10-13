import React, { useState } from 'react';
import {
  GraduationCap,
  Clock,
  Calendar,
  BookOpen,
  User,
  Plus,
  Layers,
  ChevronRight,
  Printer
} from 'lucide-react';

export default function AcademicsView({ schoolInfo }) {
  const [selectedClass, setSelectedClass] = useState('Class 10');
  const [selectedSection, setSelectedSection] = useState('A');

  const classes = [
    { name: 'Class 10', teacher: 'Mr. Dinesh Gautam', room: 'Room 301', totalStudents: 38 },
    { name: 'Class 9', teacher: 'Mr. Prakash Bhattarai', room: 'Room 302', totalStudents: 42 },
    { name: 'Class 8', teacher: 'Mrs. Sabina Neupane', room: 'Room 201', totalStudents: 40 },
    { name: 'Class 7', teacher: 'Mr. Narayan KC', room: 'Room 202', totalStudents: 36 },
    { name: 'Class 6', teacher: 'Mrs. Sunita Maharjan', room: 'Room 101', totalStudents: 35 },
    { name: 'Class 5', teacher: 'Mrs. Sita Magar', room: 'Room 102', totalStudents: 34 }
  ];

  const subjects = [
    { code: 'ENG-10', name: 'Compulsory English', teacher: 'Mrs. Sabina Neupane', credits: 4, weeklyPeriods: 6 },
    { code: 'NEP-10', name: 'Nepali', teacher: 'Mr. Ram Kumar Adhikari', credits: 4, weeklyPeriods: 6 },
    { code: 'MTH-10', name: 'Compulsory Mathematics', teacher: 'Mr. Prakash Bhattarai', credits: 4, weeklyPeriods: 7 },
    { code: 'SCI-10', name: 'Science & Technology', teacher: 'Mr. Dinesh Gautam', credits: 4, weeklyPeriods: 7 },
    { code: 'SOC-10', name: 'Social Studies & Life Skills', teacher: 'Mr. Narayan KC', credits: 4, weeklyPeriods: 5 },
    { code: 'COM-10', name: 'Computer Science (Optional)', teacher: 'Mr. Dinesh Gautam', credits: 4, weeklyPeriods: 5 },
    { code: 'HPE-10', name: 'Health & Physical Education', teacher: 'Mr. Bikash KC', credits: 2, weeklyPeriods: 3 }
  ];

  // Nepal school timetable: Sunday to Friday (Saturday is weekend holiday in Nepal)
  const routineDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const routinePeriods = [
    { period: 'Period 1', time: '10:00 - 10:45 AM', sub: 'English', teacher: 'S. Neupane' },
    { period: 'Period 2', time: '10:45 - 11:30 AM', sub: 'Compulsory Math', teacher: 'P. Bhattarai' },
    { period: 'Period 3', time: '11:30 - 12:15 PM', sub: 'Science & Tech', teacher: 'D. Gautam' },
    { period: 'Tiffin Break', time: '12:15 - 01:00 PM', sub: 'Lunch & Recess', teacher: 'All Staff' },
    { period: 'Period 4', time: '01:00 - 01:45 PM', sub: 'Nepali', teacher: 'R. Adhikari' },
    { period: 'Period 5', time: '01:45 - 02:30 PM', sub: 'Social Studies', teacher: 'N. KC' },
    { period: 'Period 6', time: '02:30 - 03:15 PM', sub: 'Computer Lab / Opt', teacher: 'D. Gautam' },
    { period: 'Period 7', time: '03:15 - 04:00 PM', sub: 'Health & Creative Arts', teacher: 'B. KC' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-indigo-600" />
            Academic Management & Class Routine
          </h2>
          <p className="text-xs text-slate-500">
            Class batches, subject curriculums, teacher assignments, and weekly period timetables (Sunday–Friday).
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50"
        >
          <Printer className="h-4 w-4 text-slate-500" />
          Print Routine
        </button>
      </div>

      {/* Class Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {classes.map(c => {
          const isSelected = selectedClass === c.name;
          return (
            <button
              key={c.name}
              onClick={() => setSelectedClass(c.name)}
              className={`rounded-2xl border p-4 text-left transition-all ${
                isSelected
                  ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-500/20 shadow-xs'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <span className="text-xs font-bold text-slate-900 block">{c.name}</span>
              <span className="text-[11px] text-indigo-600 font-medium block mt-0.5">{c.room}</span>
              <span className="text-[10px] text-slate-400 block mt-1">{c.totalStudents} Students</span>
            </button>
          );
        })}
      </div>

      {/* Routine Timetable Grid */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Weekly Class Timetable • {selectedClass} (Section {selectedSection})
            </h3>
            <p className="text-xs text-slate-500">Standard 7-period schedule (10:00 AM to 4:00 PM) - Academic Session 2081 B.S.</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Section:</span>
            {['A', 'B'].map(s => (
              <button
                key={s}
                onClick={() => setSelectedSection(s)}
                className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-colors ${
                  selectedSection === s ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Section {s}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-slate-200">
            <thead>
              <tr className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                <th className="py-2.5 px-3 border-r border-slate-200 w-32">Day</th>
                {routinePeriods.map(p => (
                  <th key={p.period} className="py-2.5 px-2 border-r border-slate-200 text-center">
                    <div className="font-bold text-slate-800">{p.period}</div>
                    <div className="text-[9px] text-slate-400 font-normal">{p.time}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {routineDays.map(day => (
                <tr key={day} className="hover:bg-slate-50/50">
                  <td className="py-3 px-3 font-bold text-slate-900 border-r border-slate-200 bg-slate-50/30">
                    {day}
                  </td>
                  {routinePeriods.map((p, idx) => {
                    const isTiffin = p.period === 'Tiffin Break';
                    return (
                      <td
                        key={idx}
                        className={`py-2 px-2 text-center border-r border-slate-200 ${
                          isTiffin ? 'bg-amber-50/60 font-semibold text-amber-800' : ''
                        }`}
                      >
                        <div className="font-bold text-slate-800">{p.sub}</div>
                        {!isTiffin && (
                          <div className="text-[10px] text-slate-400 font-medium">{p.teacher}</div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Curriculum Subjects List */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 mb-3">Prescribed Syllabus & Subjects ({selectedClass})</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase text-[10px]">
                <th className="py-2 px-3">Subject Code</th>
                <th className="py-2 px-3">Subject Title</th>
                <th className="py-2 px-3">Assigned Faculty</th>
                <th className="py-2 px-3">Credit Hours</th>
                <th className="py-2 px-3">Weekly Periods</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {subjects.map(sub => (
                <tr key={sub.code} className="hover:bg-slate-50">
                  <td className="py-2.5 px-3 font-mono font-bold text-indigo-600">{sub.code}</td>
                  <td className="py-2.5 px-3 font-bold text-slate-800">{sub.name}</td>
                  <td className="py-2.5 px-3 text-slate-600">{sub.teacher}</td>
                  <td className="py-2.5 px-3 text-slate-700">{sub.credits} CH</td>
                  <td className="py-2.5 px-3 text-slate-700">{sub.weeklyPeriods} periods/week</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
