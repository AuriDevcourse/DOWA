// TechBBQ organizational data
export const mockDepartments = [
  {
    id: "1",
    name: "Management",
    color: "#1E40AF",
    team_members: [
      { 
        name: "Avnit Singh", 
        role: "Chief Executive Officer", 
        type: "Employee", 
        email: "asg@techbbq.org", 
        profilePicture: "/images/profiles/Avnit.jpg",
        linkedin: "https://linkedin.com/in/avnitsingh",
        responsibilities: [
          "Strategic leadership and vision setting",
          "Board relations and investor communications",
          "Company culture and organizational development",
          "Key partnership negotiations"
        ],
        tools: ["Slack", "Microsoft Office", "Zoom", "Strategic Planning Tools"],
        specialSkills: ["Strategic Leadership", "Public Speaking", "Investor Relations", "Team Building"],
        languages: ["English", "Danish", "Hindi"]
      },
      { 
        name: "Benjamin Notlev", 
        role: "Chief Commercial Officer", 
        type: "Employee", 
        email: "bno@techbbq.org", 
        profilePicture: "/images/profiles/Benjamin.jpg",
        linkedin: "https://linkedin.com/in/benjaminnotlev",
        responsibilities: [
          "Commercial strategy and revenue growth",
          "Investment oversight and financial planning",
          "Business development and partnerships",
          "Market expansion strategies"
        ],
        tools: ["Salesforce", "Financial Modeling Tools", "CRM Systems", "Analytics Platforms"],
        specialSkills: ["Commercial Strategy", "Financial Analysis", "Business Development", "Negotiation"],
        languages: ["English", "Danish", "German"]
      },
      { 
        name: "Sadia Beg", 
        role: "Chief Operating Officer", 
        type: "Employee", 
        email: "sbe@techbbq.org", 
        profilePicture: "/images/profiles/Sadia.jpg",
        linkedin: "https://linkedin.com/in/sadiabeg",
        responsibilities: [
          "Operations management and optimization",
          "Process improvement and efficiency",
          "Cross-departmental coordination",
          "Operational strategy execution"
        ],
        tools: ["Project Management Tools", "Operations Analytics", "Process Mapping", "Team Coordination"],
        specialSkills: ["Operations Management", "Process Optimization", "Team Leadership", "Quality Assurance"],
        languages: ["English", "Danish", "Urdu"]
      },
      { 
        name: "Thomas Ebrup", 
        role: "Chief Experience Officer", 
        type: "Employee", 
        email: "teb@techbbq.org", 
        profilePicture: "/images/profiles/Thomas.jpg",
        linkedin: "https://linkedin.com/in/thomasebrup",
        responsibilities: [
          "Customer and attendee experience strategy",
          "Event experience design and optimization",
          "User journey mapping and improvement",
          "Experience innovation and research"
        ],
        tools: ["Experience Design Tools", "Analytics Platforms", "Survey Tools", "Design Software"],
        specialSkills: ["User Experience Design", "Customer Journey Mapping", "Data Analysis", "Innovation Management"],
        languages: ["English", "Danish", "Swedish"]
      },
      { 
        name: "Sandra Nielsen", 
        role: "Executive Assistant to CEO", 
        type: "Employee", 
        email: "sni@techbbq.org", 
        profilePicture: "/images/profiles/Sandra.jpg",
        responsibilities: [
          "Executive calendar and meeting coordination",
          "Board meeting preparation and support",
          "Executive communication management",
          "Strategic project coordination"
        ],
        tools: ["Calendar Management", "Microsoft Office", "Communication Tools", "Project Coordination"],
        specialSkills: ["Executive Support", "Meeting Coordination", "Communication Management", "Administrative Excellence"],
        languages: ["English", "Danish"]
      },
      { 
        name: "Carol Hansen", 
        role: "Executive Assistant to CXO", 
        type: "Employee", 
        email: "cha@techbbq.org", 
        profilePicture: "/images/profiles/Carol.jpg",
        responsibilities: [
          "Experience team coordination",
          "CXO calendar and meeting management",
          "Experience project support",
          "Cross-team communication facilitation"
        ],
        tools: ["Project Management", "Communication Tools", "Experience Analytics", "Coordination Platforms"],
        specialSkills: ["Project Coordination", "Experience Analytics", "Team Communication", "Process Management"],
        languages: ["English", "Danish", "Norwegian"]
      }
    ],
    tools_used: [
      { name: "Slack", paid: true },
      { name: "Microsoft Office", paid: true },
      { name: "Zoom", paid: true },
      { name: "Notion", paid: true },
      { name: "Google Drive", paid: false }
    ],
    kpis: [
      { name: "Strategic Initiatives Completed", current: 8, target: 12, unit: "initiatives" },
      { name: "Board Meeting Attendance", current: 95, target: 100, unit: "%" },
      { name: "Employee Satisfaction Score", current: 4.2, target: 4.5, unit: "/5" }
    ],
    created_date: "2024-01-01T10:00:00Z"
  },
  {
    id: "2",
    name: "Marketing",
    color: "#EF4444",
    team_members: [
      { 
        name: "Maria Krupa", 
        role: "Growth & Data Analytics Lead", 
        type: "Employee", 
        email: "mak@techbbq.org",
        profilePicture: "/images/profiles/Maria.jpg",
        linkedin: "https://linkedin.com/in/mariakrupa",
        responsibilities: [
          "Growth strategy development and execution",
          "Data analytics and performance tracking",
          "Marketing campaign optimization",
          "User acquisition and retention strategies"
        ],
        tools: ["Google Analytics", "HubSpot", "Tableau", "SQL", "Python"],
        specialSkills: ["Data Analytics", "Growth Marketing", "SQL & Python", "Campaign Optimization", "Performance Tracking"],
        languages: ["English", "Polish", "Danish"],
        reportsTo: "Sam Eshrati (COO)",
      },
      { 
        name: "Auri Baciauskas", 
        role: "Senior Digital Designer", 
        type: "Employee", 
        email: "aba@techbbq.org", 
        profilePicture: "/images/profiles/Auri.jpg",
        specialSkills: ["UI/UX Design", "Brand Design", "Adobe Creative Suite", "Web Design", "Visual Identity"],
        languages: ["English", "Lithuanian", "Danish"]
      },
      { 
        name: "Roxy Dat", 
        role: "Community Partnership Manager", 
        type: "Employee", 
        email: "rad@techbbq.org",
        profilePicture: "/images/profiles/Roxy.jpg",
        responsibilities: [
          "Community partnerships development",
          "Ticket sales coordination",
          "Community collaborations management",
          "Ecosystem relationship building"
        ],
        tools: ["Community Platforms", "Ticket Management Systems", "Social Media Tools", "CRM"],
        specialSkills: ["Community Building", "Partnership Development", "Event Coordination", "Social Media Management"],
        languages: ["English", "Danish", "Vietnamese"],
        reportsTo: "Maria Krupa",
      }
    ],
    tools_used: [
      { name: "Google Analytics", paid: false },
      { name: "Figma", paid: true },
      { name: "Adobe Creative Suite", paid: true },
      { name: "HubSpot", paid: true },
      { name: "Canva", paid: false }
    ],
    kpis: [
      { name: "Website Traffic Growth", current: 75000, target: 100000, unit: "monthly visitors" },
      { name: "Lead Generation", current: 450, target: 600, unit: "leads/month" },
      { name: "Social Media Engagement", current: 3.8, target: 5.0, unit: "% rate" },
      { name: "Brand Awareness Score", current: 68, target: 80, unit: "%" }
    ],
    created_date: "2024-01-15T10:00:00Z"
  },
  {
    id: "3",
    name: "Partnerships",
    color: "#10B981",
    description: "Building meaningful collaborations beyond simple sales transactions. We nurture ecosystem relationships to stay current with Nordic, Baltic and European trends while understanding stakeholder needs to shape TechBBQ's value proposition.",
    team_members: [
      { 
        name: "Mikkel Schiott", 
        role: "Head of Partnerships", 
        type: "Employee", 
        email: "mik@techbbq.org", 
        profilePicture: "/images/profiles/Mikkel.jpg",
        linkedin: "https://linkedin.com/in/mikkelschiott",
        responsibilities: [
          "All partnerships strategy and execution",
          "General product and package creation",
          "Partnership data collection and analysis",
          "Team success and work culture development",
          "Business development and pricing strategy"
        ],
        tools: ["Airtable", "Salesforce", "HubSpot", "LinkedIn Sales Navigator", "Partnership Templates"],
        reportsTo: "Benjamin Notlev (CCO)",
      },
      { 
        name: "Tansu Kjerimi", 
        role: "Global Partnership Manager", 
        type: "Employee", 
        email: "tkj@techbbq.org", 
        profilePicture: "/images/profiles/Tansu.jpg",
        linkedin: "https://linkedin.com/in/tansukjerimi",
        responsibilities: [
          "International partnerships and corporate relations",
          "Delegations and guided tours management",
          "Satellite events coordination",
          "Partner Dinner organization",
          "External events strategy"
        ],
        tools: ["Airtable", "CRM Systems", "Event Management Software", "International Communication Tools"],
        reportsTo: "Mikkel Schiott",
      },
      { 
        name: "Amalie Berre Eriksen", 
        role: "Partnership Success Manager", 
        type: "Employee", 
        email: "ame@techbbq.org", 
        profilePicture: "/images/profiles/Amalie.jpg",
        linkedin: "https://linkedin.com/in/amalieeriksen",
        responsibilities: [
          "Partnership success and performance tracking",
          "Pre-event partner communication",
          "Partner feedback surveys and reports",
          "Partner platform management",
          "Process automation"
        ],
        tools: ["Airtable", "Analytics Tools", "Survey Platforms", "Communication Software", "Automation Tools"],
        reportsTo: "Mikkel Schiott",
      }
    ],
    tools_used: [
      { name: "Airtable", paid: true },
      { name: "Salesforce", paid: true },
      { name: "HubSpot", paid: true },
      { name: "LinkedIn Sales Navigator", paid: true },
      { name: "Google Sheets", paid: false },
      { name: "Zoom", paid: true }
    ],
    kpis: [
      { name: "New Partnerships Signed", current: 15, target: 25, unit: "partnerships" },
      { name: "Partnership Revenue", current: 850000, target: 1200000, unit: "DKK" },
      { name: "Partner Satisfaction Score", current: 4.1, target: 4.5, unit: "/5" },
      { name: "Partnership Renewal Rate", current: 82, target: 90, unit: "%" }
    ],
    created_date: "2024-01-20T10:00:00Z"
  },
  {
    id: "4",
    name: "Events",
    color: "#8B5CF6",
    team_members: [
      { name: "Joanna Opoka", role: "Senior Project Manager", type: "Employee", email: "jop@techbbq.org", profilePicture: "/images/profiles/Joannaa.png" },
      { name: "Mette Baastrup", role: "Event Manager", type: "Employee", email: "meb@techbbq.org", profilePicture: "/images/profiles/Mette.webp" }
    ],
    tools_used: ["Event Management Software", "Project Management Tools", "Eventbrite", "Logistics Platforms"],
    created_date: "2024-02-01T10:00:00Z"
  },
  {
    id: "5",
    name: "PR",
    color: "#F59E0B",
    team_members: [
      { name: "Keyvan T. Bamdej", role: "Head of PR & Communications", type: "Employee", email: "kba@techbbq.org", profilePicture: "/images/profiles/Keyvan.jpg" },
      { name: "Mikael Hansen", role: "PR & Communications Manager", type: "Employee", email: "mkh@techbbq.org", profilePicture: "/images/profiles/Mikael Hansen.jpg" }
    ],
    tools_used: ["Media Management Tools", "Press Release Platforms", "Social Media", "Communication Software"],
    created_date: "2024-02-05T10:00:00Z"
  },
  {
    id: "6",
    name: "Program",
    color: "#EC4899",
    team_members: [
      { name: "Pedro Granacha", role: "Program Manager", type: "Employee", email: "pmg@techbbq.org", profilePicture: "/images/profiles/Pedro.png" },
      { name: "Inigo Casillas", role: "Program Coordinator", type: "Employee", email: "ica@techbbq.org", profilePicture: "/images/profiles/Inigo.jpg" }
    ],
    tools_used: ["Program Management Software", "Scheduling Tools", "Content Management Systems"],
    created_date: "2024-02-10T10:00:00Z"
  },
  {
    id: "7",
    name: "Finance",
    color: "#059669",
    team_members: [
      { 
        name: "Stephan Evon", 
        role: "Head of Finance", 
        type: "Employee", 
        email: "sev@techbbq.org", 
        profilePicture: "/images/profiles/Stephan.jpg",
        linkedin: "https://linkedin.com/in/stephanevon",
        responsibilities: [
          "Financial planning and analysis",
          "Budget management and forecasting",
          "Financial reporting and compliance",
          "Investment strategy and risk management"
        ],
        tools: ["Excel", "QuickBooks", "SAP", "Financial Modeling Software"],
        reportsTo: "Avnit Singh (CEO)",
      },
      { name: "Allan N. Hadjimihalovic", role: "Project Controller", type: "Employee", email: "alh@techbbq.org", profilePicture: "/images/profiles/Allan.jpg" }
    ],
    tools_used: ["Financial Software", "Excel", "Accounting Systems", "Investment Platforms"],
    created_date: "2024-02-15T10:00:00Z"
  },
  {
    id: "8",
    name: "Operations",
    color: "#7C3AED",
    team_members: [
      { name: "Malou Bonding Wichmann", role: "Executive Personal Assistant", type: "Employee", email: "mbw@techbbq.org", profilePicture: "/images/profiles/Malou.jpg" },
      { name: "Shabana Naseri", role: "Executive Personal Assistant", type: "Employee", email: "sna@techbbq.org", profilePicture: "/images/profiles/Shabana.jpg" }
    ],
    tools_used: ["Operations Management Systems", "Microsoft Office", "Scheduling Software", "Administrative Tools"],
    created_date: "2024-02-20T10:00:00Z"
  },
  {
    id: "9",
    name: "Projects",
    color: "#DC2626",
    team_members: [
      { name: "Jan Thordsen", role: "Project Manager", type: "Employee", email: "jan@techbbq.org", profilePicture: "/images/profiles/Jan.png" },
      { name: "Charles Kinga", role: "Project Leader", type: "Employee", email: "chk@techbbq.org", profilePicture: "/images/profiles/Charles.jpg"  }
    ],
    tools_used: ["Project Management Software", "Jira", "Trello", "Gantt Charts", "Agile Tools"],
    created_date: "2024-02-25T10:00:00Z"
  },
  {
    id: "10",
    name: "Investor Relations",
    color: "#0891B2",
    team_members: [
      { 
        name: "Rares Bagyio", 
        role: "Head of Investor Relations", 
        type: "Employee", 
        email: "rab@techbbq.org", 
        profilePicture: "/images/profiles/Rares.jpg",
        linkedin: "https://linkedin.com/in/raresbagyio",
        responsibilities: [
          "Investor relationship management",
          "Investment strategy and planning",
          "Financial reporting to investors",
          "Fundraising activities and coordination",
          "Due diligence support"
        ],
        tools: ["Investor CRM", "Financial Modeling Software", "Pitch Deck Tools", "Data Rooms"],
        reportsTo: "Benjamin Notlev (CCO)",
      }
    ],
    tools_used: [
      { name: "Investor CRM", paid: true },
      { name: "Financial Modeling Software", paid: true },
      { name: "Pitch Deck Tools", paid: true },
      { name: "Data Room Platforms", paid: true },
      { name: "Excel", paid: true }
    ],
    kpis: [
      { name: "Investor Satisfaction Score", current: 4.3, target: 4.5, unit: "/5" },
      { name: "Fundraising Target Achievement", current: 75, target: 100, unit: "%" },
      { name: "Investor Meeting Frequency", current: 12, target: 15, unit: "meetings/quarter" },
      { name: "Investment Pipeline Value", current: 5000000, target: 7500000, unit: "DKK" }
    ],
    created_date: "2024-03-01T10:00:00Z"
  },
  {
    id: "11",
    name: "HR",
    color: "#6366F1",
    team_members: [
      { name: "Emma Nielsen", role: "Head of Human Resources", type: "Employee", email: "eni@techbbq.org" },
      { name: "Lars Andersen", role: "HR Business Partner", type: "Employee", email: "lan@techbbq.org" },
      { name: "Sofia Larsson", role: "Talent Acquisition Specialist", type: "Employee", email: "sla@techbbq.org" }
    ],
    tools_used: ["HR Management Systems", "BambooHR", "LinkedIn Recruiter", "Performance Management Tools"],
    created_date: "2024-03-05T10:00:00Z"
  }
];

