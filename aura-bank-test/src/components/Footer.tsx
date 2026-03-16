import { Link } from "react-router-dom";
import { Landmark, Twitter, Linkedin, Facebook, Instagram, Send, Loader2 } from "lucide-react";
import React, { useState } from "react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      if (res.ok) {
        setStatus("success");
        setEmail("");
        setTimeout(() => setStatus("idle"), 3000);
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <footer className="bg-blue-950 text-white pt-16 pb-8 border-t-4 border-red-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 md:gap-8 mb-12">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-6 group">
              <div className="bg-white text-blue-900 p-2 rounded-xl group-hover:bg-blue-50 transition-all">
                <Landmark className="w-6 h-6" />
              </div>
              <span className="font-bold text-2xl tracking-tight text-white">Aura Bank</span>
            </Link>
            <p className="text-blue-200 text-sm leading-relaxed max-w-xs">
              Banking designed for the modern era. Secure, fast, and beautifully simple. Join the financial revolution.
            </p>
            <div className="flex gap-4 mt-6">
              <a href="#" className="text-blue-300 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-blue-300 hover:text-white transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-blue-300 hover:text-white transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-blue-300 hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-white mb-4">Products</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-blue-200 hover:text-white font-medium text-sm transition-colors">Checking</a></li>
              <li><a href="#" className="text-blue-200 hover:text-white font-medium text-sm transition-colors">Savings</a></li>
              <li><a href="#" className="text-blue-200 hover:text-white font-medium text-sm transition-colors">Credit Cards</a></li>
              <li><a href="#" className="text-blue-200 hover:text-white font-medium text-sm transition-colors">Loans</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-white mb-4">Company</h3>
            <ul className="space-y-3">
              <li><Link to="/about" className="text-blue-200 hover:text-white font-medium text-sm transition-colors">About Us</Link></li>
              <li><a href="#" className="text-blue-200 hover:text-white font-medium text-sm transition-colors">Careers</a></li>
              <li><a href="#" className="text-blue-200 hover:text-white font-medium text-sm transition-colors">Press</a></li>
              <li><Link to="/contact" className="text-blue-200 hover:text-white font-medium text-sm transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-white mb-4">Newsletter</h3>
            <p className="text-blue-200 text-sm mb-4">Subscribe to get the latest updates and financial tips.</p>
            <form onSubmit={handleNewsletter} className="flex flex-col gap-2">
              <div className="relative">
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address" 
                  className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-blue-800 bg-blue-900 text-white placeholder-blue-400 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all text-sm"
                />
                <button 
                  type="submit" 
                  disabled={status === "loading"}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-300 hover:text-white disabled:opacity-50"
                >
                  {status === "loading" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </button>
              </div>
              {status === "success" && <p className="text-emerald-400 text-xs font-medium">Subscribed successfully!</p>}
              {status === "error" && <p className="text-red-400 text-xs font-medium">Failed to subscribe.</p>}
            </form>
          </div>
        </div>
        
        <div className="pt-8 border-t border-blue-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-blue-300 text-sm font-medium">
            &copy; {new Date().getFullYear()} Aura Bank. All rights reserved.
          </p>
          <p className="text-blue-300 text-xs font-medium">
            Aura Bank is a member FDIC. Equal Housing Lender.
          </p>
        </div>
      </div>
    </footer>
  );
}
