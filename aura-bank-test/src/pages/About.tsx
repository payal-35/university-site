import { motion } from "motion/react";
import { Building2, Users, Shield, Globe2 } from "lucide-react";

export default function About() {
  return (
    <div className="w-full bg-slate-50 py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-3xl mx-auto mb-20">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-blue-900 mb-6">About Aura Bank</h1>
          <p className="text-lg text-slate-600 leading-relaxed">
            Founded on the principles of trust, security, and innovation, Aura Bank is India's premier digital-first banking institution. We combine the reliability of traditional banking with cutting-edge technology to provide a seamless financial experience.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
          {[
            { icon: <Building2 className="w-8 h-8" />, title: "1000+ Branches", desc: "Across the nation to serve you better." },
            { icon: <Users className="w-8 h-8" />, title: "50M+ Customers", desc: "Trust us with their financial future." },
            { icon: <Shield className="w-8 h-8" />, title: "Bank-Grade Security", desc: "Your assets are protected 24/7." },
            { icon: <Globe2 className="w-8 h-8" />, title: "Global Reach", desc: "Seamless international transactions." }
          ].map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bg-white p-8 rounded-3xl shadow-lg border border-slate-100 text-center hover:-translate-y-2 transition-transform duration-300">
              <div className="bg-blue-50 w-16 h-16 rounded-2xl flex items-center justify-center text-blue-900 mx-auto mb-6">
                {stat.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">{stat.title}</h3>
              <p className="text-slate-500">{stat.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-blue-900 rounded-[3rem] p-12 sm:p-16 text-center text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">Our Mission</h2>
            <p className="text-lg text-blue-100 leading-relaxed">
              To empower every individual and business with accessible, transparent, and secure financial tools. We believe that banking should be a catalyst for growth, not a hurdle.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
