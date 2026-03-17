import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Truck, Hash, MapPin, ChevronRight, CheckCircle2, Clock3, PackageCheck, Loader2, Package } from "lucide-react"
import MainLayout from "../layouts/MainLayout"
import API from "../api/axios"

const trackingSteps = ["created", "picked_up", "in_transit", "out_for_delivery", "delivered"]

const statusConfig: Record<string, { label: string; color: string; bg: string; border: string; icon: any }> = {
  created:           { label: "Created",          color: "text-slate-700",  bg: "bg-slate-50",    border: "border-slate-200", icon: Clock3 },
  picked_up:         { label: "Picked Up",         color: "text-violet-700", bg: "bg-violet-50",   border: "border-violet-200", icon: Package },
  in_transit:        { label: "In Transit",        color: "text-sky-700",    bg: "bg-sky-50",      border: "border-sky-200",    icon: Truck },
  out_for_delivery:  { label: "Out for Delivery",  color: "text-amber-700",  bg: "bg-amber-50",    border: "border-amber-200",  icon: MapPin },
  delivered:         { label: "Delivered",         color: "text-emerald-700",bg: "bg-emerald-50",  border: "border-emerald-200",icon: CheckCircle2 },
}

function ProgressBar({ status }: { status: string }) {
  const idx = trackingSteps.indexOf(status)
  const pct = idx === -1 ? 0 : Math.round(((idx + 1) / trackingSteps.length) * 100)
  return (
    <div className="mt-3">
      <div className="flex justify-between text-xs text-slate-400 mb-1">
        <span>Progress</span>
        <span>{pct}%</span>
      </div>
      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className={`h-full rounded-full ${pct === 100 ? "bg-emerald-500" : "bg-sky-500"}`}
        />
      </div>
    </div>
  )
}

export default function ShipmentsPage() {
  const [shipments, setShipments] = useState<any[]>([])
  const [advancing, setAdvancing] = useState<string | null>(null)

  const fetchShipments = () => {
    API.get("/shipments/").then((res) => setShipments(res.data))
  }

  useEffect(() => { fetchShipments() }, [])

  const advanceShipment = async (id: string) => {
    setAdvancing(id)
    await API.post(`/shipments/advance/${id}`)
    fetchShipments()
    setAdvancing(null)
  }

  return (
    <MainLayout title="Shipments">
      <div className="space-y-3">
        {shipments.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400 bg-white border border-slate-200 rounded-xl">
            <PackageCheck size={40} strokeWidth={1.5} className="mb-3 text-slate-300" />
            <p className="text-sm font-medium">No shipments yet</p>
            <p className="text-xs mt-1">Shipments will appear here after an order is assigned a courier</p>
          </div>
        )}

        <AnimatePresence>
          {shipments.map((shipment, i) => {
            const s = statusConfig[shipment.tracking_status] ?? statusConfig.booked
            const Icon = s.icon
            const isDelivered = shipment.tracking_status === "delivered"

            return (
              <motion.div
                key={shipment.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, type: "spring", stiffness: 200, damping: 22 }}
                className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg border ${s.bg} ${s.border}`}>
                      <Truck size={16} className={s.color} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{shipment.courier}</p>
                      <div className="flex items-center gap-1.5 mt-0.5 text-xs text-slate-400">
                        <Hash size={11} />
                        <span className="font-mono">{shipment.awb_number}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${s.bg} ${s.border} ${s.color}`}>
                      <Icon size={11} />
                      {s.label}
                    </span>

                    {!isDelivered && (
                      <button
                        onClick={() => advanceShipment(shipment.id)}
                        disabled={advancing === shipment.id}
                        className="flex items-center gap-1.5 text-xs font-semibold text-sky-600 bg-sky-50 hover:bg-sky-100 border border-sky-200 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-60"
                      >
                        {advancing === shipment.id
                          ? <Loader2 size={12} className="animate-spin" />
                          : <ChevronRight size={13} />}
                        Advance
                      </button>
                    )}
                  </div>
                </div>

                <ProgressBar status={shipment.tracking_status} />
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </MainLayout>
  )
}