import React, { useState, useEffect } from 'react';
import { Search, User, UserCheck, Receipt, GraduationCap, X, ArrowRight } from 'lucide-react';

export default function SearchModal({ isOpen, onClose, students, staff, feePayments, onSelectStudent, onNavigate }) {
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose(false); // toggle
      }
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const query = searchTerm.toLowerCase().trim();

  const filteredStudents = query ? students.filter(s =>
    s.fullName.toLowerCase().includes(query) ||
    s.admissionNo.toLowerCase().includes(query) ||
    s.grade.toLowerCase().includes(query)
  ).slice(0, 5) : [];

  const filteredStaff = query ? staff.filter(s =>
    s.fullName.toLowerCase().includes(query) ||
    s.designation.toLowerCase().includes(query) ||
    s.employeeId.toLowerCase().includes(query)
  ).slice(0, 4) : [];

  const filteredReceipts = query ? feePayments.filter(p =>
    p.receiptNo.toLowerCase().includes(query) ||
    p.studentName.toLowerCase().includes(query)
  ).slice(0, 4) : [];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-slate-900/50 p-4 pt-20 backdrop-blur-xs">
      <div className="w-full max-w-xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center border-b border-slate-200 px-4 py-3">
          <Search className="h-5 w-5 text-indigo-500 mr-3" />
          <input
            type="text"
            autoFocus
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search students by name, admission no, teachers, or receipts..."
            className="flex-1 text-sm bg-transparent outline-none placeholder:text-slate-400 text-slate-800"
          />
          <button onClick={onClose} className="rounded-md p-1 text-slate-400 hover:text-slate-600">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="max-h-96 overflow-y-auto p-4 space-y-4">
          {!query && (
            <div className="text-center py-6 text-slate-400 text-xs">
              Type to search Safe English Boarding School records across students, staff, and payments.
            </div>
          )}

          {query && (
            <>
              {filteredStudents.length > 0 && (
                <div>
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5 text-indigo-500" /> Students
                  </h4>
                  <div className="space-y-1">
                    {filteredStudents.map(student => (
                      <button
                        key={student.id}
                        onClick={() => {
                          onSelectStudent(student);
                          onClose();
                        }}
                        className="flex w-full items-center justify-between rounded-lg p-2 hover:bg-indigo-50 text-left transition-colors"
                      >
                        <div>
                          <div className="text-xs font-semibold text-slate-900">{student.fullName}</div>
                          <div className="text-[11px] text-slate-500">
                            {student.grade} - {student.section} • Adm: {student.admissionNo} • Roll: {student.rollNo}
                          </div>
                        </div>
                        <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {filteredStaff.length > 0 && (
                <div>
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                    <UserCheck className="h-3.5 w-3.5 text-emerald-500" /> Faculty & Staff
                  </h4>
                  <div className="space-y-1">
                    {filteredStaff.map(member => (
                      <button
                        key={member.id}
                        onClick={() => {
                          onNavigate('staff');
                          onClose();
                        }}
                        className="flex w-full items-center justify-between rounded-lg p-2 hover:bg-emerald-50 text-left transition-colors"
                      >
                        <div>
                          <div className="text-xs font-semibold text-slate-900">{member.fullName}</div>
                          <div className="text-[11px] text-slate-500">{member.designation} • {member.department}</div>
                        </div>
                        <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {filteredReceipts.length > 0 && (
                <div>
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                    <Receipt className="h-3.5 w-3.5 text-amber-500" /> Fee Receipts
                  </h4>
                  <div className="space-y-1">
                    {filteredReceipts.map(rec => (
                      <button
                        key={rec.id}
                        onClick={() => {
                          onNavigate('fees');
                          onClose();
                        }}
                        className="flex w-full items-center justify-between rounded-lg p-2 hover:bg-amber-50 text-left transition-colors"
                      >
                        <div>
                          <div className="text-xs font-semibold text-slate-900">{rec.receiptNo} - {rec.studentName}</div>
                          <div className="text-[11px] text-slate-500">Paid: NPR {rec.amount.toLocaleString()} ({rec.paymentMethod})</div>
                        </div>
                        <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {filteredStudents.length === 0 && filteredStaff.length === 0 && filteredReceipts.length === 0 && (
                <div className="text-center py-6 text-slate-400 text-xs">
                  No records found matching "{searchTerm}".
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
