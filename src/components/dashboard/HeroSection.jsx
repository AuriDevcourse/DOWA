import React from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";

export default function HeroSection({ user }) {
  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? "Good morning" : currentHour < 18 ? "Good afternoon" : "Good evening";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="glass-card rounded-3xl p-8 md:p-12 glow-on-hover"
    >
      <div className="flex flex-col md:flex-row items-start justify-between gap-6">
        <div className="flex-1">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex items-center gap-3 mb-4"
          >
            <div className="glass-intense rounded-full p-2">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-white/80 font-medium">Welcome back</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-4xl md:text-5xl font-bold text-white mb-4 text-glow"
          >
            {greeting}, {user?.full_name?.split(' ')[0] || 'there'}
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-white/70 text-lg mb-6 leading-relaxed"
          >
            Ready to create something amazing today? Your creative workspace awaits.
          </motion.p>
          
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="glass-intense rounded-full px-6 py-3 text-white font-semibold flex items-center gap-2 glow-on-hover group"
          >
            Start Creating
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
          </motion.button>
        </div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="glass-intense rounded-3xl p-6 w-full md:w-80"
        >
          <div className="text-center">
            <div className="glass-morphism rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl font-bold text-white">
                {user?.full_name?.charAt(0) || 'U'}
              </span>
            </div>
            <h3 className="text-white font-semibold mb-2">{user?.full_name || 'User'}</h3>
            <p className="text-white/60 text-sm mb-4">{user?.email || 'user@example.com'}</p>
            <div className="glass-morphism rounded-full px-3 py-1 inline-block">
              <span className="text-white/80 text-xs font-medium">✨ Premium Member</span>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}