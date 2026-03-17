import MainLayout from "../layouts/MainLayout"
import OrderList from "../components/OrderList"

export default function OrdersPage() {
  return (
    <MainLayout title="Orders">
      <OrderList refresh={true} />
    </MainLayout>
  )
}