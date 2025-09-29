import React from "react";
import { motion } from "framer-motion";
import { format, parseISO, isWithinInterval, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, eachDayOfInterval, eachMonthOfInterval, isSameDay } from "date-fns";
import EventCard from "./EventCard";

export default function TimelineView({ events, departments, currentDate, timeRange, focusDepartment }) {
  const getDaysInRange = () => {
    if (timeRange === 'week') {
      return eachDayOfInterval({
        start: startOfWeek(currentDate),
        end: endOfWeek(currentDate)
      });
    }
    return [];
  };

  const getMonthsInRange = () => {
    if (timeRange === 'year') {
      return eachMonthOfInterval({
        start: startOfYear(currentDate),
        end: endOfYear(currentDate)
      });
    }
    return [];
  };

  const getEventsForPeriod = (period) => {
    return events.filter(event => {
      const startDate = parseISO(event.start_date);
      const endDate = event.end_date ? parseISO(event.end_date) : startDate;
      return isWithinInterval(period, { start: startDate, end: endDate }) ||
             isWithinInterval(startDate, { start: period, end: period }) ||
             (startDate <= period && endDate >= period);
    });
  };

  const getDepartmentColor = (departmentName) => {
    const dept = departments.find(d => d.name === departmentName);
    return dept?.color || '#8B5CF6';
  };

  // Yearly view - show months
  if (timeRange === 'year') {
    const months = getMonthsInRange();
    
    return (
      <div className="glass-card rounded-3xl p-6">
        <h2 className="text-xl font-bold text-white mb-6 text-glow">
          {focusDepartment ? `${focusDepartment.name} - ` : ''}Yearly Timeline
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {months.map((month) => {
            const monthEvents = getEventsForPeriod(month);
            return (
              <motion.div
                key={month.toISOString()}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-morphism rounded-2xl p-4 min-h-[200px]"
              >
                <div className="text-center mb-4">
                  <div className="text-lg font-bold text-white">
                    {format(month, 'MMM')}
                  </div>
                  <div className="text-white/60 text-sm">
                    {format(month, 'yyyy')}
                  </div>
                </div>
                <div className="space-y-2">
                  {monthEvents.slice(0, 4).map((event) => (
                    <div
                      key={event.id}
                      className="glass-morphism rounded-lg p-2 text-xs glow-on-hover"
                      style={{
                        borderLeft: `3px solid ${getDepartmentColor(event.department_name)}`
                      }}
                    >
                      <div className="font-medium text-white/90 truncate">
                        {event.title}
                      </div>
                      <div className="text-white/60 truncate">
                        {event.department_name}
                      </div>
                      <div className="text-white/50 text-xs">
                        {event.type}
                      </div>
                    </div>
                  ))}
                  {monthEvents.length > 4 && (
                    <div className="text-xs text-white/50 text-center">
                      +{monthEvents.length - 4} more
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    );
  }

  // Weekly view - show days
  if (timeRange === 'week') {
    const days = getDaysInRange();
    
    return (
      <div className="glass-card rounded-3xl p-6">
        <h2 className="text-xl font-bold text-white mb-6 text-glow">
          {focusDepartment ? `${focusDepartment.name} - ` : ''}Weekly Timeline
        </h2>
        <div className="grid grid-cols-7 gap-4">
          {days.map((day) => {
            const dayEvents = getEventsForPeriod(day);
            return (
              <motion.div
                key={day.toISOString()}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-morphism rounded-2xl p-4 min-h-[200px]"
              >
                <div className="text-center mb-4">
                  <div className="text-white font-medium">
                    {format(day, 'EEE')}
                  </div>
                  <div className={`text-2xl font-bold ${
                    isSameDay(day, new Date()) ? 'text-yellow-400' : 'text-white/80'
                  }`}>
                    {format(day, 'd')}
                  </div>
                </div>
                <div className="space-y-2">
                  {dayEvents.map((event) => (
                    <div
                      key={event.id}
                      className="glass-morphism rounded-lg p-2 text-xs glow-on-hover"
                      style={{
                        borderLeft: `3px solid ${getDepartmentColor(event.department_name)}`
                      }}
                    >
                      <div className="font-medium text-white/90 truncate">
                        {event.title}
                      </div>
                      <div className="text-white/60 truncate">
                        {event.department_name}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    );
  }

  // Monthly/Quarterly view - show as a list grouped by department or chronologically
  if (focusDepartment) {
    // Show only focused department events chronologically
    return (
      <div className="glass-card rounded-3xl p-6">
        <h2 className="text-xl font-bold text-white mb-6 text-glow">
          {focusDepartment.name} - {timeRange === 'month' ? 'Monthly' : 'Quarterly'} Events
        </h2>
        <div className="space-y-4">
          {events.map((event) => (
            <EventCard key={event.id} event={event} departments={departments} />
          ))}
          {events.length === 0 && (
            <div className="text-center py-8">
              <p className="text-white/60 text-lg">No events found for the selected time range</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Default grouped view
  const eventsByDepartment = events.reduce((acc, event) => {
    const dept = event.department_name;
    if (!acc[dept]) acc[dept] = [];
    acc[dept].push(event);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {Object.entries(eventsByDepartment).map(([departmentName, deptEvents]) => {
        const deptColor = getDepartmentColor(departmentName);
        return (
          <motion.div
            key={departmentName}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-3xl p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: deptColor }}
              />
              <h3 className="text-xl font-bold text-white text-glow">{departmentName}</h3>
              <span className="glass-morphism rounded-full px-3 py-1 text-sm text-white/70">
                {deptEvents.length} events
              </span>
            </div>
            <div className="grid gap-4">
              {deptEvents.map((event) => (
                <EventCard key={event.id} event={event} departments={departments} />
              ))}
            </div>
          </motion.div>
        );
      })}
      {Object.keys(eventsByDepartment).length === 0 && (
        <div className="glass-card rounded-3xl p-12 text-center">
          <p className="text-white/60 text-lg">No events found for the selected time range</p>
        </div>
      )}
    </div>
  );
}