import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { User, Users, Mail, Wrench, Info, Building2, ChevronRight, Target, TrendingUp, Edit3, Lock, Save, X } from "lucide-react";
import TeamMemberDetailDialog from "./TeamMemberDetailDialog";

export default function DepartmentInfoDialog({ department, isOpen, onClose, onUpdate }) {
  const [selectedMember, setSelectedMember] = useState(null);
  const [showMemberDetail, setShowMemberDetail] = useState(false);
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [password, setPassword] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [editedDepartment, setEditedDepartment] = useState(null);
  
  // Individual section edit states
  const [showDescriptionEdit, setShowDescriptionEdit] = useState(false);
  const [showKPIsEdit, setShowKPIsEdit] = useState(false);
  const [showToolsEdit, setShowToolsEdit] = useState(false);
  const [showTeamEdit, setShowTeamEdit] = useState(false);
  
  // Temporary edit data for individual sections
  const [tempDescription, setTempDescription] = useState("");
  const [tempKPIs, setTempKPIs] = useState([]);
  const [tempTools, setTempTools] = useState([]);
  const [tempTeamMembers, setTempTeamMembers] = useState([]);

  if (!department) return null;

  const openMemberDetail = (member) => {
    setSelectedMember(member);
    setShowMemberDetail(true);
  };

  const handleEditClick = () => {
    setShowPasswordPrompt(true);
    setPassword("");
    setPasswordError("");
  };

  const handlePasswordSubmit = () => {
    if (password === "Marketing") {
      setIsEditMode(true);
      setShowPasswordPrompt(false);
      setPassword("");
      setPasswordError("");
    } else {
      setPasswordError("Incorrect password. Please try again.");
      setPassword("");
    }
  };

  const handleCancelPassword = () => {
    setShowPasswordPrompt(false);
    setPassword("");
    setPasswordError("");
  };

  const handleExitEditMode = () => {
    setIsEditMode(false);
    setEditedDepartment(null);
  };

  // Functions to open individual section editors
  const openDescriptionEdit = () => {
    setTempDescription(department.description || "");
    setShowDescriptionEdit(true);
  };

  const openKPIsEdit = () => {
    setTempKPIs([...(department.kpis || [])]);
    setShowKPIsEdit(true);
  };

  const openToolsEdit = () => {
    setTempTools([...(department.tools_used || [])]);
    setShowToolsEdit(true);
  };

  const openTeamEdit = () => {
    setTempTeamMembers([...(department.team_members || [])]);
    setShowTeamEdit(true);
  };

  // Functions to save individual sections
  const saveDescription = () => {
    const updatedDepartment = {
      ...department,
      description: tempDescription
    };
    console.log('Saving description:', updatedDepartment);
    if (onUpdate) {
      onUpdate(updatedDepartment);
    }
    alert('Description saved successfully!');
    setShowDescriptionEdit(false);
  };

  const saveKPIs = () => {
    const updatedDepartment = {
      ...department,
      kpis: tempKPIs
    };
    console.log('Saving KPIs:', updatedDepartment);
    if (onUpdate) {
      onUpdate(updatedDepartment);
    }
    alert('KPIs saved successfully!');
    setShowKPIsEdit(false);
  };

  const saveTools = () => {
    const updatedDepartment = {
      ...department,
      tools_used: tempTools
    };
    console.log('Saving tools:', updatedDepartment);
    if (onUpdate) {
      onUpdate(updatedDepartment);
    }
    alert('Tools saved successfully!');
    setShowToolsEdit(false);
  };

  const saveTeamMembers = () => {
    const updatedDepartment = {
      ...department,
      team_members: tempTeamMembers
    };
    console.log('Saving team members:', updatedDepartment);
    if (onUpdate) {
      onUpdate(updatedDepartment);
    }
    alert('Team members saved successfully!');
    setShowTeamEdit(false);
  };

  // Helper function to update edited department data
  const updateEditedDepartment = (field, value) => {
    setEditedDepartment(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Helper function to update team member data
  const updateTeamMember = (memberIndex, field, value) => {
    setEditedDepartment(prev => ({
      ...prev,
      team_members: prev.team_members.map((member, index) => 
        index === memberIndex ? { ...member, [field]: value } : member
      )
    }));
  };

  // Helper function to update KPI data
  const updateKPI = (kpiIndex, field, value) => {
    setEditedDepartment(prev => ({
      ...prev,
      kpis: prev.kpis?.map((kpi, index) => 
        index === kpiIndex ? { ...kpi, [field]: value } : kpi
      ) || []
    }));
  };

  // Helper function to update tools data
  const updateTool = (toolIndex, field, value) => {
    setEditedDepartment(prev => ({
      ...prev,
      tools_used: prev.tools_used?.map((tool, index) => 
        index === toolIndex ? { ...tool, [field]: value } : tool
      ) || []
    }));
  };

  // Get the current department data (edited or original)
  const currentDepartment = isEditMode ? editedDepartment : department;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-card border-white/30 text-white max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div 
                className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-bold"
                style={{ backgroundColor: department.color }}
              >
                {department.name.charAt(0)}
              </div>
              {department.name}
              {isEditMode && (
                <span className="text-xs bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded-full">
                  Edit Mode
                </span>
              )}
            </div>
            
            {/* Edit Button - Only for Marketing Department */}
            {department.name === "Marketing" && (
              <div className="flex items-center gap-2">
                {isEditMode ? (
                  <button
                    onClick={handleExitEditMode}
                    className="glass-morphism rounded-lg px-3 py-1 hover:opacity-80 transition-all duration-300 text-white hover:text-white/80"
                    title="Exit Edit Mode"
                  >
                    <span className="text-xs">Exit Edit</span>
                  </button>
                ) : (
                  <button
                    onClick={handleEditClick}
                    className="glass-morphism rounded-lg p-2 hover:opacity-80 transition-all duration-300 text-white hover:text-white/80 glow-blue"
                    title="Edit Department Details"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4 overflow-y-auto flex-1 pr-2 glass-scroll">
          {/* Description */}
          <div>
            <h4 className="font-medium text-white mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4" />
                Description
              </div>
              {isEditMode && (
                <button
                  onClick={openDescriptionEdit}
                  className="glass-morphism rounded-lg p-1 hover:opacity-80 transition-all duration-300 text-white hover:text-white/80 glow-blue"
                  title="Edit Description"
                >
                  <Edit3 className="w-3 h-3" />
                </button>
              )}
            </h4>
            <div className="glass-morphism rounded-xl p-4">
              <p className="text-white/80">
                {department?.description || "No description provided for this department."}
              </p>
            </div>
          </div>

          {/* Department Lead */}
          {department.lead_email && (
            <div>
              <h4 className="font-medium text-white mb-2 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Department Lead
              </h4>
              <div className="glass-morphism rounded-xl p-4">
                <p className="text-white/80">{department.lead_email}</p>
              </div>
            </div>
          )}

          {/* Team Members */}
          <div>
            <h4 className="font-medium text-white mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Team Members ({department?.team_members?.length || 0})
              </div>
              {isEditMode && (
                <button
                  onClick={openTeamEdit}
                  className="glass-morphism rounded-lg p-1 hover:opacity-80 transition-all duration-300 text-white hover:text-white/80 glow-blue"
                  title="Edit Team Members"
                >
                  <Edit3 className="w-3 h-3" />
                </button>
              )}
            </h4>
            <div className="glass-morphism rounded-xl p-4">
              {department?.team_members && department.team_members.length > 0 ? (
                <div className="grid grid-cols-3 gap-3">
                  {department.team_members.map((member, index) => (
                    <div 
                      key={index} 
                      className="glass-morphism rounded-xl p-3 cursor-pointer hover:bg-white/15 transition-all duration-300"
                      onClick={() => openMemberDetail(member)}
                    >
                      {/* Two-column layout - same as TeamMembersDialog */}
                      <div className="flex items-center gap-3">
                        {/* Left Column - Profile Picture */}
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center overflow-hidden">
                            {member.profilePicture ? (
                              <img 
                                src={member.profilePicture} 
                                alt={member.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  e.target.nextSibling.style.display = 'flex';
                                }}
                              />
                            ) : null}
                            <User className={`w-6 h-6 text-white/60 ${member.profilePicture ? 'hidden' : 'block'}`} />
                          </div>
                        </div>
                        
                        {/* Right Column - Information */}
                        <div className="flex-1 min-w-0">
                          {/* Name and Type Badge */}
                          <div className="flex items-center gap-1 mb-1">
                            <span className="font-medium text-white text-sm truncate" title={member.name}>
                              {member.name}
                            </span>
                            <span className={`text-xs px-1 py-0.5 rounded-full flex-shrink-0 ${
                              member.type === 'LTV' ? 'bg-red-600/20 text-red-300' : 'bg-blue-500/20 text-blue-300'
                            }`}>
                              {member.type === 'LTV' ? 'LTV' : 'E'}
                            </span>
                          </div>
                          
                          {/* Role/Title */}
                          {member.role && (
                            <div className="text-xs text-white/80 mb-1 truncate" title={member.role}>
                              {member.role}
                            </div>
                          )}
                          
                          {/* Email */}
                          <div className="text-xs text-white/60 truncate" title={member.email}>
                            {member.email}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-white/60">No team members added yet.</p>
              )}
            </div>
          </div>

          {/* KPIs */}
          {department?.kpis && department.kpis.length > 0 && (
            <div>
              <h4 className="font-medium text-white mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  KPIs - 2025-2026 Season
                </div>
                {isEditMode && (
                  <button
                    onClick={openKPIsEdit}
                    className="glass-morphism rounded-lg p-1 hover:opacity-80 transition-all duration-300 text-white hover:text-white/80 glow-blue"
                    title="Edit KPIs"
                  >
                    <Edit3 className="w-3 h-3" />
                  </button>
                )}
              </h4>
              <div className="glass-morphism rounded-xl p-4">
                <div className="space-y-4">
                  {department.kpis.map((kpi, index) => {
                    const progress = Math.min((kpi.current / kpi.target) * 100, 100);
                    const isOnTrack = progress >= 70;
                    
                    return (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-white font-medium text-sm">{kpi.name}</span>
                          <div className="flex items-center gap-2">
                            <TrendingUp className={`w-3 h-3 ${isOnTrack ? 'text-green-400' : 'text-yellow-400'}`} />
                            <span className="text-xs text-white/60">
                              {progress.toFixed(0)}%
                            </span>
                          </div>
                        </div>
                        
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs text-white/70">
                            <span>Current: {kpi.current.toLocaleString()} {kpi.unit}</span>
                            <span>Target: {kpi.target.toLocaleString()} {kpi.unit}</span>
                          </div>
                          
                          <div className="w-full bg-white/10 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full transition-all duration-500 ${
                                isOnTrack ? 'bg-green-500' : progress >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${Math.min(progress, 100)}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Tools Used */}
          <div>
            <h4 className="font-medium text-white mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wrench className="w-4 h-4" />
                Tools & Software ({department?.tools_used?.length || 0})
              </div>
              {isEditMode && (
                <button
                  onClick={openToolsEdit}
                  className="glass-morphism rounded-lg p-1 hover:opacity-80 transition-all duration-300 text-white hover:text-white/80 glow-blue"
                  title="Edit Tools"
                >
                  <Edit3 className="w-3 h-3" />
                </button>
              )}
            </h4>
            <div className="glass-morphism rounded-xl p-4">
              {department?.tools_used && department.tools_used.length > 0 ? (
                <>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {department.tools_used.map((tool, index) => {
                      const toolData = typeof tool === 'string' ? { name: tool, paid: true } : tool;
                      return (
                        <Badge 
                          key={index} 
                          className={`glass-morphism text-white/80 relative ${
                            toolData.paid ? 'bg-green-500/20 border-green-500/30' : 'bg-blue-500/20 border-blue-500/30'
                          }`}
                        >
                          {toolData.name}
                          <span className={`ml-1 text-xs font-bold ${
                            toolData.paid ? 'text-green-400' : 'text-blue-400'
                          }`}>
                            {toolData.paid ? 'P' : 'F'}
                          </span>
                        </Badge>
                      );
                    })}
                  </div>
                  <div className="flex items-center gap-4 text-xs text-white/60 pt-2 border-t border-white/10">
                    <div className="flex items-center gap-1">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      <span>P = Paid</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      <span>F = Free</span>
                    </div>
                  </div>
                </>
              ) : (
                <p className="text-white/60">No tools specified for this department.</p>
              )}
            </div>
          </div>
        </div>
      </DialogContent>

      {/* Password Prompt Dialog */}
      <Dialog open={showPasswordPrompt} onOpenChange={handleCancelPassword}>
        <DialogContent className="glass-card border-white/30 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-yellow-400" />
              Authentication Required
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <p className="text-white/80 text-sm">
              Enter the password to edit Marketing department details:
            </p>
            
            <div className="space-y-2">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handlePasswordSubmit()}
                placeholder="Enter password..."
                className="w-full glass-morphism border-white/20 text-white text-sm px-3 py-2 rounded-lg placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
                autoFocus
              />
              
              {passwordError && (
                <p className="text-red-400 text-xs">{passwordError}</p>
              )}
            </div>
            
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={handlePasswordSubmit}
                className="glass-morphism bg-blue-500/20 border-blue-500/30 text-white px-4 py-2 rounded-lg hover:opacity-80 transition-all duration-300 text-sm font-medium"
              >
                Unlock
              </button>
              <button
                onClick={handleCancelPassword}
                className="glass-morphism text-white/70 px-4 py-2 rounded-lg hover:opacity-80 transition-all duration-300 text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Description Edit Dialog */}
      <Dialog open={showDescriptionEdit} onOpenChange={() => setShowDescriptionEdit(false)}>
        <DialogContent className="glass-card border-white/30 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Info className="w-5 h-5 text-blue-400" />
              Edit Description
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <textarea
              value={tempDescription}
              onChange={(e) => setTempDescription(e.target.value)}
              placeholder="Enter department description..."
              className="w-full glass-morphism border-white/20 text-white text-sm px-4 py-3 rounded-lg placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 resize-none min-h-[120px]"
              rows={5}
            />
            
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={saveDescription}
                className="glass-morphism bg-green-500/20 border-green-500/30 text-white px-4 py-2 rounded-lg hover:opacity-80 transition-all duration-300 text-sm font-medium flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </button>
              <button
                onClick={() => setShowDescriptionEdit(false)}
                className="glass-morphism text-white/70 px-4 py-2 rounded-lg hover:opacity-80 transition-all duration-300 text-sm flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* KPIs Edit Dialog */}
      <Dialog open={showKPIsEdit} onOpenChange={() => setShowKPIsEdit(false)}>
        <DialogContent className="glass-card border-white/30 text-white max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-green-400" />
              Edit KPIs
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4 max-h-96 overflow-y-auto">
            {tempKPIs.map((kpi, index) => (
              <div key={index} className="glass-morphism rounded-xl p-4 space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-white/70 mb-1 block">KPI Name</label>
                    <input
                      type="text"
                      value={kpi.name}
                      onChange={(e) => {
                        const newKPIs = [...tempKPIs];
                        newKPIs[index].name = e.target.value;
                        setTempKPIs(newKPIs);
                      }}
                      className="w-full glass-morphism border-white/20 text-white text-sm px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/50"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-white/70 mb-1 block">Unit</label>
                    <input
                      type="text"
                      value={kpi.unit}
                      onChange={(e) => {
                        const newKPIs = [...tempKPIs];
                        newKPIs[index].unit = e.target.value;
                        setTempKPIs(newKPIs);
                      }}
                      className="w-full glass-morphism border-white/20 text-white text-sm px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/50"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-white/70 mb-1 block">Current Value</label>
                    <input
                      type="number"
                      value={kpi.current}
                      onChange={(e) => {
                        const newKPIs = [...tempKPIs];
                        newKPIs[index].current = parseFloat(e.target.value) || 0;
                        setTempKPIs(newKPIs);
                      }}
                      className="w-full glass-morphism border-white/20 text-white text-sm px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/50"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-white/70 mb-1 block">Target Value</label>
                    <input
                      type="number"
                      value={kpi.target}
                      onChange={(e) => {
                        const newKPIs = [...tempKPIs];
                        newKPIs[index].target = parseFloat(e.target.value) || 0;
                        setTempKPIs(newKPIs);
                      }}
                      className="w-full glass-morphism border-white/20 text-white text-sm px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/50"
                    />
                  </div>
                </div>
              </div>
            ))}
            
            <div className="flex items-center gap-3 pt-4 border-t border-white/10">
              <button
                onClick={saveKPIs}
                className="glass-morphism bg-green-500/20 border-green-500/30 text-white px-4 py-2 rounded-lg hover:opacity-80 transition-all duration-300 text-sm font-medium flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </button>
              <button
                onClick={() => setShowKPIsEdit(false)}
                className="glass-morphism text-white/70 px-4 py-2 rounded-lg hover:opacity-80 transition-all duration-300 text-sm flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Tools Edit Dialog */}
      <Dialog open={showToolsEdit} onOpenChange={() => setShowToolsEdit(false)}>
        <DialogContent className="glass-card border-white/30 text-white max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Wrench className="w-5 h-5 text-purple-400" />
              Edit Tools & Software
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4 max-h-96 overflow-y-auto">
            {tempTools.map((tool, index) => {
              const toolData = typeof tool === 'string' ? { name: tool, paid: true } : tool;
              return (
                <div key={index} className="glass-morphism rounded-xl p-4 flex items-center gap-4">
                  <div className="flex-1">
                    <label className="text-xs text-white/70 mb-1 block">Tool Name</label>
                    <input
                      type="text"
                      value={toolData.name}
                      onChange={(e) => {
                        const newTools = [...tempTools];
                        if (typeof newTools[index] === 'string') {
                          newTools[index] = { name: e.target.value, paid: true };
                        } else {
                          newTools[index].name = e.target.value;
                        }
                        setTempTools(newTools);
                      }}
                      className="w-full glass-morphism border-white/20 text-white text-sm px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-white/70 mb-1 block">Type</label>
                    <button
                      onClick={() => {
                        const newTools = [...tempTools];
                        if (typeof newTools[index] === 'string') {
                          newTools[index] = { name: newTools[index], paid: false };
                        } else {
                          newTools[index].paid = !newTools[index].paid;
                        }
                        setTempTools(newTools);
                      }}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                        toolData.paid 
                          ? 'bg-green-500/20 border-green-500/30 text-green-300' 
                          : 'bg-blue-500/20 border-blue-500/30 text-blue-300'
                      } glass-morphism border`}
                    >
                      {toolData.paid ? 'Paid' : 'Free'}
                    </button>
                  </div>
                </div>
              );
            })}
            
            <div className="flex items-center gap-3 pt-4 border-t border-white/10">
              <button
                onClick={saveTools}
                className="glass-morphism bg-green-500/20 border-green-500/30 text-white px-4 py-2 rounded-lg hover:opacity-80 transition-all duration-300 text-sm font-medium flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </button>
              <button
                onClick={() => setShowToolsEdit(false)}
                className="glass-morphism text-white/70 px-4 py-2 rounded-lg hover:opacity-80 transition-all duration-300 text-sm flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Team Members Edit Dialog */}
      <Dialog open={showTeamEdit} onOpenChange={() => setShowTeamEdit(false)}>
        <DialogContent className="glass-card border-white/30 text-white max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-orange-400" />
              Edit Team Members
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4 max-h-96 overflow-y-auto">
            {tempTeamMembers.map((member, index) => (
              <div key={index} className="glass-morphism rounded-xl p-4 space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-white/70 mb-1 block">Name</label>
                    <input
                      type="text"
                      value={member.name}
                      onChange={(e) => {
                        const newMembers = [...tempTeamMembers];
                        newMembers[index].name = e.target.value;
                        setTempTeamMembers(newMembers);
                      }}
                      className="w-full glass-morphism border-white/20 text-white text-sm px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-white/70 mb-1 block">Role</label>
                    <input
                      type="text"
                      value={member.role || ''}
                      onChange={(e) => {
                        const newMembers = [...tempTeamMembers];
                        newMembers[index].role = e.target.value;
                        setTempTeamMembers(newMembers);
                      }}
                      className="w-full glass-morphism border-white/20 text-white text-sm px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-white/70 mb-1 block">Email</label>
                    <input
                      type="email"
                      value={member.email || ''}
                      onChange={(e) => {
                        const newMembers = [...tempTeamMembers];
                        newMembers[index].email = e.target.value;
                        setTempTeamMembers(newMembers);
                      }}
                      className="w-full glass-morphism border-white/20 text-white text-sm px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-white/70 mb-1 block">Type</label>
                    <button
                      onClick={() => {
                        const newMembers = [...tempTeamMembers];
                        newMembers[index].type = newMembers[index].type === 'LTV' ? 'Employee' : 'LTV';
                        setTempTeamMembers(newMembers);
                      }}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                        member.type === 'LTV' 
                          ? 'bg-red-500/20 border-red-500/30 text-red-300' 
                          : 'bg-blue-500/20 border-blue-500/30 text-blue-300'
                      } glass-morphism border`}
                    >
                      {member.type === 'LTV' ? 'Long-term Volunteer' : 'Employee'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
            
            <div className="flex items-center gap-3 pt-4 border-t border-white/10">
              <button
                onClick={saveTeamMembers}
                className="glass-morphism bg-green-500/20 border-green-500/30 text-white px-4 py-2 rounded-lg hover:opacity-80 transition-all duration-300 text-sm font-medium flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </button>
              <button
                onClick={() => setShowTeamEdit(false)}
                className="glass-morphism text-white/70 px-4 py-2 rounded-lg hover:opacity-80 transition-all duration-300 text-sm flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <TeamMemberDetailDialog
        member={selectedMember}
        department={department}
        isOpen={showMemberDetail}
        onClose={() => setShowMemberDetail(false)}
      />
    </Dialog>
  );
}