
import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { format, parseISO, differenceInDays, startOfMonth, endOfMonth, addMonths, eachMonthOfInterval, isSameMonth, differenceInCalendarDays, startOfWeek, endOfWeek, eachWeekOfInterval, getWeek, addDays } from 'date-fns';
import { TimelineEvent } from "@/api/entities";
import { Edit, Trash2, AlertTriangle, Crown, Megaphone, Handshake, Calendar, Newspaper, Code, DollarSign, Settings, FolderKanban, Building2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';

const GanttView = ({ events, departments, currentDate, timeRange, focusDepartment }) => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [dragState, setDragState] = useState(null);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [eventDragState, setEventDragState] = useState(null);
  const [showPeakPeriodForm, setShowPeakPeriodForm] = useState(false);
  const [peakPeriods, setPeakPeriods] = useState([
    {
      id: 1,
      name: "TechBBQ Main Event",
      description: "Peak conference period with maximum activity",
      start_date: "2025-10-08",
      end_date: "2025-10-12",
      color: "#ef4444",
      intensity: "high"
    },
    {
      id: 2,
      name: "Holiday Season",
      description: "Reduced activity during holidays",
      start_date: "2025-12-20",
      end_date: "2026-01-05",
      color: "#f59e0b",
      intensity: "low"
    }
  ]);
  const ganttRef = useRef(null);
  const navigate = useNavigate();

  // Function to get department-specific icon
  const getDepartmentIcon = (departmentName) => {
    const iconMap = {
      'Management': Crown,
      'Marketing': Megaphone,
      'Partnerships': Handshake,
      'Events': Calendar,
      'PR': Newspaper,
      'Program': Code,
      'Finance': DollarSign,
      'Operations': Settings,
      'Project Management': FolderKanban
    };
    
    return iconMap[departmentName] || Building2;
  };

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

  // Calculate peak period positions
  const getVisiblePeakPeriods = () => {
    return peakPeriods.filter(period => {
      const periodStart = parseISO(period.start_date);
      const periodEnd = parseISO(period.end_date);
      return periodStart <= rangeEnd && periodEnd >= rangeStart;
    }).map(period => {
      const periodStart = parseISO(period.start_date);
      const periodEnd = parseISO(period.end_date);
      const startOffset = Math.max(0, differenceInDays(periodStart, rangeStart));
      const endOffset = Math.min(totalDays, differenceInDays(periodEnd, rangeStart) + 1);
      const left = (startOffset / totalDays) * 100;
      const width = ((endOffset - startOffset) / totalDays) * 100;
      
      return {
        ...period,
        left: Math.max(0, left),
        width: Math.min(100 - Math.max(0, left), width)
      };
    });
  };

  const visiblePeakPeriods = getVisiblePeakPeriods();

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

    // Calculate position relative to viewport for portal
    const rect = mouseEvent.target.getBoundingClientRect();
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

  useEffect(() => {
    if (eventDragState) {
      document.addEventListener('mousemove', handleEventDragMove);
      document.addEventListener('mouseup', handleEventDragEnd);
      return () => {
        document.removeEventListener('mousemove', handleEventDragMove);
        document.removeEventListener('mouseup', handleEventDragEnd);
      };
    }
  }, [eventDragState]);

  const handleEditEvent = () => {
    if (selectedEvent) {
      navigate(`${createPageUrl("AddEvent")}?eventId=${selectedEvent.id}&dept=${encodeURIComponent(selectedEvent.department_name)}`);
    }
  };

  const handleDeleteEvent = async () => {
    if (!selectedEvent) return;
    
    try {
      await TimelineEvent.delete(selectedEvent.id);
      // Remove from local state
      setLocalEvents(prevEvents => prevEvents.filter(e => e.id !== selectedEvent.id));
      setSelectedEvent(null);
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const handleEventDragStart = (event, mouseEvent) => {
    mouseEvent.preventDefault();
    const rect = ganttRef.current.getBoundingClientRect();
    setEventDragState({
      event,
      startY: mouseEvent.clientY,
      startDepartment: event.department_name,
      offset: {
        x: mouseEvent.clientX - rect.left,
        y: mouseEvent.clientY - rect.top
      }
    });
  };

  const handleEventDragMove = (mouseEvent) => {
    if (!eventDragState) return;
    
    const rect = ganttRef.current.getBoundingClientRect();
    const currentY = mouseEvent.clientY - rect.top;
    
    // Calculate which department row we're over
    const rowHeight = 60; // Approximate row height
    const headerHeight = 48; // Header height
    const rowIndex = Math.floor((currentY - headerHeight) / rowHeight);
    
    const departmentsList = focusDepartment ? [focusDepartment] : departments;
    const targetDepartment = departmentsList[rowIndex];
    
    if (targetDepartment && targetDepartment.name !== eventDragState.event.department_name) {
      // Update the visual state
      setEventDragState(prev => ({
        ...prev,
        targetDepartment: targetDepartment.name,
        currentY: currentY
      }));
    }
  };

  const handleEventDragEnd = async () => {
    if (!eventDragState) return;
    
    const { event, targetDepartment } = eventDragState;
    
    if (targetDepartment && targetDepartment !== event.department_name) {
      try {
        // Update the event's department
        const updatedEvent = {
          ...event,
          department_name: targetDepartment
        };
        
        await TimelineEvent.update(event.id, updatedEvent);
        
        // Update local state
        setLocalEvents(prevEvents => 
          prevEvents.map(e => e.id === event.id ? updatedEvent : e)
        );
      } catch (error) {
        console.error('Error updating event department:', error);
      }
    }
    
    setEventDragState(null);
  };

  return (
    <div className="glass-card rounded-3xl p-6 overflow-hidden relative" ref={ganttRef} style={{ minHeight: '1000px' }}>
      <div className="overflow-hidden glass-scroll">
        <div className="min-w-[1200px] relative">
          {/* Header */}
          <div className="flex sticky top-0 z-30 glass-morphism border-b border-white/20 rounded-t-2xl overflow-hidden shadow-lg">
            <div className="w-56 flex-shrink-0 border-r border-white/20 p-4 glass-intense rounded-tl-2xl">
              <h3 className="text-white font-semibold text-sm">
                {focusDepartment ? "Events" : "Departments"}
              </h3>
            </div>
            <div className="flex-1 relative">
              {/* Peak Period Background Indicators */}
              <div className="absolute inset-0 pointer-events-none">
                {visiblePeakPeriods.map(period => (
                  <div
                    key={period.id}
                    className="absolute inset-y-0 opacity-20"
                    style={{
                      left: `${period.left}%`,
                      width: `${period.width}%`,
                      backgroundColor: period.color
                    }}
                    title={`${period.name}: ${period.description}`}
                  />
                ))}
              </div>

              {/* Peak Period Labels */}
              <div className="absolute top-0 left-0 right-0 h-6 glass-intense border-b border-white/10 rounded-tr-2xl overflow-hidden">
                {visiblePeakPeriods.map(period => (
                  <div
                    key={`label-${period.id}`}
                    className="absolute inset-y-0 flex items-center px-2"
                    style={{
                      left: `${period.left}%`,
                      width: `${period.width}%`
                    }}
                  >
                    <div className="flex items-center gap-1 text-xs text-white/80 truncate">
                      <div 
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: period.color }}
                      />
                      <span className="font-medium truncate">{period.name}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex h-12 mt-6 rounded-tr-2xl overflow-hidden">
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
                    displayText = format(period, 'MMM');
                  }
                  
                  const width = (daysInPeriod / totalDays) * 100;
                  
                  return (
                    <div 
                      key={period.toISOString()} 
                      style={{ width: `${width}%` }} 
                      className="border-r border-white/20 flex items-center justify-center bg-slate-800/50 hover:bg-slate-700/50 transition-colors duration-200"
                    >
                      <div className="text-white font-semibold text-sm px-2 py-1 rounded-lg bg-slate-700/30 backdrop-blur-sm">
                        {displayText}
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* Current date indicator - now above everything */}
              {showTodayLine && (
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-yellow-400 z-30 pointer-events-none"
                  style={{ left: `${todayPosition}%` }}
                  title={`Today - ${format(today, 'MMM d, yyyy')}`}
                >
                  <div className="absolute -top-2 -left-1.5 w-3 h-3 bg-yellow-400 rounded-full shadow-lg" />
                  <div className="absolute -top-1 -left-0.5 w-1 h-1 bg-yellow-200 rounded-full" />
                </div>
              )}
            </div>
          </div>
          
          {/* Peak Period Background extending through body */}
          <div className="absolute top-18 bottom-0 left-56 right-0 pointer-events-none">
            {visiblePeakPeriods.map(period => (
              <div
                key={`body-${period.id}`}
                className="absolute inset-y-0 opacity-10"
                style={{
                  left: `${period.left}%`,
                  width: `${period.width}%`,
                  backgroundColor: period.color
                }}
              />
            ))}
          </div>

          {/* Current date line extending through body */}
          {showTodayLine && (
            <div
              className="absolute top-18 bottom-0 w-0.5 bg-yellow-400/80 z-20 pointer-events-none shadow-lg"
              style={{ left: `calc(256px + ${todayPosition}% * (100% - 256px) / 100)` }}
            />
          )}
          
          {/* Body */}
          <div className="relative">
            {eventsByDept.map(dept => {
              const laneCount = assignLanes(dept.events);
              const minHeight = Math.max(60, laneCount * 36 + 24);
              
              return (
                <div key={dept.id} className={`flex border-b border-white/20 ${
                  eventDragState?.targetDepartment === dept.name ? 'bg-white/10' : ''
                }`} style={{ minHeight: `${minHeight}px` }}>
                  <div className="w-56 flex-shrink-0 border-r border-white/20 p-4 flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: dept.color }}
                    />
                    {React.createElement(getDepartmentIcon(dept.name), {
                      className: "w-4 h-4 text-white/70"
                    })}
                    <span className="text-white font-medium">{dept.name}</span>
                    {eventDragState?.targetDepartment === dept.name && (
                      <span className="text-xs text-white/60 ml-2">Drop here</span>
                    )}
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
                          className={`absolute h-8 rounded-lg flex items-center px-3 overflow-hidden transition-all duration-200 hover:z-10 hover:shadow-lg hover:opacity-80 group ${
                            eventDragState?.event.id === event.id ? 'cursor-grabbing opacity-70 z-50' : 'cursor-grab'
                          }`}
                          style={{
                            left: `${Math.max(0, left)}%`,
                            width: `${Math.min(100 - Math.max(0, left), width)}%`,
                            top: `${12 + event.lane * 36}px`,
                            backgroundColor: `${getDepartmentColor(event.department_name)}60`,
                            border: `1px solid ${getDepartmentColor(event.department_name)}`,
                            minWidth: '80px'
                          }}
                          onClick={(e) => handleEventClick(event, e)}
                          onMouseDown={(e) => handleEventDragStart(event, e)}
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
      

      {/* Event Details Modal - Rendered via Portal */}
      {selectedEvent && createPortal(
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
              left: `${Math.min(popupPosition.x, window.innerWidth - 400)}px`,
              top: `${Math.min(popupPosition.y, window.innerHeight - 300)}px`,
              transform: popupPosition.x > window.innerWidth - 400 ? 'translateX(-100%)' : 'none'
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
            
            {/* Action Buttons */}
            <div className="flex items-center gap-2 mt-6 pt-4 border-t border-white/20">
              <button
                onClick={handleEditEvent}
                className="flex-1 glass-morphism rounded-lg px-4 py-2 text-white/80 hover:text-white transition-all duration-300 flex items-center justify-center gap-2 glow-blue"
              >
                <Edit className="w-4 h-4" />
                Edit Event
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="flex-1 glass-morphism rounded-lg px-4 py-2 text-white/80 hover:text-red-400 transition-all duration-300 flex items-center justify-center gap-2 glow-red"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>
        </>,
        document.body
      )}

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && selectedEvent && createPortal(
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/40 z-[9998]" 
            onClick={() => setShowDeleteConfirm(false)}
          />
          
          {/* Confirmation Modal */}
          <div 
            className="fixed z-[9999] glass-card rounded-2xl p-6 max-w-md shadow-2xl" 
            style={{
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-red-400" />
              <h3 className="text-xl font-bold text-white">Delete Event</h3>
            </div>
            
            <div className="mb-6">
              <p className="text-white/80 mb-2">
                Are you sure you want to delete the event <strong>"{selectedEvent.title}"</strong>?
              </p>
              <div className="glass-morphism rounded-xl p-3">
                <p className="text-sm text-white/70 mb-2">This action will:</p>
                <ul className="text-sm text-white/60 space-y-1">
                  <li>• Remove the event from the timeline permanently</li>
                  <li>• Delete all associated data</li>
                  <li>• Cannot be undone</li>
                </ul>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 glass-morphism rounded-lg px-4 py-2 text-white/80 hover:text-white transition-all duration-300"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteEvent}
                className="flex-1 bg-red-600 hover:bg-red-700 rounded-lg px-4 py-2 text-white font-medium transition-all duration-300"
              >
                Delete Event
              </button>
            </div>
          </div>
        </>,
        document.body
      )}
    </div>
  );
};

export default GanttView;
