import React, { useState, useEffect } from "react";
<<<<<<< Updated upstream
import { useNavigate, Link } from "react-router-dom";
=======
// import { Department, TimelineEvent } from "@/api/entities";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Calendar, Users, TrendingUp, Wrench, Info, UploadCloud } from "lucide-react";
>>>>>>> Stashed changes
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
import GoogleCalendarSync from "@/components/GoogleCalendarSync";
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
      // Temporarily comment out API calls
      // const [departmentsData, eventsData] = await Promise.all([
      //   Department.list(),
      //   TimelineEvent.list()
      // ]);
      // setDepartments(departmentsData);
      // setEvents(eventsData);
      
      // Use real TechBBQ data
      setDepartments([
        {
          id: 1,
          name: "Management",
          color: "#8B5CF6",
          description: "Executive leadership and strategic direction",
          team_members: [
            { name: "Avnit Singh", email: "asg@techbbq.org", role: "Chief Executive Officer", type: "Employee" },
            { name: "Sam Eshrati", email: "ses@techbbq.org", role: "Chief Operating Officer & Chief Engagement Officer", type: "Employee" },
            { name: "Benjamin Notlev", email: "bno@techbbq.org", role: "Chief Commercial Officer & Chief Investment Officer", type: "Employee" }
          ],
          tools_used: ["Strategic Planning", "Leadership", "Decision Making"]
        },
        {
          id: 2,
          name: "Marketing",
          color: "#10B981",
          description: "Brand promotion, growth analytics, and digital design",
          team_members: [
            { name: "Vera Liscinska", email: "vli@techbbq.org", role: "Head of Marketing", type: "Employee" },
            { name: "Maria Krupa", email: "mak@techbbq.org", role: "Growth & Data Analytics Lead", type: "Employee" },
            { name: "Auri Baciauskas", email: "aba@techbbq.org", role: "Senior Digital Designer", type: "Employee" },
            { name: "Chloe Passerât de la Chapelle", email: "cpc@techbbq.org", role: "Marketing Content Lead", type: "Employee" }
          ],
          tools_used: ["Google Analytics", "Adobe Creative Suite", "Content Management", "Data Analysis"]
        },
        {
          id: 3,
          name: "HR",
          color: "#F59E0B",
          description: "Human resources and talent management",
          team_members: [
            { name: "Maja Pavlek", email: "mpa@techbbq.org", role: "Head of HR", type: "Employee" }
          ],
          tools_used: ["HRIS", "Recruitment", "Performance Management"]
        },
        {
          id: 4,
          name: "Partnerships",
          color: "#3B82F6",
          description: "Strategic partnerships and business development",
          team_members: [
            { name: "Mikkel Schiott", email: "mik@techbbq.org", role: "Head of Partnerships", type: "Employee" },
            { name: "Tansu Kjerimi", email: "tkj@techbbq.org", role: "Global Partnership Manager", type: "Employee" },
            { name: "Anne-Sophie Pedersen", email: "asp@techbbq.org", role: "Partnership Manager", type: "Employee" },
            { name: "Roxy Dat", email: "rad@techbbq.org", role: "SDR & Community Partnership Manager", type: "Employee" },
            { name: "Amalie Berre Eriksen", email: "ame@techbbq.org", role: "Partnership Success Manager", type: "Employee" }
          ],
          tools_used: ["CRM", "Partnership Management", "Business Development", "Community Building"]
        },
        {
          id: 5,
          name: "Events",
          color: "#EF4444",
          description: "Event planning, coordination, and execution",
          team_members: [
            { name: "Joanna Opoka", email: "jop@techbbq.org", role: "Senior Project Manager", type: "Employee" },
            { name: "Mette Baastrup", email: "meb@techbbq.org", role: "Event Manager", type: "Employee" }
          ],
          tools_used: ["Event Management", "Project Planning", "Vendor Coordination", "Logistics"]
        },
        {
          id: 6,
          name: "PR",
          color: "#06B6D4",
          description: "Public relations and communications",
          team_members: [
            { name: "Keyvan T. Bamdej", email: "kba@techbbq.org", role: "Head of PR & Communications", type: "Employee" },
            { name: "Mikael Hansen", email: "mkh@techbbq.org", role: "PR & Communications Manager", type: "Employee" }
          ],
          tools_used: ["Media Relations", "Content Creation", "Communications Strategy", "Press Releases"]
        },
        {
          id: 7,
          name: "Program",
          color: "#84CC16",
          description: "Program development and coordination",
          team_members: [
            { name: "Pedro Granacha", email: "pmg@techbbq.org", role: "Program Manager", type: "Employee" },
            { name: "Inigo Casillas", email: "ica@techbbq.org", role: "Program Coordinator", type: "Employee" }
          ],
          tools_used: ["Program Management", "Coordination", "Planning", "Execution"]
        },
        {
          id: 8,
          name: "Finance",
          color: "#F97316",
          description: "Financial management and investor relations",
          team_members: [
            { name: "Stephan Evon", email: "sev@techbbq.org", role: "Head of Finance", type: "Employee" },
            { name: "Rares Bagyio", email: "rab@techbbq.org", role: "Head of Investor Relations", type: "Employee" },
            { name: "Allan N. Hadjimihalovic", email: "alh@techbbq.org", role: "Project Controller", type: "Employee" }
          ],
          tools_used: ["Financial Planning", "Accounting", "Investor Relations", "Budget Control"]
        },
        {
          id: 9,
          name: "Operations",
          color: "#EC4899",
          description: "Operational support and executive assistance",
          team_members: [
            { name: "Sadia Beg", email: "sab@techbbq.org", role: "Head of Operations", type: "Employee" },
            { name: "Sandra B. Frandsen", email: "sfr@techbbq.org", role: "Executive Assistant", type: "Employee" },
            { name: "Malou Bonding Wichmann", email: "mbw@techbbq.org", role: "Executive Personal Assistant", type: "Employee" },
            { name: "Shabana Naseri", email: "sna@techbbq.org", role: "Executive Personal Assistant", type: "Employee" },
            { name: "Carol Commey", email: "cac@techbbq.org", role: "Executive Assistant", type: "Employee" }
          ],
          tools_used: ["Operations Management", "Administrative Support", "Process Optimization", "Executive Support"]
        },
        {
          id: 10,
          name: "Project Management",
          color: "#6366F1",
          description: "Project planning, execution, and leadership",
          team_members: [
            { name: "Thomas Ebrup", email: "teb@techbbq.org", role: "Head of Projects", type: "Employee" },
            { name: "Harry Justus", email: "hju@techbbq.org", role: "Senior Project Manager", type: "Employee" },
            { name: "Jan Thordsen", email: "jan@techbbq.org", role: "Project Manager", type: "Employee" },
            { name: "Dianne A. Binesse", email: "dib@techbbq.org", role: "Project Manager", type: "Employee" },
            { name: "Sara Sørensen", email: "sgs@techbbq.org", role: "Project Manager", type: "Employee" },
            { name: "Charles Kinga", email: "chk@techbbq.org", role: "Project Leader", type: "Employee" }
          ],
          tools_used: ["Project Management", "Agile", "Planning", "Team Leadership", "Resource Management"]
        }
      ]);
