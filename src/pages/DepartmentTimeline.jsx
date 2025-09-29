import React, { useState, useEffect, useCallback } from "react";
import { TimelineEvent, Department } from "@/api/entities";
import { Calendar, ChevronLeft, ChevronRight, Grid, ArrowLeft, Plus, BarChartHorizontal, Users, TrendingUp } from "lucide-react";
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, addWeeks, addMonths, addYears, subWeeks, subMonths, subYears, parseISO } from "date-fns";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

import TimelineView from "../components/timeline/TimelineView";
import CalendarView from "../components/timeline/CalendarView";
import EventCard from "../components/timeline/EventCard";
import GanttView from "../components/timeline/GanttView";
import TeamMembersDialog from "../components/departments/TeamMembersDialog";

export default function DepartmentTimeline() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('gantt');
  const [timeRange, setTimeRange] = useState('year');
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showTeamDialog, setShowTeamDialog] = useState(false);

  const loadData = useCallback(async (departmentName) => {
    try {
      const [eventsData, departmentsData] = await Promise.all([
        TimelineEvent.list("-start_date"),
        Department.list()
      ]);
      
      const department = departmentsData.find(d => d.name === departmentName);
      
      if (!department) {
        navigate(createPageUrl("Departments"));
        return;
      }

      setDepartments(departmentsData);
      setSelectedDepartment(department);
      
      // Filter events for this department
      const deptEvents = eventsData.filter(event => 
        event.department_name === departmentName || 
        event.involved_departments?.includes(departmentName)
      );
      setEvents(deptEvents);
      setFilteredEvents(deptEvents);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const deptName = urlParams.get('dept');
    
    if (deptName) {
      loadData(deptName);
    } else {
      navigate(createPageUrl("Departments"));
    }
  }, [navigate, loadData]);

  const navigateTime = (direction) => {
    if (timeRange === 'week') {
      setCurrentDate(direction === 'next' ? addWeeks(currentDate, 1) : subWeeks(currentDate, 1));
    } else if (timeRange === 'month') {
      setCurrentDate(direction === 'next' ? addMonths(currentDate, 1) : subMonths(currentDate, 1));
    } else if (timeRange === 'quarter') {
      setCurrentDate(direction === 'next' ? addMonths(currentDate, 3) : subMonths(currentDate, 3));
    } else if (timeRange === 'year') {
      setCurrentDate(direction === 'next' ? addYears(currentDate, 1) : subYears(currentDate, 1));
    }
  };

  const getDateRangeTitle = () => {
    if (timeRange === 'week') {
      return `Week of ${format(startOfWeek(currentDate), 'MMM d, yyyy')}`;
    } else if (timeRange === 'month') {
      return format(currentDate, 'MMM yyyy');
    } else if (timeRange === 'quarter') {
      return `Q${Math.floor(currentDate.getMonth() / 3) + 1} ${format(currentDate, 'yyyy')}`;
    } else if (timeRange === 'year') {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      const startYear = month >= 8 ? year : year - 1;
      const endYear = startYear + 1;
      return `${startYear}-${endYear} Season`;
    }
    return '';
  };

  const handleUpdateTeam = async (updatedDepartment) => {
    try {
      await Department.update(updatedDepartment.id, { team_members: updatedDepartment.team_members });
      // Refresh department data
      const departmentsData = await Department.list();
      setDepartments(departmentsData);
      const updatedDept = departmentsData.find(d => d.id === selectedDepartment.id);
      if (updatedDept) {
          setSelectedDepartment(updatedDept);
      }
    } catch (error) {
      console.error("Error updating team:", error);
    }
  };

  const handleAddEventClick = () => {
    if (selectedDepartment) {
      navigate(`${createPageUrl("AddEvent")}?dept=${encodeURIComponent(selectedDepartment.name)}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-card rounded-2xl p-8 text-center">
          <div className="animate-spin w-8 h-8 border-2 border-white/30 border-t-white rounded-full mx-auto mb-4" />
          <p className="text-white/80">Loading department timeline...</p>
        </div>
      </div>
    );
  }

  if (!selectedDepartment) {
    return null;
  }

  return (
    <div className="min-h-screen px-6 py-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="glass-card rounded-3xl p-6">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => navigate(createPageUrl("Departments"))}
              className="glass-morphism rounded-full p-2 text-white/70 hover:text-white glow-on-hover"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div 
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-xl"
              style={{ backgroundColor: selectedDepartment.color }}
            >
              {selectedDepartment.name.charAt(0)}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-white text-glow">{selectedDepartment.name} Timeline</h1>
                <button
                  onClick={() => setShowTeamDialog(true)}
                  className="glass-morphism rounded-full p-2 text-white/70 hover:text-white glow-on-hover"
                  title="Team Members"
                >
                  <Users className="w-5 h-5" />
                </button>
              </div>
              <p className="text-white/70">Department projects, events, and deadlines</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleAddEventClick}
                className="glass-intense rounded-2xl px-4 py-2 text-white font-medium glow-on-hover"
              >
                <Plus className="w-4 h-4 mr-2 inline" />
                Add Event
              </button>
              <button
                onClick={() => {/* TODO: Add peak period functionality */}}
                className="glass-morphism rounded-2xl px-4 py-2 text-white/80 hover:text-white font-medium glow-on-hover"
                title="Add Peak Period"
              >
                <TrendingUp className="w-4 h-4 mr-2 inline" />
                Peak Period
              </button>
            </div>
          </div>
          
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {/* Time Navigation */}
              <div className="glass-morphism rounded-2xl p-2 flex items-center gap-2">
                <button
                  onClick={() => navigateTime('prev')}
                  className="glass-morphism rounded-xl p-2 text-white/70 hover:text-white glow-on-hover"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-white font-medium px-4 text-sm">
                  {getDateRangeTitle()}
                </span>
                <button
                  onClick={() => navigateTime('next')}
                  className="glass-morphism rounded-xl p-2 text-white/70 hover:text-white glow-on-hover"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Time Range Selector */}
              <div className="glass-morphism rounded-2xl p-2 flex">
                {['week', 'month', 'quarter', 'year'].map((range) => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`px-3 py-1 rounded-xl text-sm font-medium capitalize transition-all duration-300 ${
                      timeRange === range
                        ? 'glass-intense text-white'
                        : 'text-white/70 hover:text-white'
                    }`}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>

            {/* View Mode Selector */}
            <div className="glass-morphism rounded-2xl p-2 flex">
              {[
                { mode: 'timeline', icon: Calendar },
                { mode: 'gantt', icon: BarChartHorizontal },
                { mode: 'calendar', icon: Grid }
              ].map(({ mode, icon: Icon }) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`p-2 rounded-xl transition-all duration-300 ${
                    viewMode === mode
                      ? 'glass-intense text-white'
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div>

          {viewMode === 'timeline' && (
            <TimelineView 
              events={filteredEvents}
              departments={departments}
              currentDate={currentDate}
              timeRange={timeRange}
              focusDepartment={selectedDepartment}
            />
          )}

          {viewMode === 'gantt' && (
            <GanttView 
              events={filteredEvents}
              departments={departments}
              currentDate={currentDate}
              timeRange={timeRange}
              focusDepartment={selectedDepartment}
            />
          )}
          
          {viewMode === 'calendar' && (
            <CalendarView 
              events={filteredEvents}
              departments={departments}
              currentDate={currentDate}
            />
          )}
        </div>
      </div>

      {/* Team Members Dialog */}
      <TeamMembersDialog
        department={selectedDepartment}
        onUpdate={handleUpdateTeam}
        isOpen={showTeamDialog}
        onClose={() => setShowTeamDialog(false)}
      />

    </div>
  );
}