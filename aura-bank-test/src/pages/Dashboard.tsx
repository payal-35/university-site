import { motion } from "motion/react";
import { CreditCard, ArrowUpRight, ArrowDownRight, Wallet, LogOut, Building2, Send, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Modal from "../components/Modal";

export default function Dashboard() {
  const navigate = useNavigate();
  
  const [balance, setBalance] = useState(1450000);
  const [transactions, setTransactions] = useState([
    { id: 1, name: "Amazon India", date: "Today, 2:45 PM", amount: 4500, type: "debit" },
    { id: 2, name: "Salary Credit", date: "Yesterday, 9:00 AM", amount: 125000, type: "credit" },
    { id: 3, name: "Zomato", date: "12 Mar 2026", amount: 850, type: "debit" },
    { id: 4, name: "Electricity Bill", date: "10 Mar 2026", amount: 2100, type: "debit" },
  ]);

  const [isSendOpen, setIsSendOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [error, setError] = useState("");

  const handleLogout = () => {
    navigate("/");
  };

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(num);
  };

  const handleSendMoney = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const numAmount = parseFloat(amount);
    
    if (isNaN(numAmount) || numAmount <= 0) {
      setError("Please enter a valid amount.");
      return;
    }
    if (numAmount > balance) {
      setError("Insufficient balance.");
      return;
    }

    setBalance(prev => prev - numAmount);
    setTransactions(prev => [
      {
        id: Date.now(),
        name: recipient || "Unknown Transfer",
        date: "Just now",
        amount: numAmount,
        type: "debit"
      },
      ...prev
    ]);
    
    setIsSendOpen(false);
    setAmount("");
    setRecipient("");
  };

  const handleAddFunds = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const numAmount = parseFloat(amount);
    
    if (isNaN(numAmount) || numAmount <= 0) {
      setError("Please enter a valid amount.");
      return;
    }

    setBalance(prev => prev + numAmount);
    setTransactions(prev => [
      {
        id: Date.now(),
        name: "Self Deposit",
        date: "Just now",
        amount: numAmount,
        type: "credit"
      },
      ...prev
    ]);
    
    setIsAddOpen(false);
    setAmount("");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-blue-900 pb-32 pt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-white">Dashboard</h1>
            <button onClick={handleLogout} className="flex items-center gap-2 text-blue-200 hover:text-white transition-colors font-medium">
              <LogOut className="w-5 h-5" /> Logout
            </button>
          </div>
        </div>
      </div>
      
      <main className="-mt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Balance Card */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-2 bg-white rounded-3xl shadow-xl border border-slate-100 p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-slate-500 font-semibold mb-1">Savings Account</p>
                <p className="text-4xl sm:text-5xl font-bold text-blue-900">{formatCurrency(balance)}</p>
                <p className="text-sm text-slate-400 mt-2">A/C No: XXXXXX4281</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-2xl text-blue-900 hidden sm:block">
                <Building2 className="w-10 h-10" />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <button onClick={() => { setIsSendOpen(true); setError(""); setAmount(""); setRecipient(""); }} className="flex-1 bg-blue-900 text-white py-3.5 rounded-xl font-bold hover:bg-blue-800 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20">
                <ArrowUpRight className="w-5 h-5" /> Send Money
              </button>
              <button onClick={() => { setIsAddOpen(true); setError(""); setAmount(""); }} className="flex-1 bg-red-600 text-white py-3.5 rounded-xl font-bold hover:bg-red-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-red-600/20">
                <ArrowDownRight className="w-5 h-5" /> Add Funds
              </button>
            </div>
          </motion.div>

          {/* Quick Stats */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Quick Actions</h3>
            <div className="space-y-4">
              <button onClick={() => alert("Cards management coming soon!")} className="w-full flex items-center gap-4 p-4 rounded-2xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50 transition-all text-left group">
                <div className="bg-blue-50 p-3 rounded-xl text-blue-900 group-hover:bg-blue-100 transition-colors"><CreditCard className="w-6 h-6" /></div>
                <div>
                  <p className="font-bold text-slate-900">Cards</p>
                  <p className="text-sm text-slate-500">Manage debit & credit cards</p>
                </div>
              </button>
              <button onClick={() => alert("Fixed Deposits coming soon!")} className="w-full flex items-center gap-4 p-4 rounded-2xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50 transition-all text-left group">
                <div className="bg-blue-50 p-3 rounded-xl text-blue-900 group-hover:bg-blue-100 transition-colors"><Wallet className="w-6 h-6" /></div>
                <div>
                  <p className="font-bold text-slate-900">Fixed Deposits</p>
                  <p className="text-sm text-slate-500">Open a new FD</p>
                </div>
              </button>
            </div>
          </motion.div>

          {/* Transactions */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-3 bg-white rounded-3xl shadow-xl border border-slate-100 p-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-900">Recent Transactions</h3>
              <button className="text-blue-700 font-semibold hover:underline text-sm">View All</button>
            </div>
            <div className="space-y-4">
              {transactions.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-2xl transition-colors border border-transparent hover:border-slate-100">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-full ${tx.type === 'credit' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-600'}`}>
                      {tx.type === 'credit' ? <ArrowDownRight className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{tx.name}</p>
                      <p className="text-sm text-slate-500">{tx.date}</p>
                    </div>
                  </div>
                  <p className={`font-bold text-lg ${tx.type === 'credit' ? 'text-emerald-600' : 'text-slate-900'}`}>
                    {tx.type === 'credit' ? '+' : '-'}{formatCurrency(tx.amount)}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>

      {/* Send Money Modal */}
      <Modal isOpen={isSendOpen} onClose={() => setIsSendOpen(false)} title="Send Money">
        <form onSubmit={handleSendMoney} className="space-y-4">
          {error && <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm font-medium text-center">{error}</div>}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Recipient Name or Account</label>
            <input 
              type="text" 
              required 
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-900 focus:border-blue-900 outline-none transition-all" 
              placeholder="Enter name or account number" 
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Amount (₹)</label>
            <input 
              type="number" 
              required 
              min="1"
              step="any"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-900 focus:border-blue-900 outline-none transition-all" 
              placeholder="0.00" 
            />
          </div>
          <button type="submit" className="w-full bg-blue-900 text-white py-3.5 rounded-xl font-bold hover:bg-blue-800 transition-all flex justify-center items-center gap-2 shadow-lg shadow-blue-900/20 mt-6">
            <Send className="w-4 h-4" /> Transfer Funds
          </button>
        </form>
      </Modal>

      {/* Add Funds Modal */}
      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Add Funds">
        <form onSubmit={handleAddFunds} className="space-y-4">
          {error && <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm font-medium text-center">{error}</div>}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Amount to Add (₹)</label>
            <input 
              type="number" 
              required 
              min="1"
              step="any"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-red-600 focus:border-red-600 outline-none transition-all" 
              placeholder="0.00" 
            />
          </div>
          <button type="submit" className="w-full bg-red-600 text-white py-3.5 rounded-xl font-bold hover:bg-red-700 transition-all flex justify-center items-center gap-2 shadow-lg shadow-red-600/20 mt-6">
            <Plus className="w-4 h-4" /> Deposit Funds
          </button>
        </form>
      </Modal>
    </div>
  );
}
