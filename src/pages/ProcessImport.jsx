import React, { useState, useEffect } from "react";
import { Department } from "@/api/entities";
import { ExtractDataFromUploadedFile } from "@/api/integrations";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function ProcessImport() {
  const navigate = useNavigate();
  const [status, setStatus] = useState('processing');

  useEffect(() => {
    const extractAndImportData = async () => {
      try {
        const imageUrls = [
          "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68d3c16763e1ce866b62b231/f5cbcfd2c_image.png",
          "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68d3c16763e1ce866b62b231/e8d56c271_image.png",
          "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68d3c16763e1ce866b62b231/0e7376207_image.png"
        ];

        const schema = {
          type: "object",
          properties: {
            people: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  role: { type: "string" },
                  email: { type: "string" }
                },
                required: ["name", "role", "email"]
              }
            }
          }
        };

        let allPeople = [];
        for (const url of imageUrls) {
          const result = await ExtractDataFromUploadedFile({ file_url: url, json_schema: schema });
          if (result.status === 'success' && result.output.people) {
            allPeople = [...allPeople, ...result.output.people];
          }
        }
        
        const getDepartment = (person) => {
            const name = person.name.toLowerCase();
            const role = person.role.toLowerCase();
            
            // Specific name mappings based on user corrections
            if (name.includes('maria krupa')) return 'Marketing'; // Growth & Data → Marketing
            if (name.includes('auri baciauskas')) return 'Marketing'; // Design → Marketing
            if (name.includes('chloe passerat')) return 'Marketing'; // Marketing Content Lead
            if (name.includes('vera liscinska')) return 'Marketing'; // Head of Marketing
            
            if (name.includes('keyvan') || name.includes('bamdej')) return 'PR'; // PR & Communications → PR
            if (name.includes('mikael hansen')) return 'PR'; // PR & Communications Manager → PR
            
            if (name.includes('pedro granacha')) return 'Program'; // Program Manager → Program  
            if (name.includes('inigo casillas')) return 'Program'; // Program Coordinator → Program
            
            if (name.includes('joanna opoka')) return 'Events'; // Senior Project Manager → Events
            if (name.includes('mette baastrup')) return 'Events'; // Event Manager
            
            if (name.includes('allan') && name.includes('hadjimihalovic')) return 'Finance'; // Project Controller → Finance
            if (name.includes('stephan evon')) return 'Finance'; // Head of Finance
            
            if (name.includes('sandra') && name.includes('frandsen')) return 'Operations'; // Executive Assistant → Operations
            if (name.includes('malou') && name.includes('wichmann')) return 'Operations'; // Executive Personal Assistant → Operations
            if (name.includes('shabana naseri')) return 'Operations'; // Executive Personal Assistant → Operations
            if (name.includes('carol commey')) return 'Operations'; // Executive Assistant → Operations
            if (name.includes('sadia beg')) return 'Operations'; // Head of Operations
            
            // Management (Executive → Management)
            if (name.includes('avnit singh')) return 'Management'; // Chief Executive Officer
            if (name.includes('sam eshrati')) return 'Management'; // Chief Operating Officer
            if (name.includes('benjamin notlev')) return 'Management'; // Chief Commercial Officer
            
            // Other role-based mappings
            if (role.includes('hr') || role.includes('human')) return 'HR';
            if (role.includes('partnership') || role.includes('partner')) return 'Partnerships';
            if (role.includes('investor')) return 'Finance';
            if (role.includes('project')) return 'Project Management';
            
            return 'General';
        };

        const peopleByDept = allPeople.reduce((acc, person) => {
            const deptName = getDepartment(person);
            if (!acc[deptName]) acc[deptName] = [];
            acc[deptName].push({ name: person.name, email: person.email, role: person.role, type: 'employee' });
            return acc;
        }, {});
        
        // DELETE ALL EXISTING DEPARTMENTS FIRST
        const existingDepts = await Department.list();
        for (const dept of existingDepts) {
            await Department.delete(dept.id);
        }

        // CREATE NEW DEPARTMENTS WITH CORRECT ASSIGNMENTS
        const colors = ['#8B5CF6', '#EC4899', '#10B981', '#3B82F6', '#F59E0B', '#6366F1', '#D946EF'];
        let colorIndex = 0;

        for (const [deptName, members] of Object.entries(peopleByDept)) {
            await Department.create({
                name: deptName,
                color: colors[colorIndex % colors.length],
                team_members: members,
                description: `${deptName} department`
            });
            colorIndex++;
        }

        setStatus('success');
        setTimeout(() => {
          navigate(createPageUrl("Departments"));
        }, 2000);

      } catch (error) {
        console.error("Import failed:", error);
        setStatus('error');
      }
    };

    extractAndImportData();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="glass-card rounded-2xl p-8 text-center max-w-md">
        {status === 'processing' && (
          <>
            <div className="animate-spin w-8 h-8 border-2 border-white/30 border-t-white rounded-full mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">Re-Importing Team Data</h2>
            <p className="text-white/80">Clearing old departments and creating correct assignments...</p>
          </>
        )}
        
        {status === 'success' && (
          <>
            <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold">✓</span>
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Import Complete!</h2>
            <p className="text-white/80">All departments have been recreated with correct assignments. Redirecting...</p>
          </>
        )}
        
        {status === 'error' && (
          <>
            <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold">✗</span>
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Import Failed</h2>
            <p className="text-white/80">Please try again or check the console for errors.</p>
          </>
        )}
      </div>
    </div>
  );
}