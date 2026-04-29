"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Bus, Loader2, Lock, Mail, User, ArrowRight, ArrowLeft } from "lucide-react"
import { signUp } from "@/lib/auth-client"
import { motion } from "framer-motion"
import { Logo } from "@/components/logo"

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await signUp.email({
        email,
        password,
        name,
      }, {
        onSuccess: (ctx) => {
          setIsLoading(false);
          router.push("/user");
        },
        onError: (ctx) => {
          setIsLoading(false);
          alert(ctx.error.message || "Gagal mendaftar. Silakan coba email lain.");
        }
      });
    } catch (err) {
      setIsLoading(false);
      alert("Terjadi kesalahan sistem saat mencoba mendaftar.");
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-[1000px] bg-white rounded-3xl shadow-[0_8px_40px_rgb(0,0,0,0.08)] flex overflow-hidden min-h-[600px]">
        
        {/* Left Panel - Branding (Hidden on mobile) */}
        <div className="hidden md:flex md:w-1/2 bg-[#0F172A] p-10 flex-col justify-between relative overflow-hidden text-white">
          <motion.div 
            animate={{ 
              rotate: [0, 360],
              scale: [1, 1.2, 1]
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-emerald-500/20 rounded-full blur-[80px] pointer-events-none" 
          />
          <motion.div 
            animate={{ 
              rotate: [360, 0],
              scale: [1, 1.5, 1]
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-[#0053db]/30 rounded-full blur-[80px] pointer-events-none" 
          />

          <div className="relative z-10">
            <Link href="/" className="inline-flex items-center text-white/70 font-medium text-sm hover:text-white transition-opacity">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali ke Beranda
            </Link>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative z-10 mb-12"
          >
            <div className="mb-6">
              <Logo light textSize="text-5xl" iconSize={48} />
            </div>
            <p className="text-white/70 text-lg leading-relaxed max-w-sm mt-4">
              Bergabunglah dengan ribuan penumpang lain yang menikmati perjalanan praktis di Cikarang.
            </p>
          </motion.div>
        </div>

        {/* Right Panel - Form */}
        <div className="w-full md:w-1/2 p-8 sm:p-12 flex flex-col justify-center bg-white relative">
          <div className="max-w-sm w-full mx-auto">
            <div className="md:hidden flex flex-col items-center mb-8 text-center">
              <Logo textSize="text-3xl" />
            </div>

            <div className="mb-8 text-center md:text-left">
              <h2 className="text-3xl font-extrabold text-[#0F172A] tracking-tight mb-2">Buat Akun Baru</h2>
              <p className="text-slate-500">Mulai perjalanan cerdas Anda hari ini.</p>
            </div>

            <form onSubmit={handleRegister} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-semibold text-[#0F172A]">
                  Nama Lengkap
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-slate-400" />
                  </div>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Masukkan nama Anda"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="pl-11 h-12 rounded-xl border-slate-200 focus-visible:ring-2 focus-visible:ring-[#E3F2FD] focus-visible:border-[#0F172A]"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold text-[#0F172A]">
                  Email
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-400" />
                  </div>
                  <Input
                    id="email"
                    type="email"
                    placeholder="nama@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-11 h-12 rounded-xl border-slate-200 focus-visible:ring-2 focus-visible:ring-[#E3F2FD] focus-visible:border-[#0F172A]"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-semibold text-[#0F172A]">
                  Password
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400" />
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Minimal 8 karakter"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                    className="pl-11 h-12 rounded-xl border-slate-200 focus-visible:ring-2 focus-visible:ring-[#E3F2FD] focus-visible:border-[#0F172A]"
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 rounded-xl bg-[#0053db] hover:bg-blue-700 mt-2 text-white font-semibold text-base transition-all group"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Membuat Akun...
                  </>
                ) : (
                  <>
                    Daftar Sekarang
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-8 text-center text-sm text-slate-500">
              Sudah punya akun?{' '}
              <Link href="/login" className="font-semibold text-[#0053db] hover:underline">
                Masuk di sini
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
