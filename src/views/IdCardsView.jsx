import React, { useState } from 'react';
import {
  IdCard,
  Printer,
  School,
  User,
  Award,
  Phone,
  Calendar,
  FileCheck,
  CheckCircle,
  X
} from 'lucide-react';

export default function IdCardsView({ students, staff, schoolInfo }) {
  const [cardType, setCardType] = useState('student'); // 'student' or 'staff' or 'certificate'
  const [selectedStudentId, setSelectedStudentId] = useState(students[0]?.id || '');
  const [selectedStaffId, setSelectedStaffId] = useState(staff[0]?.id || '');

  const student = students.find(s => s.id === selectedStudentId) || students[0];
  const staffMember = staff.find(s => s.id === selectedStaffId) || staff[0];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl flex items-center gap-2">
            <IdCard className="h-6 w-6 text-indigo-600" />
            ID Cards & School Certificates
          </h2>
          <p className="text-xs text-slate-500">
            Generate and print official Student ID cards, Faculty identification, and Character Certificates.
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-indigo-200 hover:bg-indigo-700 transition-colors"
        >
          <Printer className="h-4 w-4" />
          Print Document
        </button>
      </div>

      {/* Type Switcher */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setCardType('student')}
          className={`rounded-xl px-4 py-2 text-xs font-bold transition-colors ${
            cardType === 'student' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Student ID Card
        </button>
        <button
          onClick={() => setCardType('staff')}
          className={`rounded-xl px-4 py-2 text-xs font-bold transition-colors ${
            cardType === 'staff' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Staff & Faculty ID Card
        </button>
        <button
          onClick={() => setCardType('certificate')}
          className={`rounded-xl px-4 py-2 text-xs font-bold transition-colors ${
            cardType === 'certificate' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Character Certificate (TC)
        </button>
      </div>

      {/* Select Person */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
        <div className="max-w-md">
          {cardType === 'staff' ? (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Select Staff Member</label>
              <select
                value={selectedStaffId}
                onChange={e => setSelectedStaffId(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold focus:border-indigo-500 focus:outline-none"
              >
                {staff.map(m => (
                  <option key={m.id} value={m.id}>{m.fullName} - {m.designation} ({m.employeeId})</option>
                ))}
              </select>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Select Student</label>
              <select
                value={selectedStudentId}
                onChange={e => setSelectedStudentId(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold focus:border-indigo-500 focus:outline-none"
              >
                {students.map(s => (
                  <option key={s.id} value={s.id}>{s.fullName} ({s.grade}-{s.section}) • Adm: {s.admissionNo}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Preview Card Area */}
      <div className="flex justify-center p-6 bg-slate-100/70 rounded-2xl border border-slate-200">
        <div id="printable-area" className="w-full max-w-md">
          {/* STUDENT ID CARD */}
          {cardType === 'student' && student && (
            <div className="w-[340px] mx-auto rounded-2xl bg-white shadow-xl border-2 border-indigo-900 overflow-hidden text-slate-900 font-sans">
              {/* ID Header */}
              <div className="bg-gradient-to-r from-indigo-950 via-indigo-900 to-indigo-950 p-4 text-center text-white border-b-2 border-amber-400">
                <div className="flex items-center justify-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-white/10 flex items-center justify-center font-black text-amber-300">
                    S
                  </div>
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-tight font-serif leading-tight">
                      SAFE ENGLISH BOARDING SCHOOL
                    </h3>
                    <p className="text-[9px] text-slate-300 font-medium">Bhimsensthan, Kathmandu, Nepal</p>
                  </div>
                </div>
                <div className="mt-1.5 inline-block bg-amber-400 px-3 py-0.5 rounded-full text-[9px] font-black tracking-wider uppercase text-slate-950">
                  STUDENT IDENTITY CARD
                </div>
              </div>

              {/* ID Body */}
              <div className="p-4 text-center">
                <div className="relative mx-auto h-24 w-24 rounded-xl border-2 border-indigo-900 overflow-hidden shadow-sm">
                  <img
                    src={student.photoUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'}
                    alt={student.fullName}
                    className="h-full w-full object-cover"
                  />
                </div>

                <h4 className="mt-2 text-sm font-black text-slate-900">{student.fullName}</h4>
                <p className="text-[11px] font-bold text-indigo-700">{student.grade} - {student.section}</p>

                <div className="mt-3 text-left space-y-1 text-[11px] bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Roll Number:</span>
                    <strong className="text-slate-800">#{student.rollNo}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Admission No:</span>
                    <strong className="font-mono text-slate-800">{student.admissionNo}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Blood Group:</span>
                    <strong className="text-rose-600 font-bold">{student.bloodGroup}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Emergency Contact:</span>
                    <strong className="text-slate-800">{student.guardianPhone}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Academic Session:</span>
                    <strong className="text-slate-800">{schoolInfo?.academicYear || '2081 B.S.'}</strong>
                  </div>
                </div>

                {/* Simulated Barcode */}
                <div className="mt-3 pt-2 border-t border-slate-200 flex flex-col items-center">
                  <div className="flex items-center gap-0.5 h-6">
                    {[1, 2, 1, 3, 1, 2, 4, 1, 3, 2, 1, 2, 3, 1, 4, 2, 1, 2].map((w, i) => (
                      <span key={i} className={`bg-slate-900 h-full rounded-xs`} style={{ width: `${w * 2}px` }} />
                    ))}
                  </div>
                  <span className="text-[9px] font-mono text-slate-500 mt-1">{student.admissionNo}</span>
                </div>

                {/* Signature */}
                <div className="mt-3 flex justify-between items-end text-[9px] text-slate-500 pt-2 border-t border-slate-100">
                  <span>Student Sign</span>
                  <div className="text-center font-bold text-slate-800">
                    <div className="h-4" />
                    Principal Signature
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STAFF ID CARD */}
          {cardType === 'staff' && staffMember && (
            <div className="w-[340px] mx-auto rounded-2xl bg-white shadow-xl border-2 border-sky-900 overflow-hidden text-slate-900 font-sans">
              <div className="bg-gradient-to-r from-sky-950 via-sky-900 to-sky-950 p-4 text-center text-white border-b-2 border-amber-400">
                <h3 className="text-xs font-black uppercase tracking-tight font-serif">
                  SAFE ENGLISH BOARDING SCHOOL
                </h3>
                <p className="text-[9px] text-slate-300">Kathmandu, Nepal</p>
                <div className="mt-1.5 inline-block bg-amber-400 px-3 py-0.5 rounded-full text-[9px] font-black tracking-wider uppercase text-slate-950">
                  FACULTY & STAFF IDENTITY
                </div>
              </div>

              <div className="p-4 text-center">
                <div className="mx-auto h-24 w-24 rounded-xl border-2 border-sky-900 bg-sky-100 flex items-center justify-center font-bold text-2xl text-sky-800 shadow-sm">
                  {staffMember.fullName.charAt(0)}
                </div>

                <h4 className="mt-2 text-sm font-black text-slate-900">{staffMember.fullName}</h4>
                <p className="text-[11px] font-bold text-sky-700">{staffMember.designation}</p>

                <div className="mt-3 text-left space-y-1 text-[11px] bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Employee ID:</span>
                    <strong className="font-mono text-slate-800">{staffMember.employeeId}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Department:</span>
                    <strong className="text-slate-800">{staffMember.department}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Contact:</span>
                    <strong className="text-slate-800">{staffMember.phone}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Status:</span>
                    <strong className="text-emerald-700 font-bold">{staffMember.status}</strong>
                  </div>
                </div>

                <div className="mt-6 flex justify-between items-end text-[9px] text-slate-500 pt-2 border-t border-slate-200">
                  <span>Card Holder Sign</span>
                  <div className="text-center font-bold text-slate-800">
                    Head of Institution
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* CHARACTER CERTIFICATE (TC) */}
          {cardType === 'certificate' && student && (
            <div className="w-full max-w-xl mx-auto rounded-2xl bg-white p-8 shadow-xl border-4 border-double border-indigo-950 text-slate-900 font-serif">
              <div className="text-center border-b-2 border-slate-800 pb-3">
                <h2 className="text-xl font-black uppercase text-indigo-950">
                  SAFE ENGLISH BOARDING SCHOOL
                </h2>
                <p className="text-xs text-slate-600 font-sans">
                  Bhimsensthan, Kathmandu, Bagmati Province, Nepal • Established 2054 B.S.
                </p>
                <div className="mt-3 inline-block border-2 border-slate-800 px-4 py-1 text-xs font-black tracking-widest uppercase text-slate-900">
                  CHARACTER & TRANSFER CERTIFICATE
                </div>
              </div>

              <div className="my-6 space-y-4 text-xs font-sans leading-relaxed text-slate-800 text-justify">
                <p>
                  This is to certify that <strong>{student.fullName}</strong>, son/daughter of <strong>{student.guardianName || 'Guardian'}</strong>,
                  resident of <strong>{student.address}</strong>, was a bonafide student of this institution studying in <strong>{student.grade} - Section {student.section}</strong> (Admission No: <strong>{student.admissionNo}</strong>).
                </p>
                <p>
                  According to school records, their date of birth is <strong>{student.dob} B.S.</strong> During their stay at Safe English Boarding School, their moral conduct, academic application, and disciplinary character have been found to be <strong className="text-indigo-950">EXCELLENT & EXEMPLARY</strong>.
                </p>
                <p>
                  All institutional dues up to the current term have been satisfactorily cleared. We wish them success in all future academic pursuits.
                </p>
              </div>

              <div className="mt-12 flex justify-between text-xs font-sans pt-6 border-t border-slate-300">
                <div className="text-center">
                  <div className="text-slate-500 font-medium">{new Date().toISOString().slice(0, 10)}</div>
                  <div className="font-semibold text-slate-700 mt-1">Date of Issue</div>
                </div>
                <div className="text-center">
                  <div className="h-6" />
                  <div className="font-bold text-slate-900 border-t border-slate-700 pt-1">
                    Principal / School Head
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
