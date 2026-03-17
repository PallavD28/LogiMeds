import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, Scale, Tag, PackageSearch, BarChart2, CheckCircle2, Clock3 } from "lucide-react"
import API from "../api/axios"
import RateComparison from "./RateComparison"

type Props = {
  refresh: boolean
}

const statusConfig: Record<string, { label: string; color: string; bg: string; icon: any }> = {
  pending: { label: "Pending", color: "text-amber-700", bg: "bg-amber-50 border-amber-200", icon: Clock3 },
  shipped: { label: "Shipped", color: "text-sky-700", bg: "bg-sky-50 border-sky-200", icon: CheckCircle2 },
  delivered: { label: "Delivered", color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-200", icon: CheckCircle2 },
}

export default function OrderList({ refresh }: Props) {
  const [orders, setOrders] = useState<any[]>([])
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null)

  const fetchOrders = () => {
    API.get("/orders/").then((res) => setOrders(res.data))
  }

  useEffect(() => { fetchOrders() }, [refresh])

  const status = (s: string) => statusConfig[s] ?? statusConfig.pending

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
        <div className="flex items-center gap-2.5">
          <div className="bg-sky-100 p-1.5 rounded-lg">
            <PackageSearch size={16} className="text-sky-600" />
          </div>
          <h2 className="text-sm font-semibold text-slate-700">All Orders</h2>
          <span className="bg-slate-200 text-slate-600 text-xs font-medium px-2 py-0.5 rounded-full">
            {orders.length}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="divide-y divide-slate-100">
        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400">
            <PackageSearch size={36} strokeWidth={1.5} className="mb-3 text-slate-300" />
            <p className="text-sm font-medium">No orders yet</p>
            <p className="text-xs mt-1">Create your first order above</p>
          </div>
        ) : (
          <AnimatePresence>
            {orders.map((order, i) => {
              const s = status(order.shipment_status)
              const Icon = s.icon
              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors group"
                >
                  {/* Route */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="bg-slate-100 p-2 rounded-lg shrink-0">
                      <ArrowRight size={14} className="text-slate-500" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-800 truncate">
                        {order.origin} <span className="text-slate-400 font-normal">→</span> {order.destination}
                      </p>
                      <div className="flex items-center gap-3 mt-0.5">
                        <span className="flex items-center gap-1 text-xs text-slate-400">
                          <Scale size={11} /> {order.chargeable_weight} kg
                        </span>
                        {order.declared_value && (
                          <span className="flex items-center gap-1 text-xs text-slate-400">
                            <Tag size={11} /> ₹{order.declared_value}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Status & Action */}
                  <div className="flex items-center gap-3 shrink-0">
                    <span className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${s.bg} ${s.color}`}>
                      <Icon size={11} />
                      {s.label}
                    </span>

                    {order.shipment_status === "pending" && (
                      <button
                        onClick={() => setSelectedOrder(order.id)}
                        className="flex items-center gap-1.5 text-xs font-semibold text-sky-600 bg-sky-50 hover:bg-sky-100 border border-sky-200 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        <BarChart2 size={13} />
                        Compare Rates
                      </button>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        )}
      </div>

      {selectedOrder && (
        <RateComparison
          orderId={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onShipmentCreated={() => { fetchOrders() }}
        />
      )}
    </div>
  )
}