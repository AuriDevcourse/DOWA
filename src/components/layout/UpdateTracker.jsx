import React, { useState } from 'react';
import { ChevronUp, ChevronDown, Clock } from 'lucide-react';

const updates = [
  { version: "3.8", description: "Added localStorage persistence: Changes now survive page refreshes and persist across sessions", timestamp: "10:18 PM" },
  { version: "3.7", description: "Fixed data persistence: Added proper state updates and debugging to ensure changes save correctly", timestamp: "10:15 PM" },
  { version: "3.6", description: "Redesigned editing: Individual edit buttons per section open dedicated popup dialogs for intuitive editing (Description, KPIs, Tools, Team Members)", timestamp: "10:12 PM" },
  { version: "3.5", description: "Made all sections editable: KPIs (names, values, targets), Tools (names, paid/free), persistent saves", timestamp: "10:01 PM" },
  { version: "3.4", description: "Fixed save button to exit edit mode after saving changes", timestamp: "9:59 PM" },
  { version: "3.3", description: "Made Marketing department sections fully editable: description, team member names, roles, emails", timestamp: "9:55 PM" },
  { version: "3.2", description: "Added password-protected edit mode for Marketing department (password: Marketing)", timestamp: "9:51 PM" },
  { version: "3.1", description: "Fixed Special Skills and Languages display in team member detail dialogs", timestamp: "9:47 PM" },
  { version: "3.0", description: "Added Special Skills and Languages to team member profiles", timestamp: "9:44 PM" },
  { version: "2.9", description: "Updated C-level: Avnit (CEO), Benjamin (CCO), Sadia (COO), Thomas (CXO) + Executive Assistants", timestamp: "9:38 PM" },
  { version: "2.8", description: "Improved Org Chart hierarchy: C-level → Department Heads → Teams", timestamp: "9:32 PM" },
  { version: "2.7", description: "Added Org Chart page with leadership hierarchy and department overview", timestamp: "9:28 PM" },
  { version: "2.6", description: "Added tag-based search filtering (People, Departments, Tools, Emails)", timestamp: "9:16 PM" },
  { version: "2.5", description: "Changed application tab name to 'DOWA'", timestamp: "9:14 PM" },
  { version: "2.4", description: "Enabled search text highlighting with yellow markers", timestamp: "9:08 PM" },
  { version: "2.3", description: "Fixed all missing icon imports (Crown, Newspaper, Code, etc.)", timestamp: "9:05 PM" },
  { version: "2.2", description: "Added Framer Motion animations and error boundaries", timestamp: "8:58 PM" },
  { version: "2.1", description: "Fixed component crashes and data loading errors", timestamp: "8:54 PM" },
  { version: "2.0", description: "Created new Investor Relations department for Rares", timestamp: "8:43 PM" },
  { version: "1.9", description: "Moved Roxy from Partnerships to Marketing department", timestamp: "8:43 PM" },
  { version: "1.8", description: "Added HR department, renamed Projects", timestamp: "11:14 AM" },
  { version: "1.7", description: "Cleaned up department cards, removed tools preview", timestamp: "11:13 AM" },
  { version: "1.6", description: "Updated team member layouts to 3-column grid", timestamp: "11:02 AM" },
  { version: "1.5", description: "Added profile pictures for 20+ team members", timestamp: "10:45 AM" },
  { version: "1.4", description: "Improved team member card layout", timestamp: "10:34 AM" },
  { version: "1.3", description: "Updated department header alignment", timestamp: "10:53 AM" },
  { version: "1.2", description: "Replaced letter icons with colored dots", timestamp: "10:35 AM" },
  { version: "1.1", description: "Implemented glass-morphism design system", timestamp: "10:14 AM" },
  { version: "1.0", description: "Initial TechBBQ organizational structure", timestamp: "Earlier" }
];

export default function UpdateTracker() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 z-40">
      <div className="glass-card rounded-2xl p-3 max-w-sm">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-medium text-glass">Updates</span>
            <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full">
              v{updates[0].version}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 text-glass-muted hover:text-glass transition-colors"
              title={isExpanded ? "Collapse" : "Expand"}
            >
              {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setIsVisible(false)}
              className="p-1 text-glass-muted hover:text-glass transition-colors text-xs"
              title="Hide"
            >
              ×
            </button>
          </div>
        </div>

        {/* Latest Update (Always Visible) */}
        <div className="text-xs text-glass-muted mb-2">
          <div className="font-medium text-glass">{updates[0].description}</div>
          <div className="text-glass-subtle">{updates[0].timestamp}</div>
        </div>

        {/* Expanded Updates List */}
        {isExpanded && (
          <div className="border-t border-white/10 pt-2 max-h-60 overflow-y-auto">
            <div className="space-y-2">
              {updates.slice(1).map((update, index) => (
                <div key={index} className="text-xs">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs bg-white/10 text-glass-muted px-1.5 py-0.5 rounded">
                      v{update.version}
                    </span>
                    <span className="text-glass-subtle">{update.timestamp}</span>
                  </div>
                  <div className="text-glass-muted">{update.description}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Show More Indicator */}
        {!isExpanded && updates.length > 1 && (
          <div className="text-xs text-glass-subtle">
            +{updates.length - 1} more updates
          </div>
        )}
      </div>
    </div>
  );
}
