import React, { useState } from 'react';
import {
  Megaphone,
  Plus,
  Calendar,
  AlertCircle,
  Tag,
  User,
  X,
  Filter,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

export default function NoticesView({ notices, onAddNotice }) {
  const { currentUser } = useAuth();
  const [selectedAudience, setSelectedAudience] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    targetAudience: 'All',
    priority: 'Normal',
    date: '2081-08-12',
    author: currentUser?.title || 'Principal Office'
  });

  const filteredNotices = notices.filter(
    n => selectedAudience === 'All' || n.targetAudience === selectedAudience || n.targetAudience === 'All'
  );

  const handleOpenAdd = () => {
    setFormData({
      title: '',
      content: '',
      targetAudience: 'All',
      priority: 'Normal',
      date: '2081-08-12',
      author: currentUser?.title || 'Principal Office'
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    onAddNotice(formData);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl flex items-center gap-2">
            <Megaphone className="h-6 w-6 text-indigo-600" />
            School Notice Circulars & Announcements
          </h2>
          <p className="text-xs text-slate-500">
            Publish official notices for teachers, students, and guardians of Safe English Boarding School.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-indigo-200 hover:bg-indigo-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Publish Notice
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        {['All', 'Parents', 'Students', 'Teachers'].map(aud => (
          <button
            key={aud}
            onClick={() => setSelectedAudience(aud)}
            className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-colors ${
              selectedAudience === aud
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {aud === 'All' ? 'All Circulars' : `For ${aud}`}
          </button>
        ))}
      </div>

      {/* Notices List */}
      <div className="space-y-4">
        {filteredNotices.map(notice => (
          <div
            key={notice.id}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:border-slate-300 transition-all space-y-3"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                  notice.priority === 'Urgent' ? 'bg-rose-100 text-rose-700 border border-rose-200' :
                  notice.priority === 'Exam' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                  'bg-slate-100 text-slate-700'
                }`}>
                  {notice.priority}
                </span>
                <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold text-indigo-700">
                  Target: {notice.targetAudience}
                </span>
              </div>
              <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
                <Calendar className="h-3 w-3" /> Published: {notice.date}
              </span>
            </div>

            <h3 className="text-base font-bold text-slate-900 leading-snug">{notice.title}</h3>
            <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">{notice.content}</p>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <User className="h-3.5 w-3.5 text-slate-400" />
                Issued by: <strong className="text-slate-700">{notice.author}</strong>
              </span>
              <span className="text-emerald-600 font-semibold flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5" /> Official Circular
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Notice Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-slate-50/75">
              <h3 className="text-base font-bold text-slate-900">Publish Official Circular</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Notice Headline *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Schedule for Second Terminal Examination 2081"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Target Audience</label>
                  <select
                    value={formData.targetAudience}
                    onChange={e => setFormData({ ...formData, targetAudience: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="All">All (School-wide)</option>
                    <option value="Parents">Parents & Guardians</option>
                    <option value="Students">Students Only</option>
                    <option value="Teachers">Faculty & Staff</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={e => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="Normal">General Information</option>
                    <option value="Urgent">Urgent Attention</option>
                    <option value="Exam">Examination Circular</option>
                    <option value="Holiday">Vacation / Holiday</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Notice Body / Description *</label>
                <textarea
                  rows={4}
                  required
                  value={formData.content}
                  onChange={e => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Type the full announcement message..."
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
                  Publish Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
