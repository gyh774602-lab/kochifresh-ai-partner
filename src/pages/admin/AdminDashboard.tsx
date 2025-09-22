import { Link } from "react-router-dom";
import { 
  ShoppingBag, 
  Package, 
  Images, 
  FolderOpen, 
  Users,
  TrendingUp,
  DollarSign,
  ShoppingCart
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAdminOrders, useAdminProducts } from "@/hooks/useAdminData";

const AdminDashboard = () => {
  const { orders } = useAdminOrders();
  const { products } = useAdminProducts();

  const totalOrders = orders.length;
  const totalProducts = products.length;
  const activeProducts = products.filter(p => p.is_active).length;
  const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);

  const stats = [
    {
      title: "Total Orders",
      value: totalOrders,
      description: "All orders received",
      icon: ShoppingCart,
      color: "text-blue-600"
    },
    {
      title: "Total Revenue",
      value: `₹${totalRevenue.toLocaleString()}`,
      description: "Total sales revenue",
      icon: DollarSign,
      color: "text-green-600"
    },
    {
      title: "Active Products",
      value: `${activeProducts}/${totalProducts}`,
      description: "Products currently available",
      icon: Package,
      color: "text-purple-600"
    },
    {
      title: "Growth",
      value: "+12%",
      description: "From last month",
      icon: TrendingUp,
      color: "text-orange-600"
    }
  ];

  const quickActions = [
    {
      title: "Manage Products",
      description: "Add, edit, or remove products",
      icon: Package,
      href: "/admin/products",
      color: "bg-blue-500 hover:bg-blue-600"
    },
    {
      title: "Manage Categories",
      description: "Organize product categories",
      icon: FolderOpen,
      href: "/admin/categories",
      color: "bg-green-500 hover:bg-green-600"
    },
    {
      title: "Manage Banners",
      description: "Update homepage banners",
      icon: Images,
      href: "/admin/banners",
      color: "bg-purple-500 hover:bg-purple-600"
    },
    {
      title: "View Orders",
      description: "Monitor all customer orders",
      icon: ShoppingBag,
      href: "/admin/orders",
      color: "bg-orange-500 hover:bg-orange-600"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Welcome to the ECFresh admin panel. Manage your products, orders, and store content.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className={`w-12 h-12 rounded-lg ${action.color} flex items-center justify-center mb-4`}>
                  <action.icon className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-lg">{action.title}</CardTitle>
                <CardDescription>{action.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link to={action.href}>
                    Manage
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
          <CardDescription>Latest customer orders</CardDescription>
        </CardHeader>
        <CardContent>
          {orders.slice(0, 5).map((order) => (
            <div key={order.id} className="flex items-center justify-between py-3 border-b last:border-0">
              <div>
                <p className="font-medium">Order #{order.id.slice(0, 8)}</p>
                <p className="text-sm text-muted-foreground">
                  {order.profiles?.name || 'Unknown Customer'}
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium">₹{order.total}</p>
                <p className="text-sm text-muted-foreground capitalize">{order.status}</p>
              </div>
            </div>
          ))}
          {orders.length === 0 && (
            <p className="text-center text-muted-foreground py-4">No orders yet</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;