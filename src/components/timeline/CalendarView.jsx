import React from "react";
import { motion } from "framer-motion";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, parseISO, isWithinInterval, getDay } from "date-fns";

export default function CalendarView({ events, departments, currentDate }) {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getEventsForDay = (day) => {
    // Skip weekends (Saturday = 6, Sunday = 0)
    const dayOfWeek = getDay(day);
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return [];
    }

    return events.filter(event => {
      const startDate = parseISO(event.start_date);
      const endDate = event.end_date ? parseISO(event.end_date) : startDate;
      return isWithinInterval(day, { start: startDate, end: endDate });
    });
  };

  const getDepartmentColor = (departmentName) => {
    const dept = departments.find(d => d.name === departmentName);
    return dept?.color || '#8B5CF6';
  };

  // Create weeks array
  const weeks = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  return (
    <div className="glass-card rounded-3xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white text-glow">Calendar View</h2>
        <div className="glass-morphism rounded-full px-4 py-2">
          <span className="text-white font-medium">{format(currentDate, 'MMMM yyyy')}</span>
        </div>
      </div>
      
      {/* Days of week header */}
      <div className="glass-morphism rounded-2xl p-4 mb-4">
        <div className="grid grid-cols-7 gap-3">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="text-center text-white/80 font-semibold py-2 text-sm">
              {day}
            </div>
          ))}
        </div>
      </div>

      {/* Calendar grid */}
      <div className="space-y-3">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="grid grid-cols-7 gap-3">
            {week.map((day) => {
              const dayEvents = getEventsForDay(day);
              const isToday = isSameDay(day, new Date());
              const isCurrentMonth = isSameMonth(day, currentDate);
              const isWeekend = getDay(day) === 0 || getDay(day) === 6;

              return (
                <motion.div
                  key={day.toISOString()}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: weekIndex * 0.05 + (day.getDay() * 0.01) }}
                  className={`glass-morphism rounded-2xl p-3 min-h-[100px] transition-all duration-300 hover:scale-105 cursor-pointer group ${
                    isCurrentMonth ? 'hover:bg-white/5' : 'opacity-50'
                  } ${isToday ? 'ring-2 ring-yellow-400/60 bg-yellow-400/5' : ''} ${
                    isWeekend ? 'bg-slate-800/30' : ''
                  }`}
                >
                  <div className={`text-sm font-semibold mb-2 flex items-center justify-center w-6 h-6 rounded-full ${
                    isToday 
                      ? 'bg-yellow-400 text-slate-900' 
                      : isWeekend 
                        ? 'text-white/50' 
                        : 'text-white/90 group-hover:text-white'
                  }`}>
                    {format(day, 'd')}
                  </div>
                  
                  {isCurrentMonth && (
                    <div className="space-y-1">
                      {dayEvents.slice(0, 3).map((event, index) => (
                        <motion.div
                          key={event.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 + index * 0.05 }}
                          className="glass-morphism rounded-lg p-1.5 text-xs hover:scale-105 transition-all duration-200 cursor-pointer"
                          style={{
                            backgroundColor: `${getDepartmentColor(event.department_name)}15`,
                            borderLeft: `3px solid ${getDepartmentColor(event.department_name)}`
                          }}
                          title={`${event.title} - ${event.department_name}`}
                        >
                          <div className="text-white/90 font-medium truncate leading-tight">
                            {event.title}
                          </div>
                          <div className="text-white/60 text-xs truncate">
                            {event.department_name}
                          </div>
                        </motion.div>
                      ))}
                      {dayEvents.length > 3 && (
                        <div className="glass-morphism rounded-lg p-1 text-center">
                          <span className="text-xs text-white/60 font-medium">
                            +{dayEvents.length - 3} more
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}