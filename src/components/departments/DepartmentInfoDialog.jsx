import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Users, Wrench, Mail, Info } from "lucide-react";

export default function DepartmentInfoDialog({ department, isOpen, onClose }) {
  if (!department) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-card border-white/30 text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div 
              className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-bold"
              style={{ backgroundColor: department.color }}
            >
              {department.name.charAt(0)}
            </div>
            {department.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Description */}
          <div>
            <h4 className="font-medium text-white mb-2 flex items-center gap-2">
              <Info className="w-4 h-4" />
              Description
            </h4>
            <div className="glass-morphism rounded-xl p-4">
              <p className="text-white/80">
                {department.description || "No description provided for this department."}
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
            <h4 className="font-medium text-white mb-2 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Team Members ({department.team_members?.length || 0})
            </h4>
            <div className="glass-morphism rounded-xl p-4">
              {department.team_members && department.team_members.length > 0 ? (
                <div className="space-y-3">
                  {department.team_members.map((member, index) => (
                    <div key={index} className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-white">{member.name}</span>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            member.type === 'LTV' ? 'bg-purple-500/20 text-purple-300' : 'bg-blue-500/20 text-blue-300'
                          }`}>
                            {member.type === 'LTV' ? 'LTV' : 'Employee'}
                          </span>
                        </div>
                        <div className="text-sm text-white/70">{member.email}</div>
                        {member.role && (
                          <div className="mt-1">
                            <Badge className="glass-morphism text-xs text-white/80 bg-white/10">
                              {member.role}
                            </Badge>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-white/60">No team members added yet.</p>
              )}
            </div>
          </div>

          {/* Tools Used */}
          <div>
            <h4 className="font-medium text-white mb-2 flex items-center gap-2">
              <Wrench className="w-4 h-4" />
              Tools & Software ({department.tools_used?.length || 0})
            </h4>
            <div className="glass-morphism rounded-xl p-4">
              {department.tools_used && department.tools_used.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {department.tools_used.map((tool, index) => (
                    <Badge key={index} className="glass-morphism text-white/80 bg-white/10">
                      {tool}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-white/60">No tools specified for this department.</p>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}