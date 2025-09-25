import React from "react";
import { motion } from "framer-motion";

export default function StatsGrid({ stats }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="glass-card rounded-2xl p-6 glow-on-hover group"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="glass-morphism rounded-xl p-3 group-hover:scale-110 transition-transform duration-300">
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <span className="text-green-400 text-sm font-medium">{stat.trend}</span>
          </div>
          
          <div>
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-1 text-glow">
              {stat.value}
            </h3>
            <p className="text-white/60 text-sm font-medium">{stat.label}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}