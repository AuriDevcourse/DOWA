import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  X, 
  Users, 
  Info, 
  BarChart3, 
  Calendar, 
  Plus, 
  ChevronDown, 
  ChevronUp,
  Building2,
  Briefcase,
  Palette,
  Megaphone,
  DollarSign,
  Cog,
  FolderOpen,
  UserCheck,
  Handshake,
  CalendarDays,
  Edit,
  Edit3,
  Save,
  Trash2,
  Wrench,
  Crown,
  Newspaper,
  Code,
  Settings,
  FolderKanban
} from "lucide-react";
import { Department, TimelineEvent } from "@/api/entities";
import TeamMembersDialog from "@/components/departments/TeamMembersDialog";
import DepartmentInfoDialog from "@/components/departments/DepartmentInfoDialog";
import { format } from "date-fns";
// import DatePicker from "@/components/ui/DatePicker";

// Temporary simple DatePicker replacement
const DatePicker = ({ value, onChange, placeholder = "Select date" }) => {
  const formatDateValue = (dateValue) => {
    if (!dateValue) return '';
    try {
      const date = new Date(dateValue);
      if (isNaN(date.getTime())) return '';
      return format(date, 'yyyy-MM-dd');
    } catch (error) {
      console.error('Date formatting error:', error);
      return '';
    }
  };

  return (
    <input
      type="date"
      value={formatDateValue(value)}
      onChange={(e) => onChange && onChange(e.target.value)}
      className="glass-morphism border-white/20 text-white text-sm px-3 py-2 rounded-lg"
      placeholder={placeholder}
    />
  );
};
// import { HighlightedText } from "@/utils/textHighlight.jsx";

// Highlighting component - working version
const HighlightedText = ({ text, searchTerm, className = "" }) => {
  if (!searchTerm || !text) {
    return <span className={className}>{text}</span>;
  }

  try {
    // Create regex for case-insensitive search
    const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    
    return (
      <span className={className}>
        {parts.map((part, index) => {
          // Check if this part matches the search term (case-insensitive)
          if (part.toLowerCase() === searchTerm.toLowerCase()) {
            return (
              <span 
                key={index} 
                className="bg-yellow-400/50 text-yellow-100 px-1 rounded-sm font-semibold shadow-sm"
              >
                {part}
              </span>
            );
          }
          return <span key={index}>{part}</span>;
        })}
      </span>
    );
  } catch (error) {
    console.error('Error in HighlightedText:', error);
    return <span className={className}>{text}</span>;
  }
};

