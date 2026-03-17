import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Activity, Building2, Mail, Lock, ArrowRight, Loader2, AlertCircle } from "lucide-react"
import API from "../api/axios"

export default function Register() {
  const navigate = useNavigate()
  const [company_name, setCompany] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await API.post("/auth/register", { company_name, email, password })
      navigate("/")
    } catch {
      setError("Registration failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const inputClass =
    "w-full border border-slate-200 bg-white text-slate-800 placeholder-slate-400 pl-10 pr-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition-all duration-200 hover:border-slate-300"

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        {/* Card */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8">
          <div className="flex items-center gap-2.5 mb-8">
            <div className="bg-sky-600 p-1.5 rounded-lg">
              <Activity size={16} className="text-white" />
            </div>
            <span className="font-bold text-lg text-slate-800">LogiMeds</span>
          </div>

          <h2 className="text-2xl font-bold text-slate-800 mb-1">Register your company</h2>
          <p className="text-sm text-slate-400 mb-7">Create an account to get started</p>

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
              <Building2 size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" placeholder="Company Name" className={inputClass} value={company_name} onChange={(e) => setCompany(e.target.value)} required />
            </div>

            <div className="relative">
              <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="email" placeholder="Admin Email" className={inputClass} value={email} onChange={(e) => setEmail(e.target.value)} required />
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
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p className="text-sm text-slate-500 text-center mt-6">
            Already have an account?{" "}
            <button onClick={() => navigate("/")} className="text-sky-600 font-medium hover:underline">
              Sign in
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  )
}