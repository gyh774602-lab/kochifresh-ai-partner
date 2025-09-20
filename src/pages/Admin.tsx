import { useState } from "react";
import { 
  BarChart3, Package, Image, MapPin, Users, Settings, 
  Plus, Search, Filter, Edit, Trash2, Eye, TrendingUp,
  ShoppingCart, DollarSign, Clock, AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Admin = () => {
  const [activeSection, setActiveSection] = useState("overview");

  // Mock data
  const todayStats = {
    orders: 24,
    revenue: 12450,
    activeDeliveries: 8,
    lowStock: 3
  };

  const recentOrders = [
    { id: "ORD-001", customer: "Rahul Kumar", pincode: "682001", items: 3, total: 450, status: "preparing" },
    { id: "ORD-002", customer: "Priya Singh", pincode: "682016", items: 2, total: 320, status: "paid" },
    { id: "ORD-003", customer: "Arun Nair", pincode: "682020", items: 5, total: 680, status: "delivered" },
  ];

  const products = [
    { id: "1", name: "Fresh Tomatoes", category: "Fresh Vegetables", price: 80, stock: 45, status: "active" },
    { id: "2", name: "Cut Carrots", category: "Ready-to-Cook", price: 120, stock: 2, status: "active" },
    { id: "3", name: "Spinach Leaves", category: "Leafy Greens", price: 60, stock: 28, status: "active" },
  ];

  const banners = [
    { id: "1", title: "Fresh Vegetables Daily", active: true, order: 1 },
    { id: "2", title: "Free Delivery Above ₹300", active: true, order: 2 },
    { id: "3", title: "First Order Cashback", active: false, order: 3 },
  ];

  const StatCard = ({ title, value, icon: Icon, trend }: any) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {trend && (
          <p className="text-xs text-muted-foreground">
            <span className="text-green-600">↗ {trend}%</span> from yesterday
          </p>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-card border-r border-border p-6 min-h-screen">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-ec-green">ECFresh Admin</h1>
            <p className="text-sm text-muted-foreground">Store Management</p>
          </div>

          <nav className="space-y-2">
            {[
              { id: "overview", icon: BarChart3, label: "Overview" },
              { id: "orders", icon: ShoppingCart, label: "Orders" },
              { id: "products", icon: Package, label: "Products" },
              { id: "banners", icon: Image, label: "Banners" },
              { id: "pincodes", icon: MapPin, label: "Pincodes" },
              { id: "drivers", icon: Users, label: "Drivers" },
              { id: "reports", icon: TrendingUp, label: "Sales & Reports" },
              { id: "settings", icon: Settings, label: "Settings" },
            ].map((item) => (
              <Button
                key={item.id}
                variant={activeSection === item.id ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveSection(item.id)}
              >
                <item.icon className="w-4 h-4 mr-3" />
                {item.label}
              </Button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold tracking-tight">
                  {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}
                </h2>
                <p className="text-muted-foreground">
                  Manage your ECFresh store operations
                </p>
              </div>
              <Button className="bg-ec-green hover:bg-ec-green-dark">
                <Plus className="w-4 h-4 mr-2" />
                New
              </Button>
            </div>

            {/* Overview Section */}
            {activeSection === "overview" && (
              <div className="space-y-8">
                {/* Stats Grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <StatCard 
                    title="Today's Orders" 
                    value={todayStats.orders} 
                    icon={ShoppingCart}
                    trend={12}
                  />
                  <StatCard 
                    title="Today's Revenue" 
                    value={`₹${todayStats.revenue.toLocaleString()}`} 
                    icon={DollarSign}
                    trend={8}
                  />
                  <StatCard 
                    title="Active Deliveries" 
                    value={todayStats.activeDeliveries} 
                    icon={Clock}
                  />
                  <StatCard 
                    title="Low Stock Items" 
                    value={todayStats.lowStock} 
                    icon={AlertTriangle}
                  />
                </div>

                {/* Recent Orders */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Orders</CardTitle>
                    <CardDescription>Latest orders from customers</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentOrders.map((order) => (
                        <div key={order.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                          <div>
                            <h4 className="font-semibold">{order.id}</h4>
                            <p className="text-sm text-muted-foreground">
                              {order.customer} • {order.pincode} • {order.items} items
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="font-semibold">₹{order.total}</span>
                            <Badge className={
                              order.status === "delivered" ? "bg-green-100 text-green-800" :
                              order.status === "preparing" ? "bg-blue-100 text-blue-800" :
                              "bg-yellow-100 text-yellow-800"
                            }>
                              {order.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Orders Section */}
            {activeSection === "orders" && (
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input placeholder="Search orders..." className="pl-10" />
                  </div>
                  <Button variant="outline">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                </div>

                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <Card key={order.id}>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center gap-4">
                              <h3 className="font-semibold">{order.id}</h3>
                              <Badge className={
                                order.status === "delivered" ? "bg-green-100 text-green-800" :
                                order.status === "preparing" ? "bg-blue-100 text-blue-800" :
                                "bg-yellow-100 text-yellow-800"
                              }>
                                {order.status}
                              </Badge>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {order.customer} • {order.pincode} • {order.items} items • ₹{order.total}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Products Section */}
            {activeSection === "products" && (
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input placeholder="Search products..." className="pl-10" />
                  </div>
                  <Button className="bg-ec-green hover:bg-ec-green-dark">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Product
                  </Button>
                </div>

                <div className="grid gap-4">
                  {products.map((product) => (
                    <Card key={product.id}>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center gap-3">
                              <h3 className="font-semibold">{product.name}</h3>
                              {product.stock < 5 && (
                                <Badge variant="destructive">Low Stock</Badge>
                              )}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {product.category} • ₹{product.price} • Stock: {product.stock}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="sm" className="text-destructive">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Banners Section */}
            {activeSection === "banners" && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Banner Management</CardTitle>
                    <CardDescription>
                      Manage homepage banners (16:4 aspect ratio recommended)
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {banners.map((banner) => (
                        <div key={banner.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-4 bg-muted rounded border"></div>
                            <div>
                              <h4 className="font-medium">{banner.title}</h4>
                              <p className="text-sm text-muted-foreground">Order: {banner.order}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge variant={banner.active ? "default" : "secondary"}>
                              {banner.active ? "Active" : "Inactive"}
                            </Badge>
                            <Button variant="outline" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <Button className="mt-4 bg-ec-green hover:bg-ec-green-dark">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Banner
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Sales Reports Section */}
            {activeSection === "reports" && (
              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-3">
                  <StatCard 
                    title="30-Day Revenue" 
                    value="₹3,45,670" 
                    icon={DollarSign}
                    trend={15}
                  />
                  <StatCard 
                    title="Average Order Value" 
                    value="₹425" 
                    icon={ShoppingCart}
                    trend={8}
                  />
                  <StatCard 
                    title="Total Orders (30d)" 
                    value="812" 
                    icon={Package}
                    trend={12}
                  />
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Revenue Chart</CardTitle>
                    <CardDescription>Daily revenue for the last 30 days</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80 bg-muted rounded-lg flex items-center justify-center">
                      <p className="text-muted-foreground">Chart placeholder - Revenue data visualization</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Export Data</CardTitle>
                    <CardDescription>Download reports for selected date range</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-4">
                      <Button variant="outline">Export Orders CSV</Button>
                      <Button variant="outline">Export Sales Report</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Other sections placeholder */}
            {![
              "overview", "orders", "products", "banners", "reports"
            ].includes(activeSection) && (
              <Card>
                <CardContent className="p-12 text-center">
                  <h3 className="text-xl font-semibold mb-2">
                    {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)} Section
                  </h3>
                  <p className="text-muted-foreground">
                    This section is under development. Coming soon!
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
