
import React, { useState, useEffect } from "react";
import { TimelineEvent, Department, User } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar, Save, ArrowLeft, Users, CalendarDays, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";
import DatePicker from "@/components/ui/DatePicker";

const STATUS_OPTIONS = [
  { value: "planning", label: "Planning", color: "text-purple-400" },
  { value: "active", label: "Active", color: "text-green-400" },
  { value: "completed", label: "Completed", color: "text-blue-400" },
  { value: "on_hold", label: "On Hold", color: "text-gray-400" }
];

const TYPE_OPTIONS = [
  { value: "project", label: "Project" },
  { value: "deadline", label: "Deadline" },
  { value: "busy_period", label: "Busy Period" },
  { value: "event", label: "Event" }
];

export default function AddEvent() {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [useExactDates, setUseExactDates] = useState(false);
  const [preselectedDepartment, setPreselectedDepartment] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    start_date: "",
    end_date: "",
    start_month: "",
    end_month: "",
    department_id: "",
    department_name: "",
    involved_departments: [],
    lead_person: "",
    status: "planning",
    type: "project",
    priority: "medium"
  });

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const deptName = urlParams.get('dept');
      const eventId = urlParams.get('eventId');

      const departmentsData = await Department.list();
      setDepartments(departmentsData);

      // If editing an existing event
      if (eventId) {
        try {
          const eventData = await TimelineEvent.get(eventId);
          const eventDept = departmentsData.find(d => d.name === eventData.department_name);
          
          if (eventDept) {
            setPreselectedDepartment(eventDept);
          }
          
          setFormData({
            title: eventData.title || "",
            description: eventData.description || "",
            start_date: eventData.start_date || "",
            end_date: eventData.end_date || "",
            start_month: eventData.start_date ? eventData.start_date.substring(0, 7) : "",
            end_month: eventData.end_date ? eventData.end_date.substring(0, 7) : "",
            department_id: eventDept?.id || "",
            department_name: eventData.department_name || "",
            involved_departments: eventData.involved_departments || [],
            lead_person: eventData.lead_person || "",
            status: eventData.status || "planning",
            type: eventData.type || "project",
            priority: eventData.priority || "medium"
          });
          
          // Set exact dates if available
          if (eventData.start_date && eventData.end_date) {
            setUseExactDates(true);
          }
        } catch (error) {
          console.error("Error loading event data:", error);
        }
      }
      // If creating new event with department context
      else if (deptName) {
        const dept = departmentsData.find(d => d.name === deptName);
        if (dept) {
          setPreselectedDepartment(dept);
          setFormData(prev => ({
            ...prev,
            department_id: dept.id,
            department_name: dept.name
          }));
        }
      }
    } catch (error) {
      console.error("Error loading initial data:", error);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => {
      const newState = { ...prev, [field]: value };

      if (field === 'department_id') {
        const selectedDept = departments.find(d => d.id === value);
        newState.department_name = selectedDept?.name || "";
      }
      
      return newState;
    });
  };

  const toggleInvolvedDepartment = (deptName) => {
    setFormData(prev => ({
      ...prev,
      involved_departments: prev.involved_departments.includes(deptName)
        ? prev.involved_departments.filter(d => d !== deptName)
        : [...prev.involved_departments, deptName]
    }));
  };


  const formatDateForSubmission = (dateString, isStart = true) => {
    if (useExactDates) {
      return dateString;
    } else {
      const [year, month] = dateString.split('-');
      if (isStart) {
        return `${year}-${month}-01`;
      } else {
        const lastDay = new Date(parseInt(year), parseInt(month), 0).getDate();
        return `${year}-${month}-${lastDay.toString().padStart(2, '0')}`;
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.department_id) {
      alert("Please fill in all required fields");
      return;
    }

    const startDate = useExactDates ? formData.start_date : formData.start_month;
    const endDate = useExactDates ? formData.end_date : formData.end_month;

    if (!startDate) {
      alert("Please select a start date");
      return;
    }

    setLoading(true);
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const eventId = urlParams.get('eventId');
      
      const eventData = {
        title: formData.title,
        description: formData.description,
        department_name: formData.department_name,
        start_date: formatDateForSubmission(startDate, true),
        end_date: endDate ? formatDateForSubmission(endDate, false) : formatDateForSubmission(startDate, false),
        involved_departments: formData.involved_departments,
        lead_person: formData.lead_person,
        status: formData.status,
        type: formData.type,
        priority: formData.priority,
        tags: [] // Keep empty for now
      };

      if (eventId) {
        // Update existing event
        await TimelineEvent.update(eventId, eventData);
      } else {
        // Create new event
        await TimelineEvent.create(eventData);
      }
      
      if (preselectedDepartment) {
        navigate(`${createPageUrl("DepartmentTimeline")}?dept=${encodeURIComponent(preselectedDepartment.name)}`);
      } else {
        navigate(createPageUrl("Dashboard"));
      }
    } catch (error) {
      console.error(`Error ${urlParams.get('eventId') ? 'updating' : 'creating'} event:`, error);
      alert(`Error ${urlParams.get('eventId') ? 'updating' : 'creating'} event. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen px-6 py-8 overflow-x-hidden">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="glass-card rounded-3xl p-8"
        >
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => {
                if (preselectedDepartment) {
                  navigate(`${createPageUrl("DepartmentTimeline")}?dept=${encodeURIComponent(preselectedDepartment.name)}`);
                } else {
                  navigate(createPageUrl("Dashboard"));
                }
              }}
              className="glass-morphism rounded-full p-2 text-white/70 hover:text-white glow-on-hover"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-white text-glow">
                {new URLSearchParams(window.location.search).get('eventId') ? 'Edit Event' : 'Add New Event'}
              </h1>
              <p className="text-white/70 mt-1">
                {new URLSearchParams(window.location.search).get('eventId') 
                  ? `Update timeline event${preselectedDepartment ? ` for ${preselectedDepartment.name}` : ''}`
                  : preselectedDepartment 
                    ? `Create a new timeline item for ${preselectedDepartment.name}`
                    : "Create a new timeline item for your department"
                }
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Essential Information */}
            <div className="glass-morphism rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Event Details
              </h3>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-white font-medium">What's happening? *</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="e.g., TechBBQ 2025 Planning, Marketing Campaign Launch"
                    className="glass-morphism border-white/20 text-white placeholder:text-white/50 text-lg"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-white font-medium">Brief description (optional)</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Quick overview of what this event involves..."
                    className="glass-morphism border-white/20 text-white placeholder:text-white/50 h-20"
                  />
                </div>
              </div>
            </div>

            {/* Department & Lead */}
            <div className="glass-morphism rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Users className="w-5 h-5" />
                Ownership
              </h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-white font-medium">Primary Department *</Label>
                  <Select
                    value={formData.department_id}
                    onValueChange={(value) => handleInputChange('department_id', value)}
                  >
                    <SelectTrigger className="glass-morphism border-white/20 text-white">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent className="glass-morphism border-white/20 bg-slate-900/95 backdrop-blur-md max-h-60 overflow-y-auto">
                      {departments.map((dept) => (
                        <SelectItem key={dept.id} value={dept.id} className="text-white hover:bg-white/10 focus:bg-white/10">
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-3 h-3 rounded-full" 
                              style={{ backgroundColor: dept.color }}
                            />
                            {dept.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-white font-medium">Who's leading this?</Label>
                  <Input
                    value={formData.lead_person}
                    onChange={(e) => handleInputChange('lead_person', e.target.value)}
                    placeholder="e.g., Maria Krupa, Avnit Singh"
                    className="glass-morphism border-white/20 text-white placeholder:text-white/50"
                  />
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="glass-morphism rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <CalendarDays className="w-5 h-5" />
                When is this happening?
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="exactDates"
                    checked={useExactDates}
                    onCheckedChange={setUseExactDates}
                  />
                  <Label htmlFor="exactDates" className="text-white font-medium">
                    I know the exact dates
                  </Label>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-white font-medium flex items-center gap-2">
                      <CalendarDays className="w-4 h-4" />
                      {useExactDates ? 'Start Date *' : 'Start Month *'}
                    </Label>
                    <DatePicker
                      type={useExactDates ? "date" : "month"}
                      value={useExactDates ? formData.start_date : formData.start_month}
                      onChange={(value) => handleInputChange(useExactDates ? 'start_date' : 'start_month', value)}
                      placeholder={useExactDates ? "Select start date" : "Select start month"}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white font-medium flex items-center gap-2">
                      <CalendarDays className="w-4 h-4" />
                      {useExactDates ? 'End Date (optional)' : 'End Month (optional)'}
                    </Label>
                    <DatePicker
                      type={useExactDates ? "date" : "month"}
                      value={useExactDates ? formData.end_date : formData.end_month}
                      onChange={(value) => handleInputChange(useExactDates ? 'end_date' : 'end_month', value)}
                      placeholder={useExactDates ? "Select end date" : "Select end month"}
                    />
                  </div>
                </div>
                
                <p className="text-white/60 text-sm">
                  {useExactDates 
                    ? "Select specific dates if you know them" 
                    : "Just pick the months - perfect for longer projects or when dates aren't finalized"
                  }
                </p>
              </div>
            </div>

            {/* Collaboration (Optional) */}
            <div className="glass-morphism rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Users className="w-5 h-5" />
                Other departments involved? (Optional)
              </h3>
              
              <div className="space-y-3">
                <p className="text-white/60 text-sm">
                  Select any other departments that will be working on this with you
                </p>
                
                <div className="flex flex-wrap gap-2 mb-3">
                  {formData.involved_departments.map((dept) => (
                    <span
                      key={dept}
                      className="glass-morphism rounded-full px-3 py-1 text-sm text-white flex items-center gap-2"
                    >
                      {dept}
                      <button
                        type="button"
                        onClick={() => toggleInvolvedDepartment(dept)}
                        className="hover:text-red-400"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {departments
                    .filter(dept => dept.name !== formData.department_name && !formData.involved_departments.includes(dept.name))
                    .map((dept) => (
                      <button
                        key={dept.id}
                        type="button"
                        onClick={() => toggleInvolvedDepartment(dept.name)}
                        className="glass-morphism rounded-lg p-3 text-sm text-white/70 hover:text-white hover:bg-white/10 flex items-center gap-2 text-left transition-all duration-200"
                      >
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: dept.color }}
                        />
                        {dept.name}
                      </button>
                    ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  if (preselectedDepartment) {
                    navigate(`${createPageUrl("DepartmentTimeline")}?dept=${encodeURIComponent(preselectedDepartment.name)}`);
                  } else {
                    navigate(createPageUrl("Dashboard"));
                  }
                }}
                className="glass-morphism border-white/20 text-white hover:bg-white/10"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="glass-intense text-white font-semibold glow-on-hover"
              >
                {loading ? (
                  <>
                    <div className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full mr-2" />
                    {new URLSearchParams(window.location.search).get('eventId') ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    {new URLSearchParams(window.location.search).get('eventId') ? 'Update Event' : 'Create Event'}
                  </>
                )}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
