import { Wallet, Gift } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { MOCK_USER } from "@/lib/mock-data";

export const LoyaltyProgressBar = () => {
  const user = MOCK_USER;
  const nextRewardThreshold = 500; // Next reward at ₹500
  const progress = Math.min((user.loyaltyPoints / nextRewardThreshold) * 100, 100);
  const remainingPoints = Math.max(nextRewardThreshold - user.loyaltyPoints, 0);

  return (
    <div className="bg-gradient-to-r from-ec-green/10 to-ec-orange/10 rounded-xl p-4 border border-ec-green/20">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="bg-ec-green text-primary-foreground p-2 rounded-lg">
            <Wallet className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">Loyalty Rewards</h3>
            <p className="text-xs text-muted-foreground">Earn cashback on every order</p>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-lg font-bold text-ec-green">₹{user.walletBalance}</div>
          <div className="text-xs text-muted-foreground">Wallet Balance</div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span>Points: {user.loyaltyPoints}</span>
          {remainingPoints > 0 ? (
            <span className="text-muted-foreground">
              {remainingPoints} more for next reward
            </span>
          ) : (
            <span className="text-ec-green font-medium flex items-center gap-1">
              <Gift className="w-3 h-3" />
              Reward Ready!
            </span>
          )}
        </div>
        
        <Progress 
          value={progress} 
          className="h-2"
        />
        
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>0</span>
          <span>₹{nextRewardThreshold}</span>
        </div>
      </div>

      {!user.isFirstOrder && (
        <div className="mt-3 p-2 bg-ec-orange/10 rounded-lg">
          <p className="text-xs text-center">
            <span className="font-medium text-ec-orange">First order cashback:</span> Get ₹100 back instantly!
          </p>
        </div>
      )}
    </div>
  );
};