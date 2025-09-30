

import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
<<<<<<< Updated upstream
import { Calendar, Building2, Settings, Users, Gift } from "lucide-react";
=======
import { Calendar, Building2, Settings, Users } from "lucide-react";
import UpdateNotification from "@/components/UpdateNotification";
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes

const navigationItems = [
  { title: "Departments", url: createPageUrl("Departments"), icon: Building2 },
  { title: "Team", url: createPageUrl("Team"), icon: Users },
  { title: "Employee Benefits", url: createPageUrl("EmployeeBenefits"), icon: Gift },
  { title: "Settings", url: createPageUrl("Settings"), icon: Settings },
];

export default function Layout({ children }) {
  const location = useLocation();

  return (
    <div className="min-h-screen relative overflow-hidden">
      <style>{`
        :root {
          --glass-bg: rgba(255, 255, 255, 0.15);
          --glass-border: rgba(255, 255, 255, 0.3);
          --glass-shadow: rgba(0, 0, 0, 0.15);
        }
        
        .glass-morphism {
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(15px);
          -webkit-backdrop-filter: blur(15px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        }
        
        .glass-card {
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          border: 1px solid rgba(255, 255, 255, 0.35);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
        }
        
        .glass-intense {
          background: rgba(255, 255, 255, 0.25);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.4);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
        }
        
        .gradient-bg {
          background: linear-gradient(135deg, 
            #0f172a 0%, 
            #1e293b 25%, 
            #064e3b 50%, 
            #022c22 75%, 
            #14532d 100%);
          background-size: 400% 400%;
          animation: gradientShift 15s ease infinite;
        }
        
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        .glow-on-hover {
          transition: all 0.3s ease;
        }
        
        .glow-on-hover:hover {
          box-shadow: 0 0 15px rgba(139, 92, 246, 0.3);
          transform: translateY(-1px);
        }
        
        .text-glow {
          /* Removed text glow effect */
        }
      `}</style>

      <div className="gradient-bg fixed inset-0" />
      
      <nav className="glass-morphism fixed top-0 left-0 right-0 z-50 border-b border-white/30">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to={createPageUrl("Departments")} className="flex items-center gap-3">
              <div className="glass-card rounded-full p-2">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-white">DeptSync</h1>
            </Link>
            
            <div className="hidden md:flex items-center gap-2">
              {navigationItems.map((item) => (
                <Link
                  key={item.title}
                  to={item.url}
                  className={`glass-morphism glow-on-hover px-4 py-2 rounded-full flex items-center gap-2 text-sm font-medium transition-all duration-300 ${
                    location.pathname === item.url || (item.title === 'Departments' && (location.pathname === '/' || location.pathname === ''))
                      ? 'text-white bg-white/25'
                      : 'text-white/90 hover:text-white hover:bg-white/15'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.title}
                </Link>
              ))}
            </div>

            <div className="md:hidden glass-card rounded-lg p-2">
              {/* Mobile menu placeholder */}
            </div>
          </div>
        </div>
      </nav>

      <main className="relative z-10 pt-20">
        {children}
      </main>
      
      <UpdateNotification />
    </div>
  );
}

