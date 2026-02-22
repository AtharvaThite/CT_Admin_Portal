import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/shared/status-badge";
import { getOrderById } from "@/lib/queries/orders";
import { formatDate, formatCurrencyRupees } from "@/lib/utils";
import { OrderStatusActions } from "./order-status-actions";

export default async function OrderDetailPage({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await params;
  const order = await getOrderById(orderId);

  if (!order) return notFound();

  return (
    <div>
      <div className="mb-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/orders">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Orders
          </Link>
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">Order Details</h1>
            <StatusBadge status={order.status} />
          </div>
          <p className="text-muted-foreground text-sm mt-1">
            <code className="bg-muted px-1.5 py-0.5 rounded text-xs">{order.orderId}</code>
            <span className="mx-2">·</span>
            {formatDate(order.createdAt)}
          </p>
        </div>
        <OrderStatusActions orderId={orderId} currentStatus={order.status} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Package className="h-4 w-4" />
              Order Items ({order.items.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {order.items.map((item, i) => (
                <div key={i} className="flex items-center justify-between border rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    {item.product.imageUrl && (
                      <div className="w-12 h-12 rounded-lg bg-muted overflow-hidden shrink-0">
                        <img
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-sm">{item.product.name}</p>
                      <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="font-medium text-sm">
                    {formatCurrencyRupees(item.product.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Order Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatCurrencyRupees(order.subtotal)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Discount</span>
                  <span className="text-green-600">-{formatCurrencyRupees(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax</span>
                <span>{formatCurrencyRupees(order.tax)}</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-medium">
                <span>Total</span>
                <span>{formatCurrencyRupees(order.total)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
