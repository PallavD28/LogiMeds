import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import API from "../api/axios"
import {
  ClipboardList, Truck, Clock, Weight, BarChart3, CheckCircle
} from "lucide-react"

const cardMeta = [
  { key: "total_orders",          label: "Total Orders",            icon: ClipboardList, color: "text-violet-600", bg: "bg-violet-50",  border: "border-violet-100" },
  { key: "shipped_orders",        label: "Shipped",                 icon: Truck,         color: "text-sky-600",    bg: "bg-sky-50",      border: "border-sky-100" },
  { key: "pending_orders",        label: "Pending",                 icon: Clock,         color: "text-amber-600",  bg: "bg-amber-50",    border: "border-amber-100" },
  { key: "total_weight_shipped",  label: "Weight Shipped (kg)",     icon: Weight,        color: "text-teal-600",   bg: "bg-teal-50",     border: "border-teal-100" },
  { key: "most_used_courier",     label: "Most Used Courier",       icon: BarChart3,     color: "text-rose-600",   bg: "bg-rose-50",     border: "border-rose-100" },
  { key: "delivery_success_rate", label: "Delivery Success",        icon: CheckCircle,   color: "text-emerald-600",bg: "bg-emerald-50",  border: "border-emerald-100" },
]

export default function StatsCards({ refresh }: any) {
  const [stats, setStats] = useState<any>(null)

  useEffect(() => {
    API.get("/dashboard/stats").then((res) => setStats(res.data))
  }, [refresh])

  if (!stats) {
    return (
      <div className="grid grid-cols-3 gap-4 mb-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white border border-slate-200 rounded-xl p-5 h-24 animate-pulse">
            <div className="h-3 w-1/2 bg-slate-100 rounded mb-3" />
            <div className="h-6 w-1/3 bg-slate-100 rounded" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      {cardMeta.map((card, i) => {
        const Icon = card.icon
        const raw = stats[card.key]
        const value = card.key === "delivery_success_rate"
          ? `${raw}%`
          : card.key === "most_used_courier"
          ? (raw || "—")
          : raw

        return (
          <motion.div
            key={card.key}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07, type: "spring", stiffness: 180, damping: 20 }}
            whileHover={{ y: -2, transition: { duration: 0.15 } }}
            className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500 mb-2">{card.label}</p>
                <p className="text-2xl font-bold text-slate-800 leading-none">{value}</p>
              </div>
              <div className={`p-2 rounded-lg border ${card.bg} ${card.border}`}>
                <Icon size={17} className={card.color} />
              </div>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}