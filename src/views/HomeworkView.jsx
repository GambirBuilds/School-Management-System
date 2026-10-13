import React, { useState } from 'react';
import {
  BookMarked,
  Plus,
  Calendar,
  CheckCircle2,
  Clock,
  Filter,
  X,
  FileText,
  User
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

export default function HomeworkView({ homework, onAddHomework }) {
  const { currentUser } = useAuth();
  const [selectedGrade, setSelectedGrade] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    grade: 'Class 10',
    section: 'A',
    subject: 'Science & Technology',
    instructions: '',
    dueDate: '2081-08-20',
    assignedBy: currentUser?.name || 'Subject Teacher'
  });

  const filteredHomework = homework.filter(
    h => selectedGrade === 'All' || h.grade === selectedGrade
  );

  const handleOpenAdd = () => {
    setFormData({
      title: '',
      grade: 'Class 10',
      section: 'A',
      subject: 'Science & Technology',
      instructions: '',
      dueDate: '2081-08-20',
      assignedBy: currentUser?.name || 'Subject Teacher'
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    onAddHomework({
      ...formData,
      createdAt: new Date().toISOString().slice(0, 10)
    });
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl flex items-center gap-2">
            <BookMarked className="h-6 w-6 text-indigo-600" />
            Homework & Assignments
          </h2>
          <p className="text-xs text-slate-500">
            Publish syllabus tasks, problem sets, and review completion progress.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-indigo-200 hover:bg-indigo-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Assign Homework
        </button>
      </div>

      {/* Filter by Grade */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {['All', 'Class 10', 'Class 9', 'Class 8', 'Class 7', 'Class 6', 'Class 5'].map(g => (
          <button
            key={g}
            onClick={() => setSelectedGrade(g)}
            className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-colors whitespace-nowrap ${
              selectedGrade === g ? 'bg-indigo-600 text-white shadow-xs' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {g === 'All' ? 'All Classes' : g}
          </button>
        ))}
      </div>

      {/* Homework Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredHomework.map(item => (
          <div key={item.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-[10px] font-bold text-indigo-700">
                  {item.grade} - {item.section || 'A'}
                </span>
                <span className="flex items-center gap-1 text-[11px] font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md">
                  <Clock className="h-3 w-3" /> Due: {item.dueDate}
                </span>
              </div>

              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">{item.subject}</span>
                <h3 className="text-sm font-bold text-slate-900 leading-snug mt-0.5">{item.title}</h3>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                {item.instructions}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span className="flex items-center gap-1">
                <User className="h-3 w-3 text-slate-400" />
                By: <strong className="text-slate-700">{item.assignedBy}</strong>
              </span>
              <span className="text-emerald-600 font-semibold flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5" /> Assigned
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Assign Homework Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-slate-50/75">
              <h3 className="text-base font-bold text-slate-900">Create Homework Assignment</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Homework Topic / Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Chapter 4 Numerical Problems on Light Reflection"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Class</label>
                  <select
                    value={formData.grade}
                    onChange={e => setFormData({ ...formData, grade: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs focus:border-indigo-500 focus:outline-none"
                  >
                    {['Class 10', 'Class 9', 'Class 8', 'Class 7', 'Class 6', 'Class 5'].map(g => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Subject</label>
                  <select
                    value={formData.subject}
                    onChange={e => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs focus:border-indigo-500 focus:outline-none"
                  >
                    {['Science & Technology', 'Compulsory English', 'Nepali', 'Compulsory Mathematics', 'Social Studies', 'Computer Science'].map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Due Date</label>
                <input
                  type="text"
                  value={formData.dueDate}
                  onChange={e => setFormData({ ...formData, dueDate: e.target.value })}
                  placeholder="YYYY-MM-DD (e.g. 2081-08-20)"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Instructions & Page References</label>
                <textarea
                  rows={3}
                  required
                  value={formData.instructions}
                  onChange={e => setFormData({ ...formData, instructions: e.target.value })}
                  placeholder="Write clear tasks for the students..."
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-lg border border-slate-300 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-indigo-600 px-5 py-2 font-bold text-white hover:bg-indigo-700"
                >
                  Publish Homework
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
