import React, { useState } from 'react';
import {
  Receipt,
  Plus,
  Search,
  Printer,
  X,
  CreditCard,
  DollarSign,
  Calendar,
  CheckCircle2,
  FileText,
  User,
  ArrowRight,
  Filter
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

export default function FeesView({
  students,
  feePayments,
  onAddPayment,
  schoolInfo,
  preSelectedStudent
}) {
  const { currentUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('All');

  const [isCollectModalOpen, setIsCollectModalOpen] = useState(false);
  const [activeReceipt, setActiveReceipt] = useState(null);

  // New payment form state
  const [formData, setFormData] = useState({
    studentId: preSelectedStudent ? preSelectedStudent.id : (students[0]?.id || ''),
    amount: 5500,
    paymentMethod: 'Cash',
    month: 'Kartik 2081 (Monthly Tuition)',
    date: '2081-08-12',
    remarks: 'Paid at fee counter'
  });

  // Open modal prefilled if triggered from student list
  React.useEffect(() => {
    if (preSelectedStudent) {
      setFormData(prev => ({
        ...prev,
        studentId: preSelectedStudent.id,
        amount: Number(preSelectedStudent.feesDue) > 0 ? Number(preSelectedStudent.feesDue) : 5500
      }));
      setIsCollectModalOpen(true);
    }
  }, [preSelectedStudent]);

  const filteredPayments = feePayments.filter(p => {
    const matchesSearch =
      p.receiptNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.studentName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMethod = selectedMethod === 'All' || p.paymentMethod === selectedMethod;
    return matchesSearch && matchesMethod;
  });

  const totalCollected = feePayments.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
  const totalDues = students.reduce((acc, curr) => acc + (Number(curr.feesDue) || 0), 0);

  const handleOpenCollect = () => {
    const nextReceiptNum = `REC-2081-0${String(feePayments.length + 325).padStart(3, '0')}`;
    setFormData({
      studentId: students[0]?.id || '',
      amount: 5500,
      paymentMethod: 'Cash',
      month: 'Kartik 2081 (Monthly Tuition)',
      date: '2081-08-12',
      remarks: 'Paid at fee counter'
    });
    setIsCollectModalOpen(true);
  };

  const handleSubmitPayment = (e) => {
    e.preventDefault();
    const student = students.find(s => s.id === formData.studentId);
    if (!student) return;

    const receiptNo = `REC-2081-0${String(feePayments.length + 325).padStart(3, '0')}`;
    const newPayment = {
      receiptNo,
      studentId: student.id,
      studentName: student.fullName,
      grade: student.grade,
      section: student.section,
      amount: Number(formData.amount),
      paymentMethod: formData.paymentMethod,
      month: formData.month,
      date: formData.date,
      collectedBy: currentUser?.name || 'Accountant',
      remarks: formData.remarks
    };

    onAddPayment(newPayment);
    setIsCollectModalOpen(false);
    setActiveReceipt(newPayment);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl flex items-center gap-2">
            <Receipt className="h-6 w-6 text-emerald-600" />
            Fee Collection & Receipts
          </h2>
          <p className="text-xs text-slate-500">
            Collect school fees, issue uniquely numbered money receipts in NPR (रु), and manage dues ledgers.
          </p>
        </div>

        <button
          onClick={handleOpenCollect}
          className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-emerald-200 hover:bg-emerald-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Collect Fee (New Receipt)
        </button>
      </div>

      {/* Metrics Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Collected (Session)</span>
          <div className="text-2xl font-black text-slate-900 mt-1">
            रु {totalCollected.toLocaleString()}
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold">Processed via Cash, eSewa & Bank</span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Outstanding Dues</span>
          <div className="text-2xl font-black text-rose-600 mt-1">
            रु {totalDues.toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-500 font-medium">Across all active grades</span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Official Receipts Issued</span>
          <div className="text-2xl font-black text-indigo-600 mt-1">
            {feePayments.length}
          </div>
          <span className="text-[11px] text-slate-500 font-medium">Audit-logged records</span>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative sm:col-span-2">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search receipt by number or student name..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 py-2 text-xs focus:border-indigo-500 focus:bg-white focus:outline-none"
            />
          </div>

          <div>
            <select
              value={selectedMethod}
              onChange={e => setSelectedMethod(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold focus:border-indigo-500 focus:bg-white focus:outline-none"
            >
              <option value="All">All Payment Modes</option>
              <option value="Cash">Cash Counter</option>
              <option value="eSewa">eSewa Digital</option>
              <option value="Khalti">Khalti Digital</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Cheque">Bank Cheque</option>
            </select>
          </div>
        </div>
      </div>

      {/* Payments History Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/75 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3 px-4">Receipt No</th>
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-4">Class</th>
                <th className="py-3 px-4">Fee Month / Head</th>
                <th className="py-3 px-4">Amount Paid</th>
                <th className="py-3 px-4">Payment Method</th>
                <th className="py-3 px-4">Collected By</th>
                <th className="py-3 px-4 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPayments.map(payment => (
                <tr key={payment.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-emerald-700">{payment.receiptNo}</td>
                  <td className="py-3 px-4 font-bold text-slate-900">{payment.studentName}</td>
                  <td className="py-3 px-4 text-slate-600">{payment.grade} - {payment.section}</td>
                  <td className="py-3 px-4 text-slate-700">{payment.month}</td>
                  <td className="py-3 px-4 font-black text-slate-900">रु {payment.amount.toLocaleString()}</td>
                  <td className="py-3 px-4">
                    <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-700">
                      {payment.paymentMethod}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-500 text-[11px]">{payment.collectedBy}</td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setActiveReceipt(payment)}
                      className="inline-flex items-center gap-1 rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-bold text-indigo-700 hover:bg-indigo-100 transition-colors"
                    >
                      <Printer className="h-3.5 w-3.5" /> Print
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Collect Fee Modal */}
      {isCollectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-slate-50/75">
              <h3 className="text-base font-bold text-slate-900">Record Fee Collection</h3>
              <button onClick={() => setIsCollectModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitPayment} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Select Student *</label>
                <select
                  value={formData.studentId}
                  onChange={e => setFormData({ ...formData, studentId: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs focus:border-indigo-500 focus:outline-none"
                >
                  {students.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.fullName} ({s.grade}-{s.section}) • Adm: {s.admissionNo} • Dues: रु {s.feesDue}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Amount Paid (रु NPR) *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={formData.amount}
                    onChange={e => setFormData({ ...formData, amount: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs font-bold focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Payment Method *</label>
                  <select
                    value={formData.paymentMethod}
                    onChange={e => setFormData({ ...formData, paymentMethod: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="Cash">Cash</option>
                    <option value="eSewa">eSewa</option>
                    <option value="Khalti">Khalti</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Cheque">Cheque</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Fee Head / Description</label>
                <input
                  type="text"
                  value={formData.month}
                  onChange={e => setFormData({ ...formData, month: e.target.value })}
                  placeholder="e.g. Kartik 2081 (Tuition + Exam Fee)"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Collection Date (BS)</label>
                <input
                  type="text"
                  value={formData.date}
                  onChange={e => setFormData({ ...formData, date: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Transaction Remarks / Voucher No</label>
                <input
                  type="text"
                  value={formData.remarks}
                  onChange={e => setFormData({ ...formData, remarks: e.target.value })}
                  placeholder="e.g. Counter Cash / eSewa Ref #4912"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCollectModalOpen(false)}
                  className="rounded-lg border border-slate-300 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-emerald-600 px-5 py-2 font-bold text-white shadow-xs hover:bg-emerald-700"
                >
                  Confirm & Generate Receipt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Official Printable Money Receipt Modal */}
      {activeReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden my-6">
            <div className="no-print flex items-center justify-between border-b border-slate-200 bg-slate-100 px-6 py-3">
              <span className="text-xs font-bold text-slate-700">Official Money Receipt Preview</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 shadow-xs"
                >
                  <Printer className="h-3.5 w-3.5" /> Print Receipt
                </button>
                <button
                  onClick={() => setActiveReceipt(null)}
                  className="rounded-lg p-1.5 text-slate-400 hover:text-slate-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Printable Receipt Sheet */}
            <div id="printable-area" className="p-8 font-sans bg-white text-slate-900 border-2 border-slate-300 m-2 rounded-xl">
              {/* Header */}
              <div className="text-center border-b-2 border-slate-800 pb-3">
                <h1 className="text-xl font-black uppercase text-indigo-950 font-serif">
                  SAFE ENGLISH BOARDING SCHOOL
                </h1>
                <p className="text-[11px] font-medium text-slate-600">
                  {schoolInfo?.address || 'Bhimsensthan, Kathmandu, Nepal'} • Phone: {schoolInfo?.phone || '+977-01-4245678'}
                </p>
                <div className="mt-1 inline-block rounded border border-slate-400 px-3 py-0.5 text-xs font-extrabold uppercase tracking-wider text-slate-800 bg-slate-50">
                  OFFICIAL MONEY RECEIPT
                </div>
              </div>

              {/* Receipt Details Top */}
              <div className="my-4 flex justify-between text-xs border-b border-slate-200 pb-2">
                <div>
                  <span className="text-slate-500">Receipt No: </span>
                  <strong className="font-mono text-emerald-800 font-bold">{activeReceipt.receiptNo}</strong>
                </div>
                <div>
                  <span className="text-slate-500">Date: </span>
                  <strong>{activeReceipt.date}</strong>
                </div>
              </div>

              {/* Student info */}
              <div className="space-y-1.5 text-xs my-3 bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div className="flex justify-between">
                  <span className="text-slate-500">Student Name:</span>
                  <strong className="text-slate-900">{activeReceipt.studentName}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Class & Section:</span>
                  <strong>{activeReceipt.grade} - {activeReceipt.section}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Fee Particulars:</span>
                  <span>{activeReceipt.month}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Payment Mode:</span>
                  <span className="font-semibold text-slate-800">{activeReceipt.paymentMethod}</span>
                </div>
              </div>

              {/* Amount Box */}
              <div className="my-4 flex items-center justify-between border-2 border-emerald-600 bg-emerald-50/60 p-4 rounded-xl">
                <div>
                  <span className="text-xs uppercase font-extrabold text-emerald-900 block">Total Amount Received</span>
                  <span className="text-[11px] text-slate-500 italic">{activeReceipt.remarks || 'Authorized School Receipt'}</span>
                </div>
                <div className="text-2xl font-black text-emerald-800">
                  रु {activeReceipt.amount.toLocaleString()}
                </div>
              </div>

              {/* Signatures */}
              <div className="mt-12 flex justify-between text-xs pt-4">
                <div className="text-center w-36 border-t border-slate-400 pt-1 text-slate-600">
                  Student / Guardian
                </div>
                <div className="text-center w-36 border-t border-slate-400 pt-1 font-bold text-slate-800">
                  Authorized Cashier
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
