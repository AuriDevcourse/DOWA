import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, X, Users, User } from "lucide-react";
import TeamMemberDetailDialog from "./TeamMemberDetailDialog";

export default function TeamMembersDialog({ department, allDepartments = [], onUpdate, isOpen, onClose }) {
  const [teamMembers, setTeamMembers] = useState([]);
  const [newMember, setNewMember] = useState({ name: "", email: "", role: "", type: "employee" });
  const [selectedMember, setSelectedMember] = useState(null);
  const [showMemberDetail, setShowMemberDetail] = useState(false);

  useEffect(() => {
    if (department) {
      setTeamMembers(department.team_members || []);
    } else {
      setTeamMembers([]);
    }
  }, [department, isOpen]);

  const addMember = () => {
    if (newMember.name && newMember.email) {
      setTeamMembers([...teamMembers, { ...newMember }]);
      setNewMember({ name: "", email: "", role: "", type: "employee" });
    }
  };

  const removeMember = (index) => {
    setTeamMembers(teamMembers.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    onUpdate({ ...department, team_members: teamMembers });
    onClose();
  };

  const openMemberDetail = (member) => {
    setSelectedMember(member);
    setShowMemberDetail(true);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-card border-white/30 text-white max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Team Members - {department?.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Add New Member */}
          <div className="glass-morphism rounded-xl p-4">
            <h4 className="font-medium text-white mb-3">Add Team Member</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-white/80">Name</Label>
                <Input
                  value={newMember.name}
                  onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                  placeholder="Full name"
                  className="glass-morphism border-white/20 text-white placeholder:text-white/50"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white/80">Email</Label>
                <Input
                  value={newMember.email}
                  onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                  placeholder="email@example.com"
                  className="glass-morphism border-white/20 text-white placeholder:text-white/50"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white/80">Role</Label>
                <Input
                  value={newMember.role}
                  onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
                  placeholder="Manager, Designer, etc."
                  className="glass-morphism border-white/20 text-white placeholder:text-white/50"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white/80">Type</Label>
                <Select
                  value={newMember.type}
                  onValueChange={(value) => setNewMember({ ...newMember, type: value })}
                >
                  <SelectTrigger className="glass-morphism border-white/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="employee">Employee</SelectItem>
                    <SelectItem value="LTV">LTV (Long term Volunteer)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button onClick={addMember} className="glass-intense text-white mt-3" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Member
            </Button>
          </div>

          {/* Team Members List */}
          <div className="max-h-80 overflow-y-auto">
            {teamMembers.length === 0 ? (
              <div className="text-center py-8 text-white/60">
                No team members added yet
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-3">
                {teamMembers.map((member, index) => (
                  <div 
                    key={index} 
                    className="glass-morphism rounded-xl p-3 relative cursor-pointer hover:bg-white/15 transition-all duration-300"
                    onClick={() => openMemberDetail(member)}
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeMember(index);
                      }}
                      className="absolute top-1 right-1 h-6 w-6 p-0 text-white/60 hover:text-white hover:bg-white/10"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                    
                    {/* Two-column layout */}
                    <div className="flex items-center gap-3 pr-6">
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
            )}
          </div>
        </div>

        <DialogFooter className="border-t border-white/20 pt-4">
          <Button variant="outline" onClick={onClose} className="glass-morphism border-white/20 text-white hover:bg-white/10">
            Cancel
          </Button>
          <Button onClick={handleSave} className="glass-intense text-white">
            Save Team
          </Button>
        </DialogFooter>
      </DialogContent>

      <TeamMemberDetailDialog
        member={selectedMember}
        department={department}
        allDepartments={allDepartments}
        isOpen={showMemberDetail}
        onClose={() => setShowMemberDetail(false)}
      />
    </Dialog>
  );
}