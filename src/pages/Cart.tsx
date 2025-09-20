import { Link } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/hooks/useCart";
import { FREE_DELIVERY_THRESHOLD, DELIVERY_FEE } from "@/lib/mock-data";

const Cart = () => {
  const {
    cart,
    updateQuantity,
    removeFromCart,
    toggleItemSelection,
    selectAllItems,
    hasSelectedItems
  } = useCart();

  const selectedItems = cart.items.filter(item => item.isSelected);
  const allSelected = cart.items.length > 0 && cart.items.every(item => item.isSelected);
  
  if (cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center min-h-[60vh] flex flex-col justify-center">
        <ShoppingCart className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
        <p className="text-muted-foreground mb-6">
          Add some fresh vegetables to get started!
        </p>
        <Link to="/">
          <Button size="lg" className="bg-ec-green hover:bg-ec-green-dark">
            Shop Now
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 pb-24 md:pb-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Shopping Cart ({cart.items.length})</h1>
          <div className="flex items-center gap-2">
            <Checkbox
              checked={allSelected}
              onCheckedChange={(checked) => selectAllItems(!!checked)}
            />
            <span className="text-sm">Select All</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map((item) => (
              <div
                key={item.id}
                className="bg-card rounded-lg p-4 border border-border space-y-4"
              >
                <div className="flex items-start gap-4">
                  {/* Selection Checkbox */}
                  <Checkbox
                    checked={item.isSelected}
                    onCheckedChange={() => toggleItemSelection(item.id)}
                    className="mt-2"
                  />

                  {/* Product Image */}
                  <div className="w-20 h-20 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold line-clamp-1">{item.product.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          Weight: {item.variant.weight}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="font-semibold text-ec-green">
                            ₹{item.variant.price}
                          </span>
                          {item.variant.originalPrice && item.variant.originalPrice > item.variant.price && (
                            <span className="text-sm text-muted-foreground line-through">
                              ₹{item.variant.originalPrice}
                            </span>
                          )}
                        </div>
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFromCart(item.id)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-3">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="w-8 h-8"
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="font-semibold w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8"
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                      
                      <div className="text-right">
                        <div className="font-semibold">
                          ₹{(item.variant.price * item.quantity).toFixed(0)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-lg p-6 border border-border space-y-4 sticky top-24">
              <h2 className="text-xl font-semibold">Order Summary</h2>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Items ({selectedItems.length})</span>
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

              {cart.subtotal > 0 && cart.subtotal < FREE_DELIVERY_THRESHOLD && (
                <div className="text-sm text-muted-foreground p-3 bg-muted rounded-lg">
                  Add ₹{FREE_DELIVERY_THRESHOLD - cart.subtotal} more for free delivery
                </div>
              )}

              <Button
                size="lg"
                className="w-full bg-ec-green hover:bg-ec-green-dark"
                disabled={!hasSelectedItems()}
                asChild
              >
                <Link to="/checkout">
                  Proceed to Checkout
                </Link>
              </Button>

              <Link to="/" className="block">
                <Button variant="outline" size="lg" className="w-full">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;