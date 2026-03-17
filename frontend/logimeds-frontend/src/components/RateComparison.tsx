import { useEffect, useState } from "react"
import API from "../api/axios"

type Props = {
  orderId: string
  onClose: () => void
  onShipmentCreated: () => void
}

export default function RateComparison({
  orderId,
  onClose,
  onShipmentCreated,
}: Props) {
  const [rates, setRates] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    API.get(`/rates/${orderId}`).then((res) => {
      setRates(res.data)
      setLoading(false)
    })
  }, [orderId])

  const selectCourier = async (quoteId: string) => {
    await API.post(`/shipments/select/${quoteId}`)
    onShipmentCreated()
    onClose()
  }

  if (loading) {
    return <div className="p-6">Loading rates...</div>
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center">
      <div className="bg-zinc-900 border border-zinc-800 w-full max-w-3xl rounded-xl p-6">
        <h2 className="text-xl font-bold mb-4">Courier Options</h2>

        <div className="space-y-4">
          {rates.map((rate) => (
            <div
              key={rate.quote_id}
              className={`border border-zinc-800 bg-zinc-950 p-4 rounded flex justify-between items-center ${
                rate.recommended ? "border-slate-600" : ""
              }`}
            >
              <div>
                <p className="font-semibold">{rate.courier_name}</p>
                <p>₹ {rate.price}</p>
                <p>{rate.estimated_days} days</p>
                {rate.recommended && (
                  <span className="text-green-600 text-sm font-bold">
                    ⭐ Recommended
                  </span>
                )}
              </div>

              <button
                onClick={() => selectCourier(rate.quote_id)}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Select
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="mt-6 text-red-500 underline"
        >
          Close
        </button>
      </div>
    </div>
  )
}