import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import PersonCard from "@/components/ui/PersonCard";
import { User, Linkedin, Briefcase, Wrench, Users, ExternalLink, Star, Globe } from "lucide-react";

export default function TeamMemberDetailDialog({ member, department, allDepartments = [], isOpen, onClose }) {
  if (!member) return null;

  // Find the person this member reports to
  const findReportsToPersonData = (reportsToString) => {
    if (!reportsToString || !allDepartments) return null;
    
    // Search through all departments to find the person
    for (const dept of allDepartments) {
      if (dept.team_members) {
        const foundPerson = dept.team_members.find(teamMember => {
          // Check if the name matches (with or without role in parentheses)
          const nameMatch = teamMember.name === reportsToString || 
                           `${teamMember.name} (${teamMember.role})` === reportsToString;
          return nameMatch;
        });
        
        if (foundPerson) {
          return {
            ...foundPerson,
            department: dept.name
          };
        }
      }
    }
    
    // If not found, return a basic object with parsed name and role
    const match = reportsToString.match(/^(.+?)\s*\((.+?)\)$/);
    if (match) {
      return {
        name: match[1].trim(),
        role: match[2].trim()
      };
    }
    
    return {
      name: reportsToString,
      role: null
    };
  };

  const reportsToPersonData = member.reportsTo ? findReportsToPersonData(member.reportsTo) : null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-card border-white/30 text-white max-w-2xl" style={{ background: 'rgba(255, 255, 255, 0.15)', backdropFilter: 'blur(15px)', maxHeight: '90vh', display: 'flex', flexDirection: 'column', position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            {/* Profile Picture */}
            <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center overflow-hidden">
              {member.profilePicture ? (
                <img 
                  src={member.profilePicture} 
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-6 h-6 text-white/60" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span>{member.name}</span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  member.type === 'LTV' ? 'bg-red-600/20 text-red-300' : 'bg-blue-500/20 text-blue-300'
                }`}>
                  {member.type === 'LTV' ? 'LTV' : 'Employee'}
                </span>
              </div>
              <div className="text-sm text-white/70">{member.role}</div>
              <div className="text-xs text-white/60">{department?.name} Department</div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4 overflow-y-auto flex-1 pr-2 glass-scroll">
          {/* Contact Information */}
          <div>
            <h4 className="font-medium text-white mb-3 flex items-center gap-2">
              <User className="w-4 h-4" />
              Contact Information
            </h4>
            <div className="glass-morphism rounded-xl p-4 space-y-3">
              <div>
                <span className="text-white/70 text-sm">Email:</span>
                <div className="text-white">{member.email}</div>
              </div>
              {member.linkedin && (
                <div>
                  <span className="text-white/70 text-sm">LinkedIn:</span>
                  <div className="flex items-center gap-2">
                    <Linkedin className="w-4 h-4 text-white/70" />
                    <a 
                      href={member.linkedin} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-white/80 hover:text-white transition-colors flex items-center gap-1"
                    >
                      View Profile
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Special Skills */}
          {member.specialSkills && member.specialSkills.length > 0 && (
            <div>
              <h4 className="font-medium text-white mb-3 flex items-center gap-2">
                <Star className="w-4 h-4" />
                Special Skills
              </h4>
              <div className="glass-morphism rounded-xl p-4">
                <div className="flex flex-wrap gap-2">
                  {member.specialSkills.map((skill, index) => (
                    <Badge key={index} className="glass-morphism text-white/80 bg-blue-500/20 border-blue-500/30">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Languages */}
          {member.languages && member.languages.length > 0 && (
            <div>
              <h4 className="font-medium text-white mb-3 flex items-center gap-2">
                <Globe className="w-4 h-4" />
                Languages
              </h4>
              <div className="glass-morphism rounded-xl p-4">
                <div className="flex flex-wrap gap-2">
                  {member.languages.map((language, index) => (
                    <Badge key={index} className="glass-morphism text-white/80 bg-green-500/20 border-green-500/30">
                      {language}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Responsibilities */}
          {member.responsibilities && member.responsibilities.length > 0 && (
            <div>
              <h4 className="font-medium text-white mb-3 flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                Key Responsibilities
              </h4>
              <div className="glass-morphism rounded-xl p-4">
                <ul className="space-y-2">
                  {member.responsibilities.map((responsibility, index) => (
                    <li key={index} className="text-white/80 text-sm flex items-start gap-2">
                      <span className="text-blue-400 mt-1">•</span>
                      {responsibility}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Tools & Technologies */}
          {member.tools && member.tools.length > 0 && (
            <div>
              <h4 className="font-medium text-white mb-3 flex items-center gap-2">
                <Wrench className="w-4 h-4" />
                Tools & Technologies
              </h4>
              <div className="glass-morphism rounded-xl p-4">
                <div className="flex flex-wrap gap-2">
                  {member.tools.map((tool, index) => (
                    <Badge key={index} className="glass-morphism text-white/80 bg-white/10">
                      {tool}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Reporting Structure */}
          {member.reportsTo && reportsToPersonData && (
            <div>
              <h4 className="font-medium text-white mb-3 flex items-center gap-2">
                <Users className="w-4 h-4" />
                Reporting Structure
              </h4>
              <div className="space-y-3">
                <div className="text-white/70 text-sm">Reports to:</div>
                <PersonCard 
                  person={reportsToPersonData} 
                  showRole={true} 
                  showDepartment={true}
                  className="border border-white/20"
                />
              </div>
            </div>
          )}

        </div>
      </DialogContent>
    </Dialog>
  );
}
