import React, { useState, useEffect } from "react";
import { Department } from "@/api/entities";
import { ExtractDataFromUploadedFile } from "@/api/integrations";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, CheckCircle, AlertTriangle, Loader, ChevronRight } from "lucide-react";

const IMAGE_URLS = [
  "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68d3c16763e1ce866b62b231/f5cbcfd2c_image.png",
  "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68d3c16763e1ce866b62b231/e8d56c271_image.png",
  "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68d3c16763e1ce866b62b231/0e7376207_image.png"
];

const EXTRACTION_SCHEMA = {
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

const getDepartmentNameFromRole = (role) => {
  const lowerRole = role.toLowerCase();
  if (lowerRole.includes('ceo') || lowerRole.includes('chief')) return 'Executive';
  if (lowerRole.includes('marketing')) return 'Marketing';
  if (lowerRole.includes('hr') || lowerRole.includes('human resources')) return 'HR';
  if (lowerRole.includes('partnership')) return 'Partnerships';
  if (lowerRole.includes('project')) return 'Project Management';
  if (lowerRole.includes('investor relations')) return 'Investor Relations';
  if (lowerRole.includes('pr') || lowerRole.includes('communications')) return 'Communications';
  if (lowerRole.includes('operations')) return 'Operations';
  if (lowerRole.includes('designer')) return 'Design';
  if (lowerRole.includes('growth') || lowerRole.includes('analytics')) return 'Growth & Data';
  if (lowerRole.includes('event')) return 'Events';
  if (lowerRole.includes('program')) return 'Program Management';
  if (lowerRole.includes('controller')) return 'Finance';
  return 'General';
};

const COLORS = ['#8B5CF6', '#EC4899', '#10B981', '#3B82F6', '#F59E0B', '#6366F1', '#D946EF'];
let colorIndex = 0;
const getNextColor = () => {
  const color = COLORS[colorIndex];
  colorIndex = (colorIndex + 1) % COLORS.length;
  return color;
};

export default function Import() {
  const navigate = useNavigate();
  const [status, setStatus] = useState('idle');
  const [logs, setLogs] = useState([]);

  const addLog = (message, type = 'info') => {
    setLogs(prev => [...prev, { message, type, time: new Date() }]);
  };

  const runImport = async () => {
    setStatus('processing');
    addLog('Starting team data import process...');

    try {
      // 1. Fetch existing departments
      addLog('Fetching existing departments...');
      const existingDepts = await Department.list();
      const deptMap = new Map(existingDepts.map(d => [d.name, d]));
      addLog(`Found ${existingDepts.length} existing departments.`);

      // 2. Extract data from all images
      let allPeople = [];
      for (const url of IMAGE_URLS) {
        addLog(`Extracting data from image: ${url.split('/').pop()}`);
        const result = await ExtractDataFromUploadedFile({ file_url: url, json_schema: EXTRACTION_SCHEMA });
        if (result.status === 'success' && result.output.people) {
          allPeople = [...allPeople, ...result.output.people];
          addLog(`Successfully extracted ${result.output.people.length} people.`, 'success');
        } else {
          addLog(`Failed to extract data from an image. Details: ${result.details}`, 'error');
        }
      }
      addLog(`Total people extracted: ${allPeople.length}.`);

      if (allPeople.length === 0) {
        throw new Error("No data could be extracted from any images.");
      }

      // 3. Group people by department
      const peopleByDept = allPeople.reduce((acc, person) => {
        const deptName = getDepartmentNameFromRole(person.role);
        if (!acc[deptName]) acc[deptName] = [];
        const newMember = { name: person.name, email: person.email, role: person.role, type: 'employee' };
        acc[deptName].push(newMember);
        return acc;
      }, {});
      addLog('Categorized all extracted members into departments.');

      // 4. Update or create departments
      for (const deptName in peopleByDept) {
        const newMembers = peopleByDept[deptName];
        if (deptMap.has(deptName)) {
          // Update existing department
          const existingDept = deptMap.get(deptName);
          const existingEmails = new Set((existingDept.team_members || []).map(m => m.email));
          const membersToAdd = newMembers.filter(m => !existingEmails.has(m.email));
          
          if (membersToAdd.length > 0) {
            addLog(`Updating department "${deptName}" with ${membersToAdd.length} new members.`);
            const updatedMembers = [...(existingDept.team_members || []), ...membersToAdd];
            await Department.update(existingDept.id, { team_members: updatedMembers });
          } else {
            addLog(`Department "${deptName}" is already up-to-date.`, 'info');
          }
        } else {
          // Create new department
          addLog(`Creating new department: "${deptName}" with ${newMembers.length} members.`, 'success');
          await Department.create({
            name: deptName,
            color: getNextColor(),
            team_members: newMembers,
          });
        }
      }

      addLog('Import process completed successfully!', 'success');
      setStatus('success');

    } catch (error) {
      console.error("Import failed:", error);
      addLog(`An error occurred: ${error.message}`, 'error');
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen px-6 py-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-3xl p-8"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="glass-intense rounded-full p-3">
              <UploadCloud className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Import Team Data</h1>
              <p className="text-white/70">Automated data extraction from provided images.</p>
            </div>
          </div>

          {status === 'idle' && (
            <div className="text-center">
              <p className="text-white/80 mb-6">Click the button below to start the import process. This will read the team data from the provided images and populate your departments.</p>
              <Button onClick={runImport} className="glass-intense text-white font-semibold glow-on-hover px-6 py-3">
                Start Import
              </Button>
            </div>
          )}

          <AnimatePresence>
            {status !== 'idle' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="space-y-3 mb-6 max-h-80 overflow-y-auto glass-morphism p-4 rounded-xl">
                  {logs.map((log, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex items-start gap-3 text-sm ${
                        log.type === 'error' ? 'text-red-400' : 'text-white/80'
                      }`}
                    >
                      <span className="text-white/50">{log.time.toLocaleTimeString()}</span>
                      {log.type === 'success' && <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />}
                      {log.type === 'error' && <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />}
                      <span>{log.message}</span>
                    </motion.div>
                  ))}
                </div>

                {status === 'processing' && (
                  <div className="flex items-center justify-center gap-3 text-white">
                    <Loader className="w-5 h-5 animate-spin" />
                    <span>Processing... Please wait.</span>
                  </div>
                )}
                
                {status === 'success' && (
                  <div className="text-center">
                    <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">Import Successful</h3>
                    <p className="text-white/70 mb-6">All data has been processed and your departments have been updated.</p>
                    <Button onClick={() => navigate(createPageUrl("Departments"))} className="glass-intense text-white font-semibold glow-on-hover">
                      Go to Departments <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                )}

                {status === 'error' && (
                  <div className="text-center">
                    <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">Import Failed</h3>
                    <p className="text-white/70 mb-6">An error occurred during the import process. Please check the logs above for details.</p>
                     <Button onClick={runImport} className="glass-intense text-white font-semibold glow-on-hover">
                        Retry Import
                      </Button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}