import React, { useState, useEffect } from 'react';
import {
  AuthProvider,
  useAuth,
  ROLES,
  DEMO_ACCOUNTS
} from './context/AuthContext.jsx';
import Navbar from './components/Navbar.jsx';
import Sidebar from './components/Sidebar.jsx';
import SearchModal from './components/SearchModal.jsx';

import DashboardView from './views/DashboardView.jsx';
import StudentsView from './views/StudentsView.jsx';
import StaffView from './views/StaffView.jsx';
import AcademicsView from './views/AcademicsView.jsx';
import AttendanceView from './views/AttendanceView.jsx';
import ExamsView from './views/ExamsView.jsx';
import FeesView from './views/FeesView.jsx';
import AccountsView from './views/AccountsView.jsx';
import HomeworkView from './views/HomeworkView.jsx';
import NoticesView from './views/NoticesView.jsx';
import IdCardsView from './views/IdCardsView.jsx';
import ReportsView from './views/ReportsView.jsx';
import SettingsView from './views/SettingsView.jsx';

import {
  getSchoolInfo,
  updateSchoolInfo,
  getStudents,
  addStudent,
  updateStudent,
  deleteStudent,
  getStaff,
  addStaff,
  getNotices,
  addNotice,
  getFeePayments,
  addFeePayment,
  getTransactions,
  addTransaction,
  getExams,
  getMarks,
  saveMarkEntry,
  getHomework,
  addHomework,
  getAttendance,
  saveAttendance,
  sampleStudents,
  sampleStaff,
  sampleNotices,
  sampleFeePayments,
  sampleTransactions,
  sampleExams,
  sampleMarks,
  sampleHomework,
  sampleAttendance,
  initialSchoolInfo
} from './services/schoolService.js';

import {
  School,
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Users,
  GraduationCap
} from 'lucide-react';

