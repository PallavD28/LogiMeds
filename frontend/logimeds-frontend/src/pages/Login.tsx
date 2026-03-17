import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Activity, Mail, Lock, AlertCircle, ArrowRight, Loader2 } from "lucide-react"
import API from "../api/axios"
import { useAuth } from "../context/AuthContext"

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const res = await API.post("/auth/login", { email, password })
      login(res.data.access_token)
      navigate("/dashboard")
    } catch {
      setError("Invalid email or password. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const inputClass =
    "w-full border border-slate-200 bg-white text-slate-800 placeholder-slate-400 pl-10 pr-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition-all duration-200 hover:border-slate-300"

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Left panel */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-sky-600 to-sky-800 flex-col justify-between p-12">
        <div className="flex items-center gap-2.5">
          <div className="bg-white/20 p-2 rounded-lg">
            <Activity size={20} className="text-white" />
          </div>
          <span className="text-white font-bold text-xl">LogiMeds</span>
        </div>
        <div>
          <h2 className="text-4xl font-bold text-white leading-snug mb-4">
            Pharmaceutical<br />Logistics, Simplified.
          </h2>
          <p className="text-sky-200 text-sm leading-relaxed max-w-sm">
            Manage cold-chain shipments, compare courier rates, and track deliveries — all in one place.
          </p>
        </div>
        <p className="text-sky-300 text-xs">© {new Date().getFullYear()} LogiMeds</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-sm"
        >
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="bg-sky-600 p-1.5 rounded-lg">
              <Activity size={16} className="text-white" />
            </div>
            <span className="font-bold text-lg text-slate-800">LogiMeds</span>
          </div>

          <h2 className="text-2xl font-bold text-slate-800 mb-1">Welcome back</h2>
          <p className="text-sm text-slate-400 mb-8">Sign in to your account to continue</p>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-5"
            >
              <AlertCircle size={15} className="shrink-0" />
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="email" placeholder="Email address" className={inputClass} value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>

            <div className="relative">
              <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="password" placeholder="Password" className={inputClass} value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-700 disabled:opacity-60 text-white py-3 rounded-xl text-sm font-semibold shadow-sm hover:shadow-md transition-all duration-200 mt-2"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <ArrowRight size={16} />}
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="text-sm text-slate-500 text-center mt-6">
            New company?{" "}
            <button onClick={() => navigate("/register")} className="text-sky-600 font-medium hover:underline">
              Register here
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  )
}