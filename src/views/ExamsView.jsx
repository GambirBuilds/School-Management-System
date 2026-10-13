import React, { useState } from 'react';
import {
  Award,
  BookOpen,
  Plus,
  Printer,
  Edit3,
  CheckCircle2,
  AlertCircle,
  FileText,
  X,
  Search,
  School,
  GraduationCap
} from 'lucide-react';
import { calculateNepaliGrade } from '../services/schoolService.js';

export default function ExamsView({ exams, marks, students, schoolInfo, onSaveMarks }) {
  const [selectedExamId, setSelectedExamId] = useState(exams[0]?.id || 'ex-001');
  const [selectedGrade, setSelectedGrade] = useState('Class 10');
  const [selectedSection, setSelectedSection] = useState('A');
  const [searchTerm, setSearchTerm] = useState('');

  const [activeReportStudent, setActiveReportStudent] = useState(null);
  const [isEntryModalOpen, setIsEntryModalOpen] = useState(false);
  const [editingStudentMark, setEditingStudentMark] = useState(null);

  const selectedExam = exams.find(e => e.id === selectedExamId) || exams[0];

  // Subjects for the grade (standard Nepal CDC secondary syllabus)
  const defaultSubjects = [
    { code: 'ENG-10', name: 'Compulsory English', fullMarks: 100, passMarks: 35, thFull: 75, prFull: 25 },
    { code: 'NEP-10', name: 'Nepali', fullMarks: 100, passMarks: 35, thFull: 75, prFull: 25 },
    { code: 'MTH-10', name: 'Compulsory Mathematics', fullMarks: 100, passMarks: 35, thFull: 75, prFull: 25 },
    { code: 'SCI-10', name: 'Science & Technology', fullMarks: 100, passMarks: 35, thFull: 75, prFull: 25 },
    { code: 'SOC-10', name: 'Social Studies & Life Skills', fullMarks: 100, passMarks: 35, thFull: 75, prFull: 25 },
    { code: 'COM-10', name: 'Computer Science (Opt)', fullMarks: 100, passMarks: 35, thFull: 50, prFull: 50 }
  ];

  // Mark entry form state
  const [entryForm, setEntryForm] = useState({
    studentId: '',
    subjects: defaultSubjects.map(s => ({
      code: s.code,
      name: s.name,
      fullMarks: s.fullMarks,
      passMarks: s.passMarks,
      obtainedTheory: 60,
      obtainedPractical: 22
    })),
    remarks: 'Consistent academic dedication and good conduct.'
  });

  // Students in selected grade
  const gradeStudents = students.filter(
    s => s.grade === selectedGrade && s.section === selectedSection
  );

  const handleOpenMarksEntry = (student) => {
    // Check if marks already exist
    const existing = marks.find(m => m.studentId === student.id && m.examId === selectedExamId);
    if (existing) {
      setEditingStudentMark(existing);
      setEntryForm({
        studentId: student.id,
        subjects: existing.subjects,
        remarks: existing.remarks || 'Very good performance.'
      });
    } else {
      setEditingStudentMark(null);
      setEntryForm({
        studentId: student.id,
        subjects: defaultSubjects.map(s => ({
          code: s.code,
          name: s.name,
          fullMarks: s.fullMarks,
          passMarks: s.passMarks,
          obtainedTheory: 62,
          obtainedPractical: 22
        })),
        remarks: 'Satisfactory performance. Keep working hard.'
      });
    }
    setIsEntryModalOpen(true);
  };

  const handleTheoryChange = (index, val) => {
    const num = Math.min(75, Math.max(0, Number(val) || 0));
    setEntryForm(prev => {
      const updated = [...prev.subjects];
      updated[index] = { ...updated[index], obtainedTheory: num };
      return { ...prev, subjects: updated };
    });
  };

  const handlePracticalChange = (index, val) => {
    const num = Math.min(25, Math.max(0, Number(val) || 0));
    setEntryForm(prev => {
      const updated = [...prev.subjects];
      updated[index] = { ...updated[index], obtainedPractical: num };
      return { ...prev, subjects: updated };
    });
  };

  const handleSaveMarks = (e) => {
    e.preventDefault();
    const student = students.find(s => s.id === entryForm.studentId);
    if (!student) return;

    // Calculate grades and GPA
    let totalMarks = 0;
    let totalGradePoints = 0;
    const computedSubjects = entryForm.subjects.map(sub => {
      const tot = (Number(sub.obtainedTheory) || 0) + (Number(sub.obtainedPractical) || 0);
      totalMarks += tot;
      const pct = (tot / sub.fullMarks) * 100;
      const { grade, gp } = calculateNepaliGrade(pct);
      totalGradePoints += gp;
      return {
        ...sub,
        total: tot,
        grade,
        gp
      };
    });

    const averagePct = totalMarks / computedSubjects.length;
    const gpa = Number((totalGradePoints / computedSubjects.length).toFixed(2));
    const overallGrade = calculateNepaliGrade(averagePct).grade;

    const payload = {
      id: editingStudentMark ? editingStudentMark.id : `mk-${Date.now()}`,
      examId: selectedExamId,
      studentId: student.id,
      studentName: student.fullName,
      grade: student.grade,
      section: student.section,
      rollNo: student.rollNo,
      subjects: computedSubjects,
      totalMarks,
      percentage: Number(averagePct.toFixed(1)),
      gpa,
      finalGrade: overallGrade,
      remarks: entryForm.remarks
    };

    onSaveMarks(payload);
    setIsEntryModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl flex items-center gap-2">
            <Award className="h-6 w-6 text-amber-500" />
            Examinations & Terminal Marksheets
          </h2>
          <p className="text-xs text-slate-500">
            Record subject-wise marks, calculate CDC/NEB Grade & GPA, and print terminal progress report cards.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedExamId}
            onChange={e => setSelectedExamId(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-800 shadow-xs focus:border-indigo-500 focus:outline-none"
          >
            {exams.map(e => (
              <option key={e.id} value={e.id}>{e.title}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Grade Selector & Filters */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">Class</label>
            <select
              value={selectedGrade}
              onChange={e => setSelectedGrade(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold focus:border-indigo-500 focus:bg-white focus:outline-none"
            >
              {['Class 10', 'Class 9', 'Class 8', 'Class 7', 'Class 6', 'Class 5'].map(g => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">Section</label>
            <select
              value={selectedSection}
              onChange={e => setSelectedSection(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold focus:border-indigo-500 focus:bg-white focus:outline-none"
            >
              <option value="A">Section A</option>
              <option value="B">Section B</option>
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">Search Student</label>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search by student name..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 py-2 text-xs focus:border-indigo-500 focus:bg-white focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Marks Summary Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/75 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3 px-4">Roll</th>
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-4">Class</th>
                <th className="py-3 px-4">Total Marks</th>
                <th className="py-3 px-4">GPA (4.0)</th>
                <th className="py-3 px-4">Final Grade</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {gradeStudents.map(student => {
                const markRecord = marks.find(m => m.studentId === student.id && m.examId === selectedExamId);
                return (
                  <tr key={student.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-700">#{student.rollNo}</td>
                    <td className="py-3 px-4 font-bold text-slate-900">{student.fullName}</td>
                    <td className="py-3 px-4 text-slate-600">{student.grade} - {student.section}</td>
                    <td className="py-3 px-4">
                      {markRecord ? (
                        <span className="font-semibold text-slate-800">{markRecord.totalMarks} / 600 ({markRecord.percentage}%)</span>
                      ) : (
                        <span className="text-slate-400 italic">Not entered yet</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {markRecord ? (
                        <span className="font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                          {markRecord.gpa}
                        </span>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {markRecord ? (
                        <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-bold ${
                          markRecord.finalGrade === 'A+' ? 'bg-emerald-100 text-emerald-800' :
                          markRecord.finalGrade === 'A' ? 'bg-indigo-100 text-indigo-800' :
                          markRecord.finalGrade === 'B+' ? 'bg-sky-100 text-sky-800' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          Grade {markRecord.finalGrade}
                        </span>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenMarksEntry(student)}
                          className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                          <Edit3 className="h-3.5 w-3.5 text-slate-500" />
                          {markRecord ? 'Edit Marks' : 'Enter Marks'}
                        </button>

                        {markRecord && (
                          <button
                            onClick={() => setActiveReportStudent({ student, markRecord })}
                            className="flex items-center gap-1 rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-bold text-indigo-700 hover:bg-indigo-100 transition-colors"
                          >
                            <FileText className="h-3.5 w-3.5" />
                            Report Card
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Marks Entry Modal */}
      {isEntryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-slate-50/75">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Enter Examination Marks
                </h3>
                <p className="text-xs text-slate-500">
                  {selectedExam.title} • {students.find(s => s.id === entryForm.studentId)?.fullName} (Roll #{students.find(s => s.id === entryForm.studentId)?.rollNo})
                </p>
              </div>
              <button onClick={() => setIsEntryModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMarks} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-200 text-[10px] font-bold uppercase text-slate-500">
                      <th className="py-2">Subject</th>
                      <th className="py-2 w-24">Theory (75)</th>
                      <th className="py-2 w-24">Practical (25)</th>
                      <th className="py-2 w-20 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {entryForm.subjects.map((sub, idx) => {
                      const tot = (Number(sub.obtainedTheory) || 0) + (Number(sub.obtainedPractical) || 0);
                      return (
                        <tr key={sub.code}>
                          <td className="py-2.5 font-semibold text-slate-800">{sub.name}</td>
                          <td className="py-2.5">
                            <input
                              type="number"
                              min={0}
                              max={75}
                              required
                              value={sub.obtainedTheory}
                              onChange={e => handleTheoryChange(idx, e.target.value)}
                              className="w-20 rounded-lg border border-slate-300 px-2 py-1 text-xs focus:border-indigo-500 focus:outline-none"
                            />
                          </td>
                          <td className="py-2.5">
                            <input
                              type="number"
                              min={0}
                              max={25}
                              required
                              value={sub.obtainedPractical}
                              onChange={e => handlePracticalChange(idx, e.target.value)}
                              className="w-20 rounded-lg border border-slate-300 px-2 py-1 text-xs focus:border-indigo-500 focus:outline-none"
                            />
                          </td>
                          <td className="py-2.5 text-right font-bold text-slate-900">{tot} / 100</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Teacher's Remarks</label>
                <input
                  type="text"
                  value={entryForm.remarks}
                  onChange={e => setEntryForm({ ...entryForm, remarks: e.target.value })}
                  placeholder="e.g. Excellent conceptual clarity and discipline."
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEntryModalOpen(false)}
                  className="rounded-lg border border-slate-300 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-indigo-600 px-5 py-2 font-bold text-white hover:bg-indigo-700"
                >
                  Save & Compute GPA
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Official Printable Terminal Progress Report Card Modal */}
      {activeReportStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-3xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden my-6">
            {/* Action Bar (Not printed) */}
            <div className="no-print flex items-center justify-between border-b border-slate-200 bg-slate-100 px-6 py-3">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <FileText className="h-4 w-4 text-indigo-600" /> Printable Terminal Report Card Preview
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-indigo-700"
                >
                  <Printer className="h-3.5 w-3.5" /> Print Report Card
                </button>
                <button
                  onClick={() => setActiveReportStudent(null)}
                  className="rounded-lg p-1.5 text-slate-400 hover:text-slate-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Official Report Card Printable Area */}
            <div id="printable-area" className="p-8 font-sans bg-white text-slate-900">
              {/* School Header */}
              <div className="text-center border-b-2 border-indigo-900 pb-4">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-900 text-white font-black text-xl">
                    S
                  </div>
                  <div>
                    <h1 className="text-2xl font-black uppercase tracking-tight text-indigo-950 font-serif">
                      SAFE ENGLISH BOARDING SCHOOL
                    </h1>
                    <p className="text-xs font-semibold text-slate-600">
                      {schoolInfo?.address || 'Bhimsensthan-07, Kathmandu, Nepal'} • Tel: {schoolInfo?.phone || '+977-01-4245678'}
                    </p>
                  </div>
                </div>
                <p className="text-[11px] font-bold uppercase tracking-widest text-indigo-800 mt-1">
                  Affiliated to Government of Nepal • CDC / NEB Curriculum
                </p>
                <div className="mt-2 inline-block rounded-full bg-indigo-50 px-4 py-0.5 text-xs font-extrabold text-indigo-900 border border-indigo-200 uppercase">
                  Terminal Progress Report Card • {selectedExam.title} ({schoolInfo?.academicYear || '2081 B.S.'})
                </div>
              </div>

              {/* Student Info Grid */}
              <div className="my-4 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs border border-slate-300 p-3 rounded-lg bg-slate-50/50">
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-semibold">Student Name</span>
                  <strong className="text-slate-900">{activeReportStudent.student.fullName}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-semibold">Class & Section</span>
                  <strong className="text-slate-900">{activeReportStudent.student.grade} - {activeReportStudent.student.section}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-semibold">Roll No</span>
                  <strong className="text-slate-900">#{activeReportStudent.student.rollNo}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-semibold">Admission No</span>
                  <strong className="text-slate-900">{activeReportStudent.student.admissionNo}</strong>
                </div>
              </div>

              {/* Subject Scores Table */}
              <table className="w-full text-left text-xs border-collapse border border-slate-300 my-4">
                <thead>
                  <tr className="bg-slate-100 text-[10px] font-bold uppercase text-slate-700">
                    <th className="border border-slate-300 py-2 px-2.5">Subject Name</th>
                    <th className="border border-slate-300 py-2 px-2 text-center">Full Marks</th>
                    <th className="border border-slate-300 py-2 px-2 text-center">Pass Marks</th>
                    <th className="border border-slate-300 py-2 px-2 text-center">Theory</th>
                    <th className="border border-slate-300 py-2 px-2 text-center">Practical</th>
                    <th className="border border-slate-300 py-2 px-2 text-center">Total</th>
                    <th className="border border-slate-300 py-2 px-2 text-center">Grade</th>
                    <th className="border border-slate-300 py-2 px-2 text-center">GP</th>
                  </tr>
                </thead>
                <tbody>
                  {activeReportStudent.markRecord.subjects.map((sub, i) => (
                    <tr key={i} className="hover:bg-slate-50">
                      <td className="border border-slate-300 py-1.5 px-2.5 font-semibold text-slate-800">{sub.name}</td>
                      <td className="border border-slate-300 py-1.5 px-2 text-center text-slate-600">{sub.fullMarks}</td>
                      <td className="border border-slate-300 py-1.5 px-2 text-center text-slate-600">{sub.passMarks}</td>
                      <td className="border border-slate-300 py-1.5 px-2 text-center font-mono">{sub.obtainedTheory}</td>
                      <td className="border border-slate-300 py-1.5 px-2 text-center font-mono">{sub.obtainedPractical}</td>
                      <td className="border border-slate-300 py-1.5 px-2 text-center font-bold text-slate-900">{sub.total}</td>
                      <td className="border border-slate-300 py-1.5 px-2 text-center font-bold text-indigo-700">{sub.grade}</td>
                      <td className="border border-slate-300 py-1.5 px-2 text-center font-bold text-slate-800">{sub.gp}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Cumulative Result Box */}
              <div className="grid grid-cols-3 gap-3 p-3 bg-indigo-50/70 border border-indigo-200 rounded-lg text-center my-4">
                <div>
                  <span className="text-[10px] uppercase font-bold text-indigo-900 block">Total Marks</span>
                  <span className="text-base font-black text-indigo-950">
                    {activeReportStudent.markRecord.totalMarks} / 600 ({activeReportStudent.markRecord.percentage}%)
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-indigo-900 block">Grade Point Average (GPA)</span>
                  <span className="text-xl font-black text-indigo-600">
                    {activeReportStudent.markRecord.gpa}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-indigo-900 block">Final Overall Grade</span>
                  <span className="text-xl font-black text-emerald-700">
                    Grade {activeReportStudent.markRecord.finalGrade}
                  </span>
                </div>
              </div>

              {/* Teacher Remarks */}
              <div className="border border-slate-200 p-3 rounded-lg text-xs my-3 bg-slate-50">
                <span className="font-bold text-slate-700 mr-2">Teacher Remarks:</span>
                <span className="text-slate-600 italic">"{activeReportStudent.markRecord.remarks}"</span>
              </div>

              {/* Signatures */}
              <div className="mt-12 grid grid-cols-3 gap-6 text-center text-xs pt-4">
                <div className="border-t border-slate-400 pt-1 font-semibold text-slate-700">
                  Class Teacher
                </div>
                <div className="border-t border-slate-400 pt-1 font-semibold text-slate-700">
                  Exam Controller
                </div>
                <div className="border-t border-slate-400 pt-1 font-bold text-indigo-950">
                  Principal / Headmaster
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
