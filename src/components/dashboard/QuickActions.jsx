import React from "react";
import { motion } from "framer-motion";
import { Plus, Upload, Bookmark, Settings, Zap, Coffee } from "lucide-react";

const actions = [
  { icon: Plus, label: "New Project", color: "text-purple-400", desc: "Start fresh" },
  { icon: Upload, label: "Upload Files", color: "text-pink-400", desc: "Add resources" },
  { icon: Bookmark, label: "Saved Items", color: "text-blue-400", desc: "Your bookmarks" },
  { icon: Zap, label: "Quick Actions", color: "text-yellow-400", desc: "Shortcuts" },
  { icon: Settings, label: "Preferences", color: "text-green-400", desc: "Customize" },
  { icon: Coffee, label: "Take a Break", color: "text-orange-400", desc: "You've earned it" },
];

export default function QuickActions() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      <div className="glass-card rounded-3xl p-6">
        <h2 className="text-xl font-bold text-white mb-4 text-glow">Quick Actions</h2>
        <div className="space-y-3">
          {actions.map((action, index) => (
            <motion.button
              key={action.label}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="glass-morphism rounded-2xl p-4 w-full text-left glow-on-hover group"
            >
              <div className="flex items-center gap-3">
                <div className="glass-intense rounded-xl p-2 group-hover:scale-110 transition-transform duration-300">
                  <action.icon className={`w-4 h-4 ${action.color}`} />
                </div>
                <div>
                  <div className="font-medium text-white text-sm">{action.label}</div>
                  <div className="text-white/50 text-xs">{action.desc}</div>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      <div className="glass-card rounded-3xl p-6">
        <h3 className="text-lg font-bold text-white mb-4 text-glow">Daily Quote</h3>
        <div className="glass-morphism rounded-2xl p-4">
          <blockquote className="text-white/80 italic text-sm leading-relaxed mb-3">
            "Design is not just what it looks like and feels like. Design is how it works."
          </blockquote>
          <cite className="text-white/50 text-xs">— Steve Jobs</cite>
        </div>
      </div>

      <div className="glass-card rounded-3xl p-6">
        <h3 className="text-lg font-bold text-white mb-4 text-glow">Today's Focus</h3>
        <div className="space-y-2">
          <div className="glass-morphism rounded-xl p-3 flex items-center justify-between">
            <span className="text-white/80 text-sm">Complete UI Design</span>
            <div className="w-2 h-2 rounded-full bg-green-400" />
          </div>
          <div className="glass-morphism rounded-xl p-3 flex items-center justify-between">
            <span className="text-white/80 text-sm">Review Code</span>
            <div className="w-2 h-2 rounded-full bg-yellow-400" />
          </div>
          <div className="glass-morphism rounded-xl p-3 flex items-center justify-between">
            <span className="text-white/80 text-sm">Client Meeting</span>
            <div className="w-2 h-2 rounded-full bg-purple-400" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}