import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, X, Users } from "lucide-react";

export default function TeamMembersDialog({ department, onUpdate, isOpen, onClose }) {
  const [teamMembers, setTeamMembers] = useState([]);
  const [newMember, setNewMember] = useState({ name: "", email: "", role: "", type: "employee" });

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-card border-white/30 text-white max-w-2xl">
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
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {teamMembers.map((member, index) => (
              <div key={index} className="glass-morphism rounded-xl p-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium text-white">{member.name}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        member.type === 'LTV' ? 'bg-purple-500/20 text-purple-300' : 'bg-blue-500/20 text-blue-300'
                      }`}>
                        {member.type === 'LTV' ? 'LTV' : 'Employee'}
                      </span>
                    </div>
                    <div className="text-sm text-white/70 mb-2">{member.email}</div>
                    {member.role && (
                      <div className="flex items-center gap-1">
                        <span className="glass-morphism rounded-full px-2 py-1 text-xs text-white/80">
                          {member.role}
                        </span>
                      </div>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeMember(index)}
                    className="text-white/80 hover:text-white hover:bg-white/10"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
            {teamMembers.length === 0 && (
              <div className="text-center py-4 text-white/60">
                No team members added yet
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
    </Dialog>
  );
}