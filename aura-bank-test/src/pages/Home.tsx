import { motion } from "motion/react";
import { ArrowRight, ShieldCheck, Smartphone, Zap, CreditCard, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function Home() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } },
  };

  const scrollToFeatures = () => {
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="w-full overflow-hidden">
      {/* Hero Section */}
      <section className="relative bg-slate-50 pt-24 pb-32 sm:pt-32 sm:pb-40 lg:pb-48">
        {/* Corporate Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-[50%] h-[100%] bg-gradient-to-l from-blue-50 to-transparent" />
          <div className="absolute -top-[40%] -right-[10%] w-[70%] h-[70%] rounded-full bg-blue-100/50 blur-3xl mix-blend-multiply" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="max-w-2xl"
            >
              <motion.div variants={item} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white shadow-sm border border-slate-200 text-slate-800 text-sm font-bold mb-8">
                <span className="flex h-2 w-2 rounded-full bg-red-600 animate-pulse"></span>
                New: High-Yield Savings Account at 7.5% p.a.
              </motion.div>
              <motion.h1 variants={item} className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-slate-900 mb-8 leading-[1.1]">
                Banking, <br />
                <span className="text-blue-900">built on trust.</span>
              </motion.h1>
              <motion.p variants={item} className="text-lg sm:text-xl text-slate-600 mb-10 leading-relaxed max-w-lg">
                Experience the future of finance with zero hidden fees, instant transfers, and intelligent insights to grow your wealth securely.
              </motion.p>
              <motion.div variants={item} className="flex flex-col sm:flex-row gap-4">
                <Link to="/register" className="inline-flex justify-center items-center gap-2 bg-red-600 text-white px-8 py-4 rounded-2xl text-base font-bold hover:shadow-lg hover:shadow-red-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]">
                  Open an Account <ArrowRight className="w-5 h-5" />
                </Link>
                <button 
                  onClick={scrollToFeatures}
                  className="inline-flex justify-center items-center gap-2 bg-white text-blue-900 border border-slate-200 px-8 py-4 rounded-2xl text-base font-bold hover:bg-slate-50 hover:border-slate-300 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-sm"
                >
                  Explore Features
                </button>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95, rotate: -2 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
              className="relative hidden lg:block"
            >
              {/* Abstract Card Visual */}
              <div className="relative w-full aspect-[4/3] rounded-[2.5rem] bg-gradient-to-br from-blue-950 via-blue-900 to-slate-900 p-8 shadow-2xl shadow-blue-900/20 overflow-hidden border border-white/10">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-red-600/20 to-transparent rounded-full blur-3xl -mr-20 -mt-20" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-blue-500/30 to-transparent rounded-full blur-3xl -ml-20 -mb-20" />
                
                <div className="relative h-full flex flex-col justify-between z-10">
                  <div className="flex justify-between items-start">
                    <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-white text-sm font-bold border border-white/20 shadow-sm">
                      Aura Premium
                    </div>
                    <CreditCard className="w-8 h-8 text-white/80" />
                  </div>
                  
                  <div>
                    <div className="text-blue-200 text-sm font-medium mb-2">Available Balance</div>
                    <div className="text-white text-5xl font-bold tracking-tight">₹ 24,50,000</div>
                    <div className="flex items-center gap-4 mt-8">
                      <div className="text-white/80 font-mono tracking-widest text-lg">**** **** **** 4281</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating Element */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="absolute -bottom-8 -left-8 bg-white p-6 rounded-3xl shadow-xl border border-slate-100 flex items-center gap-4"
              >
                <div className="bg-emerald-100 p-3 rounded-2xl text-emerald-600 shadow-sm">
                  <ArrowRight className="w-6 h-6 -rotate-45" />
                </div>
                <div>
                  <div className="text-sm text-slate-500 font-medium">Received</div>
                  <div className="text-slate-900 font-bold text-lg">+₹ 1,25,000</div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mb-6">
              Everything you need, nothing you don't.
            </h2>
            <p className="text-lg text-slate-600">
              We've stripped away the complexity of traditional banking to give you a clear, powerful financial tool.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Zap className="w-6 h-6" />,
                title: "Lightning Fast",
                desc: "Send and receive money instantly, anywhere in the world. No more waiting for business days.",
                color: "bg-blue-600",
                bg: "bg-blue-50",
              },
              {
                icon: <ShieldCheck className="w-6 h-6" />,
                title: "Bank-grade Security",
                desc: "Your money is protected by industry-leading encryption and biometric authentication.",
                color: "bg-red-600",
                bg: "bg-red-50",
              },
              {
                icon: <Smartphone className="w-6 h-6" />,
                title: "Smart Insights",
                desc: "Understand your spending habits with automated categorization and beautiful visual reports.",
                color: "bg-blue-900",
                bg: "bg-blue-50",
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="group bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-xl hover:border-blue-200 transition-all duration-300"
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white mb-6 ${feature.color} shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-900" />
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-8"
          >
            Ready to upgrade your banking?
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-blue-200 mb-12 max-w-2xl mx-auto"
          >
            Join thousands of users who have already made the switch. It takes less than 3 minutes to open an account.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Link to="/register" className="inline-flex justify-center items-center gap-2 bg-red-600 text-white px-8 py-4 rounded-2xl text-lg font-bold hover:bg-red-700 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl">
              Get Started Now <ChevronRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
