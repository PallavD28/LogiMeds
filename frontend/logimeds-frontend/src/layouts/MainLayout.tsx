import { useEffect, useState } from "react"
import type { ReactNode } from "react"
import { motion } from "framer-motion"
import { Building2, User } from "lucide-react"
import Sidebar from "../components/Sidebar"
import API from "../api/axios"

type Props = {
  title: string
  children: ReactNode
}

export default function MainLayout({ title, children }: Props) {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    API.get("/users/me").then((res) => setUser(res.data))
  }, [])

  return (
    <div className="flex bg-slate-50 min-h-screen">
      <Sidebar />

      <div className="flex-1 overflow-auto">
        {/* Top bar */}
        <header className="sticky top-0 z-10 bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between shadow-sm">
          <motion.h1
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-xl font-bold text-slate-800"
          >
            {title}
          </motion.h1>

          {user && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3"
            >
              {user.company_name && (
                <div className="flex items-center gap-1.5 text-sm text-slate-500">
                  <Building2 size={14} className="text-slate-400" />
                  <span className="font-medium text-slate-700">{user.company_name}</span>
                </div>
              )}
              <div className="w-px h-4 bg-slate-200" />
              <div className="flex items-center gap-2">
                <div className="bg-sky-100 text-sky-700 p-1.5 rounded-full">
                  <User size={13} />
                </div>
                <div className="text-right">
                  <p className="text-xs font-medium text-slate-700">{user.email}</p>
                  <p className="text-xs text-slate-400 capitalize">{user.role}</p>
                </div>
              </div>
            </motion.div>
          )}
        </header>

        {/* Page content */}
        <main className="px-8 py-6">
          {children}
        </main>
      </div>
    </div>
  )
}