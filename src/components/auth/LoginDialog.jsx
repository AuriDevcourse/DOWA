import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Eye, EyeOff } from "lucide-react";

export default function LoginDialog({ isOpen, onClose, onSuccess }) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Simple password check
    setTimeout(() => {
      if (password === "admin123") {
        onSuccess();
        setPassword("");
        setError("");
      } else {
        setError("Incorrect password. Please try again.");
      }
      setLoading(false);
    }, 500);
  };

  const handleClose = () => {
    setPassword("");
    setError("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="glass-card border-white/30 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5" />
            Admin Access Required
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label className="text-white/80">Password</Label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="glass-morphism border-white/20 text-white placeholder:text-white/50 pr-10"
                required
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {error && (
              <p className="text-red-400 text-sm">{error}</p>
            )}
          </div>
        </form>

        <DialogFooter className="border-t border-white/20 pt-4">
          <Button variant="outline" onClick={handleClose} className="glass-morphism border-white/20 text-white hover:bg-white/10">
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={loading || !password}
            className="glass-intense text-white"
          >
            {loading ? (
              <>
                <div className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full mr-2" />
                Checking...
              </>
            ) : (
              "Login"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}