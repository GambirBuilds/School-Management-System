import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Download,
  Printer,
  Filter,
  Users,
  Receipt,
  Award,
  UserCheck,
  Calendar,
  CheckCircle2
} from 'lucide-react';

export default function ReportsView({ students, staff, feePayments, marks, transactions, schoolInfo }) {
  const [reportType, setReportType] = useState('fees'); // 'fees', 'students', 'exams', 'staff'

  const downloadCSV = (filename, headers, rows) => {
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${filename}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExport = () => {
    if (reportType === 'fees') {
      const headers = ['Receipt No', 'Student Name', 'Class', 'Amount (NPR)', 'Payment Method', 'Month', 'Date', 'Collected By'];
      const rows = feePayments.map(p => [
        p.receiptNo,
        `"${p.studentName}"`,
        `"${p.grade}-${p.section}"`,
        p.amount,
        p.paymentMethod,
        `"${p.month}"`,
        p.date,
        `"${p.collectedBy}"`
      ]);
      downloadCSV('Safe_English_School_Fee_Report', headers, rows);
    } else if (reportType === 'students') {
      const headers = ['Admission No', 'Full Name', 'Grade', 'Section', 'Roll No', 'Guardian', 'Contact', 'Dues (NPR)', 'Status'];
      const rows = students.map(s => [
        s.admissionNo,
        `"${s.fullName}"`,
        s.grade,
        s.section,
        s.rollNo,
        `"${s.guardianName || ''}"`,
        `"${s.guardianPhone || ''}"`,
        s.feesDue,
        s.status
      ]);
      downloadCSV('Safe_English_School_Student_Enrollment_Report', headers, rows);
    } else if (reportType === 'exams') {
      const headers = ['Student Name', 'Class', 'Roll No', 'Total Marks (600)', 'Percentage', 'GPA (4.0)', 'Grade', 'Remarks'];
      const rows = marks.map(m => [
        `"${m.studentName}"`,
        `"${m.grade}-${m.section}"`,
        m.rollNo,
        m.totalMarks,
        m.percentage,
        m.gpa,
        m.finalGrade,
        `"${m.remarks}"`
      ]);
      downloadCSV('Safe_English_School_Exam_Results_Report', headers, rows);
    } else if (reportType === 'staff') {
      const headers = ['Employee ID', 'Name', 'Designation', 'Department', 'Phone', 'Email', 'Status'];
      const rows = staff.map(m => [
        m.employeeId,
        `"${m.fullName}"`,
        `"${m.designation}"`,
        `"${m.department}"`,
        `"${m.phone}"`,
        `"${m.email}"`,
        m.status
      ]);
      downloadCSV('Safe_English_School_Staff_Report', headers, rows);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl flex items-center gap-2">
            <FileSpreadsheet className="h-6 w-6 text-indigo-600" />
            Institutional Reports & Analytics
          </h2>
          <p className="text-xs text-slate-500">
            Generate and export consolidated audit records, fee ledgers, exam standings, and faculty rosters.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-indigo-200 hover:bg-indigo-700 transition-colors"
          >
            <Download className="h-4 w-4" />
            Export to CSV
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 transition-colors"
          >
            <Printer className="h-4 w-4 text-slate-500" />
            Print Report
          </button>
        </div>
      </div>

      {/* Report Categories */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { id: 'fees', label: 'Fee Collection Audit', icon: Receipt, count: feePayments.length + ' receipts' },
          { id: 'students', label: 'Student Directory & Dues', icon: Users, count: students.length + ' students' },
          { id: 'exams', label: 'Terminal Academic Results', icon: Award, count: marks.length + ' marksheets' },
          { id: 'staff', label: 'Staff & Faculty Roster', icon: UserCheck, count: staff.length + ' members' }
        ].map(item => {
          const Icon = item.icon;
          const isSelected = reportType === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setReportType(item.id)}
              className={`rounded-2xl border p-4 text-left transition-all ${
                isSelected
                  ? 'border-indigo-600 bg-indigo-50/70 ring-2 ring-indigo-500/20 shadow-xs'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <Icon className={`h-5 w-5 mb-2 ${isSelected ? 'text-indigo-600' : 'text-slate-500'}`} />
              <div className="text-xs font-bold text-slate-900">{item.label}</div>
              <div className="text-[11px] text-slate-400 mt-0.5">{item.count}</div>
            </button>
          );
        })}
      </div>

      {/* Render selected report table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
        <div className="border-b border-slate-200 px-5 py-3 bg-slate-50/75 flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            {reportType === 'fees' && 'Consolidated Fee Collection Register (NPR)'}
            {reportType === 'students' && 'Enrolled Students & Fee Balance Ledger'}
            {reportType === 'exams' && 'Terminal Examination Results & CDC GPA Standing'}
            {reportType === 'staff' && 'Faculty & Administrative Employee Registry'}
          </h3>
          <span className="text-[11px] text-slate-500">Session {schoolInfo?.academicYear || '2081 B.S.'}</span>
        </div>

        <div className="overflow-x-auto">
          {reportType === 'fees' && (
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/50 text-[10px] font-bold uppercase text-slate-500">
                  <th className="py-2.5 px-4">Receipt No</th>
                  <th className="py-2.5 px-4">Student</th>
                  <th className="py-2.5 px-4">Class</th>
                  <th className="py-2.5 px-4">Particulars</th>
                  <th className="py-2.5 px-4">Amount</th>
                  <th className="py-2.5 px-4">Mode</th>
                  <th className="py-2.5 px-4">Date</th>
                  <th className="py-2.5 px-4">Audited By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {feePayments.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-4 font-mono font-bold text-indigo-600">{p.receiptNo}</td>
                    <td className="py-2.5 px-4 font-bold text-slate-800">{p.studentName}</td>
                    <td className="py-2.5 px-4 text-slate-600">{p.grade} - {p.section}</td>
                    <td className="py-2.5 px-4 text-slate-600">{p.month}</td>
                    <td className="py-2.5 px-4 font-black text-slate-900">रु {p.amount.toLocaleString()}</td>
                    <td className="py-2.5 px-4 font-semibold text-slate-700">{p.paymentMethod}</td>
                    <td className="py-2.5 px-4 text-slate-500">{p.date}</td>
                    <td className="py-2.5 px-4 text-slate-500">{p.collectedBy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {reportType === 'students' && (
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/50 text-[10px] font-bold uppercase text-slate-500">
                  <th className="py-2.5 px-4">Admission No</th>
                  <th className="py-2.5 px-4">Student Name</th>
                  <th className="py-2.5 px-4">Class & Roll</th>
                  <th className="py-2.5 px-4">Gender</th>
                  <th className="py-2.5 px-4">Guardian Contact</th>
                  <th className="py-2.5 px-4">Outstanding Dues</th>
                  <th className="py-2.5 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.map(s => (
                  <tr key={s.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-4 font-mono font-bold text-slate-700">{s.admissionNo}</td>
                    <td className="py-2.5 px-4 font-bold text-slate-900">{s.fullName}</td>
                    <td className="py-2.5 px-4 text-slate-600">{s.grade} - {s.section} (#{s.rollNo})</td>
                    <td className="py-2.5 px-4 text-slate-600">{s.gender}</td>
                    <td className="py-2.5 px-4 text-slate-600">{s.guardianPhone || 'N/A'}</td>
                    <td className="py-2.5 px-4 font-bold text-rose-600">
                      {Number(s.feesDue) > 0 ? `रु ${Number(s.feesDue).toLocaleString()}` : 'Cleared'}
                    </td>
                    <td className="py-2.5 px-4">
                      <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                        {s.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {reportType === 'exams' && (
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/50 text-[10px] font-bold uppercase text-slate-500">
                  <th className="py-2.5 px-4">Student Name</th>
                  <th className="py-2.5 px-4">Class & Roll</th>
                  <th className="py-2.5 px-4">Total Marks (600)</th>
                  <th className="py-2.5 px-4">Percentage</th>
                  <th className="py-2.5 px-4">GPA (4.0)</th>
                  <th className="py-2.5 px-4">Letter Grade</th>
                  <th className="py-2.5 px-4">Evaluator Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {marks.map(m => (
                  <tr key={m.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-4 font-bold text-slate-900">{m.studentName}</td>
                    <td className="py-2.5 px-4 text-slate-600">{m.grade} - {m.section} (#{m.rollNo})</td>
                    <td className="py-2.5 px-4 font-bold text-slate-800">{m.totalMarks}</td>
                    <td className="py-2.5 px-4 text-slate-700">{m.percentage}%</td>
                    <td className="py-2.5 px-4 font-black text-indigo-600">{m.gpa}</td>
                    <td className="py-2.5 px-4 font-bold text-emerald-700">Grade {m.finalGrade}</td>
                    <td className="py-2.5 px-4 text-slate-500 italic max-w-xs truncate">{m.remarks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {reportType === 'staff' && (
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/50 text-[10px] font-bold uppercase text-slate-500">
                  <th className="py-2.5 px-4">Employee ID</th>
                  <th className="py-2.5 px-4">Full Name</th>
                  <th className="py-2.5 px-4">Designation</th>
                  <th className="py-2.5 px-4">Department</th>
                  <th className="py-2.5 px-4">Contact</th>
                  <th className="py-2.5 px-4">Email</th>
                  <th className="py-2.5 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {staff.map(st => (
                  <tr key={st.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-4 font-mono font-bold text-slate-700">{st.employeeId}</td>
                    <td className="py-2.5 px-4 font-bold text-slate-900">{st.fullName}</td>
                    <td className="py-2.5 px-4 font-semibold text-slate-700">{st.designation}</td>
                    <td className="py-2.5 px-4 text-slate-600">{st.department}</td>
                    <td className="py-2.5 px-4 text-slate-600">{st.phone}</td>
                    <td className="py-2.5 px-4 text-slate-500">{st.email}</td>
                    <td className="py-2.5 px-4">
                      <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                        {st.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
