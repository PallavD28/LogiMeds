import { useState } from "react"
import MainLayout from "../layouts/MainLayout"
import StatsCards from "../components/StatsCards"
import OrderForm from "../components/OrderForm"
import OrderList from "../components/OrderList"

export default function Dashboard() {
  const [refresh, setRefresh] = useState(false)

  const handleRefresh = () => setRefresh((prev) => !prev)

  return (
    <MainLayout title="Dashboard">
      <StatsCards refresh={refresh} />
      <OrderForm onOrderCreated={handleRefresh} />
      <OrderList refresh={refresh} />
    </MainLayout>
  )
}