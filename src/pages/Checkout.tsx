import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, MapPin, Calendar, Clock, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/hooks/useCart";
import { MOCK_USER } from "@/lib/mock-data";
import { toast } from "@/hooks/use-toast";

const Checkout = () => {
  const { cart, applyWalletDiscount, removeWalletDiscount, canUseWallet } = useCart();
  const [loading, setLoading] = useState(false);
  const [useWallet, setUseWallet] = useState(false);
  
  const [formData, setFormData] = useState({
    name: MOCK_USER.name,
    phone: MOCK_USER.phone,
    email: MOCK_USER.email,
    address: "",
    landmark: "",
    pincode: localStorage.getItem("ecfresh_pincode") || "",
    deliveryDate: "",
    deliveryTime: "",
    paymentMethod: "cod" as "cod" | "online"
  });

  const selectedItems = cart.items.filter(item => item.isSelected);
  const canProceed = selectedItems.length > 0 && formData.name && formData.phone && 
                    formData.address && formData.pincode && formData.deliveryDate && 
                    formData.deliveryTime;

  // Generate available delivery slots (20+ hours from now)
  const generateDeliverySlots = () => {
    const slots = [];
    const now = new Date();
    const minDeliveryTime = new Date(now.getTime() + 20 * 60 * 60 * 1000); // 20 hours from now
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(minDeliveryTime);
      date.setDate(date.getDate() + i);
      
      const dateStr = date.toISOString().split('T')[0];
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
      const dayDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      
      slots.push({
        date: dateStr,
        label: i === 0 ? `Tomorrow (${dayName}, ${dayDate})` : `${dayName}, ${dayDate}`
      });
    }
    
    return slots;
  };

  const timeSlots = [
    "9:00 AM - 12:00 PM",
    "12:00 PM - 3:00 PM", 
    "3:00 PM - 6:00 PM",
    "6:00 PM - 9:00 PM"
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleWalletToggle = (checked: boolean) => {
    setUseWallet(checked);
    if (checked && canUseWallet(MOCK_USER.walletBalance)) {
      // Apply maximum possible wallet discount
      const maxDiscount = Math.min(MOCK_USER.walletBalance, cart.subtotal);
      applyWalletDiscount(maxDiscount);
    } else {
      removeWalletDiscount();
    }
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    
    try {
      // Simulate order placement
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Order Placed Successfully! 🎉",
        description: "You will receive a confirmation shortly",
      });
      
      // Clear cart and redirect
      window.location.href = "/account?tab=orders";
    } catch (error) {
      toast({
        title: "Order Failed",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (selectedItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">No items selected for checkout</h1>
        <Link to="/cart">
          <Button className="bg-ec-green hover:bg-ec-green-dark">
            Go back to Cart
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 pb-24 md:pb-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link to="/cart">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Checkout</h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Details */}
            <div className="bg-card rounded-lg p-6 border border-border">
              <h2 className="text-xl font-semibold mb-4">Customer Details</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="+91 9876543210"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="your@email.com"
                  />
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="bg-card rounded-lg p-6 border border-border">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Delivery Address
              </h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="address">Street Address *</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    placeholder="House/Flat No, Street Name"
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="landmark">Landmark</Label>
                    <Input
                      id="landmark"
                      value={formData.landmark}
                      onChange={(e) => handleInputChange("landmark", e.target.value)}
                      placeholder="Near landmark"
                    />
                  </div>
                  <div>
                    <Label htmlFor="pincode">Pincode *</Label>
                    <Input
                      id="pincode"
                      value={formData.pincode}
                      onChange={(e) => handleInputChange("pincode", e.target.value)}
                      placeholder="682001"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery Slot */}
            <div className="bg-card rounded-lg p-6 border border-border">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Delivery Slot
              </h2>
              
              <div className="space-y-4">
                <div>
                  <Label>Select Date *</Label>
                  <RadioGroup 
                    value={formData.deliveryDate} 
                    onValueChange={(value) => handleInputChange("deliveryDate", value)}
                    className="mt-2"
                  >
                    {generateDeliverySlots().map((slot) => (
                      <div key={slot.date} className="flex items-center space-x-2">
                        <RadioGroupItem value={slot.date} id={slot.date} />
                        <Label htmlFor={slot.date}>{slot.label}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div>
                  <Label>Select Time *</Label>
                  <RadioGroup 
                    value={formData.deliveryTime} 
                    onValueChange={(value) => handleInputChange("deliveryTime", value)}
                    className="mt-2"
                  >
                    {timeSlots.map((slot) => (
                      <div key={slot} className="flex items-center space-x-2">
                        <RadioGroupItem value={slot} id={slot} />
                        <Label htmlFor={slot} className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          {slot}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-card rounded-lg p-6 border border-border">
              <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
              
              {/* Wallet Option */}
              {canUseWallet(MOCK_USER.walletBalance) && (
                <div className="mb-4 p-4 bg-ec-green/10 rounded-lg border border-ec-green/20">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="useWallet"
                      checked={useWallet}
                      onCheckedChange={handleWalletToggle}
                    />
                    <Label htmlFor="useWallet" className="flex items-center gap-2 font-medium">
                      <Wallet className="w-4 h-4" />
                      Use Wallet Balance (₹{MOCK_USER.walletBalance} available)
                    </Label>
                  </div>
                  {useWallet && (
                    <p className="text-sm text-muted-foreground mt-2">
                      ₹{cart.walletDiscount} will be deducted from your wallet
                    </p>
                  )}
                </div>
              )}

              <RadioGroup 
                value={formData.paymentMethod} 
                onValueChange={(value: "cod" | "online") => handleInputChange("paymentMethod", value)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="cod" id="cod" />
                  <Label htmlFor="cod">Cash on Delivery</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="online" id="online" />
                  <Label htmlFor="online">Online Payment (UPI/Card)</Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-lg p-6 border border-border space-y-4 sticky top-24">
              <h2 className="text-xl font-semibold">Order Summary</h2>
              
              {/* Items */}
              <div className="space-y-3">
                {selectedItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-muted rounded overflow-hidden">
                      <img 
                        src={item.product.image} 
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm line-clamp-1">{item.product.name}</h4>
                      <p className="text-xs text-muted-foreground">
                        {item.variant.weight} × {item.quantity}
                      </p>
                    </div>
                    <span className="font-semibold text-sm">
                      ₹{(item.variant.price * item.quantity).toFixed(0)}
                    </span>
                  </div>
                ))}
              </div>

              <Separator />
              
              {/* Price Breakdown */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{cart.subtotal}</span>
                </div>
                
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span>
                    {cart.deliveryFee === 0 ? (
                      <span className="text-ec-green">Free</span>
                    ) : (
                      `₹${cart.deliveryFee}`
                    )}
                  </span>
                </div>

                {cart.walletDiscount > 0 && (
                  <div className="flex justify-between text-ec-green">
                    <span>Wallet Discount</span>
                    <span>-₹{cart.walletDiscount}</span>
                  </div>
                )}

                <Separator />
                
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>₹{cart.total}</span>
                </div>
              </div>

              <Button
                size="lg"
                className="w-full bg-ec-green hover:bg-ec-green-dark"
                disabled={!canProceed || loading}
                onClick={handlePlaceOrder}
              >
                {loading ? "Placing Order..." : `Place Order (₹${cart.total})`}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;