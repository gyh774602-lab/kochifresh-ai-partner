import { Wallet, Gift } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/useAuth";

export const LoyaltyProgressBar = () => {
  const { profile } = useAuth();
  const walletBalance = profile?.wallet_balance || 0;
  const walletThreshold = 300; // Can purchase at ₹300
  const progress = Math.min((walletBalance / walletThreshold) * 100, 100);
  const remainingAmount = Math.max(walletThreshold - walletBalance, 0);
  const canUseWallet = walletBalance >= walletThreshold;

  return (
    <div className="bg-gradient-to-r from-ec-green/10 to-ec-orange/10 rounded-xl p-3 md:p-4 border border-ec-green/20 mx-2 md:mx-0">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="bg-ec-green text-primary-foreground p-1.5 md:p-2 rounded-lg">
            <Wallet className="w-3 h-3 md:w-4 md:h-4" />
          </div>
          <div>
            <h3 className="font-semibold text-xs md:text-sm">Wallet Balance</h3>
            <p className="text-xs text-muted-foreground">Amount earned: ₹{walletBalance}</p>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-sm md:text-lg font-bold text-ec-green">₹{walletBalance}</div>
          {canUseWallet ? (
            <div className="text-xs text-ec-green font-medium">Ready to use!</div>
          ) : (
            <div className="text-xs text-muted-foreground">Min ₹300</div>
          )}
        </div>
      </div>

      <div className="space-y-1 md:space-y-2">
        <div className="flex items-center justify-between text-xs md:text-sm">
          <span>Progress</span>
          {!canUseWallet ? (
            <span className="text-muted-foreground">
              ₹{remainingAmount} more to unlock
            </span>
          ) : (
            <span className="text-ec-green font-medium flex items-center gap-1">
              <Gift className="w-3 h-3" />
              Can use for purchase!
            </span>
          )}
        </div>
        
        <Progress 
          value={progress} 
          className="h-1 md:h-2"
        />
        
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>₹0</span>
          <span>₹{walletThreshold}</span>
        </div>
      </div>
    </div>
  );
};