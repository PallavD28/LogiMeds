import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MapPin, Package, Weight, DollarSign, Thermometer, Plus, X } from "lucide-react"
import API from "../api/axios"

type Props = {
  onOrderCreated: () => void
}

export default function OrderForm({ onOrderCreated }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  const [form, setForm] = useState({
    origin_pincode: "",
    destination_pincode: "",
    length_cm: "",
    width_cm: "",
    height_cm: "",
    actual_weight_kg: "",
    declared_value: "",
    is_cold_chain: false,
  })

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target
    setForm({ ...form, [name]: type === "checkbox" ? checked : value })
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setSubmitting(true)
    await API.post("/orders/", {
      ...form,
      length_cm: Number(form.length_cm),
      width_cm: Number(form.width_cm),
      height_cm: Number(form.height_cm),
      actual_weight_kg: Number(form.actual_weight_kg),
      declared_value: form.declared_value ? Number(form.declared_value) : null,
    })
    setForm({
      origin_pincode: "",
      destination_pincode: "",
      length_cm: "",
      width_cm: "",
      height_cm: "",
      actual_weight_kg: "",
      declared_value: "",
      is_cold_chain: false,
    })
    setSubmitting(false)
    setSuccess(true)
    setTimeout(() => setSuccess(false), 2500)
    onOrderCreated()
  }

  const inputClass =
    "w-full border border-slate-200 bg-white text-slate-800 placeholder-slate-400 p-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition-all duration-200 hover:border-slate-300"

  return (
    <div className="mb-6">
      {/* Toggle header */}
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        className="w-full flex items-center justify-between bg-white border border-slate-200 rounded-xl px-5 py-4 shadow-sm hover:shadow-md hover:border-sky-300 transition-all duration-200 group"
      >
        <div className="flex items-center gap-3">
          <div className="bg-sky-50 p-2 rounded-lg group-hover:bg-sky-100 transition-colors">
            <Plus size={18} className="text-sky-600" />
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold text-slate-700">Create New Order</p>
            <p className="text-xs text-slate-400">Fill in package & route details</p>
          </div>
        </div>
        <motion.div animate={{ rotate: isOpen ? 45 : 0 }} transition={{ duration: 0.2 }}>
          <Plus size={20} className="text-slate-400" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="bg-white border border-slate-200 rounded-xl shadow-sm mt-2 p-6"
          >
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Route */}
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <MapPin size={12} className="text-sky-500" /> Route
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative">
                    <input name="origin_pincode" placeholder="Origin Pincode" className={inputClass} value={form.origin_pincode} onChange={handleChange} required />
                  </div>
                  <div className="relative">
                    <input name="destination_pincode" placeholder="Destination Pincode" className={inputClass} value={form.destination_pincode} onChange={handleChange} required />
                  </div>
                </div>
              </div>

              {/* Dimensions */}
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Package size={12} className="text-sky-500" /> Dimensions (cm)
                </p>
                <div className="grid grid-cols-3 gap-3">
                  <input name="length_cm" placeholder="Length" type="number" className={inputClass} value={form.length_cm} onChange={handleChange} required />
                  <input name="width_cm" placeholder="Width" type="number" className={inputClass} value={form.width_cm} onChange={handleChange} required />
                  <input name="height_cm" placeholder="Height" type="number" className={inputClass} value={form.height_cm} onChange={handleChange} required />
                </div>
              </div>

              {/* Weight & Value */}
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Weight size={12} className="text-sky-500" /> Weight & Value
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative">
                    <input name="actual_weight_kg" placeholder="Weight (kg)" type="number" step="0.1" className={inputClass} value={form.actual_weight_kg} onChange={handleChange} required />
                  </div>
                  <div className="relative">
                    <input name="declared_value" placeholder="Declared Value (₹)" type="number" className={inputClass} value={form.declared_value} onChange={handleChange} />
                  </div>
                </div>
              </div>

              {/* Cold Chain */}
              <label className="flex items-center gap-3 p-3 bg-sky-50 border border-sky-100 rounded-lg cursor-pointer hover:bg-sky-100 transition-colors group">
                <div className="relative">
                  <input type="checkbox" name="is_cold_chain" checked={form.is_cold_chain} onChange={handleChange} className="sr-only" />
                  <div className={`w-10 h-5 rounded-full transition-colors duration-200 ${form.is_cold_chain ? "bg-sky-500" : "bg-slate-200"}`} />
                  <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${form.is_cold_chain ? "translate-x-5" : "translate-x-0"}`} />
                </div>
                <Thermometer size={16} className={form.is_cold_chain ? "text-sky-600" : "text-slate-400"} />
                <div>
                  <p className={`text-sm font-medium ${form.is_cold_chain ? "text-sky-700" : "text-slate-600"}`}>Cold Chain Required</p>
                  <p className="text-xs text-slate-400">Temperature-controlled logistics</p>
                </div>
              </label>

              {/* Submit */}
              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 flex items-center justify-center gap-2 border border-slate-200 text-slate-500 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
                >
                  <X size={15} /> Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-700 disabled:opacity-60 text-white py-2.5 rounded-lg text-sm font-semibold shadow-sm hover:shadow-md transition-all duration-200"
                >
                  {submitting ? (
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}>
                      <Plus size={15} />
                    </motion.div>
                  ) : (
                    <Plus size={15} />
                  )}
                  {submitting ? "Creating..." : "Create Order"}
                </button>
              </div>

              <AnimatePresence>
                {success && (
                  <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-center text-sm text-emerald-600 font-medium bg-emerald-50 border border-emerald-200 rounded-lg p-2">
                    ✓ Order created successfully!
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}