import React, { useState, useEffect } from 'react';
import { X, Clock, CheckCircle } from 'lucide-react';

const UpdateNotification = () => {
  const [updates, setUpdates] = useState([]);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Initialize with current updates
    const currentUpdates = [
      {
        id: 1,
        timestamp: new Date().toLocaleString(),
        title: "Admin Login Removed",
        description: "Removed authentication system for streamlined development workflow",
        type: "feature"
      },
      {
        id: 2,
        timestamp: new Date().toLocaleString(),
        title: "Default Landing Page",
        description: "Set Departments page as the default landing page",
        type: "improvement"
      },
      {
        id: 3,
        timestamp: new Date().toLocaleString(),
        title: "Update Notification System",
        description: "Added left-side notification panel to track development changes",
        type: "feature"
      }
    ];
    setUpdates(currentUpdates);
  }, []);

  const addUpdate = (update) => {
    const newUpdate = {
      ...update,
      id: Date.now(),
      timestamp: new Date().toLocaleString()
    };
    setUpdates(prev => [newUpdate, ...prev.slice(0, 9)]); // Keep only last 10 updates
  };

  // Expose addUpdate function globally for easy access
  useEffect(() => {
    window.addDevUpdate = addUpdate;
    return () => {
      delete window.addDevUpdate;
    };
  }, []);

  const getTypeColor = (type) => {
    switch (type) {
      case 'feature': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'improvement': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'fix': return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
      case 'breaking': return 'bg-red-500/20 text-red-300 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed left-4 top-24 z-50 glass-morphism rounded-full p-3 text-white/70 hover:text-white glow-on-hover"
        title="Show Updates"
      >
        <Clock className="w-5 h-5" />
      </button>
    );
  }

  return (
    <div className="fixed left-4 top-24 z-50 w-80 max-h-[calc(100vh-120px)] overflow-hidden">
      <div className="glass-card rounded-2xl p-4 border border-white/20">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <h3 className="text-white font-semibold">Development Updates</h3>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="text-white/60 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        
        <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
          {updates.map((update) => (
            <div
              key={update.id}
              className={`glass-morphism rounded-lg p-3 border ${getTypeColor(update.type)}`}
            >
              <div className="flex items-start justify-between gap-2 mb-1">
                <h4 className="text-sm font-medium text-white">{update.title}</h4>
                <span className="text-xs text-white/50 whitespace-nowrap">
                  {update.timestamp.split(',')[1]?.trim() || update.timestamp}
                </span>
              </div>
              <p className="text-xs text-white/70 leading-relaxed">
                {update.description}
              </p>
              <div className="mt-2">
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium capitalize ${getTypeColor(update.type)}`}>
                  {update.type}
                </span>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 pt-3 border-t border-white/10">
          <p className="text-xs text-white/50 text-center">
            Total Updates: {updates.length}
          </p>
        </div>
      </div>
      
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.5);
        }
      `}</style>
    </div>
  );
};

export default UpdateNotification;
