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
      <h2 className="text-xl font-bold text-white mb-6 text-glow">Calendar View</h2>
      
      {/* Days of week header */}
      <div className="grid grid-cols-7 gap-2 mb-4">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="text-center text-white/60 font-medium py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="space-y-2">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="grid grid-cols-7 gap-2">
            {week.map((day) => {
              const dayEvents = getEventsForDay(day);
              const isToday = isSameDay(day, new Date());
              const isCurrentMonth = isSameMonth(day, currentDate);
              const isWeekend = getDay(day) === 0 || getDay(day) === 6;

              return (
                <motion.div
                  key={day.toISOString()}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`glass-morphism rounded-xl p-2 min-h-[80px] ${
                    isCurrentMonth ? '' : 'opacity-40'
                  } ${isToday ? 'ring-2 ring-yellow-400' : ''} ${
                    isWeekend ? 'bg-gray-500/10' : ''
                  }`}
                >
                  <div className={`text-sm font-medium mb-1 ${
                    isToday ? 'text-yellow-400' : isWeekend ? 'text-white/50' : 'text-white/80'
                  }`}>
                    {format(day, 'd')}
                  </div>
                  {!isWeekend && (
                    <div className="space-y-1">
                      {dayEvents.slice(0, 2).map((event) => (
                        <div
                          key={event.id}
                          className="text-xs p-1 rounded truncate"
                          style={{
                            backgroundColor: `${getDepartmentColor(event.department_name)}20`,
                            borderLeft: `2px solid ${getDepartmentColor(event.department_name)}`
                          }}
                          title={`${event.title} - ${event.department_name}`}
                        >
                          <div className="text-white/90 font-medium truncate">
                            {event.title}
                          </div>
                        </div>
                      ))}
                      {dayEvents.length > 2 && (
                        <div className="text-xs text-white/50 text-center">
                          +{dayEvents.length - 2} more
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