import { Link, useLocation } from "react-router-dom";
import { motion } from "motion/react";
import { Landmark, Menu, X } from "lucide-react";
import React, { useState } from "react";
import clsx from "clsx";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="bg-blue-900 text-white p-2.5 rounded-xl group-hover:bg-blue-800 transition-all duration-300">
                <Landmark className="w-6 h-6" />
              </div>
              <span className="font-bold text-2xl tracking-tight text-blue-900">Aura Bank</span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              <div className="flex gap-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={clsx(
                      "text-sm font-bold transition-colors hover:text-blue-700",
                      location.pathname === link.path
                        ? "text-blue-700 border-b-2 border-blue-700 pb-1"
                        : "text-slate-600"
                    )}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
              <div className="flex items-center gap-4">
                <Link 
                  to="/login"
                  className="text-sm font-bold text-slate-700 hover:text-blue-700 transition-colors"
                >
                  Login
                </Link>
                <Link 
                  to="/register"
                  className="bg-red-600 text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-red-700 hover:shadow-lg hover:shadow-red-600/20 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                >
                  Open Account
                </Link>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-slate-600 hover:text-blue-900 focus:outline-none"
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden bg-white border-b border-slate-200 shadow-lg"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={clsx(
                    "block px-3 py-3 rounded-xl text-base font-bold",
                    location.pathname === link.path
                      ? "bg-blue-50 text-blue-900"
                      : "text-slate-600 hover:bg-slate-50 hover:text-blue-900"
                  )}
                >
                  {link.name}
                </Link>
              ))}
              <div className="mt-6 pt-6 border-t border-slate-100 flex flex-col gap-3 px-3">
                <Link 
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center py-3 text-base font-bold text-slate-700 hover:text-blue-900 transition-colors border border-slate-200 rounded-xl"
                >
                  Login
                </Link>
                <Link 
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center py-3 bg-red-600 text-white rounded-xl text-base font-bold hover:bg-red-700 transition-all"
                >
                  Open Account
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </nav>
    </>
  );
}
