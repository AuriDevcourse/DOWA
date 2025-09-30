import React, { useState, useEffect } from "react";
import { Department } from "@/api/entities";
import { Crown, Users, Mail, Building2 } from "lucide-react";

export default function OrgChart() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const departmentsData = await Department.list();
      setDepartments(departmentsData || []);
    } catch (error) {
      console.error("Error loading departments:", error);
      setDepartments([]);
    } finally {
      setLoading(false);
    }
  };

  // Organize team members by hierarchy
  const organizeHierarchy = () => {
    const cLevel = [];
    const executiveAssistants = [];
    const departmentHeads = [];
    
    // Specific C-level names to include
    const cLevelNames = ['avnit', 'sadia', 'thomas', 'benjamin'];
    
    departments.forEach(dept => {
      if (dept.team_members) {
        dept.team_members.forEach(member => {
          const memberWithDept = {
            ...member,
            department: dept.name,
            departmentColor: dept.color
          };
          
          if (member.role) {
            const role = member.role.toLowerCase();
            const name = member.name.toLowerCase();
            
            // C-level executives - only Avnit, Sadia, Thomas, and Benjamin
            if (cLevelNames.some(cName => name.includes(cName))) {
              cLevel.push(memberWithDept);
            }
            // Executive assistants
            else if (role.includes('executive assistant')) {
              executiveAssistants.push(memberWithDept);
            }
            // Department heads (including other chiefs and heads)
            else if (role.includes('chief') || role.includes('ceo') || role.includes('coo') || 
                     role.includes('cco') || role.includes('cxo') || role.includes('head of') || 
                     role.includes('head,') || (role.includes('head') && !role.includes('growth')) ||
                     role.includes('manager') && dept.name === 'Program') {
              departmentHeads.push(memberWithDept);
            }
          }
        });
      }
    });

    // Sort C-level by specific order: Avnit, Sadia, Thomas, Benjamin
    cLevel.sort((a, b) => {
      const nameOrder = { 'avnit': 0, 'sadia': 1, 'thomas': 2, 'benjamin': 3 };
      const aOrder = Object.keys(nameOrder).find(key => a.name.toLowerCase().includes(key));
      const bOrder = Object.keys(nameOrder).find(key => b.name.toLowerCase().includes(key));
      return (nameOrder[aOrder] || 99) - (nameOrder[bOrder] || 99);
    });

    // Sort department heads alphabetically by department
    departmentHeads.sort((a, b) => a.department.localeCompare(b.department));

    return { cLevel, executiveAssistants, departmentHeads };
  };

  const { cLevel, executiveAssistants, departmentHeads } = organizeHierarchy();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="glass-card rounded-2xl p-8 text-center">
          <div className="animate-spin w-8 h-8 border-2 border-white/30 border-t-white rounded-full mx-auto mb-4" />
          <p className="text-glass-muted">Loading organizational chart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 py-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Page Header */}
        <div className="glass-card rounded-3xl p-8 mb-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-glass mb-4">Organizational Chart</h1>
            <p className="text-glass-subtle text-lg">TechBBQ Team Structure & Hierarchy</p>
          </div>
        </div>

        {/* C-Level Executives */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-glass mb-8 flex items-center gap-3">
            <Crown className="w-8 h-8 text-yellow-400" />
            C-Level Executives
          </h2>
          
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {cLevel.map((executive, index) => (
              <div key={index} className="glass-card rounded-2xl p-8 text-center border-2 border-yellow-400/20">
                <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6 overflow-hidden border-2 border-yellow-400/30">
                  {executive.profilePicture ? (
                    <img 
                      src={executive.profilePicture} 
                      alt={executive.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Users className="w-12 h-12 text-white/60" />
                  )}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{executive.name}</h3>
                <p className="text-yellow-200 text-sm font-semibold mb-3">{executive.role}</p>
                <div className="flex items-center justify-center gap-2 mb-4">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: executive.departmentColor }}
                  ></div>
                  <span className="text-xs text-glass-subtle">{executive.department}</span>
                </div>
                {executive.email && (
                  <div className="flex items-center justify-center gap-2 text-xs text-glass-muted">
                    <Mail className="w-3 h-3" />
                    {executive.email}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Executive Assistants */}
        <div className="mb-12">
          <h3 className="text-xl font-semibold text-glass mb-4 flex items-center gap-3 ml-4">
            <Users className="w-5 h-5 text-yellow-300" />
            Executive Support Team
          </h3>
          
          <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {executiveAssistants.map((assistant, index) => (
              <div key={index} className="glass-morphism rounded-xl p-4 border border-yellow-400/10">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0 border border-yellow-400/20">
                    {assistant.profilePicture ? (
                      <img 
                        src={assistant.profilePicture} 
                        alt={assistant.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Users className="w-6 h-6 text-white/60" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-white text-sm truncate">{assistant.name}</h4>
                    <p className="text-xs text-yellow-200 truncate">{assistant.role}</p>
                    {assistant.email && (
                      <p className="text-xs text-glass-muted truncate">{assistant.email}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Department Heads */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-glass mb-6 flex items-center gap-3">
            <Users className="w-6 h-6 text-blue-400" />
            Department Heads & Managers
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {departmentHeads.map((head, index) => (
              <div key={index} className="glass-morphism rounded-xl p-5 border border-blue-400/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0 border border-blue-400/30">
                    {head.profilePicture ? (
                      <img 
                        src={head.profilePicture} 
                        alt={head.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Users className="w-7 h-7 text-white/60" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-white text-base truncate">{head.name}</h4>
                    <p className="text-sm text-blue-200 truncate font-medium">{head.role}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 mb-3">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: head.departmentColor }}
                  ></div>
                  <span className="text-sm text-glass-subtle font-medium">{head.department}</span>
                </div>
                
                {head.email && (
                  <div className="text-xs text-glass-muted truncate">
                    <Mail className="w-3 h-3 inline mr-1" />
                    {head.email}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Department Structure */}
        <div>
          <h2 className="text-2xl font-bold text-glass mb-6 flex items-center gap-3">
            <Building2 className="w-6 h-6 text-green-400" />
            Department Structure & Teams
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {departments.map((department, index) => (
              <div key={index} className="glass-card rounded-xl p-4">
                <div className="flex items-center gap-3 mb-4">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: department.color }}
                  ></div>
                  <h3 className="font-bold text-white">{department.name}</h3>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-glass-muted">Team Members</span>
                    <span className="text-blue-400 font-semibold">
                      {department.team_members?.length || 0}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-glass-muted">Tools Used</span>
                    <span className="text-purple-400 font-semibold">
                      {department.tools_used?.length || 0}
                    </span>
                  </div>
                </div>

                {department.team_members && department.team_members.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-white/10">
                    <div className="text-xs text-glass-subtle mb-2">Team:</div>
                    <div className="space-y-1 max-h-32 overflow-y-auto">
                      {department.team_members.slice(0, 5).map((member, memberIndex) => (
                        <div key={memberIndex} className="text-xs text-glass-muted truncate">
                          {member.name} - {member.role || 'Employee'}
                        </div>
                      ))}
                      {department.team_members.length > 5 && (
                        <div className="text-xs text-glass-subtle">
                          +{department.team_members.length - 5} more...
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
