import React from "react";
import {
  Users,
  UserCheck,
  CalendarCheck,
  Receipt,
  Wallet,
  TrendingUp,
  AlertCircle,
  Clock,
  ArrowUpRight,
  PlusCircle,
  FileText,
  Megaphone,
  Award,
  ChevronRight,
  BookOpen,
  Calendar,
  Sparkles,
  CheckCircle,
  DollarSign,
} from "lucide-react";
import { useAuth, ROLES } from "../context/AuthContext.jsx";

export default function DashboardView({
  students,
  staff,
  notices,
  feePayments,
  transactions,
  exams,
  homework,
  schoolInfo,
  onNavigate,
  onOpenQuickAdmission,
  onOpenQuickFee,
}) {
  const { currentUser } = useAuth();

  // Metrics
  const totalStudentsCount = students.length;
  const activeStudents = students.filter((s) => s.status === "Active").length;
  const maleStudents = students.filter((s) => s.gender === "Male").length;
  const femaleStudents = students.filter((s) => s.gender === "Female").length;
  const totalStaffCount = staff.length;
  const totalDues = students.reduce(
    (acc, curr) => acc + (Number(curr.feesDue) || 0),
    0,
  );
  const totalCollectedThisMonth = feePayments.reduce(
    (acc, curr) => acc + (Number(curr.amount) || 0),
    0,
  );

  // Student/Parent personalized stats if logged in as Student or Parent
  const studentProfile =
    students.find(
      (s) => s.id === (currentUser?.studentId || currentUser?.wardId),
    ) || students[0];

  return (
    <div className="space-y-6">
      {/* Institution Banner / Welcome Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 text-white shadow-xl">
        <div className="relative z-10 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/20 px-3 py-1 text-xs font-semibold text-indigo-300 ring-1 ring-indigo-400/30">
              <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
              <span>
                {schoolInfo?.motto || "Excellence in Education & Character"}
              </span>
            </div>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Welcome back, {currentUser?.name}!
            </h2>
            <p className="mt-1 text-xs text-slate-300 max-w-2xl leading-relaxed">
              School Management System • Academic Session{" "}
              <strong>{schoolInfo?.academicYear || "2081 B.S."}</strong>. All
              administrative, examination, and fee records are synchronized in
              real-time.
            </p>
          </div>

          {/* Quick Action Buttons on Banner */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={onOpenQuickFee}
              className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-emerald-950/40 hover:bg-emerald-500 transition-all active:scale-95"
            >
              <Receipt className="h-4 w-4" />
              Collect Fee
            </button>
            <button
              onClick={onOpenQuickAdmission}
              className="flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-slate-900 shadow-lg shadow-black/20 hover:bg-slate-100 transition-all active:scale-95"
            >
              <PlusCircle className="h-4 w-4 text-indigo-600" />
              New Admission
            </button>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-indigo-600/20 blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 h-64 w-64 rounded-full bg-sky-500/10 blur-3xl pointer-events-none" />
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Students */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Total Students
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900">
              {totalStudentsCount}
            </span>
            <span className="text-xs font-medium text-emerald-600 flex items-center">
              <TrendingUp className="h-3 w-3 mr-0.5" /> 100% Active
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-100 pt-2">
            <span>
              Boys: <strong className="text-slate-700">{maleStudents}</strong>
            </span>
            <span>
              Girls:{" "}
              <strong className="text-slate-700">{femaleStudents}</strong>
            </span>
            <span
              className="text-indigo-600 font-semibold cursor-pointer"
              onClick={() => onNavigate("students")}
            >
              View all →
            </span>
          </div>
        </div>

        {/* Card 2: Faculty & Staff */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Teachers & Staff
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
              <UserCheck className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900">
              {totalStaffCount}
            </span>
            <span className="text-xs font-medium text-slate-500">
              Across 6 Depts
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-100 pt-2">
            <span>
              Principal:{" "}
              <strong className="text-slate-700">R.K. Adhikari</strong>
            </span>
            <span
              className="text-sky-600 font-semibold cursor-pointer"
              onClick={() => onNavigate("staff")}
            >
              Faculty list →
            </span>
          </div>
        </div>

        {/* Card 3: Today's Attendance */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Today's Attendance
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <CalendarCheck className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-emerald-600">
              96.8%
            </span>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
              Optimal
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-100 pt-2">
            <span>
              Class 10: <strong className="text-slate-700">100% Present</strong>
            </span>
            <span
              className="text-emerald-600 font-semibold cursor-pointer"
              onClick={() => onNavigate("attendance")}
            >
              Take roll →
            </span>
          </div>
        </div>

        {/* Card 4: Fee Collections & Dues */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Fee Collected (Term)
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <Receipt className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900">
              रु {totalCollectedThisMonth.toLocaleString()}
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-100 pt-2">
            <span className="text-rose-600 font-medium">
              Pending: रु {totalDues.toLocaleString()}
            </span>
            <span
              className="text-amber-600 font-semibold cursor-pointer"
              onClick={() => onNavigate("fees")}
            >
              Ledger →
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Grid: Charts & Modules */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left 2 Columns: Financial & Attendance Visual Analytics */}
        <div className="space-y-6 lg:col-span-2">
          {/* Visual Chart 1: Monthly Fee Collection Trends */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Fee Revenue vs Target (2081 B.S.)
                </h3>
                <p className="text-xs text-slate-500">
                  Monthly billing collections in Nepalese Rupees (रु NPR)
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 text-[11px] text-slate-500">
                  <span className="h-2 w-2 rounded-full bg-indigo-600"></span>{" "}
                  Collected
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] text-slate-500">
                  <span className="h-2 w-2 rounded-full bg-slate-200"></span>{" "}
                  Expected Target
                </span>
              </div>
            </div>

            {/* Responsive SVG Bar Chart */}
            <div className="mt-4 pt-2">
              <div className="grid grid-cols-6 gap-2 sm:gap-4 items-end h-48 px-2 border-b border-slate-200 pb-2">
                {[
                  { month: "Baisakh", actual: 88, target: 100, val: "रु 2.8L" },
                  { month: "Jestha", actual: 94, target: 100, val: "रु 3.1L" },
                  { month: "Ashadh", actual: 92, target: 100, val: "रु 3.0L" },
                  { month: "Shrawan", actual: 96, target: 100, val: "रु 3.3L" },
                  { month: "Bhadra", actual: 89, target: 100, val: "रु 2.9L" },
                  { month: "Ashwin", actual: 98, target: 100, val: "रु 3.5L" },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex flex-col items-center gap-1 group relative"
                  >
                    {/* Tooltip on hover */}
                    <div className="absolute -top-8 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] py-0.5 px-2 rounded pointer-events-none whitespace-nowrap z-10">
                      {item.month}: {item.val}
                    </div>
                    <div className="w-full flex items-end justify-center gap-1 h-36">
                      <div
                        className="w-4 sm:w-7 bg-slate-200 rounded-t-md transition-all group-hover:bg-slate-300"
                        style={{ height: `${item.target}%` }}
                      />
                      <div
                        className="w-4 sm:w-7 bg-indigo-600 rounded-t-md transition-all group-hover:bg-indigo-700 shadow-xs"
                        style={{ height: `${item.actual}%` }}
                      />
                    </div>
                    <span className="text-[11px] font-semibold text-slate-600 truncate max-w-full">
                      {item.month}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex items-center justify-between text-xs text-slate-500 px-1">
                <span>
                  Average Collection Rate:{" "}
                  <strong className="text-emerald-600">92.8%</strong>
                </span>
                <span>
                  Fiscal Quarter:{" "}
                  <strong className="text-slate-800">Q2 (2081 B.S.)</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Recent Fee Payments Table */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Recent Fee Receipts
                </h3>
                <p className="text-xs text-slate-500">
                  Official money receipts recorded by accounts
                </p>
              </div>
              <button
                onClick={() => onNavigate("fees")}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
              >
                View all receipts →
              </button>
            </div>

            <div className="mt-3 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                    <th className="py-2.5 px-2">Receipt No</th>
                    <th className="py-2.5 px-2">Student Name</th>
                    <th className="py-2.5 px-2">Class</th>
                    <th className="py-2.5 px-2">Amount (NPR)</th>
                    <th className="py-2.5 px-2">Payment Method</th>
                    <th className="py-2.5 px-2">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {feePayments.slice(0, 4).map((pay) => (
                    <tr
                      key={pay.id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="py-2 px-2 font-mono font-medium text-indigo-600">
                        {pay.receiptNo}
                      </td>
                      <td className="py-2 px-2 font-semibold text-slate-800">
                        {pay.studentName}
                      </td>
                      <td className="py-2 px-2 text-slate-600">
                        {pay.grade} - {pay.section}
                      </td>
                      <td className="py-2 px-2 font-bold text-slate-900">
                        रु {pay.amount.toLocaleString()}
                      </td>
                      <td className="py-2 px-2">
                        <span
                          className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-semibold ${
                            pay.paymentMethod === "eSewa"
                              ? "bg-emerald-50 text-emerald-700"
                              : pay.paymentMethod === "Khalti"
                                ? "bg-purple-50 text-purple-700"
                                : pay.paymentMethod === "Bank Transfer"
                                  ? "bg-blue-50 text-blue-700"
                                  : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {pay.paymentMethod}
                        </span>
                      </td>
                      <td className="py-2 px-2 text-slate-500">{pay.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right 1 Column: Notice Circulars & Upcoming Exams */}
        <div className="space-y-6">
          {/* Quick Shortcuts Box */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-3">
              Quick Administrative Actions
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onNavigate("attendance")}
                className="flex flex-col items-center justify-center rounded-xl border border-slate-200 p-3 text-center hover:border-indigo-300 hover:bg-indigo-50/50 transition-all group"
              >
                <CalendarCheck className="h-5 w-5 text-indigo-600 group-hover:scale-110 transition-transform mb-1" />
                <span className="text-xs font-semibold text-slate-800">
                  Roll Call
                </span>
                <span className="text-[10px] text-slate-400">
                  Class Attendance
                </span>
              </button>
              <button
                onClick={() => onNavigate("exams")}
                className="flex flex-col items-center justify-center rounded-xl border border-slate-200 p-3 text-center hover:border-amber-300 hover:bg-amber-50/50 transition-all group"
              >
                <Award className="h-5 w-5 text-amber-600 group-hover:scale-110 transition-transform mb-1" />
                <span className="text-xs font-semibold text-slate-800">
                  Marks Entry
                </span>
                <span className="text-[10px] text-slate-400">
                  NEB/CDC Grade
                </span>
              </button>
              <button
                onClick={() => onNavigate("homework")}
                className="flex flex-col items-center justify-center rounded-xl border border-slate-200 p-3 text-center hover:border-sky-300 hover:bg-sky-50/50 transition-all group"
              >
                <BookOpen className="h-5 w-5 text-sky-600 group-hover:scale-110 transition-transform mb-1" />
                <span className="text-xs font-semibold text-slate-800">
                  Assignments
                </span>
                <span className="text-[10px] text-slate-400">
                  Give Homework
                </span>
              </button>
              <button
                onClick={() => onNavigate("idcards")}
                className="flex flex-col items-center justify-center rounded-xl border border-slate-200 p-3 text-center hover:border-emerald-300 hover:bg-emerald-50/50 transition-all group"
              >
                <FileText className="h-5 w-5 text-emerald-600 group-hover:scale-110 transition-transform mb-1" />
                <span className="text-xs font-semibold text-slate-800">
                  ID Cards
                </span>
                <span className="text-[10px] text-slate-400">Print Cards</span>
              </button>
            </div>
          </div>

          {/* School Notice Board */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Megaphone className="h-4 w-4 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  Notice Circulars
                </h3>
              </div>
              <button
                onClick={() => onNavigate("notices")}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
              >
                View all →
              </button>
            </div>

            <div className="mt-3 space-y-3">
              {notices.slice(0, 3).map((notice) => (
                <div
                  key={notice.id}
                  className="rounded-xl border border-slate-100 bg-slate-50/60 p-3 hover:bg-indigo-50/30 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span
                      className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${
                        notice.priority === "Urgent"
                          ? "bg-rose-100 text-rose-700"
                          : notice.priority === "Exam"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-slate-200 text-slate-700"
                      }`}
                    >
                      {notice.priority}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {notice.date}
                    </span>
                  </div>
                  <h4 className="mt-1.5 text-xs font-bold text-slate-900 leading-snug">
                    {notice.title}
                  </h4>
                  <p className="mt-1 line-clamp-2 text-[11px] text-slate-500 leading-normal">
                    {notice.content}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Examinations Card */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-amber-500" />
                <h3 className="text-sm font-bold text-slate-900">
                  Examination Cycles
                </h3>
              </div>
              <span className="text-xs font-semibold text-slate-400">
                2081 B.S.
              </span>
            </div>

            <div className="mt-3 space-y-2.5">
              {exams.map((ex) => (
                <div
                  key={ex.id}
                  className="flex items-center justify-between rounded-xl p-2.5 bg-slate-50 hover:bg-slate-100 transition-colors"
                >
                  <div>
                    <div className="text-xs font-bold text-slate-800">
                      {ex.title}
                    </div>
                    <div className="text-[10px] text-slate-500">
                      Starts: {ex.startDate} • Term: {ex.term}
                    </div>
                  </div>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                      ex.status === "Published"
                        ? "bg-emerald-100 text-emerald-800"
                        : ex.status === "Ongoing"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-slate-200 text-slate-700"
                    }`}
                  >
                    {ex.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
