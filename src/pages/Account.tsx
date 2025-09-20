import { useState } from "react";
import { User, ShoppingBag, Wallet, LogOut, Edit, Package, Clock, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MOCK_USER } from "@/lib/mock-data";
import { toast } from "@/hooks/use-toast";

const Account = () => {
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: MOCK_USER.name,
    phone: MOCK_USER.phone,
    email: MOCK_USER.email,
  });

  // Mock orders data
  const orders = [
    {
      id: "ORD-001",
      date: "2024-01-15",
      items: ["Fresh Tomatoes", "Cut Carrots", "Spinach"],
      total: 450,
      status: "delivered" as const,
    },
    {
      id: "ORD-002", 
      date: "2024-01-12",
      items: ["Mixed Vegetables", "Bell Peppers"],
      total: 380,
      status: "delivered" as const,
    },
    {
      id: "ORD-003",
      date: "2024-01-10",
      items: ["Baby Corn", "Fresh Tomatoes"],
      total: 280,
      status: "cancelled" as const,
    }
  ];

  // Mock wallet transactions
  const walletTransactions = [
    {
      id: "TXN-001",
      type: "credit" as const,
      amount: 100,
      description: "First order cashback",
      date: "2024-01-15",
    },
    {
      id: "TXN-002",
      type: "credit" as const,
      amount: 38,
      description: "Order cashback (10%)",
      date: "2024-01-12", 
    },
    {
      id: "TXN-003",
      type: "debit" as const,
      amount: 200,
      description: "Used for order ORD-004",
      date: "2024-01-08",
    }
  ];

  const walletThreshold = 300;
  const progress = Math.min((MOCK_USER.walletBalance / walletThreshold) * 100, 100);

  const handleProfileUpdate = () => {
    // Simulate profile update
    setEditing(false);
    toast({
      title: "Profile Updated",
      description: "Your profile has been updated successfully",
    });
  };

  const handleLogout = () => {
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully",
    });
    // Clear user data and redirect to home
    localStorage.removeItem("ecfresh_user");
    window.location.href = "/";
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "cancelled":
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      case "preparing":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 pb-24 md:pb-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">My Account</h1>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Orders</span>
            </TabsTrigger>
            <TabsTrigger value="wallet" className="flex items-center gap-2">
              <Wallet className="w-4 h-4" />
              <span className="hidden sm:inline">Wallet</span>
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6 mt-6">
            <div className="bg-card rounded-lg p-6 border border-border">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Profile Information</h2>
                {!editing ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditing(true)}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditing(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleProfileUpdate}
                      className="bg-ec-green hover:bg-ec-green-dark"
                    >
                      Save
                    </Button>
                  </div>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={profile.name}
                    onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                    disabled={!editing}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={profile.phone}
                    onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                    disabled={!editing}
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    value={profile.email}
                    onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                    disabled={!editing}
                  />
                </div>
              </div>

              <Separator className="my-6" />

              <Button
                variant="destructive"
                onClick={handleLogout}
                className="flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-4 mt-6">
            {orders.length === 0 ? (
              <div className="text-center py-8">
                <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No orders yet</h3>
                <p className="text-muted-foreground">
                  Start shopping for fresh vegetables!
                </p>
              </div>
            ) : (
              orders.map((order) => (
                <div key={order.id} className="bg-card rounded-lg p-6 border border-border">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold">{order.id}</h3>
                      <p className="text-sm text-muted-foreground">
                        Ordered on {new Date(order.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(order.status)}
                      <Badge className={getStatusColor(order.status)}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div>
                      <h4 className="font-medium text-sm">Items:</h4>
                      <p className="text-sm text-muted-foreground">
                        {order.items.join(", ")}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">Total: ₹{order.total}</span>
                      {order.status === "delivered" && (
                        <Button variant="outline" size="sm">
                          Reorder
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </TabsContent>

          {/* Wallet Tab */}
          <TabsContent value="wallet" className="space-y-6 mt-6">
            {/* Wallet Balance */}
            <div className="bg-gradient-to-r from-ec-green/10 to-ec-orange/10 rounded-lg p-6 border border-ec-green/20">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-ec-green text-primary-foreground p-2 rounded-lg">
                    <Wallet className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Wallet Balance</h3>
                    <p className="text-sm text-muted-foreground">Available to use</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-ec-green">₹{MOCK_USER.walletBalance}</div>
                  {MOCK_USER.walletBalance >= walletThreshold ? (
                    <div className="text-sm text-ec-green font-medium">Ready to use!</div>
                  ) : (
                    <div className="text-sm text-muted-foreground">Min ₹300 to use</div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Progress to ₹{walletThreshold}</span>
                  {MOCK_USER.walletBalance < walletThreshold && (
                    <span className="text-muted-foreground">
                      ₹{walletThreshold - MOCK_USER.walletBalance} more needed
                    </span>
                  )}
                </div>
                
                <Progress value={progress} className="h-2" />
                
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>₹0</span>
                  <span>₹{walletThreshold}</span>
                </div>
              </div>
            </div>

            {/* How it Works */}
            <div className="bg-card rounded-lg p-6 border border-border">
              <h3 className="font-semibold mb-4">How Wallet Works</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-ec-green mt-2 flex-shrink-0"></div>
                  <p>
                    <span className="font-medium">First Order:</span> Get ₹100 cashback instantly when you complete your first order
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-ec-green mt-2 flex-shrink-0"></div>
                  <p>
                    <span className="font-medium">Regular Orders:</span> Earn 10% cashback on every order once delivered
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-ec-orange mt-2 flex-shrink-0"></div>
                  <p>
                    <span className="font-medium">Minimum Usage:</span> You can use wallet balance only if you have ₹300 or more
                  </p>
                </div>
              </div>
            </div>

            {/* Transaction History */}
            <div className="bg-card rounded-lg p-6 border border-border">
              <h3 className="font-semibold mb-4">Recent Transactions</h3>
              {walletTransactions.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No transactions yet</p>
              ) : (
                <div className="space-y-3">
                  {walletTransactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{transaction.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(transaction.date).toLocaleDateString()}
                        </p>
                      </div>
                      <span className={`font-semibold ${
                        transaction.type === "credit" ? "text-green-600" : "text-red-600"
                      }`}>
                        {transaction.type === "credit" ? "+" : "-"}₹{transaction.amount}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Account;