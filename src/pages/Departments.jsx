
import React, { useState, useEffect } from "react";
import { Department, TimelineEvent } from "@/api/entities";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Calendar, Users, TrendingUp, Wrench, Info, UploadCloud } from "lucide-react";
import { motion } from "framer-motion";
import TeamMembersDialog from "../components/departments/TeamMembersDialog";
import DepartmentInfoDialog from "../components/departments/DepartmentInfoDialog";

export default function Departments() {
  const [departments, setDepartments] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [showTeamDialog, setShowTeamDialog] = useState(false);
  const [showInfoDialog, setShowInfoDialog] = useState(false);
  const [infoDepartment, setInfoDepartment] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [departmentsData, eventsData] = await Promise.all([
        Department.list(),
        TimelineEvent.list()
      ]);
      setDepartments(departmentsData);
      setEvents(eventsData);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getDepartmentStats = (deptName) => {
    const deptEvents = events.filter(e => e.department_name === deptName);
    const activeEvents = deptEvents.filter(e => e.status === 'active');
    const upcomingEvents = deptEvents.filter(e => new Date(e.start_date) > new Date());
    
    return {
      total: deptEvents.length,
      active: activeEvents.length,
      upcoming: upcomingEvents.length
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-card rounded-2xl p-8 text-center">
          <div className="animate-spin w-8 h-8 border-2 border-white/30 border-t-white rounded-full mx-auto mb-4" />
          <p className="text-white/80">Loading departments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="glass-card rounded-3xl p-8 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Department Overview</h1>
              <p className="text-white/70 text-lg mb-3">Select a department to view their timeline and projects</p>
              <div className="text-white/60">
                <div className="text-sm font-medium">
                  Total Employees: <span className="text-blue-400 font-semibold">{totalEmployees}</span>
                </div>
                {totalLTVs > 0 && (
                  <div className="text-sm font-medium">
                    LTV Members: <span className="text-purple-400 font-semibold">{totalLTVs}</span>
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={() => navigate(createPageUrl("ProcessImport"))}
              className="glass-intense rounded-2xl px-4 py-2 text-white font-medium glow-on-hover flex items-center gap-2"
            >
              <UploadCloud className="w-4 h-4" />
              Import Team Data
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {departments.map((department, index) => {
            const stats = getDepartmentStats(department.name);
            const teamCount = department.team_members?.length || 0;
            const toolsCount = department.tools_used?.length || 0;
            return (
              <motion.div
                key={department.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass-card rounded-3xl p-6 h-full"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div 
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-xl"
                    style={{ backgroundColor: department.color }}
                  >
                    {department.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-xl font-bold text-white">{department.name}</h3>
                      <button
                        onClick={() => openInfoDialog(department)}
                        className="rounded-full p-1.5 text-white/70 hover:text-white glow-on-hover"
                        title="Department Info"
                      >
                        <Info className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openTeamDialog(department)}
                        className="rounded-full p-1.5 text-white/70 hover:text-white glow-on-hover"
                        title="Team Members"
                      >
                        <Users className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-white/70 text-sm flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Team Members
                    </span>
                    <span className="text-blue-400 font-semibold">{teamCount}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-white/70 text-sm flex items-center gap-2">
                      <Wrench className="w-4 h-4" />
                      Tools Used
                    </span>
                    <span className="text-purple-400 font-semibold">{toolsCount}</span>
                  </div>
                </div>

                {/* Tools Used Display */}
                {department.tools_used && department.tools_used.length > 0 && (
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {department.tools_used.slice(0, 4).map((tool, idx) => (
                        <span key={idx} className="glass-morphism rounded-full px-2 py-1 text-xs text-white/70">
                          {tool}
                        </span>
                      ))}
                      {department.tools_used.length > 4 && (
                        <span className="text-xs text-white/50">+{department.tools_used.length - 4} more</span>
                      )}
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  <Link
                    to={`${createPageUrl("DepartmentTimeline")}?dept=${encodeURIComponent(department.name)}`}
                    className="w-full glass-morphism rounded-2xl px-4 py-2 text-white/80 hover:text-white flex items-center justify-center gap-2 glow-on-hover"
                  >
                    View Timeline →
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <TeamMembersDialog
        department={selectedDepartment}
        onUpdate={handleUpdateTeam}
        isOpen={showTeamDialog}
        onClose={() => setShowTeamDialog(false)}
      />

      <DepartmentInfoDialog
        department={infoDepartment}
        isOpen={showInfoDialog}
        onClose={() => setShowInfoDialog(false)}
      />
    </div>
  );
}
