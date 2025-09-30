import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Calendar, Building2, Users, Settings, Network, Gift } from 'lucide-react';

export default function Header() {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-header">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Branding */}
          <div className="flex items-center gap-3">
            <div className="glass-intense rounded-full p-3">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-white">DeptSync</h1>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-4">
            <Link
              to="/departments"
              className={`nav-link rounded-full px-4 py-2 text-sm font-medium flex items-center gap-2 ${
                isActive('/departments') ? 'active' : 'text-white/90 hover:text-white'
              }`}
            >
              <Building2 className="w-4 h-4" />
              Departments
            </Link>
            
            <Link
              to="/org-chart"
              className={`nav-link rounded-full px-4 py-2 text-sm font-medium flex items-center gap-2 ${
                isActive('/org-chart') ? 'active' : 'text-white/90 hover:text-white'
              }`}
            >
              <Network className="w-4 h-4" />
              Org Chart
            </Link>
            
            <Link
              to="/employee-benefits"
              className={`nav-link rounded-full px-4 py-2 text-sm font-medium flex items-center gap-2 ${
                isActive('/employee-benefits') ? 'active' : 'text-white/90 hover:text-white'
              }`}
            >
              <Gift className="w-4 h-4" />
              Employee Benefits
            </Link>
            
            <Link
              to="/settings"
              className={`nav-link rounded-full px-4 py-2 text-sm font-medium flex items-center gap-2 ${
                isActive('/settings') ? 'active' : 'text-white/90 hover:text-white'
              }`}
            >
              <Settings className="w-4 h-4" />
              Settings
            </Link>
          </nav>

          {/* Mobile menu placeholder */}
          <div className="md:hidden">
            {/* Mobile menu button would go here */}
          </div>
        </div>
      </div>
    </header>
  );
}
