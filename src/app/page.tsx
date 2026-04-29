"use client"

import { Logo } from "@/components/logo"
import Link from "next/link"
import { motion } from "framer-motion"
import { MapPin, Navigation, ArrowRight, ShieldCheck, Clock, CreditCard } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0F172A] flex flex-col relative font-sans">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ 
            rotate: [0, 360],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-[#0053db]/20 blur-[120px]"
        />
        <motion.div 
          animate={{ 
            rotate: [360, 0],
            scale: [1, 1.5, 1]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute top-[40%] -right-[10%] w-[40%] h-[60%] rounded-full bg-emerald-500/10 blur-[120px]"
        />
      </div>

      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 text-white py-6 px-6 md:px-12 flex justify-between items-center"
      >
        <Logo light textSize="text-2xl" />
        <nav className="hidden md:flex gap-8 text-sm font-medium text-white/70">
          <Link href="#fitur" className="hover:text-white transition-colors">Fitur Utama</Link>
          <Link href="#tentang" className="hover:text-white transition-colors">Tentang Kami</Link>
        </nav>
      </motion.header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center p-6 text-center relative z-10 pt-20 md:pt-32">
        <div className="max-w-5xl mx-auto space-y-12 w-full">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-4">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-sm font-medium text-white/80">Platform Navigasi Transportasi #1 Cikarang</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight leading-tight">
              Jelajahi Cikarang <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0053db] to-emerald-400">
                Tanpa Tersesat
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto leading-relaxed">
              Temukan rute angkot terbaik, estimasi tarif akurat, dan jadwal operasional armada dalam satu platform pintar. Mulai perjalanan Anda sekarang.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <Link href="/login" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto bg-[#0053db] hover:bg-blue-600 text-white rounded-2xl px-8 py-4 font-bold text-lg transition-all flex items-center justify-center shadow-lg shadow-blue-500/30 group">
                Masuk & Cari Rute
                <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
          </motion.div>

          {/* Fitur Section */}
          <motion.div 
            id="fitur"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="pt-32 scroll-mt-20"
          >
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6">Fitur Utama CikarangGo</h2>
              <p className="text-white/60 text-lg max-w-2xl mx-auto">Kami menyediakan berbagai kemudahan untuk menemani perjalanan Anda mengelilingi kota industri terbesar di Asia Tenggara ini.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: MapPin, title: "Rute Akurat", desc: "Navigasi titik ke titik dengan panduan angkot yang presisi." },
                { icon: CreditCard, title: "Tarif Transparan", desc: "Ketahui estimasi biaya perjalanan Anda sebelum berangkat." },
                { icon: Clock, title: "Jadwal Real-time", desc: "Pantau jam operasional setiap armada yang aktif." }
              ].map((feature, i) => (
                <motion.div 
                  key={i}
                  whileHover={{ y: -10 }}
                  className="bg-white/5 backdrop-blur-md border border-white/10 rounded-[32px] p-10 text-left hover:bg-white/10 transition-colors"
                >
                  <div className="bg-[#0053db]/20 w-16 h-16 rounded-2xl flex items-center justify-center mb-8 border border-[#0053db]/30">
                    <feature.icon className="h-8 w-8 text-blue-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                  <p className="text-white/50 text-base leading-relaxed">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* About Section */}
          <motion.div
            id="tentang"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="mt-32 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[48px] p-8 md:p-20 text-left relative overflow-hidden scroll-mt-20"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#0053db]/20 rounded-full blur-[80px] -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] -ml-32 -mb-32"></div>
            
            <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6">
                  <ShieldCheck className="h-4 w-4 text-blue-400" />
                  <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">Tentang Kami</span>
                </div>
                <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6">Misi Kami untuk <span className="text-emerald-400">Cikarang</span></h2>
                <p className="text-white/60 text-lg leading-relaxed mb-6">
                  CikarangGo lahir dari keresahan masyarakat tentang sulitnya mencari informasi rute transportasi umum di Cikarang. Kami percaya bahwa mobilitas yang mudah adalah hak semua orang.
                </p>
                <p className="text-white/60 text-lg leading-relaxed">
                  Dengan mengintegrasikan data angkot, bus, dan KRL dalam satu tempat, kami bermimpi menjadikan Cikarang kota yang lebih terkoneksi dan ramah bagi para penumpang transportasi publik.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <motion.div whileHover={{ scale: 1.05 }} className="bg-white/5 border border-white/10 rounded-3xl p-6 text-center flex flex-col justify-center">
                  <h4 className="text-4xl md:text-5xl font-black text-white mb-2">10+</h4>
                  <p className="text-white/50 text-sm font-medium">Rute Terdaftar</p>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} className="bg-white/5 border border-white/10 rounded-3xl p-6 text-center flex flex-col justify-center translate-y-0 md:translate-y-8">
                  <h4 className="text-4xl md:text-5xl font-black text-white mb-2">24/7</h4>
                  <p className="text-white/50 text-sm font-medium">Akses Informasi</p>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} className="bg-white/5 border border-white/10 rounded-3xl p-6 text-center flex flex-col justify-center">
                  <h4 className="text-4xl md:text-5xl font-black text-white mb-2">100%</h4>
                  <p className="text-white/50 text-sm font-medium">Gratis Digunakan</p>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} className="bg-[#0053db]/20 border border-[#0053db]/30 rounded-3xl p-6 text-center flex flex-col justify-center translate-y-0 md:translate-y-8">
                  <h4 className="text-4xl md:text-5xl font-black text-emerald-400 mb-2">#1</h4>
                  <p className="text-white/60 text-sm font-medium">Platform Navigasi Cikarang</p>
                </motion.div>
              </div>
            </div>
          </motion.div>

        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 py-8 text-center text-white/40 text-sm mt-12">
        <p>&copy; 2026 CikarangGo. Membantu Cikarang bergerak lebih maju.</p>
      </footer>
    </div>
  )
}
