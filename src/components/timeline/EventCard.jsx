import React from "react";
import { motion } from "framer-motion";
import { format, parseISO } from "date-fns";
import { Calendar, Clock, Users, Tag, AlertCircle } from "lucide-react";

export default function EventCard({ event, departments }) {
  const getDepartmentColor = (departmentName) => {
    const dept = departments.find(d => d.name === departmentName);
    return dept?.color || '#8B5CF6';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: 'text-blue-400',
      medium: 'text-yellow-400',
      high: 'text-orange-400',
      critical: 'text-red-400'
    };
    return colors[priority] || 'text-gray-400';
  };

  const getStatusColor = (status) => {
    const colors = {
      planning: 'text-purple-400 bg-purple-400/20',
      active: 'text-green-400 bg-green-400/20',
      completed: 'text-blue-400 bg-blue-400/20',
      on_hold: 'text-gray-400 bg-gray-400/20'
    };
    return colors[status] || 'text-gray-400 bg-gray-400/20';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-morphism rounded-2xl p-4 glow-on-hover"
      style={{
        borderLeft: `4px solid ${getDepartmentColor(event.department_name)}`
      }}
    >
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-white mb-1 text-lg">
            {event.title}
          </h3>
          <p className="text-white/60 text-sm line-clamp-2">
            {event.description}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <span className={`glass-morphism rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(event.status)}`}>
            {event.status.replace('_', ' ')}
          </span>
          <AlertCircle className={`w-4 h-4 ${getPriorityColor(event.priority)}`} />
        </div>
      </div>

      <div className="flex items-center gap-4 text-sm text-white/70 mb-3">
        <div className="flex items-center gap-1">
          <Calendar className="w-4 h-4" />
          <span>{format(parseISO(event.start_date), 'MMM d, yyyy')}</span>
          {event.end_date && (
            <>
              <span>-</span>
              <span>{format(parseISO(event.end_date), 'MMM d, yyyy')}</span>
            </>
          )}
        </div>
        
        <div className="flex items-center gap-1">
          <Clock className="w-4 h-4" />
          <span className="capitalize">{event.type}</span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: getDepartmentColor(event.department_name) }}
          />
          <span className="text-white/80 text-sm font-medium">
            {event.department_name}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {event.involved_departments?.length > 0 && (
            <div className="flex items-center gap-1 text-xs text-white/60">
              <Users className="w-3 h-3" />
              <span>+{event.involved_departments.length}</span>
            </div>
          )}
          
          {event.tags?.length > 0 && (
            <div className="flex items-center gap-1">
              {event.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="glass-morphism rounded-full px-2 py-1 text-xs text-white/70"
                >
                  {tag}
                </span>
              ))}
              {event.tags.length > 3 && (
                <span className="text-xs text-white/50">
                  +{event.tags.length - 3}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}