<<<<<<< Updated upstream
      setDepartments(departmentsData || []);
      setEvents(eventsData || []);
=======
      setEvents([]);
>>>>>>> Stashed changes
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

  // Handle Google Calendar sync
  const handleGoogleSync = (syncedEvents) => {
    setUpcomingDates(syncedEvents);
  };

  const handleUpdateTeam = async (updatedDepartment) => {
    try {
      // await Department.update(updatedDepartment.id, { team_members: updatedDepartment.team_members });
      // loadData();
      
      // Update local state directly for now
      setDepartments(prev => prev.map(dept =>
        dept.id === updatedDepartment.id
          ? { ...dept, team_members: updatedDepartment.team_members }
          : dept
      ));
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
      {/* Desktop Floating Sidebar - Important Upcoming Dates */}
      <div className="fixed top-24 right-2 sm:right-4 w-64 sm:w-72 lg:w-80 xl:w-72 z-50 hidden md:block">
        <div className="glass-card rounded-2xl p-4 shadow-2xl max-h-[calc(100vh-8rem)] overflow-y-auto">
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
          
          {/* Google Calendar Sync */}
          <GoogleCalendarSync onSync={handleGoogleSync} />
          
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

      {/* Mobile Sidebar - Important Upcoming Dates */}
      <div className="md:hidden fixed bottom-4 left-4 right-4 z-50">
        <div className="glass-card rounded-2xl p-4 shadow-2xl max-h-48 overflow-y-auto">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-glass">Important Dates</h2>
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

            {upcomingDates.slice(0, 3).map((item, index) => (
              <div key={index} className="glass-morphism rounded-lg p-2 hover:opacity-90 transition-all duration-300">
                <div className="flex items-start gap-2">
                  <span className="text-sm">{item.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-white/60 mb-1 truncate">
                      {item.date} • {item.day}
                    </div>
                    <div className="text-white font-medium text-xs leading-tight truncate">
                      {item.event}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {upcomingDates.length > 3 && (
              <div className="text-center text-xs text-white/60 pt-2">
                +{upcomingDates.length - 3} more dates
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 py-8 pb-20 md:pb-8">
      <div className="max-w-7xl mx-auto pr-0 md:pr-64 lg:pr-80 xl:pr-72">

        {/* Main Content */}
        <div>
        <div className="glass-card rounded-3xl p-4 sm:p-8 mb-8">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6">
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
                className={`glass-card rounded-3xl p-4 sm:p-6 cursor-pointer hover:opacity-90 transition-all duration-300 ${
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
                      <h3 className="text-lg sm:text-xl font-bold text-glass truncate">{department.name}</h3>
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