// Simple error boundary component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="glass-card rounded-2xl p-8 text-center">
            <p className="text-glass-muted mb-4">Something went wrong loading the departments.</p>
            <button 
              onClick={() => this.setState({ hasError: false, error: null })}
              className="glass-intense text-white px-4 py-2 rounded-lg"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default function Departments() {
  const [departments, setDepartments] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [showTeamDialog, setShowTeamDialog] = useState(false);
  const [showInfoDialog, setShowInfoDialog] = useState(false);
  const [infoDepartment, setInfoDepartment] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [highlightedDepartments, setHighlightedDepartments] = useState(new Set());
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchDetails, setShowSearchDetails] = useState(false);
  const [editingDate, setEditingDate] = useState(null);
  const [showAddDate, setShowAddDate] = useState(false);
  const [newDateData, setNewDateData] = useState(null);
  const navigate = useNavigate();

  // Available search tags
  const searchTags = [
    { id: 'people', label: 'People', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
    { id: 'departments', label: 'Departments', color: 'bg-green-500/20 text-green-300 border-green-500/30' },
    { id: 'tools', label: 'Tools', color: 'bg-purple-500/20 text-purple-300 border-purple-500/30' },
    { id: 'emails', label: 'Emails', color: 'bg-orange-500/20 text-orange-300 border-orange-500/30' }
  ];

  // Toggle tag selection
  const toggleTag = (tagId) => {
    setSelectedTags(prev => 
      prev.includes(tagId) 
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  // Load dates from localStorage or use default
  const getInitialDates = () => {
    const saved = localStorage.getItem('importantDates');
    if (saved) {
      return JSON.parse(saved);
    }
    return [
    {
      date: "October 3, 2025",
      day: "Friday",
      event: "Bar Night for Everyone",
      type: "social",
      icon: "🍻"
    },
    {
      date: "October 10, 2025", 
      day: "Friday",
      event: "TechBBQ Main Event",
      type: "conference",
      icon: "🎪"
    },
    {
      date: "October 15, 2025",
      day: "Wednesday", 
      event: "Partnership Review Meeting",
      type: "meeting",
      icon: "🤝"
    },
    {
      date: "October 22, 2025",
      day: "Wednesday",
      event: "Marketing Campaign Launch",
      type: "launch",
      icon: "🚀"
    },
    {
      date: "November 1, 2025",
      day: "Saturday",
      event: "Team Building Workshop",
      type: "workshop",
      icon: "🏗️"
    },
    {
      date: "November 8, 2025",
      day: "Saturday",
      event: "Quarterly Review Meeting",
      type: "meeting",
      icon: "📊"
    },
    {
      date: "November 15, 2025",
      day: "Saturday",
      event: "Holiday Party Planning",
      type: "social",
      icon: "🎉"
    },
    {
      date: "November 22, 2025",
      day: "Friday",
      event: "Product Launch Event",
      type: "launch",
      icon: "🚀"
    }
    ];
  };

  const [upcomingDates, setUpcomingDates] = useState(() => {
    try {
      return getInitialDates();
    } catch (error) {
      console.error('Error loading initial dates:', error);
      return [];
    }
  });

  // Save dates to localStorage whenever they change
  const saveDates = (newDates) => {
    setUpcomingDates(newDates);
    localStorage.setItem('importantDates', JSON.stringify(newDates));
  };

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
      'Projects': FolderKanban,
      'Investor Relations': DollarSign,
      'HR': UserCheck
    };
    
    return iconMap[departmentName] || Building2;
  };

  useEffect(() => {
    loadData();
  }, []);

  // Re-run search when tags change
  useEffect(() => {
    if (searchQuery.trim()) {
      handleSearch(searchQuery);
    }
  }, [selectedTags]);

  const loadData = async () => {
    try {
      const [departmentsData, eventsData] = await Promise.all([
        Department.list(),
        TimelineEvent.list()
      ]);
      setDepartments(departmentsData || []);
      setEvents(eventsData || []);
    } catch (error) {
      console.error("Error loading data:", error);
      // Set empty arrays as fallback to prevent crashes
      setDepartments([]);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const getDepartmentStats = (department) => {
    const teamMembers = department.team_members || [];
    const employees = teamMembers.filter(member => member.type === 'Employee').length;
    const ltvs = teamMembers.filter(member => member.type === 'LTV').length;
    const eventVolunteers = teamMembers.filter(member => member.type === 'Event Volunteer').length;
    
    return {
      employees,
      ltvs,
      eventVolunteers
    };
  };

  const handleUpdateTeam = async (updatedDepartment) => {
    try {
      await Department.update(updatedDepartment.id, { team_members: updatedDepartment.team_members });
      loadData();
    } catch (error) {
      console.error("Error updating team:", error);
      alert("Failed to update team members. Please try again.");
    }
  };

  const getTotalCounts = () => {
    let totalEmployees = 0;
    let totalLTVs = 0;
    
    departments.forEach(dept => {
      if (dept.team_members) {
        dept.team_members.forEach(member => {
          if (member.type === 'LTV') {
            totalLTVs++;
          } else {
            totalEmployees++;
          }
        });
      }
    });
    
    return { totalEmployees, totalLTVs };
  };

  const { totalEmployees, totalLTVs } = getTotalCounts();

  // Search functionality with tag filtering
  const handleSearch = (query) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      setHighlightedDepartments(new Set());
      setSearchResults([]);
      setShowSearchDetails(false);
      return;
    }

    const searchTerm = query.toLowerCase().trim();
    const matchingDepartments = new Set();
    const results = [];
    const hasTagFilter = selectedTags.length > 0;

    departments.forEach(department => {
      const departmentMatches = [];

      // Search in department name (only if 'departments' tag is selected or no tags)
      if ((!hasTagFilter || selectedTags.includes('departments')) && 
          department.name.toLowerCase().includes(searchTerm)) {
        departmentMatches.push({
          type: 'Department Name',
          value: department.name,
          icon: '🏢',
          category: 'departments'
        });
      }

      // Search in team members (names, emails, roles)
      if (department.team_members) {
        department.team_members.forEach(member => {
          // Team member names (only if 'people' tag is selected or no tags)
          if ((!hasTagFilter || selectedTags.includes('people')) && 
              member.name.toLowerCase().includes(searchTerm)) {
            departmentMatches.push({
              type: 'Team Member',
              value: `${member.name} (${member.role || 'Employee'})`,
              icon: '👤',
              category: 'people'
            });
          }
          
          // Emails (only if 'emails' tag is selected or no tags)
          if ((!hasTagFilter || selectedTags.includes('emails')) && 
              member.email.toLowerCase().includes(searchTerm)) {
            departmentMatches.push({
              type: 'Email',
              value: `${member.name}: ${member.email}`,
              icon: '📧',
              category: 'emails'
            });
          }
          
          // Job roles (only if 'people' tag is selected or no tags)
          if ((!hasTagFilter || selectedTags.includes('people')) && 
              member.role && member.role.toLowerCase().includes(searchTerm)) {
            departmentMatches.push({
              type: 'Job Role',
              value: `${member.name}: ${member.role}`,
              icon: '💼',
              category: 'people'
            });
          }
        });
      }

      // Search in tools (only if 'tools' tag is selected or no tags)
      if ((!hasTagFilter || selectedTags.includes('tools')) && department.tools_used) {
        department.tools_used.forEach(tool => {
          const toolName = typeof tool === 'string' ? tool : tool.name;
          if (toolName.toLowerCase().includes(searchTerm)) {
            const isPaid = typeof tool === 'object' ? tool.paid : true;
            departmentMatches.push({
              type: 'Tool',
              value: `${toolName} (${isPaid ? 'Paid' : 'Free'})`,
              icon: '🛠️',
              category: 'tools'
            });
          }
        });
      }

      if (departmentMatches.length > 0) {
        matchingDepartments.add(department.id);
        results.push({
          department: department.name,
          departmentId: department.id,
          matches: departmentMatches
        });
      }
    });

    setHighlightedDepartments(matchingDepartments);
    setSearchResults(results);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSelectedTags([]);
    setHighlightedDepartments(new Set());
    setSearchResults([]);
    setShowSearchDetails(false);
  };

  const toggleSearchDetails = () => {
    setShowSearchDetails(!showSearchDetails);
  };

  const openTeamDialog = (department) => {
    setSelectedDepartment(department);
    setShowTeamDialog(true);
  };

  const openInfoDialog = (department) => {
    setInfoDepartment(department);
    setShowInfoDialog(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="glass-card rounded-2xl p-8 text-center">
          <div className="animate-spin w-8 h-8 border-2 border-white/30 border-t-white rounded-full mx-auto mb-4" />
          <p className="text-glass-muted">Loading departments...</p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      {/* Floating Sidebar - Important Upcoming Dates */}
      <div className="fixed top-24 right-4 w-72 z-50">
        <div className="glass-card rounded-2xl p-4 shadow-2xl">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-glass">Important Dates</h2>
            <button
              onClick={() => setShowAddDate(true)}
              className="glass-morphism rounded-lg p-2 hover:opacity-80 transition-all duration-300 text-white hover:text-white/80"
              title="Add New Date"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          
          <div className="space-y-2">
            {/* Add New Date Form */}
            {showAddDate && (
              <div className="glass-morphism rounded-lg p-3 border-2 border-green-500/30">
                <div className="space-y-2">
                  <DatePicker
                    value={newDateData?.date ? new Date(newDateData.date).toISOString().split('T')[0] : ''}
                    onChange={(dateValue) => {
                      const dateObj = new Date(dateValue);
                      const options = { year: 'numeric', month: 'long', day: 'numeric' };
                      const dayOptions = { weekday: 'long' };
                      const newDate = {
                        date: dateObj.toLocaleDateString('en-US', options),
                        day: dateObj.toLocaleDateString('en-US', dayOptions),
                        event: newDateData?.event || '',
                        type: newDateData?.type || 'meeting',
                        icon: newDateData?.icon || '📅'
                      };
                      setNewDateData(newDate);
                    }}
                    placeholder="Select date"
                  />
                  <input
                    type="text"
                    placeholder="Event name"
                    onChange={(e) => {
                      setNewDateData(prev => ({ ...prev, event: e.target.value }));
                    }}
                    className="glass-morphism w-full px-2 py-1 text-xs text-white bg-white/10 border border-white/20 rounded focus:outline-none focus:ring-1 focus:ring-green-400"
                    autoFocus
                  />
                  <select
                    onChange={(e) => {
                      const icons = {
                        social: '🍻',
                        conference: '🎪',
                        meeting: '🤝',
                        launch: '🚀',
                        workshop: '🏗️'
                      };
                      setNewDateData(prev => ({ 
                        ...prev, 
                        type: e.target.value,
                        icon: icons[e.target.value] || '📅'
                      }));
                    }}
                    className="glass-morphism w-full px-2 py-1 text-xs text-white bg-white/10 border border-white/20 rounded focus:outline-none focus:ring-1 focus:ring-green-400"
                  >
                    <option value="meeting" className="bg-gray-800">Meeting</option>
                    <option value="social" className="bg-gray-800">Social</option>
                    <option value="conference" className="bg-gray-800">Conference</option>
                    <option value="launch" className="bg-gray-800">Launch</option>
                    <option value="workshop" className="bg-gray-800">Workshop</option>
                  </select>
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => {
                        if (newDateData && newDateData.event && newDateData.date) {
                          const newDates = [...upcomingDates, newDateData];
                          saveDates(newDates);
                          setShowAddDate(false);
                          setNewDateData(null);
                        }
                      }}
                      className="glass-morphism px-3 py-1 text-xs text-green-400 hover:text-green-300 rounded transition-colors"
                    >
                      Add
                    </button>
                    <button
                      onClick={() => {
                        setShowAddDate(false);
                        setNewDateData(null);
                      }}
                      className="glass-morphism px-3 py-1 text-xs text-gray-400 hover:text-gray-300 rounded transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {upcomingDates.map((item, index) => (
              <div key={index} className="glass-morphism rounded-lg p-3 hover:opacity-90 transition-all duration-300 group">
                <div className="flex items-start gap-2">
                  <span className="text-lg">{item.icon}</span>
                  <div className="flex-1">
                    {editingDate === index ? (
                      <div className="space-y-2">
                        <DatePicker
                          value={new Date(item.date).toISOString().split('T')[0]}
                          onChange={(dateValue) => {
                            const newDates = [...upcomingDates];
                            const dateObj = new Date(dateValue);
                            const options = { year: 'numeric', month: 'long', day: 'numeric' };
                            const dayOptions = { weekday: 'long' };
                            newDates[index].date = dateObj.toLocaleDateString('en-US', options);
                            newDates[index].day = dateObj.toLocaleDateString('en-US', dayOptions);
                            saveDates(newDates);
                          }}
                          placeholder="Select date"
                        />
                        <input
                          type="text"
                          value={item.event}
                          onChange={(e) => {
                            const newDates = [...upcomingDates];
                            newDates[index].event = e.target.value;
                            saveDates(newDates);
                          }}
                          placeholder="Event name"
                          className="glass-morphism w-full px-2 py-1 text-xs text-white bg-white/10 border border-white/20 rounded focus:outline-none focus:ring-1 focus:ring-blue-400"
                          autoFocus
                        />
                        <select
                          value={item.type}
                          onChange={(e) => {
                            const newDates = [...upcomingDates];
                            newDates[index].type = e.target.value;
                            saveDates(newDates);
                          }}
                          className="glass-morphism w-full px-2 py-1 text-xs text-white bg-white/10 border border-white/20 rounded focus:outline-none focus:ring-1 focus:ring-blue-400"
                        >
                          <option value="social" className="bg-gray-800">Social</option>
                          <option value="conference" className="bg-gray-800">Conference</option>
                          <option value="meeting" className="bg-gray-800">Meeting</option>
                          <option value="launch" className="bg-gray-800">Launch</option>
                          <option value="workshop" className="bg-gray-800">Workshop</option>
                        </select>
                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={() => setEditingDate(null)}
                            className="glass-morphism px-3 py-1 text-xs text-green-400 hover:text-green-300 rounded transition-colors"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingDate(null)}
                            className="glass-morphism px-3 py-1 text-xs text-gray-400 hover:text-gray-300 rounded transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="text-xs text-white/60 mb-1">
                          {item.date} • {item.day}
                        </div>
                        <div className="text-white font-medium text-xs leading-tight">
                          {item.event}
                        </div>
                        <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                          item.type === 'social' ? 'bg-purple-500/20 text-purple-300' :
                          item.type === 'conference' ? 'bg-red-500/20 text-red-300' :
                          item.type === 'meeting' ? 'bg-blue-500/20 text-blue-300' :
                          item.type === 'launch' ? 'bg-green-500/20 text-green-300' :
                          'bg-yellow-500/20 text-yellow-300'
                        }`}>
                          {item.type}
                        </div>
                      </>
                    )}
                  </div>
                  <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                      onClick={() => setEditingDate(index)}
                      className="glass-morphism rounded p-1 hover:opacity-80 transition-all duration-300 text-white hover:text-white/80"
                      title="Edit Date"
                    >
                      <Edit3 className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => {
                        const newDates = upcomingDates.filter((_, i) => i !== index);
                        saveDates(newDates);
                      }}
                      className="glass-morphism rounded p-1 hover:opacity-80 transition-all duration-300 text-white hover:text-white/80"
                      title="Delete Date"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="px-6 py-8">
      <div className="max-w-7xl mx-auto">

        {/* Main Content */}
        <div>
        <div className="glass-card rounded-3xl p-8 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-glass mb-4">Department Overview</h1>
            <div className="text-glass-subtle">
              <div className="text-sm font-medium">
                Total Employees: <span className="text-blue-400 font-semibold">{totalEmployees}</span>
              </div>
              <div className="text-sm font-medium">
                Long-term Volunteers: <span className="text-red-400 font-semibold">{totalLTVs}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="glass-card rounded-2xl p-4 mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-white/60" />
            </div>
            <input
              type="text"
              placeholder="Search departments, people, emails, or tools..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="glass-morphism w-full pl-10 pr-10 py-3 rounded-xl text-white placeholder-white/50 border border-white/20 focus:outline-none focus:ring-2 focus:ring-red-600/50 focus:border-red-600/50 transition-all duration-300"
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-white/60 hover:text-white transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          
          {/* Search Tags */}
          <div className="mt-3 flex items-center gap-2 flex-wrap">
            <span className="text-xs text-white/60 font-medium">Filter by:</span>
            {searchTags.map(tag => (
              <button
                key={tag.id}
                onClick={() => toggleTag(tag.id)}
                className={`text-xs px-3 py-1.5 rounded-full border transition-all duration-200 ${
                  selectedTags.includes(tag.id)
                    ? tag.color + ' shadow-sm'
                    : 'bg-white/5 text-white/60 border-white/20 hover:bg-white/10 hover:text-white/80'
                }`}
              >
                {tag.label}
                {selectedTags.includes(tag.id) && (
                  <span className="ml-1 text-xs">✓</span>
                )}
              </button>
            ))}
            {selectedTags.length > 0 && (
              <button
                onClick={() => setSelectedTags([])}
                className="text-xs px-2 py-1 text-white/60 hover:text-white/80 transition-colors"
                title="Clear all filters"
              >
                Clear filters
              </button>
            )}
          </div>
          
          {searchQuery && (
            <div className="mt-2">
              <div className="flex items-center justify-between">
                <div className="text-sm text-white/70">
                  {highlightedDepartments.size > 0 ? (
                    <span>Found matches in <span className="text-red-400 font-semibold">{highlightedDepartments.size}</span> department{highlightedDepartments.size !== 1 ? 's' : ''}</span>
                  ) : (
                    <span className="text-yellow-400">No matches found</span>
                  )}
                </div>
                {searchResults.length > 0 && (
                  <button
                    onClick={toggleSearchDetails}
                    className="flex items-center gap-1 text-xs text-white/60 hover:text-white transition-colors"
                  >
                    <span>Details</span>
                    {showSearchDetails ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  </button>
                )}
              </div>
              
              {showSearchDetails && searchResults.length > 0 && (
                <div className="mt-3 space-y-2 max-h-48 overflow-y-auto glass-scroll">
                  {searchResults.map((result, index) => (
                    <div key={index} className="glass-morphism rounded-lg p-3">
                      <div className="font-medium text-white text-sm mb-2 flex items-center gap-2">
                        {React.createElement(getDepartmentIcon(result.department), {
                          className: "w-4 h-4"
                        })}
                        <HighlightedText text={result.department} searchTerm={searchQuery} />
                      </div>
                      <div className="space-y-1">
                        {result.matches.map((match, matchIndex) => (
                          <div key={matchIndex} className="flex items-start gap-2 text-xs text-white/80">
                            <span className="text-sm">{match.icon}</span>
                            <div>
                              <span className="text-white/60">{match.type}:</span>
                              <span className="ml-1">
                                <HighlightedText 
                                  text={match.value} 
                                  searchTerm={searchQuery}
                                  className="text-white"
                                />
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {departments && departments.length > 0 ? departments.map((department, index) => {
            const stats = getDepartmentStats(department);
            const teamCount = department.team_members?.length || 0;
            const toolsCount = department.tools_used?.length || 0;
            const isHighlighted = highlightedDepartments.has(department.id);
            const isSearchActive = searchQuery.trim() !== "";
            
            return (
              <motion.div
                key={department.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ 
                  opacity: isSearchActive ? (isHighlighted ? 1 : 0.3) : 1, 
                  y: 0,
                  scale: isHighlighted ? 1.02 : 1
                }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`glass-card rounded-3xl p-6 cursor-pointer hover:opacity-90 transition-all duration-300 ${
                  isHighlighted ? 'glow-red ring-2 ring-red-500/50' : 'glow-purple'
                }`}
                onClick={() => openInfoDialog(department)}
              >
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-1">
                    {/* Left Column - Dot + Icon + Department Name */}
                    <div className="flex items-center gap-3">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: department.color }}
                      ></div>
                      {React.createElement(getDepartmentIcon(department.name), {
                        className: "w-5 h-5 text-glass-muted"
                      })}
                      <h3 className="text-xl font-bold text-glass">{department.name}</h3>
                    </div>
                    
                    {/* Right Column - Action Icons */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openTeamDialog(department);
                        }}
                        className="p-1.5 text-glass-muted hover:text-glass transition-all duration-300 hover:opacity-80 glow-blue"
                        title="Team Members"
                      >
                        <Users className="w-4 h-4" />
                      </button>
                      <Link
                        to={`/department-timeline?dept=${encodeURIComponent(department.name)}`}
                        onClick={(e) => e.stopPropagation()}
                        className="p-1.5 text-glass-muted hover:text-glass transition-all duration-300 hover:opacity-80 glow-green"
                        title="View Timeline"
                      >
                        <BarChart3 className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-glass-muted text-sm flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Total Employees
                    </span>
                    <span className="text-blue-400 font-semibold">{stats.employees}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-glass-muted text-sm flex items-center gap-2">
                      <Wrench className="w-4 h-4" />
                      Tools Used
                    </span>
                    <span className="text-purple-400 font-semibold">{toolsCount}</span>
                  </div>
                </div>

              </motion.div>
            );
          }) : (
            <div className="col-span-full flex items-center justify-center py-12">
              <div className="glass-card rounded-2xl p-8 text-center">
                <p className="text-glass-muted">No departments found.</p>
              </div>
            </div>
          )}
        </div>
      </div>

        </div>

        <TeamMembersDialog
          department={selectedDepartment}
          allDepartments={departments}
          isOpen={showTeamDialog}
          onClose={() => setShowTeamDialog(false)}
          onUpdate={handleUpdateTeam}
        />

        <DepartmentInfoDialog
          department={infoDepartment}
          isOpen={showInfoDialog}
          onClose={() => setShowInfoDialog(false)}
          onUpdate={async (updatedDepartment) => {
            try {
              // Save to mock API to persist changes
              await Department.update(updatedDepartment.id, updatedDepartment);
              
              // Update the department in the departments array
              setDepartments(prev => 
                prev.map(dept => 
                  dept.id === updatedDepartment.id ? updatedDepartment : dept
                )
              );
              // Also update the infoDepartment to reflect changes in the dialog
              setInfoDepartment(updatedDepartment);
              
              console.log('Department updated successfully in API');
            } catch (error) {
              console.error('Failed to update department:', error);
              alert('Failed to save changes. Please try again.');
            }
          }}
        />
      </div>
    </ErrorBoundary>
  );
}
