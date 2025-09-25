
import React, { useState, useRef, useEffect } from 'react';
import { format, parseISO, differenceInDays, startOfMonth, endOfMonth, addMonths, eachMonthOfInterval, isSameMonth, differenceInCalendarDays, startOfWeek, endOfWeek, eachWeekOfInterval, getWeek, addDays } from 'date-fns';
import { TimelineEvent } from "@/api/entities";

const GanttView = ({ events, departments, currentDate, timeRange, focusDepartment }) => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [dragState, setDragState] = useState(null);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
  const ganttRef = useRef(null);

  // Local state to manage events for drag operations and visual updates
  const [localEvents, setLocalEvents] = useState(events);

  // Effect to update localEvents if the 'events' prop changes
  useEffect(() => {
    setLocalEvents(events);
  }, [events]);

  const getDepartmentColor = (departmentName) => {
    return departments.find(d => d.name === departmentName)?.color || '#9ca3af';
  };

  const getRange = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    switch (timeRange) {
      case 'week':
        return { start: startOfWeek(currentDate), end: endOfWeek(currentDate) };
      case 'month':
        return { start: startOfMonth(currentDate), end: endOfMonth(currentDate) };
      case 'quarter':
        return { start: startOfMonth(currentDate), end: endOfMonth(addMonths(currentDate, 2)) };
      case 'year':
        const startYear = month >= 8 ? year : year - 1;
        const fiscalYearStart = new Date(startYear, 8, 1);
        const fiscalYearEnd = endOfMonth(addMonths(fiscalYearStart, 11));
        return { start: fiscalYearStart, end: fiscalYearEnd };
      default:
        return { start: startOfMonth(currentDate), end: endOfMonth(currentDate) };
    }
  };

  const { start: rangeStart, end: rangeEnd } = getRange();
  const totalDays = differenceInDays(rangeEnd, rangeStart) + 1;

  const getTimePeriods = () => {
    if (timeRange === 'week') {
      return eachWeekOfInterval({ start: rangeStart, end: rangeEnd });
    } else {
      return eachMonthOfInterval({ start: rangeStart, end: rangeEnd });
    }
  };

  const timePeriods = getTimePeriods();

  const today = new Date();
  const todayOffset = differenceInDays(today, rangeStart);
  const todayPosition = Math.max(0, Math.min(100, (todayOffset / totalDays) * 100));
  const showTodayLine = todayOffset >= 0 && todayOffset < totalDays;

  const assignLanes = (deptEvents) => {
    const lanes = [];
    deptEvents.forEach(event => {
      let placed = false;
      const eventStart = parseISO(event.start_date);
      const eventEnd = event.end_date ? parseISO(event.end_date) : eventStart;

      for (let i = 0; i < lanes.length; i++) {
        const lane = lanes[i];
        const hasOverlap = lane.some(laneEvent => {
          const laneEventStart = parseISO(laneEvent.start_date);
          const laneEventEnd = laneEvent.end_date ? parseISO(laneEvent.end_date) : laneEventStart;
          return (eventStart <= laneEventEnd && eventEnd >= laneEventStart);
        });
        if (!hasOverlap) {
          lanes[i].push(event);
          event.lane = i;
          placed = true;
          break;
        }
      }

      if (!placed) {
        event.lane = lanes.length;
        lanes.push([event]);
      }
    });
    return lanes.length;
  };

  // Filter localEvents instead of the prop 'events'
  const filteredEvents = localEvents.filter(event => {
    const eventStart = parseISO(event.start_date);
    const eventEnd = event.end_date ? parseISO(event.end_date) : eventStart;
    return eventStart <= rangeEnd && eventEnd >= rangeStart;
  });

  // Map departments using filteredEvents (which are from localEvents)
  const eventsByDept = focusDepartment
    ? [{ ...focusDepartment, events: filteredEvents.sort((a, b) => parseISO(a.start_date) - parseISO(b.start_date)) }]
    : departments.map(dept => ({
        ...dept,
        events: filteredEvents
          .filter(e => e.department_name === dept.name)
          .sort((a, b) => parseISO(a.start_date) - parseISO(b.start_date))
      }));

  const handleEventClick = (event, mouseEvent) => {
    // Prevent event click if a drag operation is in progress
    if (dragState) return;

    setPopupPosition({
      x: mouseEvent.clientX,
      y: mouseEvent.clientY
    });
    setSelectedEvent(selectedEvent?.id === event.id ? null : event);
  };

  const handleDragStart = (event, handle, mouseEvent) => {
    mouseEvent.stopPropagation(); // Stop event propagation to prevent handleEventClick

    // Close any open popup when dragging starts
    setSelectedEvent(null);

    const originalEndDate = event.end_date ? parseISO(event.end_date) : parseISO(event.start_date);

    const rect = ganttRef.current.getBoundingClientRect();
    const timelineWidth = rect.width - 256; // Subtract department column width
    
    setDragState({
      eventId: event.id,
      handle,
      startX: mouseEvent.clientX,
      originalStartDate: parseISO(event.start_date),
      originalEndDate: originalEndDate,
      timelineWidth,
      pixelsPerDay: timelineWidth / totalDays
    });
  };

  const handleMouseMove = (mouseEvent) => {
    if (!dragState) return;

    const deltaX = mouseEvent.clientX - dragState.startX;
    const daysDelta = Math.round(deltaX / dragState.pixelsPerDay);

    setLocalEvents(prevEvents => prevEvents.map(e => {
      if (e.id === dragState.eventId) {
        let newStartDate = dragState.originalStartDate;
        let newEndDate = dragState.originalEndDate;

        if (dragState.handle === 'start') {
          newStartDate = addDays(dragState.originalStartDate, daysDelta);
          // Ensure newStartDate does not exceed newEndDate (which is based on originalEndDate for now)
          if (newStartDate > newEndDate) newStartDate = newEndDate;
        } else if (dragState.handle === 'end') {
          newEndDate = addDays(dragState.originalEndDate, daysDelta);
          // Ensure newEndDate does not precede newStartDate (which is based on originalStartDate for now)
          if (newEndDate < newStartDate) newEndDate = newStartDate;
        }

        return {
          ...e,
          start_date: format(newStartDate, 'yyyy-MM-dd'),
          end_date: format(newEndDate, 'yyyy-MM-dd')
        };
      }
      return e;
    }));
  };

  const handleMouseUp = async () => {
    if (!dragState) return;

    const eventToUpdate = localEvents.find(e => e.id === dragState.eventId);

    if (!eventToUpdate) {
      setDragState(null);
      return;
    }

    try {
      // The `eventToUpdate` object already holds the visually updated dates from `handleMouseMove`
      const updateData = {
        start_date: eventToUpdate.start_date,
        end_date: eventToUpdate.end_date // Ensure end_date is always present after drag
      };
      
      await TimelineEvent.update(eventToUpdate.id, updateData);
      // No need to reload, localEvents is already updated visually
      // If the parent component needs to be notified of the change, a callback prop should be used here.
    } catch (error) {
      console.error('Error updating event:', error);
      // Optionally, revert localEvents to its state before drag if API call fails
      // This would require storing the original event state in dragState
    } finally {
      setDragState(null);
    }
  };

  useEffect(() => {
    if (dragState) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [dragState, handleMouseMove, handleMouseUp]); // Added handleMouseMove and handleMouseUp to dependencies

  return (
    <div className="glass-card rounded-3xl p-6 overflow-hidden relative" ref={ganttRef}>
      <div className="overflow-x-auto">
        <div className="min-w-[1200px] relative">
          {/* Header */}
          <div className="flex sticky top-0 z-30 bg-slate-900/90 backdrop-blur-sm border-b border-white/20">
            <div className="w-56 flex-shrink-0 border-r border-white/20 p-3">
              <h3 className="text-white font-semibold">
                {focusDepartment ? "Events" : "Departments"}
              </h3>
            </div>
            <div className="flex-1 relative">
              <div className="flex h-12">
                {timePeriods.map((period) => {
                  let periodStart, periodEnd, daysInPeriod, displayText;
                  
                  if (timeRange === 'week') {
                    periodStart = startOfWeek(period);
                    periodEnd = endOfWeek(period);
                    daysInPeriod = 7;
                    displayText = `Week ${getWeek(period)}`;
                  } else {
                    periodStart = isSameMonth(period, rangeStart) ? rangeStart : startOfMonth(period);
                    periodEnd = isSameMonth(period, rangeEnd) ? rangeEnd : endOfMonth(period);
                    daysInPeriod = differenceInCalendarDays(periodEnd, periodStart) + 1;
                    displayText = format(period, 'MMMM');
                  }
                  
                  const width = (daysInPeriod / totalDays) * 100;
                  
                  return (
                    <div 
                      key={period.toISOString()} 
                      style={{ width: `${width}%` }} 
                      className="border-r border-white/20 flex items-center justify-center bg-slate-800/50"
                    >
                      <div className="text-white font-semibold text-sm">
                        {displayText}
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* Current date indicator */}
              {showTodayLine && (
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-yellow-400 z-20 pointer-events-none"
                  style={{ left: `${todayPosition}%` }}
                  title={`Today - ${format(today, 'MMM d, yyyy')}`}
                >
                  <div className="absolute -top-1 -left-1 w-2 h-2 bg-yellow-400 rounded-full" />
                </div>
              )}
            </div>
          </div>
          
          {/* Current date line extending through body */}
          {showTodayLine && (
            <div
              className="absolute top-12 bottom-0 w-0.5 bg-yellow-400/60 z-10 pointer-events-none"
              style={{ left: `calc(256px + ${todayPosition}% * (100% - 256px) / 100)` }}
            />
          )}
          
          {/* Body */}
          <div className="relative">
            {eventsByDept.map(dept => {
              const laneCount = assignLanes(dept.events);
              const minHeight = Math.max(60, laneCount * 36 + 24);
              
              return (
                <div key={dept.id} className="flex border-b border-white/20" style={{ minHeight: `${minHeight}px` }}>
                  <div className="w-56 flex-shrink-0 border-r border-white/20 p-3 flex items-center bg-slate-900/30">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-4 h-4 rounded-full flex-shrink-0" 
                        style={{ backgroundColor: dept.color }}
                      />
                      <span className="text-white text-sm font-medium truncate">
                        {dept.name}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex-1 relative bg-slate-900/20">
                    {dept.events.map(event => {
                      const eventStart = parseISO(event.start_date);
                      const eventEnd = event.end_date ? parseISO(event.end_date) : eventStart;
                      const offset = Math.max(0, differenceInDays(eventStart, rangeStart));
                      const duration = Math.max(1, differenceInDays(eventEnd, eventStart) + 1);
                      const width = Math.max(80, (duration / totalDays) * 100);
                      const left = (offset / totalDays) * 100;

                      if (left > 100 || left + width < 0) return null;

                      const truncatedTitle = event.title.length > 15 ? event.title.substring(0, 12) + '...' : event.title;

                      return (
                        <div
                          key={event.id}
                          className="absolute h-8 rounded-lg flex items-center px-3 overflow-hidden cursor-pointer transition-all duration-200 hover:z-10 hover:shadow-lg hover:scale-105 group"
                          style={{
                            left: `${Math.max(0, left)}%`,
                            width: `${Math.min(100 - Math.max(0, left), width)}%`,
                            top: `${12 + event.lane * 36}px`,
                            backgroundColor: `${getDepartmentColor(event.department_name)}60`,
                            border: `1px solid ${getDepartmentColor(event.department_name)}`,
                            minWidth: '80px'
                          }}
                          onClick={(e) => handleEventClick(event, e)}
                          title={`${event.title}\n${format(eventStart, 'MMM d')} - ${format(eventEnd, 'MMM d')}`}
                        >
                          {/* Start drag handle - more visible */}
                          <div
                            className="absolute left-0 top-0 bottom-0 w-2 cursor-ew-resize bg-white/20 opacity-0 group-hover:opacity-100 hover:bg-white/40 transition-all flex items-center justify-center"
                            onMouseDown={(e) => handleDragStart(event, 'start', e)}
                            title="Drag to change start date"
                          >
                            <div className="w-0.5 h-4 bg-white/60" />
                          </div>
                          
                          <span className="text-white text-xs font-medium truncate select-none px-2">
                            {truncatedTitle}
                          </span>
                          
                          {/* End drag handle - more visible */}
                          <div
                            className="absolute right-0 top-0 bottom-0 w-2 cursor-ew-resize bg-white/20 opacity-0 group-hover:opacity-100 hover:bg-white/40 transition-all flex items-center justify-center"
                            onMouseDown={(e) => handleDragStart(event, 'end', e)}
                            title="Drag to change end date"
                          >
                            <div className="w-0.5 h-4 bg-white/60" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute top-0 right-0 bottom-0 w-8 bg-gradient-to-l from-slate-900/90 via-slate-900/60 to-transparent pointer-events-none flex items-center justify-center">
        <div className="w-1 h-8 bg-white/30 rounded-full animate-pulse" />
      </div>

      {/* Event Details Modal - Now properly positioned outside timeline */}
      {selectedEvent && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/20 z-[9998]" 
            onClick={() => setSelectedEvent(null)}
          />
          
          {/* Modal */}
          <div 
            className="fixed z-[9999] glass-card rounded-2xl p-6 max-w-md shadow-2xl" 
            style={{
              left: Math.min(popupPosition.x + 20, window.innerWidth - 400),
              top: Math.min(popupPosition.y - 150, window.innerHeight - 400),
              maxHeight: '80vh',
              overflowY: 'auto'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-xl font-bold text-white pr-4">{selectedEvent.title}</h3>
              <button 
                onClick={() => setSelectedEvent(null)}
                className="text-white/60 hover:text-white text-xl leading-none flex-shrink-0 ml-2"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-3 text-white/80">
              <div>
                <span className="font-medium text-white">Department: </span>
                {selectedEvent.department_name}
              </div>
              
              <div>
                <span className="font-medium text-white">Dates: </span>
                {format(parseISO(selectedEvent.start_date), 'MMM d, yyyy')}
                {selectedEvent.end_date && (
                  <span> - {format(parseISO(selectedEvent.end_date), 'MMM d, yyyy')}</span>
                )}
              </div>
              
              <div>
                <span className="font-medium text-white">Status: </span>
                <span className="capitalize">{selectedEvent.status.replace('_', ' ')}</span>
              </div>
              
              <div>
                <span className="font-medium text-white">Type: </span>
                <span className="capitalize">{selectedEvent.type}</span>
              </div>
              
              {selectedEvent.description && (
                <div>
                  <span className="font-medium text-white">Description: </span>
                  {selectedEvent.description}
                </div>
              )}
              
              {selectedEvent.tags && selectedEvent.tags.length > 0 && (
                <div>
                  <span className="font-medium text-white">Tags: </span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedEvent.tags.map(tag => (
                      <span key={tag} className="glass-morphism rounded-full px-2 py-1 text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {selectedEvent.involved_departments && selectedEvent.involved_departments.length > 0 && (
                <div>
                  <span className="font-medium text-white">Involved Departments: </span>
                  {selectedEvent.involved_departments.join(', ')}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default GanttView;
