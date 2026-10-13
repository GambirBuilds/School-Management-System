import React, { useState } from 'react';
import {
  Wallet,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  DollarSign,
  Calendar,
  Filter,
  Download,
  Printer,
  X,
  CreditCard
} from 'lucide-react';

export default function AccountsView({ transactions, onAddTransaction, schoolInfo }) {
  const [filterType, setFilterType] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    type: 'income',
    title: '',
    category: 'Tuition Fees',
    amount: 15000,
    date: '2081-08-12',
    paymentMode: 'Bank Transfer',
    voucherNo: `VCH-2081-${Math.floor(100 + Math.random() * 900)}`
  });

  const filteredTransactions = transactions.filter(
    t => filterType === 'All' || t.type === filterType
  );

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);

  const netBalance = totalIncome - totalExpense;

  const handleOpenAdd = (type = 'income') => {
    setFormData({
      type,
      title: '',
      category: type === 'income' ? 'Tuition Fees' : 'Staff Salary',
      amount: 10000,
      date: '2081-08-12',
      paymentMode: 'Bank Transfer',
      voucherNo: `${type === 'income' ? 'INC' : 'EXP'}-2081-${Math.floor(100 + Math.random() * 900)}`
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    onAddTransaction({
      ...formData,
      amount: Number(formData.amount)
    });
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl flex items-center gap-2">
            <Wallet className="h-6 w-6 text-indigo-600" />
            Financial Accounts & Ledgers
          </h2>
          <p className="text-xs text-slate-500">
            Track school income, operational expenses, staff salaries, and balance statements in NPR (रु).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleOpenAdd('income')}
            className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white shadow-xs hover:bg-emerald-700"
          >
            <ArrowUpRight className="h-4 w-4" />
            Record Income
          </button>
          <button
            onClick={() => handleOpenAdd('expense')}
            className="flex items-center gap-1.5 rounded-xl bg-rose-600 px-3.5 py-2 text-xs font-bold text-white shadow-xs hover:bg-rose-700"
          >
            <ArrowDownLeft className="h-4 w-4" />
            Record Expense
          </button>
        </div>
      </div>

      {/* Financial Health Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Income</span>
            <div className="rounded-xl bg-emerald-50 p-2 text-emerald-600">
              <ArrowUpRight className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black text-emerald-700">
            रु {totalIncome.toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-500">Fee collections & admissions</span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Operating Expenses</span>
            <div className="rounded-xl bg-rose-50 p-2 text-rose-600">
              <ArrowDownLeft className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black text-rose-600">
            रु {totalExpense.toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-500">Salaries, utilities, maintenance</span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Net Operating Surplus</span>
            <div className="rounded-xl bg-indigo-50 p-2 text-indigo-600">
              <Wallet className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black text-indigo-900">
            रु {netBalance.toLocaleString()}
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold">Positive Cash Flow</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        {['All', 'income', 'expense'].map(t => (
          <button
            key={t}
            onClick={() => setFilterType(t)}
            className={`rounded-xl px-3.5 py-1.5 text-xs font-bold capitalize transition-colors ${
              filterType === t ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {t === 'All' ? 'All Transactions' : `${t} Entries`}
          </button>
        ))}
      </div>

      {/* Transactions Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/75 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3 px-4">Voucher No</th>
                <th className="py-3 px-4">Transaction Details</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Payment Mode</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 text-right">Amount (NPR)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTransactions.map(tx => (
                <tr key={tx.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-slate-700">{tx.voucherNo}</td>
                  <td className="py-3 px-4 font-bold text-slate-900">{tx.title}</td>
                  <td className="py-3 px-4">
                    <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700">
                      {tx.category}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-600">{tx.paymentMode}</td>
                  <td className="py-3 px-4 text-slate-500">{tx.date}</td>
                  <td className={`py-3 px-4 text-right font-black ${
                    tx.type === 'income' ? 'text-emerald-700' : 'text-rose-600'
                  }`}>
                    {tx.type === 'income' ? '+ ' : '- '}रु {tx.amount.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Transaction Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-slate-50/75">
              <h3 className="text-base font-bold text-slate-900">
                Record New {formData.type === 'income' ? 'Income' : 'Expense'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Transaction Type</label>
                  <select
                    value={formData.type}
                    onChange={e => setFormData({ ...formData, type: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="income">Income (+)</option>
                    <option value="expense">Expense (-)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Voucher Number</label>
                  <input
                    type="text"
                    required
                    value={formData.voucherNo}
                    onChange={e => setFormData({ ...formData, voucherNo: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 font-mono text-xs focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description / Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Science Lab Consumables & Reagents Purchase"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs focus:border-indigo-500 focus:outline-none"
                  >
                    {formData.type === 'income' ? (
                      <>
                        <option value="Tuition Fees">Tuition Fees</option>
                        <option value="Admission Fees">Admission Fees</option>
                        <option value="Exam Fees">Exam Fees</option>
                        <option value="Transportation">Transportation</option>
                        <option value="Donation / Grant">Donation / Grant</option>
                      </>
                    ) : (
                      <>
                        <option value="Staff Salary">Staff Salary</option>
                        <option value="Lab & Library">Lab & Library</option>
                        <option value="Utilities">Utilities & Internet</option>
                        <option value="Building Maintenance">Building Maintenance</option>
                        <option value="Stationery & Printing">Stationery & Printing</option>
                        <option value="Sports & ECA">Sports & ECA</option>
                      </>
                    )}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Amount (रु NPR) *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={formData.amount}
                    onChange={e => setFormData({ ...formData, amount: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs font-bold focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Payment Mode</label>
                  <select
                    value={formData.paymentMode}
                    onChange={e => setFormData({ ...formData, paymentMode: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Cash">Cash</option>
                    <option value="Cheque">Cheque</option>
                    <option value="Digital Wallet">Digital Wallet</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Date (BS)</label>
                  <input
                    type="text"
                    value={formData.date}
                    onChange={e => setFormData({ ...formData, date: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs focus:border-indigo-500 focus:outline-none"
                  />
                </div>
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
                  Save Transaction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