export const mockTimelineEvents = [
  {
    id: "1",
    title: "TechBBQ 2024 Main Event",
    description: "Annual TechBBQ conference and networking event",
    department_name: "Events",
    start_date: "2024-09-10",
    end_date: "2024-09-12",
    status: "completed",
    type: "event",
    priority: "high",
    tags: ["conference", "networking", "annual"],
    involved_departments: ["Marketing", "PR", "Operations"],
    created_date: "2024-01-15T10:00:00Z"
  },
  {
    id: "2", 
    title: "Partnership Expansion Q4",
    description: "Global partnership outreach and relationship building",
    department_name: "Partnerships",
    start_date: "2024-10-01",
    end_date: "2024-12-31",
    status: "active",
    type: "project",
    priority: "high",
    tags: ["partnerships", "global", "expansion"],
    involved_departments: ["Marketing", "Management"],
    created_date: "2024-09-01T10:00:00Z"
  },
  {
    id: "3",
    title: "Digital Marketing Campaign",
    description: "Q4 digital marketing and growth analytics initiative",
    department_name: "Marketing",
    start_date: "2024-10-15", 
    end_date: "2024-12-15",
    status: "active",
    type: "campaign",
    priority: "medium",
    tags: ["digital", "analytics", "growth"],
    involved_departments: ["PR", "Partnerships"],
    created_date: "2024-09-15T10:00:00Z"
  },
  {
    id: "9",
    title: "Brand Redesign Project",
    description: "Complete brand identity and website redesign",
    department_name: "Marketing",
    start_date: "2024-11-01",
    end_date: "2025-02-28",
    status: "planning",
    type: "project",
    priority: "high",
    tags: ["branding", "design", "website"],
    involved_departments: ["PR"],
    created_date: "2024-10-20T10:00:00Z"
  },
  {
    id: "10",
    title: "Social Media Strategy",
    description: "Develop comprehensive social media strategy for 2025",
    department_name: "Marketing",
    start_date: "2024-12-01",
    end_date: "2024-12-31",
    status: "planning",
    type: "strategy",
    priority: "medium",
    tags: ["social-media", "strategy", "2025"],
    created_date: "2024-11-15T10:00:00Z"
  },
  {
    id: "4",
    title: "PR Media Outreach",
    description: "Strategic PR campaign for brand visibility",
    department_name: "PR",
    start_date: "2024-11-01",
    end_date: "2024-12-31", 
    status: "planning",
    type: "campaign",
    priority: "medium",
    tags: ["PR", "media", "outreach"],
    created_date: "2024-10-01T10:00:00Z"
  },
  {
    id: "5",
    title: "2025 Program Planning",
    description: "Strategic planning for 2025 programs and initiatives",
    department_name: "Program",
    start_date: "2024-11-15",
    end_date: "2025-01-31",
    status: "planning",
    type: "planning",
    priority: "high",
    tags: ["planning", "2025", "strategy"],
    created_date: "2024-10-15T10:00:00Z"
  },
  {
    id: "6",
    title: "Financial Year-End Review",
    description: "Annual financial review and budget planning",
    department_name: "Finance",
    start_date: "2024-12-01",
    end_date: "2024-12-31",
    status: "planning",
    type: "review",
    priority: "high",
    tags: ["finance", "year-end", "budget"],
    created_date: "2024-11-01T10:00:00Z"
  },
  {
    id: "7",
    title: "Operations Optimization",
    description: "Streamlining operational processes and systems",
    department_name: "Operations",
    start_date: "2024-10-01",
    end_date: "2024-11-30",
    status: "active",
    type: "project",
    priority: "medium",
    tags: ["operations", "optimization", "processes"],
    created_date: "2024-09-20T10:00:00Z"
  },
  {
    id: "8",
    title: "Project Portfolio Review",
    description: "Comprehensive review of all ongoing projects",
    department_name: "Projects",
    start_date: "2024-11-01",
    end_date: "2024-11-30",
    status: "planning",
    type: "review",
    priority: "medium",
    tags: ["projects", "portfolio", "review"],
    created_date: "2024-10-15T10:00:00Z"
  },
  {
    id: "14",
    title: "TechBBQ 2025 Marketing Launch",
    description: "Launch comprehensive marketing campaign for TechBBQ 2025 event",
    department_name: "Marketing",
    start_date: "2024-12-15",
    end_date: "2025-09-15",
    status: "planning",
    type: "campaign",
    priority: "high",
    tags: ["techbbq", "event-marketing", "launch"],
    involved_departments: ["PR", "Events", "Partnerships"],
    lead_person: "Maria Krupa",
    created_date: "2024-11-20T10:00:00Z"
  },
  {
    id: "15",
    title: "Content Marketing Strategy Q1",
    description: "Develop and execute content marketing strategy for Q1 2025",
    department_name: "Marketing",
    start_date: "2025-01-01",
    end_date: "2025-03-31",
    status: "planning",
    type: "strategy",
    priority: "medium",
    tags: ["content", "strategy", "Q1"],
    lead_person: "Auri Baciauskas",
    created_date: "2024-12-01T10:00:00Z"
  },
  {
    id: "16",
    title: "Startup Ecosystem Report",
    description: "Research and publish comprehensive Nordic startup ecosystem report",
    department_name: "Marketing",
    start_date: "2024-11-15",
    end_date: "2025-01-31",
    status: "active",
    type: "project",
    priority: "high",
    tags: ["research", "report", "startups", "nordic"],
    involved_departments: ["Partnerships"],
    lead_person: "Maria Krupa",
    created_date: "2024-11-01T10:00:00Z"
  },
  {
    id: "17",
    title: "Email Marketing Automation",
    description: "Implement advanced email marketing automation workflows",
    department_name: "Marketing",
    start_date: "2024-10-01",
    end_date: "2024-12-31",
    status: "active",
    type: "project",
    priority: "medium",
    tags: ["email", "automation", "workflows"],
    lead_person: "Auri Baciauskas",
    created_date: "2024-09-25T10:00:00Z"
  },
  {
    id: "18",
    title: "Influencer Partnership Program",
    description: "Launch influencer partnership program for tech industry leaders",
    department_name: "Marketing",
    start_date: "2025-02-01",
    end_date: "2025-08-31",
    status: "planning",
    type: "program",
    priority: "medium",
    tags: ["influencer", "partnerships", "tech-leaders"],
    involved_departments: ["Partnerships", "PR"],
    lead_person: "Maria Krupa",
    created_date: "2024-12-10T10:00:00Z"
  },
  {
    id: "19",
    title: "Website Performance Optimization",
    description: "Comprehensive website performance and SEO optimization project",
    department_name: "Marketing",
    start_date: "2024-11-01",
    end_date: "2024-12-15",
    status: "active",
    type: "project",
    priority: "high",
    tags: ["website", "SEO", "performance"],
    lead_person: "Auri Baciauskas",
    created_date: "2024-10-15T10:00:00Z"
  },
  {
    id: "20",
    title: "Video Content Series",
    description: "Produce monthly video content series featuring startup founders",
    department_name: "Marketing",
    start_date: "2025-01-15",
    end_date: "2025-12-31",
    status: "planning",
    type: "content",
    priority: "medium",
    tags: ["video", "content", "founders", "series"],
    involved_departments: ["Events"],
    lead_person: "Auri Baciauskas",
    created_date: "2024-12-05T10:00:00Z"
  },
  {
    id: "21",
    title: "Marketing Analytics Dashboard",
    description: "Build comprehensive marketing analytics and reporting dashboard",
    department_name: "Marketing",
    start_date: "2024-12-01",
    end_date: "2025-01-15",
    status: "planning",
    type: "project",
    priority: "medium",
    tags: ["analytics", "dashboard", "reporting"],
    lead_person: "Maria Krupa",
    created_date: "2024-11-25T10:00:00Z"
  },
  {
    id: "22",
    title: "Community Building Initiative",
    description: "Launch community platform for TechBBQ alumni and participants",
    department_name: "Marketing",
    start_date: "2025-03-01",
    end_date: "2025-06-30",
    status: "planning",
    type: "initiative",
    priority: "high",
    tags: ["community", "platform", "alumni"],
    involved_departments: ["Events", "Operations"],
    lead_person: "Maria Krupa",
    created_date: "2024-12-15T10:00:00Z"
  },
  {
    id: "23",
    title: "Pre-Register",
    description: "Getting 50% off for the upcoming tickets once the ticket sales are released",
    department_name: "Marketing",
    start_date: "2025-09-01",
    end_date: "2025-11-30",
    status: "planning",
    type: "campaign",
    priority: "high",
    tags: ["pre-register", "tickets", "discount", "50-percent-off"],
    involved_departments: ["Events"],
    lead_person: "Maria Krupa",
    created_date: "2024-12-26T10:00:00Z"
  },
  {
    id: "24",
    title: "Ticket Sales Open",
    description: "Tiered ticket sales campaign: 40% off (Jan 5-18), then 30% off (Jan 18 - Mar 18)",
    department_name: "Marketing",
    start_date: "2025-01-05",
    end_date: "2025-03-18",
    status: "planning",
    type: "campaign",
    priority: "high",
    tags: ["ticket-sales", "tiered-pricing", "40-percent-off", "30-percent-off", "early-bird"],
    involved_departments: ["Events", "Finance"],
    lead_person: "Maria Krupa",
    created_date: "2024-12-26T10:00:00Z"
  },
  {
    id: "25",
    title: "Pre-Register 2026",
    description: "Getting 50% off for the upcoming TechBBQ 2026 tickets once the ticket sales are released",
    department_name: "Marketing",
    start_date: "2026-09-01",
    end_date: "2026-11-30",
    status: "planning",
    type: "campaign",
    priority: "high",
    tags: ["pre-register", "tickets", "discount", "50-percent-off", "2026"],
    involved_departments: ["Events"],
    lead_person: "Maria Krupa",
    created_date: "2025-01-01T10:00:00Z"
  },
  {
    id: "26",
    title: "Ticket Sales Open 2026",
    description: "Tiered ticket sales campaign for 2026: 40% off (Jan 5-18), then 30% off (Jan 18 - Mar 18)",
    department_name: "Marketing",
    start_date: "2026-01-05",
    end_date: "2026-03-18",
    status: "planning",
    type: "campaign",
    priority: "high",
    tags: ["ticket-sales", "tiered-pricing", "40-percent-off", "30-percent-off", "early-bird", "2026"],
    involved_departments: ["Events", "Finance"],
    lead_person: "Maria Krupa",
    created_date: "2025-01-01T10:00:00Z"
  },
  {
    id: "11",
    title: "Strategic Planning 2025",
    description: "Annual strategic planning and goal setting for 2025",
    department_name: "Management",
    start_date: "2024-11-01",
    end_date: "2024-12-15",
    status: "active",
    type: "planning",
    priority: "high",
    tags: ["strategy", "planning", "2025"],
    involved_departments: ["Finance", "Operations"],
    created_date: "2024-10-20T10:00:00Z"
  },
  {
    id: "12",
    title: "Board Meeting Preparation",
    description: "Quarterly board meeting preparation and presentation",
    department_name: "Management",
    start_date: "2024-12-01",
    end_date: "2024-12-05",
    status: "planning",
    type: "meeting",
    priority: "high",
    tags: ["board", "meeting", "quarterly"],
    created_date: "2024-11-15T10:00:00Z"
  },
  {
    id: "13",
    title: "Company Culture Initiative",
    description: "Implementing new company culture and engagement programs",
    department_name: "Management",
    start_date: "2024-10-15",
    end_date: "2025-03-31",
    status: "active",
    type: "initiative",
    priority: "medium",
    tags: ["culture", "engagement", "HR"],
    involved_departments: ["HR", "Operations"],
    created_date: "2024-10-01T10:00:00Z"
  }
];

export const mockUser = {
  id: "user1",
  name: "Demo User",
  email: "demo@example.com",
  role: "Admin"
};
