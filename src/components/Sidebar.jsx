import React from 'react';
import {
  LayoutDashboard,
  Users,
  UserCheck,
  GraduationCap,
  CalendarCheck,
  Award,
  Receipt,
  Wallet,
  BookMarked,
  Megaphone,
  IdCard,
  FileSpreadsheet,
  Settings,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Database
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

export default function Sidebar({ activeTab, setActiveTab, collapsed, setCollapsed }) {
  const { hasPermission, currentUser } = useAuth();

  const menuSections = [
    {
      title: 'Overview',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard }
      ]
    },
    {
      title: 'Academic Core',
      items: [
        { id: 'students', label: 'Student Admissions', icon: Users, perm: 'students' },
        { id: 'staff', label: 'Teachers & Staff', icon: UserCheck, perm: 'staff' },
        { id: 'academics', label: 'Academic Routine', icon: GraduationCap, perm: 'academics' },
        { id: 'attendance', label: 'Daily Attendance', icon: CalendarCheck, perm: 'attendance' },
        { id: 'exams', label: 'Exams & Marksheet', icon: Award, perm: 'exams' }
      ]
    },
    {
      title: 'Finance & Accounts',
      items: [
        { id: 'fees', label: 'Fee Collection', icon: Receipt, perm: 'fees' },
        { id: 'accounts', label: 'Income & Expenses', icon: Wallet, perm: 'accounts' }
      ]
    },
    {
      title: 'Academic Life',
      items: [
        { id: 'homework', label: 'Homework & Tasks', icon: BookMarked, perm: 'homework' },
        { id: 'notices', label: 'Notice Circulars', icon: Megaphone, perm: 'notices' },
        { id: 'idcards', label: 'ID Cards & Certificates', icon: IdCard, perm: 'idcards' }
      ]
    },
    {
      title: 'Administration',
      items: [
        { id: 'reports', label: 'Reports & Export', icon: FileSpreadsheet, perm: 'reports' },
        { id: 'settings', label: 'School Settings', icon: Settings, perm: 'settings' }
      ]
    }
  ];

  return (
    <aside
      className={`fixed top-16 bottom-0 left-0 z-20 flex flex-col border-r border-slate-200 bg-slate-900 text-slate-300 transition-all duration-200 select-none ${
        collapsed ? 'w-18' : 'w-64'
      }`}
    >
      {/* Navigation Modules list */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 scrollbar-thin scrollbar-thumb-slate-700">
        {menuSections.map((section, idx) => {
          // Filter items based on permissions
          const visibleItems = section.items.filter(item => !item.perm || hasPermission(item.perm));
          if (visibleItems.length === 0) return null;

          return (
            <div key={idx} className="space-y-1">
              {!collapsed && (
                <h3 className="px-3 text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                  {section.title}
                </h3>
              )}
              <div className="space-y-0.5">
                {visibleItems.map(item => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      title={collapsed ? item.label : undefined}
                      className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2 text-xs font-medium transition-all ${
                        isActive
                          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/40 font-semibold'
                          : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />
                      {!collapsed && (
                        <span className="truncate">{item.label}</span>
                      )}
                      {!collapsed && isActive && (
                        <span className="ml-auto h-1.5 w-1.5 rounded-full bg-white" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Footer Info & Collapse Toggle */}
      <div className="border-t border-slate-800 p-3">
        {!collapsed && (
          <div className="mb-2 rounded-xl bg-slate-800/80 p-2.5 text-xs">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold text-[11px]">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>RBAC Verified</span>
            </div>
            <p className="mt-0.5 text-[10px] text-slate-400 leading-tight">
              Logged in as <strong className="text-slate-200">{currentUser?.role}</strong>
            </p>
          </div>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-slate-800 py-1.5 text-xs text-slate-400 hover:bg-slate-700 hover:text-white transition-colors"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : (
            <>
              <ChevronLeft className="h-4 w-4" />
              <span className="text-[11px] font-medium">Collapse Menu</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