function LoginScreen() {
  const { login, switchRole } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleCustomLogin = (e) => {
    e.preventDefault();
    const res = login(email, password);
    if (!res.success) {
      setError(res.error || 'Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 selection:bg-indigo-500 selection:text-white">
      <div className="w-full max-w-4xl rounded-3xl bg-white shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* Left: Brand Presentation */}
        <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 p-8 text-white flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-500/30">
                <School className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-lg font-black tracking-tight text-white font-serif">
                  Safe English Boarding School
                </h1>
                <p className="text-xs text-indigo-200">Bhimsensthan, Kathmandu, Nepal</p>
              </div>
            </div>

            <div className="mt-8 space-y-4">
              <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-xs border border-white/10">
                <h3 className="text-xs font-bold uppercase tracking-wider text-amber-300">
                  Comprehensive School ERP
                </h3>
                <p className="mt-1 text-xs text-slate-300 leading-relaxed">
                  Enterprise-grade portal managing student admissions, fee collection, CDC / NEB grading, daily attendance, class routines, and staff records.
                </p>
              </div>

              <div className="space-y-2 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  <span>Real-time Nepal CDC Grade Point Average (GPA) Engine</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  <span>NPR (रु) Invoicing & Printable Money Receipts</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  <span>Role-Based Access Control for 6 Stakeholder Roles</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-white/10 text-[11px] text-slate-400">
            Affiliated to Ministry of Education, Nepal • Session 2081 B.S.
          </div>
        </div>

        {/* Right: Authentication Form with 1-Click Demo Logins */}
        <div className="p-8 flex flex-col justify-between space-y-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Sign in to your account</h2>
            <p className="text-xs text-slate-500 mt-1">Select any stakeholder profile or enter credentials</p>

            {/* 1-Click Quick Demo Sign-In Buttons */}
            <div className="mt-4 space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                One-Click Quick Login (Testing Roles)
              </span>
              <div className="grid grid-cols-2 gap-2">
                {DEMO_ACCOUNTS.map(acc => (
                  <button
                    key={acc.id}
                    onClick={() => switchRole(acc)}
                    className="flex flex-col items-start rounded-xl border border-slate-200 bg-slate-50/70 p-2 text-left hover:border-indigo-400 hover:bg-indigo-50/50 transition-all text-xs group"
                  >
                    <span className="font-bold text-slate-900 group-hover:text-indigo-700 leading-tight">
                      {acc.role}
                    </span>
                    <span className="text-[10px] text-slate-500 truncate max-w-full">
                      {acc.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="relative my-4 flex items-center justify-center">
              <div className="border-t border-slate-200 w-full" />
              <span className="bg-white px-2 text-[10px] uppercase font-bold text-slate-400 absolute">Or enter email</span>
            </div>

            {error && (
              <div className="mb-3 rounded-lg bg-rose-50 p-2.5 text-xs text-rose-700 border border-rose-200">
                {error}
              </div>
            )}

            <form onSubmit={handleCustomLogin} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Institutional Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="superadmin@safeenglishschool.edu.np"
                    className="w-full rounded-xl border border-slate-300 pl-9 pr-3 py-2 text-xs focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-slate-300 pl-9 pr-3 py-2 text-xs focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-2.5 text-xs font-bold text-white shadow-md hover:bg-indigo-700 transition-colors"
              >
                Sign In <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          </div>

          <div className="text-center text-[11px] text-slate-400">
            Protected by Cloud Firebase Auth & Role-Based Access Controls
          </div>
        </div>
      </div>
    </div>
  );
}

function MainApp() {
  const { currentUser, hasPermission } = useAuth();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [collapsed, setCollapsed] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Application Data States
  const [schoolInfo, setSchoolInfo] = useState(initialSchoolInfo);
  const [students, setStudents] = useState(sampleStudents);
  const [staff, setStaff] = useState(sampleStaff);
  const [notices, setNotices] = useState(sampleNotices);
  const [feePayments, setFeePayments] = useState(sampleFeePayments);
  const [transactions, setTransactions] = useState(sampleTransactions);
  const [exams, setExams] = useState(sampleExams);
  const [marks, setMarks] = useState(sampleMarks);
  const [homework, setHomework] = useState(sampleHomework);
  const [attendance, setAttendance] = useState(sampleAttendance);

  // Quick action context transfer
  const [preSelectedStudentForFee, setPreSelectedStudentForFee] = useState(null);

  // Load Firestore data on mount
  useEffect(() => {
    async function loadData() {
      try {
        const [infoData, stdData, stfData, notData, feeData, txData, exData, mkData, hwData, attData] =
          await Promise.all([
            getSchoolInfo(),
            getStudents(),
            getStaff(),
            getNotices(),
            getFeePayments(),
            getTransactions(),
            getExams(),
            getMarks(),
            getHomework(),
            getAttendance()
          ]);

        if (infoData) setSchoolInfo(infoData);
        if (stdData) setStudents(stdData);
        if (stfData) setStaff(stfData);
        if (notData) setNotices(notData);
        if (feeData) setFeePayments(feeData);
        if (txData) setTransactions(txData);
        if (exData) setExams(exData);
        if (mkData) setMarks(mkData);
        if (hwData) setHomework(hwData);
        if (attData) setAttendance(attData);
      } catch (err) {
        console.warn('Using seeded data layers:', err);
      }
    }
    loadData();
  }, []);

  // CRUD Handlers
  const handleAddStudent = async (data) => {
    const newStd = await addStudent(data);
    setStudents(prev => [newStd, ...prev]);
  };

  const handleUpdateStudent = async (id, data) => {
    await updateStudent(id, data);
    setStudents(prev => prev.map(s => s.id === id ? { ...s, ...data } : s));
  };

  const handleDeleteStudent = async (id) => {
    await deleteStudent(id);
    setStudents(prev => prev.filter(s => s.id !== id));
  };

  const handleAddStaff = async (data) => {
    const newStaff = await addStaff(data);
    setStaff(prev => [newStaff, ...prev]);
  };

  const handleAddPayment = async (data) => {
    const newPayment = await addFeePayment(data);
    setFeePayments(prev => [newPayment, ...prev]);
    // Also record income transaction
    await addTransaction({
      type: 'income',
      title: `Fee Collected - ${data.studentName} (${data.receiptNo})`,
      category: 'Tuition Fees',
      amount: data.amount,
      date: data.date,
      paymentMode: data.paymentMethod,
      voucherNo: data.receiptNo
    });
    // Adjust student fee dues
    setStudents(prev => prev.map(s => {
      if (s.id === data.studentId) {
        const remaining = Math.max(0, (Number(s.feesDue) || 0) - Number(data.amount));
        return { ...s, feesDue: remaining };
      }
      return s;
    }));
  };

  const handleAddTransaction = async (data) => {
    const newTx = await addTransaction(data);
    setTransactions(prev => [newTx, ...prev]);
  };

  const handleSaveMarks = async (data) => {
    const saved = await saveMarkEntry(data);
    setMarks(prev => {
      const idx = prev.findIndex(m => m.id === saved.id || (m.studentId === saved.studentId && m.examId === saved.examId));
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = saved;
        return copy;
      }
      return [saved, ...prev];
    });
  };

  const handleAddHomework = async (data) => {
    const newHw = await addHomework(data);
    setHomework(prev => [newHw, ...prev]);
  };

  const handleAddNotice = async (data) => {
    const newNot = await addNotice(data);
    setNotices(prev => [newNot, ...prev]);
  };

  const handleSaveAttendance = async (data) => {
    const saved = await saveAttendance(data);
    setAttendance(prev => {
      const idx = prev.findIndex(a => a.date === data.date && a.grade === data.grade && a.section === data.section);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = saved;
        return copy;
      }
      return [saved, ...prev];
    });
  };

  const handleUpdateSchoolInfo = async (data) => {
    await updateSchoolInfo(data);
    setSchoolInfo(data);
  };

  if (!currentUser) {
    return <LoginScreen />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased selection:bg-indigo-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        onOpenSearch={() => setIsSearchOpen(true)}
        schoolInfo={schoolInfo}
      />

      {/* Main Layout Body */}
      <div className="flex">
        {/* Left Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
        />

        {/* Content Canvas */}
        <main
          className={`flex-1 transition-all duration-200 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full ${
            collapsed ? 'ml-18' : 'ml-64'
          }`}
        >
          {activeTab === 'dashboard' && (
            <DashboardView
              students={students}
              staff={staff}
              notices={notices}
              feePayments={feePayments}
              transactions={transactions}
              exams={exams}
              homework={homework}
              schoolInfo={schoolInfo}
              onNavigate={(tab) => setActiveTab(tab)}
              onOpenQuickAdmission={() => setActiveTab('students')}
              onOpenQuickFee={() => setActiveTab('fees')}
            />
          )}

          {activeTab === 'students' && (
            <StudentsView
              students={students}
              onAddStudent={handleAddStudent}
              onUpdateStudent={handleUpdateStudent}
              onDeleteStudent={handleDeleteStudent}
              schoolInfo={schoolInfo}
              onCollectFeeForStudent={(std) => {
                setPreSelectedStudentForFee(std);
                setActiveTab('fees');
              }}
            />
          )}

          {activeTab === 'staff' && (
            <StaffView
              staff={staff}
              onAddStaff={handleAddStaff}
              schoolInfo={schoolInfo}
            />
          )}

          {activeTab === 'academics' && (
            <AcademicsView
              schoolInfo={schoolInfo}
            />
          )}

          {activeTab === 'attendance' && (
            <AttendanceView
              students={students}
              attendance={attendance}
              onSaveAttendance={handleSaveAttendance}
            />
          )}

          {activeTab === 'exams' && (
            <ExamsView
              exams={exams}
              marks={marks}
              students={students}
              schoolInfo={schoolInfo}
              onSaveMarks={handleSaveMarks}
            />
          )}

          {activeTab === 'fees' && (
            <FeesView
              students={students}
              feePayments={feePayments}
              onAddPayment={handleAddPayment}
              schoolInfo={schoolInfo}
              preSelectedStudent={preSelectedStudentForFee}
            />
          )}

          {activeTab === 'accounts' && (
            <AccountsView
              transactions={transactions}
              onAddTransaction={handleAddTransaction}
              schoolInfo={schoolInfo}
            />
          )}

          {activeTab === 'homework' && (
            <HomeworkView
              homework={homework}
              onAddHomework={handleAddHomework}
            />
          )}

          {activeTab === 'notices' && (
            <NoticesView
              notices={notices}
              onAddNotice={handleAddNotice}
            />
          )}

          {activeTab === 'idcards' && (
            <IdCardsView
              students={students}
              staff={staff}
              schoolInfo={schoolInfo}
            />
          )}

          {activeTab === 'reports' && (
            <ReportsView
              students={students}
              staff={staff}
              feePayments={feePayments}
              marks={marks}
              transactions={transactions}
              schoolInfo={schoolInfo}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsView
              schoolInfo={schoolInfo}
              onUpdateSchoolInfo={handleUpdateSchoolInfo}
            />
          )}
        </main>
      </div>

      {/* Global Quick Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        students={students}
        staff={staff}
        feePayments={feePayments}
        onSelectStudent={(std) => {
          setActiveTab('students');
        }}
        onNavigate={(tab) => {
          setActiveTab(tab);
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
