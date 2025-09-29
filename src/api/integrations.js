// Mock integrations to replace Base44 SDK integrations

// Simulate API delay
const delay = (ms = 1000) => new Promise(resolve => setTimeout(resolve, ms));

// Mock file extraction function
export const ExtractDataFromUploadedFile = async (fileData) => {
  await delay(2000); // Simulate processing time
  
  // Mock extracted data - simulating CSV/Excel file with TechBBQ department data
  return {
    success: true,
    data: {
      departments: [
        {
          name: "Management",
          team_members: [
            { name: "Avnit Singh", role: "Chief Executive Officer", type: "Employee", email: "asg@techbbq.org" },
            { name: "Sam Eshrati", role: "Chief Operating Officer & Chief Engagement Officer", type: "Employee", email: "ses@techbbq.org" },
            { name: "Benjamin Notlev", role: "Chief Commercial Officer & Chief Investment Officer", type: "Employee", email: "bno@techbbq.org" }
          ],
          tools_used: ["Slack", "Microsoft Office", "Zoom", "Strategic Planning Tools"]
        },
        {
          name: "Marketing",
          team_members: [
            { name: "Maria Krupa", role: "Growth & Data Analytics Lead", type: "Employee", email: "mak@techbbq.org" },
            { name: "Auri Baciauskas", role: "Senior Digital Designer", type: "Employee", email: "aba@techbbq.org" },
            { name: "Roxy Dat", role: "Community Partnership Manager", type: "Employee", email: "rad@techbbq.org" }
          ],
          tools_used: ["Google Analytics", "Figma", "Adobe Creative Suite", "HubSpot", "Social Media Platforms"]
        },
        {
          name: "Partnerships",
          team_members: [
            { name: "Mikkel Schiott", role: "Head of Partnerships", type: "Employee", email: "mik@techbbq.org" },
            { name: "Tansu Kjerimi", role: "Global Partnership Manager", type: "Employee", email: "tkj@techbbq.org" },
            { name: "Amalie Berre Eriksen", role: "Partnership Success Manager", type: "Employee", email: "ame@techbbq.org" }
          ],
          tools_used: ["CRM Systems", "Salesforce", "LinkedIn", "Partnership Management Tools"]
        },
        {
          name: "Events",
          team_members: [
            { name: "Joanna Opoka", role: "Senior Project Manager", type: "Employee", email: "jop@techbbq.org" },
            { name: "Mette Baastrup", role: "Event Manager", type: "Employee", email: "meb@techbbq.org" }
          ],
          tools_used: ["Event Management Software", "Project Management Tools", "Eventbrite", "Logistics Platforms"]
        },
        {
          name: "Finance",
          team_members: [
            { name: "Stephan Evon", role: "Head of Finance", type: "Employee", email: "sev@techbbq.org" },
            { name: "Allan N. Hadjimihalovic", role: "Project Controller", type: "Employee", email: "alh@techbbq.org" }
          ],
          tools_used: ["Financial Software", "Excel", "Accounting Systems"]
        },
        {
          name: "Investor Relations",
          team_members: [
            { name: "Rares Bagyio", role: "Head of Investor Relations", type: "Employee", email: "rab@techbbq.org" }
          ],
          tools_used: ["Investor CRM", "Financial Modeling Software", "Pitch Deck Tools", "Data Room Platforms"]
        }
      ]
    }
  };
};

// Mock other integration functions (in case they're needed)
export const InvokeLLM = async (prompt) => {
  await delay(1500);
  return { success: true, response: "Mock LLM response for: " + prompt };
};

export const SendEmail = async (emailData) => {
  await delay(500);
  return { success: true, message: "Email sent successfully (mock)" };
};

export const UploadFile = async (file) => {
  await delay(1000);
  return { success: true, fileId: "mock-file-" + Date.now() };
};

export const GenerateImage = async (prompt) => {
  await delay(2000);
  return { success: true, imageUrl: "https://via.placeholder.com/400x300?text=Generated+Image" };
};

export const CreateFileSignedUrl = async (fileId) => {
  await delay(300);
  return { success: true, url: "https://example.com/mock-signed-url/" + fileId };
};

export const UploadPrivateFile = async (file) => {
  await delay(1000);
  return { success: true, fileId: "mock-private-file-" + Date.now() };
};

// Core object for compatibility
export const Core = {
  InvokeLLM,
  SendEmail,
  UploadFile,
  GenerateImage,
  ExtractDataFromUploadedFile,
  CreateFileSignedUrl,
  UploadPrivateFile
};






