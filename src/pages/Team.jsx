import React, { useState, useEffect, useMemo } from "react";
import { Department } from "@/api/entities";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Edit, Search, Users, Briefcase } from "lucide-react";
import EditMemberDialog from "../components/team/EditMemberDialog";

export default function Team() {
    const [departments, setDepartments] = useState([]);
    const [allMembers, setAllMembers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [editingMember, setEditingMember] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const loadData = async () => {
        setLoading(true);
        try {
            const depts = await Department.list("-created_date");
            setDepartments(depts);

            const members = depts.flatMap(dept => 
                (dept.team_members || []).map(member => ({
                    ...member,
                    departmentName: dept.name,
                }))
            );
            setAllMembers(members);

        } catch (error) {
            console.error("Error loading data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const filteredMembers = useMemo(() => {
        if (!searchTerm) return allMembers;
        return allMembers.filter(member => 
            member.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.role?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.departmentName?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [allMembers, searchTerm]);

    const handleEditClick = (member) => {
        setEditingMember(member);
        setIsDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setEditingMember(null);
    };

    const handleSaveChanges = async (originalMember, updatedMemberData) => {
        setLoading(true);
        const { departmentName: newDeptName, ...memberDetails } = updatedMemberData;
        const oldDeptName = originalMember.departmentName;

        try {
            const currentDepartments = await Department.list();
            const oldDept = currentDepartments.find(d => d.name === oldDeptName);
            const newDept = currentDepartments.find(d => d.name === newDeptName);

            if (!oldDept || !newDept) {
                throw new Error("Could not find source or destination department.");
            }

            // Department has not changed, just update details
            if (oldDept.id === newDept.id) {
                const updatedMembers = oldDept.team_members.map(m => 
                    m.email === originalMember.email ? { ...memberDetails } : m
                );
                await Department.update(oldDept.id, { team_members: updatedMembers });
            } else {
                // Department has changed, move member
                const oldDeptMembers = oldDept.team_members.filter(m => m.email !== originalMember.email);
                const newDeptMembers = [...(newDept.team_members || []), { ...memberDetails }];
                
                await Promise.all([
                    Department.update(oldDept.id, { team_members: oldDeptMembers }),
                    Department.update(newDept.id, { team_members: newDeptMembers })
                ]);
            }
            
            handleCloseDialog();
        } catch (error) {
            console.error("Failed to save changes:", error);
            alert("An error occurred while saving. Please try again.");
        } finally {
            await loadData(); // Reload all data
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen px-6 py-8">
            <div className="max-w-6xl mx-auto">
                <div className="glass-card rounded-3xl p-8 mb-8">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-white mb-2">Team Directory</h1>
                            <p className="text-white/70 text-lg">Search, view, and manage all team members across departments</p>
                        </div>
                        <div className="relative w-full sm:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                            <Input
                                placeholder="Search by name, email, role..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="glass-morphism border-white/20 text-white placeholder:text-white/60 w-full pl-10"
                            />
                        </div>
                    </div>
                </div>
                
                {loading && !isDialogOpen ? (
                     <div className="text-center p-8 text-white/80">Loading team members...</div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredMembers.map((member, index) => (
                            <motion.div
                                key={`${member.email}-${index}`}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.05 }}
                                className="glass-card rounded-2xl p-6"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full glass-morphism flex items-center justify-center text-xl font-bold text-white">
                                            {member.name?.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-white text-lg">{member.name}</h3>
                                            <p className="text-white/60 text-sm">{member.email}</p>
                                        </div>
                                    </div>
                                    <Button size="icon" variant="ghost" className="text-white/60 hover:text-white hover:bg-white/10" onClick={() => handleEditClick(member)}>
                                        <Edit className="w-4 h-4" />
                                    </Button>
                                </div>

                                <div className="mt-4 pt-4 border-t border-white/20 space-y-3">
                                    <div className="flex items-center gap-3 text-sm">
                                        <Briefcase className="w-4 h-4 text-white/50" />
                                        <span className="text-white/80">{member.role || 'No role assigned'}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm">
                                        <Users className="w-4 h-4 text-white/50" />
                                        <span className="text-white/80">{member.departmentName}</span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
                 {filteredMembers.length === 0 && !loading && (
                    <div className="text-center glass-card rounded-2xl p-12">
                        <p className="text-white/70 text-lg">No members found matching your search.</p>
                    </div>
                )}
            </div>

            {editingMember && (
                <EditMemberDialog
                    isOpen={isDialogOpen}
                    onClose={handleCloseDialog}
                    member={editingMember}
                    departments={departments}
                    onSave={handleSaveChanges}
                />
            )}
        </div>
    );
}