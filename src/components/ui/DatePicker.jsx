import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, getDay, startOfWeek, endOfWeek } from 'date-fns';

const DatePicker = ({ value, onChange, placeholder = "Select date", type = "date" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(value ? new Date(value) : new Date());
  const [selectedDate, setSelectedDate] = useState(value ? new Date(value) : null);
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0, width: 0 });
  const containerRef = useRef(null);
  const popupRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current && 
        !containerRef.current.contains(event.target) &&
        popupRef.current &&
        !popupRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    const handleResize = () => {
      if (isOpen) {
        updatePopupPosition();
      }
    };

    const handleScroll = () => {
      if (isOpen) {
        updatePopupPosition();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      window.addEventListener('resize', handleResize);
      window.addEventListener('scroll', handleScroll);
      
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('scroll', handleScroll);
      };
    }
  }, [isOpen]);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    if (type === "date") {
      onChange(format(date, 'yyyy-MM-dd'));
    } else {
      onChange(format(date, 'yyyy-MM'));
    }
    setIsOpen(false);
  };

  const handleMonthSelect = (month, year) => {
    const date = new Date(year, month);
    setSelectedDate(date);
    onChange(format(date, 'yyyy-MM'));
    setIsOpen(false);
  };

  const navigateMonth = (direction) => {
    setCurrentMonth(prev => direction === 'next' ? addMonths(prev, 1) : subMonths(prev, 1));
  };

  const displayValue = () => {
    if (!value) return placeholder;
    const date = new Date(value);
    return type === "date" ? format(date, 'MMM d, yyyy') : format(date, 'MMM yyyy');
  };

  const updatePopupPosition = () => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const popupWidth = Math.max(rect.width, 300);
      const popupHeight = 400; // Approximate popup height
      
      // Default to positioning above the input
      let top = rect.top + window.scrollY - popupHeight - 4;
      let left = rect.left + window.scrollX;
      
      // Check if there's enough space above, if not, position below
      if (top < window.scrollY + 16) {
        top = rect.bottom + window.scrollY + 4;
      }
      
      // Check right boundary
      if (left + popupWidth > window.innerWidth) {
        left = window.innerWidth - popupWidth - 16; // 16px margin from edge
      }
      
      // Check left boundary
      if (left < 16) {
        left = 16; // 16px margin from left edge
      }
      
      // Final check - if positioned below and still out of bounds, position within viewport
      if (top + popupHeight > window.innerHeight + window.scrollY) {
        top = window.innerHeight + window.scrollY - popupHeight - 16;
      }
      
      setPopupPosition({
        top,
        left,
        width: rect.width
      });
    }
  };

  const handleToggle = () => {
    if (!isOpen) {
      updatePopupPosition();
    }
    setIsOpen(!isOpen);
  };

  const MonthYearPicker = () => {
    const currentYear = currentMonth.getFullYear();
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    return (
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <button
            type="button"
            onClick={() => setCurrentMonth(prev => new Date(prev.getFullYear() - 1, prev.getMonth()))}
            className="p-2 rounded-lg hover:bg-white/20 transition-colors"
          >
            <ChevronLeft className="w-4 h-4 text-white" />
          </button>
          <span className="text-white font-semibold text-lg">{currentYear}</span>
          <button
            type="button"
            onClick={() => setCurrentMonth(prev => new Date(prev.getFullYear() + 1, prev.getMonth()))}
            className="p-2 rounded-lg hover:bg-white/20 transition-colors"
          >
            <ChevronRight className="w-4 h-4 text-white" />
          </button>
        </div>
        
        <div className="grid grid-cols-3 gap-2">
          {months.map((month, index) => (
            <button
              key={month}
              type="button"
              onClick={() => handleMonthSelect(index, currentYear)}
              className={`p-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                selectedDate && selectedDate.getMonth() === index && selectedDate.getFullYear() === currentYear
                  ? 'bg-red-600 text-white shadow-lg'
                  : 'text-white hover:bg-white/20 hover:text-white'
              }`}
            >
              {month}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const DateCalendar = () => (
    <div className="p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={() => navigateMonth('prev')}
          className="p-2 rounded-lg hover:bg-white/20 transition-colors"
        >
          <ChevronLeft className="w-4 h-4 text-white" />
        </button>
        <span className="text-white font-semibold text-lg">
          {format(currentMonth, 'MMMM yyyy')}
        </span>
        <button
          type="button"
          onClick={() => navigateMonth('next')}
          className="p-2 rounded-lg hover:bg-white/20 transition-colors"
        >
          <ChevronRight className="w-4 h-4 text-white" />
        </button>
      </div>

      {/* Days of week */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
          <div key={day} className="text-center text-white/80 text-sm font-medium py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar days */}
      <div className="grid grid-cols-7 gap-1">
        {days.map(day => {
          const isCurrentMonth = isSameMonth(day, currentMonth);
          const isSelected = selectedDate && isSameDay(day, selectedDate);
          const isToday = isSameDay(day, new Date());

          return (
            <button
              key={day.toISOString()}
              type="button"
              onClick={() => handleDateSelect(day)}
              className={`
                p-2 text-sm rounded-lg transition-all duration-200 relative
                ${isCurrentMonth ? 'text-white' : 'text-white/40'}
                ${isSelected ? 'bg-red-600 text-white font-semibold shadow-lg' : 'hover:bg-white/20'}
                ${isToday && !isSelected ? 'ring-1 ring-red-400' : ''}
              `}
            >
              {format(day, 'd')}
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <>
      <div className="relative" ref={containerRef}>
        <button
          type="button"
          onClick={handleToggle}
          className="w-full glass-morphism border border-white/20 text-white rounded-xl px-4 py-3 text-left flex items-center justify-between hover:bg-white/10 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-600/50 backdrop-blur-md"
        >
          <span className={value ? 'text-white' : 'text-white/40'}>
            {displayValue()}
          </span>
          <Calendar className="w-4 h-4 text-white/60" />
        </button>
      </div>

      {isOpen && createPortal(
        <div 
          ref={popupRef}
          className="fixed bg-slate-900/95 backdrop-blur-xl rounded-2xl border border-white/30 shadow-2xl min-w-[300px]"
          style={{
            top: `${popupPosition.top}px`,
            left: `${popupPosition.left}px`,
            minWidth: `${Math.max(popupPosition.width, 300)}px`,
            zIndex: 9999
          }}
        >
          {type === "month" ? <MonthYearPicker /> : <DateCalendar />}
        </div>,
        document.body
      )}
    </>
  );
};

export default DatePicker;
