import React, { useState, useEffect } from "react";
import { Department } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Trash2, Edit, Plus, Palette, AlertTriangle, Users, Building2, UserPlus, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

export default function Settings() {
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newDept, setNewDept] = useState({ name: "", color: "#8B5CF6", description: "" });
    const [editingDept, setEditingDept] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [isDepartmentsOpen, setIsDepartmentsOpen] = useState(false);
    const [isTeamManagementOpen, setIsTeamManagementOpen] = useState(false);

    useEffect(() => {
        loadDepartments();
    }, []);

    const loadDepartments = async () => {
        setLoading(true);
        try {
            const depts = await Department.list("-created_date");
            setDepartments(depts);
        } catch (error) {
            console.error("Error loading departments:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!newDept.name) return;
        try {
            await Department.create(newDept);
            setNewDept({ name: "", color: "#8B5CF6", description: "" });
            loadDepartments();
        } catch (error) {
            console.error("Error creating department:", error);
            alert("Error creating department. Please try again.");
        }
    };

    const handleDelete = async (dept) => {
        try {
            await Department.delete(dept.id);
            setDeleteConfirm(null);
            loadDepartments();
        } catch (error) {
            console.error("Delete error:", error);
            alert("Error deleting department. Please try again.");
            // Always refresh the list regardless of error
            loadDepartments();
        }
    };

    const handleUpdate = async () => {
        if (!editingDept) return;
        try {
            await Department.update(editingDept.id, {
                name: editingDept.name,
                color: editingDept.color,
                description: editingDept.description
            });
            setIsDialogOpen(false);
            setEditingDept(null);
            loadDepartments();
        } catch (error) {
            console.error("Error updating department:", error);
            alert("Error updating department. Please try again.");
        }
    };

    const openEditDialog = (dept) => {
        setEditingDept({ ...dept });
        setIsDialogOpen(true);
    };

    const openDeleteConfirm = (dept) => {
        setDeleteConfirm(dept);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="glass-card rounded-2xl p-8 text-center">
                    <div className="animate-spin w-8 h-8 border-2 border-white/30 border-t-white rounded-full mx-auto mb-4" />
                    <p className="text-white/80">Loading settings...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen px-6 py-8">
            <div className="max-w-4xl mx-auto space-y-8">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
                    <p className="text-white/70">Manage departments, team members, and organizational structure.</p>
                </motion.div>

                {/* Add New Department */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="glass-card rounded-3xl p-8"
                >
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><Plus /> Add New Department</h2>
                    <form onSubmit={handleCreate} className="space-y-4 md:space-y-0 md:flex md:gap-4 md:items-end">
                        <div className="flex-grow space-y-2">
                            <Label className="text-white/80">Department Name</Label>
                            <Input
                                value={newDept.name}
                                onChange={(e) => setNewDept({ ...newDept, name: e.target.value })}
                                placeholder="e.g., Marketing"
                                className="glass-morphism border-white/20 text-white placeholder:text-white/50"
                                required
                            />
                        </div>
                        <div className="flex-grow space-y-2">
                             <Label className="text-white/80">Description</Label>
                            <Input
                                value={newDept.description}
                                onChange={(e) => setNewDept({ ...newDept, description: e.target.value })}
                                placeholder="Optional description"
                                className="glass-morphism border-white/20 text-white placeholder:text-white/50"
                            />
                        </div>
                        <div className="flex items-end gap-4">
                           <div className="space-y-2">
                             <Label className="text-white/80 flex items-center gap-2"><Palette /></Label>
                             <Input
                                type="color"
                                value={newDept.color}
                                onChange={(e) => setNewDept({ ...newDept, color: e.target.value })}
                                className="glass-morphism p-1 h-10"
                             />
                           </div>
                           <Button type="submit" className="glass-intense text-white font-semibold flex-1 h-10">Create</Button>
                        </div>
                    </form>
                </motion.div>

                {/* Existing Departments */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="glass-card rounded-3xl p-8"
                >
                    <button
                        onClick={() => setIsDepartmentsOpen(!isDepartmentsOpen)}
                        className="w-full flex items-center justify-between mb-4 hover:bg-white/5 rounded-lg px-3 py-2 transition-all duration-300"
                    >
                        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                            <Building2 className="w-4 h-4" />
                            Existing Departments ({departments.length})
                        </h2>
                        <ChevronRight 
                            className={`w-4 h-4 text-white/60 transform transition-transform duration-300 ease-in-out ${
                                isDepartmentsOpen ? 'rotate-90' : 'rotate-0'
                            }`} 
                        />
                    </button>
                    
                    <div 
                        className={`overflow-hidden transition-all duration-500 ease-in-out ${
                            isDepartmentsOpen ? 'max-h-[1500px] opacity-100' : 'max-h-0 opacity-0'
                        }`}
                    >
                        <div className="space-y-3">
                            {departments.map((dept, index) => (
                                <div 
                                    key={dept.id} 
                                    className="glass-morphism rounded-2xl p-4 flex items-center justify-between transform transition-all duration-200 ease-out"
                                    style={{ 
                                        transitionDelay: isDepartmentsOpen ? `${index * 50}ms` : '0ms'
                                    }}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-8 h-8 rounded-lg flex-shrink-0" style={{ backgroundColor: dept.color }} />
                                        <div>
                                            <p className="font-semibold text-white">{dept.name}</p>
                                            <p className="text-sm text-white/60">
                                                {dept.description || "No description"} • {dept.team_members?.length || 0} members
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button variant="ghost" size="icon" onClick={() => openEditDialog(dept)} className="text-white/70 hover:text-white hover:bg-white/10">
                                            <Edit className="w-4 h-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" onClick={() => openDeleteConfirm(dept)} className="text-white/70 hover:text-red-400 hover:bg-red-400/10">
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                            {departments.length === 0 && (
                                <p className="text-center text-white/60 py-4">No departments created yet.</p>
                            )}
                        </div>
                    </div>
                </motion.div>

                {/* Team Management */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="glass-card rounded-3xl p-8"
                >
                    <button
                        onClick={() => setIsTeamManagementOpen(!isTeamManagementOpen)}
                        className="w-full flex items-center justify-between mb-4 hover:bg-white/5 rounded-lg px-3 py-2 transition-all duration-300"
                    >
                        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            Team Management ({departments.reduce((total, dept) => total + (dept.team_members?.length || 0), 0)} total members)
                        </h2>
                        <ChevronRight 
                            className={`w-4 h-4 text-white/60 transform transition-transform duration-300 ease-in-out ${
                                isTeamManagementOpen ? 'rotate-90' : 'rotate-0'
                            }`} 
                        />
                    </button>
                    
                    <div 
                        className={`overflow-hidden transition-all duration-500 ease-in-out ${
                            isTeamManagementOpen ? 'max-h-[2500px] opacity-100' : 'max-h-0 opacity-0'
                        }`}
                    >
                        <div className="space-y-6">
                            {departments.map((dept, deptIndex) => (
                                <div 
                                    key={dept.id} 
                                    className="glass-morphism rounded-2xl p-6 transform transition-all duration-200 ease-out"
                                    style={{ 
                                        transitionDelay: isTeamManagementOpen ? `${deptIndex * 100}ms` : '0ms'
                                    }}
                                >
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-6 h-6 rounded-lg" style={{ backgroundColor: dept.color }} />
                                        <h3 className="font-semibold text-white text-lg">{dept.name}</h3>
                                        <span className="text-sm text-white/60">
                                            {dept.team_members?.length || 0} members
                                        </span>
                                    </div>
                                    
                                    {dept.team_members && dept.team_members.length > 0 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                            {dept.team_members.map((member, memberIndex) => (
                                                <div 
                                                    key={memberIndex} 
                                                    className="bg-white/5 rounded-lg p-3 flex items-center gap-3 transform transition-all duration-200 ease-out"
                                                    style={{ 
                                                        transitionDelay: isTeamManagementOpen ? `${(deptIndex * 100) + (memberIndex * 50)}ms` : '0ms'
                                                    }}
                                                >
                                                    {/* Profile Picture */}
                                                    <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
                                                        {member.profilePicture ? (
                                                            <img 
                                                                src={member.profilePicture} 
                                                                alt={member.name}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <Users className="w-4 h-4 text-white/60" />
                                                        )}
                                                    </div>
                                                    
                                                    {/* Member Info */}
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-1 mb-1">
                                                            <span className="font-medium text-white text-sm truncate">
                                                                {member.name}
                                                            </span>
                                                            <span className={`text-xs px-1 py-0.5 rounded-full flex-shrink-0 ${
                                                                member.type === 'LTV' ? 'bg-red-600/20 text-red-300' : 'bg-blue-500/20 text-blue-300'
                                                            }`}>
                                                                {member.type === 'LTV' ? 'LTV' : 'E'}
                                                            </span>
                                                        </div>
                                                        {member.role && (
                                                            <div className="text-xs text-white/70 truncate">
                                                                {member.role}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-6 text-white/60">
                                            <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                            <p>No team members in this department</p>
                                            <p className="text-sm">Use the Departments page to add team members</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                            
                            {departments.length === 0 && (
                                <div className="text-center py-8 text-white/60">
                                    <Building2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                    <p className="text-lg mb-2">No departments created yet</p>
                                    <p className="text-sm">Create departments first to manage team members</p>
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Edit Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="glass-card border-white/30 text-white">
                    <DialogHeader>
                        <DialogTitle>Edit Department</DialogTitle>
                    </DialogHeader>
                    {editingDept && (
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label>Department Name</Label>
                                <Input
                                    value={editingDept.name}
                                    onChange={(e) => setEditingDept({ ...editingDept, name: e.target.value })}
                                    className="glass-morphism border-white/20 text-white placeholder:text-white/50"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Description</Label>
                                <Input
                                    value={editingDept.description}
                                    onChange={(e) => setEditingDept({ ...editingDept, description: e.target.value })}
                                    className="glass-morphism border-white/20 text-white placeholder:text-white/50"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Color</Label>
                                <Input
                                    type="color"
                                    value={editingDept.color}
                                    onChange={(e) => setEditingDept({ ...editingDept, color: e.target.value })}
                                    className="glass-morphism p-1 w-full"
                                />
                            </div>
                        </div>
                    )}
                    <DialogFooter className="border-t border-white/20 pt-4">
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="glass-morphism border-white/20 text-white hover:bg-white/10">Cancel</Button>
                        <Button onClick={handleUpdate} className="glass-intense text-white">Save Changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
                <DialogContent className="glass-card border-white/30 text-white">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-red-400" />
                            Delete Department
                        </DialogTitle>
                    </DialogHeader>
                    {deleteConfirm && (
                        <div className="py-4">
                            <p className="text-white/80 mb-4">
                                Are you sure you want to delete the department <strong>"{deleteConfirm.name}"</strong>?
                            </p>
                            <div className="glass-morphism rounded-xl p-4">
                                <p className="text-sm text-white/70 mb-2">This action will:</p>
                                <ul className="text-sm text-white/60 space-y-1">
                                    <li>• Remove {deleteConfirm.team_members?.length || 0} team members from this department</li>
                                    <li>• Delete all department data permanently</li>
                                    <li>• Cannot be undone</li>
                                </ul>
                            </div>
                        </div>
                    )}
                    <DialogFooter className="border-t border-white/20 pt-4">
                        <Button variant="outline" onClick={() => setDeleteConfirm(null)} className="glass-morphism border-white/20 text-white hover:bg-white/10">
                            Cancel
                        </Button>
                        <Button onClick={() => handleDelete(deleteConfirm)} className="bg-red-600 hover:bg-red-700 text-white">
                            Delete Department
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}