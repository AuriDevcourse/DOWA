
import React, { useState, useEffect } from "react";
import { TimelineEvent, Department, User } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar, Save, ArrowLeft, Tag, Users, CalendarDays, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";

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
  const [user, setUser] = useState(null);
  const [availableTags, setAvailableTags] = useState([]);
  const [useExactDates, setUseExactDates] = useState(true);
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
    tags: [],
    status: "planning",
    type: "project"
  });

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const deptName = urlParams.get('dept');

      const [departmentsData, userData, eventsData] = await Promise.all([
        Department.list(),
        User.me(),
        TimelineEvent.list()
      ]);
      
      setDepartments(departmentsData);
      setUser(userData);

      const tags = new Set();
      eventsData.forEach(event => {
        event.tags?.forEach(tag => tags.add(tag));
      });
      setAvailableTags(Array.from(tags));

      if (deptName) {
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

  const handleArrayInput = (field, value) => {
    const items = value.split(',').map(item => item.trim()).filter(item => item);
    setFormData(prev => ({
      ...prev,
      [field]: items
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
      const eventData = {
        ...formData,
        start_date: formatDateForSubmission(startDate, true),
        end_date: endDate ? formatDateForSubmission(endDate, false) : formatDateForSubmission(startDate, false)
      };
      
      delete eventData.start_month;
      delete eventData.end_month;

      await TimelineEvent.create(eventData);
      
      if (preselectedDepartment) {
        navigate(`${createPageUrl("DepartmentTimeline")}?dept=${encodeURIComponent(preselectedDepartment.name)}`);
      } else {
        navigate(createPageUrl("Dashboard"));
      }
    } catch (error) {
      console.error("Error creating event:", error);
      alert("Error creating event. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen px-6 py-8">
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
              <h1 className="text-3xl font-bold text-white text-glow">Add New Event</h1>
              <p className="text-white/70 mt-1">
                {preselectedDepartment 
                  ? `Create a new timeline item for ${preselectedDepartment.name}`
                  : "Create a new timeline item for your department"
                }
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-white font-medium">Title *</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Project or event title"
                  className="glass-morphism border-white/20 text-white placeholder:text-white/50"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label className="text-white font-medium">Department *</Label>
                <Select
                  value={formData.department_id}
                  onValueChange={(value) => handleInputChange('department_id', value)}
                >
                  <SelectTrigger className="glass-morphism border-white/20 text-white">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept.id} value={dept.id}>
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
                <Label className="text-white font-medium">Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => handleInputChange('type', value)}
                >
                  <SelectTrigger className="glass-morphism border-white/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TYPE_OPTIONS.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-white font-medium">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleInputChange('status', value)}
                >
                  <SelectTrigger className="glass-morphism border-white/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        <span className={status.color}>{status.label}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Date Selection */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="exactDates"
                  checked={useExactDates}
                  onCheckedChange={setUseExactDates}
                />
                <Label htmlFor="exactDates" className="text-white font-medium flex items-center gap-2">
                  <CalendarDays className="w-4 h-4" />
                  Use exact dates
                </Label>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-white font-medium">
                    {useExactDates ? 'Start Date *' : 'Start Month *'}
                  </Label>
                  <Input
                    type={useExactDates ? "date" : "month"}
                    value={useExactDates ? formData.start_date : formData.start_month}
                    onChange={(e) => handleInputChange(useExactDates ? 'start_date' : 'start_month', e.target.value)}
                    className="glass-morphism border-white/20 text-white"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-white font-medium">
                    {useExactDates ? 'End Date' : 'End Month'}
                  </Label>
                  <Input
                    type={useExactDates ? "date" : "month"}
                    value={useExactDates ? formData.end_date : formData.end_month}
                    onChange={(e) => handleInputChange(useExactDates ? 'end_date' : 'end_month', e.target.value)}
                    className="glass-morphism border-white/20 text-white"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-white font-medium">Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Detailed description or comments..."
                className="glass-morphism border-white/20 text-white placeholder:text-white/50 h-24"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-white font-medium flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Involved Departments
                </Label>
                <div className="glass-morphism border-white/20 rounded-lg p-4">
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
                  <div className="space-y-2">
                    {departments
                      .filter(dept => dept.name !== formData.department_name && !formData.involved_departments.includes(dept.name))
                      .map((dept) => (
                        <button
                          key={dept.id}
                          type="button"
                          onClick={() => toggleInvolvedDepartment(dept.name)}
                          className="glass-morphism rounded-lg p-2 text-sm text-white/70 hover:text-white hover:bg-white/10 flex items-center gap-2 w-full text-left"
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

              <div className="space-y-2">
                <Label className="text-white font-medium flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  Tags
                </Label>
                <Input
                  value={formData.tags.join(', ')}
                  onChange={(e) => handleArrayInput('tags', e.target.value)}
                  placeholder="launch, campaign, meeting (comma-separated)"
                  className="glass-morphism border-white/20 text-white placeholder:text-white/50"
                />
                {availableTags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {availableTags.slice(0, 6).map((tag) => (
                      <span
                        key={tag}
                        onClick={() => {
                          if (!formData.tags.includes(tag)) {
                            setFormData(prev => ({
                              ...prev,
                              tags: [...prev.tags, tag]
                            }));
                          }
                        }}
                        className="glass-morphism rounded-full px-2 py-1 text-xs text-white/70 cursor-pointer hover:text-white hover:bg-white/10"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
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
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Create Event
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
