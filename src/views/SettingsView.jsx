import React, { useState } from 'react';
import {
  Settings,
  School,
  Database,
  Save,
  CheckCircle2,
  AlertCircle,
  Shield,
  RefreshCw,
  Sparkles,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { seedInitialFirestoreData } from '../services/schoolService.js';

export default function SettingsView({ schoolInfo, onUpdateSchoolInfo }) {
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState({
    schoolName: schoolInfo?.schoolName || 'School Management System',
    established: schoolInfo?.established || '2054 B.S. (1997 A.D.)',
    motto: schoolInfo?.motto || 'Excellence in Education, Character & Discipline',
    affiliation: schoolInfo?.affiliation || 'Affiliated to Ministry of Education, CDC & NEB, Nepal',
    address: schoolInfo?.address || 'Bhimsensthan-07, Kathmandu, Bagmati Province, Nepal',
    phone: schoolInfo?.phone || '+977-01-4245678, +977-9851023456',
    email: schoolInfo?.email || 'info@safeenglishschool.edu.np',
    principal: schoolInfo?.principal || 'Mr. Ram Kumar Adhikari, M.Ed.',
    academicYear: schoolInfo?.academicYear || '2081 B.S. (2024–2025)',
    currency: schoolInfo?.currency || 'रु (NPR)'
  });

  const [isSaved, setIsSaved] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedStatus, setSeedStatus] = useState('');

  const handleSave = (e) => {
    e.preventDefault();
    onUpdateSchoolInfo(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleSeedDatabase = async () => {
    if (!window.confirm('This will synchronize and seed demonstration records (Students, Faculty, Fees, Exams, Notices) to the live Firestore database. Continue?')) {
      return;
    }
    setIsSeeding(true);
    setSeedStatus('Seeding collections to Firestore...');
    const res = await seedInitialFirestoreData();
    setIsSeeding(false);
    if (res.success) {
      setSeedStatus('Database seeded successfully to live Firestore! Refreshing data.');
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } else {
      setSeedStatus(`Failed: ${res.error}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl flex items-center gap-2">
            <Settings className="h-6 w-6 text-indigo-600" />
            System & Institutional Settings
          </h2>
          <p className="text-xs text-slate-500">
            Configure institutional profile, academic session, currency preferences, and database synchronization.
          </p>
        </div>

        {isSaved && (
          <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
            <CheckCircle2 className="h-4 w-4" /> Settings Updated!
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: School Profile Form */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
            <School className="h-5 w-5 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900">Institutional Identity & Branding</h3>
          </div>

          <form onSubmit={handleSave} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">School Name *</label>
                <input
                  type="text"
                  required
                  value={formData.schoolName}
                  onChange={e => setFormData({ ...formData, schoolName: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Established Year</label>
                <input
                  type="text"
                  value={formData.established}
                  onChange={e => setFormData({ ...formData, established: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">Motto / Tagline</label>
                <input
                  type="text"
                  value={formData.motto}
                  onChange={e => setFormData({ ...formData, motto: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">Curriculum & Affiliation</label>
                <input
                  type="text"
                  value={formData.affiliation}
                  onChange={e => setFormData({ ...formData, affiliation: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Principal / Headmaster</label>
                <input
                  type="text"
                  value={formData.principal}
                  onChange={e => setFormData({ ...formData, principal: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Current Academic Session</label>
                <input
                  type="text"
                  value={formData.academicYear}
                  onChange={e => setFormData({ ...formData, academicYear: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 font-semibold text-indigo-700 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Contact Phone(s)</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Official Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">Institution Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={e => setFormData({ ...formData, address: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button
                type="submit"
                className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-5 py-2 font-bold text-white hover:bg-indigo-700 transition-colors shadow-xs"
              >
                <Save className="h-4 w-4" />
                Save School Profile
              </button>
            </div>
          </form>
        </div>

        {/* Right 1 Col: Live Database Sync & Status */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Database className="h-5 w-5 text-emerald-600" />
              <h3 className="text-sm font-bold text-slate-900">Firestore Cloud Database</h3>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Safe English Boarding School is backed by cloud database persistence with real collections for students, staff, attendance, marks, homework, and fee receipts.
            </p>

            <div className="rounded-xl bg-slate-50 p-3 text-xs space-y-2 border border-slate-200">
              <div className="flex justify-between">
                <span className="text-slate-500">Security Rules:</span>
                <span className="font-bold text-emerald-700">Deployed & Active</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Currency Standard:</span>
                <span className="font-bold text-slate-800">रु NPR (Nepal)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Grading System:</span>
                <span className="font-bold text-indigo-700">CDC / NEB Standard</span>
              </div>
            </div>

            {seedStatus && (
              <div className="rounded-xl bg-indigo-50 p-3 text-indigo-800 text-xs border border-indigo-200">
                {seedStatus}
              </div>
            )}

            <button
              onClick={handleSeedDatabase}
              disabled={isSeeding}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-900 py-2.5 text-xs font-bold text-white shadow-md hover:bg-slate-800 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${isSeeding ? 'animate-spin' : ''}`} />
              {isSeeding ? 'Synchronizing Firestore...' : 'Sync & Seed Live Data'}
            </button>
            <p className="text-[10px] text-slate-400 text-center">
              Populates complete pre-configured demonstration batches into your Firestore instance.
            </p>
          </div>

          {/* Role Access Matrix */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Shield className="h-5 w-5 text-indigo-600" />
              <h3 className="text-sm font-bold text-slate-900">Role-Based Authorization (RBAC)</h3>
            </div>

            <div className="space-y-1.5 text-xs">
              {[
                { role: 'Super Admin', access: 'All modules, settings, users & audit' },
                { role: 'Administrator', access: 'Academics, admissions, routines, notices' },
                { role: 'Accountant', access: 'Fees, payments, income/expense ledgers' },
                { role: 'Teacher', access: 'Attendance, marks entry, homework, routines' },
                { role: 'Student', access: 'View homework, attendance, terminal marksheets' },
                { role: 'Parent', access: 'Ward profile, attendance, fee balances' }
              ].map(item => (
                <div key={item.role} className="flex justify-between items-center py-1 border-b border-slate-50 last:border-none">
                  <span className="font-bold text-slate-800 text-[11px]">{item.role}</span>
                  <span className="text-[10px] text-slate-500 text-right truncate max-w-[150px]">{item.access}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
