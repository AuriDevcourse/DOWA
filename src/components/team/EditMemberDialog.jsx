import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users } from "lucide-react";

export default function EditMemberDialog({ isOpen, onClose, member, departments, onSave }) {
    const [updatedMember, setUpdatedMember] = useState(null);

    useEffect(() => {
        if (member) {
            setUpdatedMember({ ...member });
        }
    }, [member, isOpen]);

    const handleChange = (field, value) => {
        setUpdatedMember(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = () => {
        onSave(member, updatedMember);
    };

    if (!updatedMember) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="glass-card border-white/30 text-white max-w-lg">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Users className="w-5 h-5" />
                        Edit Team Member
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-white/80">Name</Label>
                            <Input
                                value={updatedMember.name}
                                onChange={(e) => handleChange('name', e.target.value)}
                                className="glass-morphism border-white/20 text-white"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-white/80">Email</Label>
                            <Input
                                value={updatedMember.email}
                                disabled
                                className="glass-morphism border-white/20 text-white/70"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-white/80">Role</Label>
                        <Input
                            value={updatedMember.role}
                            onChange={(e) => handleChange('role', e.target.value)}
                            className="glass-morphism border-white/20 text-white"
                        />
                    </div>
                    
                    <div className="space-y-2">
                        <Label className="text-white/80">Department</Label>
                        <Select
                            value={updatedMember.departmentName}
                            onValueChange={(value) => handleChange('departmentName', value)}
                        >
                            <SelectTrigger className="glass-morphism border-white/20 text-white">
                                <SelectValue placeholder="Select department" />
                            </SelectTrigger>
                            <SelectContent>
                                {departments.map((dept) => (
                                    <SelectItem key={dept.id} value={dept.name}>
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: dept.color }} />
                                            {dept.name}
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <DialogFooter className="border-t border-white/20 pt-4">
                    <Button variant="outline" onClick={onClose} className="glass-morphism border-white/20 text-white hover:bg-white/10">
                        Cancel
                    </Button>
                    <Button onClick={handleSave} className="glass-intense text-white">
                        Save Changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}