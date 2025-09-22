import { ShoppingBag, Calendar, User, MapPin, Phone } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAdminOrders } from "@/hooks/useAdminData";
import { format } from "date-fns";

const AdminOrders = () => {
  const { orders, loading } = useAdminOrders();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'confirmed': return 'bg-blue-500';
      case 'preparing': return 'bg-orange-500';
      case 'out_for_delivery': return 'bg-purple-500';
      case 'delivered': return 'bg-green-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading orders...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">All Orders</h1>
          <p className="text-muted-foreground">Monitor and manage customer orders</p>
        </div>
        <div className="text-sm text-muted-foreground">
          Total Orders: {orders.length}
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-6">
        {orders.map((order) => (
          <Card key={order.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5" />
                    Order #{order.id.slice(0, 8)}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-4 mt-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {format(new Date(order.created_at), 'MMM dd, yyyy - hh:mm a')}
                    </span>
                  </CardDescription>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600">₹{order.total}</div>
                  <Badge className={`${getStatusColor(order.status)} text-white`}>
                    {order.status.replace('_', ' ').toUpperCase()}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                {/* Customer Info */}
                <div className="space-y-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Customer Information
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium">Name:</span> {order.profiles?.name || 'Unknown Customer'}
                    </div>
                    <div>
                      <span className="font-medium">Email:</span> {order.profiles?.email || 'N/A'}
                    </div>
                    <div className="flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      <span className="font-medium">Phone:</span> {order.profiles?.phone || 'N/A'}
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Order Items</h3>
                  <div className="space-y-3">
                    {order.order_items?.map((item: any) => (
                      <div key={item.id} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                        <img
                          src={item.products?.image}
                          alt={item.products?.name}
                          className="w-12 h-12 rounded object-cover"
                        />
                        <div className="flex-1">
                          <div className="font-medium">{item.products?.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {item.product_variants?.weight} × {item.quantity}
                          </div>
                        </div>
                        <div className="font-semibold">
                          ₹{item.total}
                        </div>
                      </div>
                    )) || <div className="text-muted-foreground">No items found</div>}
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="mt-6 pt-6 border-t">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2 text-sm">
                    <h4 className="font-semibold">Order Summary</h4>
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>₹{order.subtotal}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery Fee:</span>
                      <span>₹{order.delivery_fee}</span>
                    </div>
                    {order.wallet_discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Wallet Discount:</span>
                        <span>-₹{order.wallet_discount}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-semibold text-lg border-t pt-2">
                      <span>Total:</span>
                      <span>₹{order.total}</span>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <h4 className="font-semibold">Payment & Delivery</h4>
                    <div>
                      <span className="font-medium">Payment Method:</span> {order.payment_method?.toUpperCase()}
                    </div>
                    {order.notes && (
                      <div>
                        <span className="font-medium">Notes:</span> {order.notes}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {orders.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <ShoppingBag className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No orders yet</h3>
            <p className="text-muted-foreground">
              Orders will appear here when customers start placing them
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminOrders;