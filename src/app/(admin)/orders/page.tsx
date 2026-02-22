import { PageHeader } from "@/components/shared/page-header";
import { getOrders } from "@/lib/queries/orders";
import { OrdersClient } from "./orders-client";

export default async function OrdersPage() {
  const orders = await getOrders();

  return (
    <div>
      <PageHeader
        title="Orders"
        description="Track and manage shop orders"
      />
      <OrdersClient orders={orders} />
    </div>
  );
}
