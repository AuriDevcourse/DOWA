import React from "react";
import { User, ExternalLink } from "lucide-react";

export default function PersonCard({ person, showRole = true, showDepartment = false, className = "" }) {
  if (!person) return null;

  // Parse person string if it's in format "Name (Role)" or just use as name
  const parsePerson = (personString) => {
    if (typeof personString === 'object') return personString;
    
    const match = personString.match(/^(.+?)\s*\((.+?)\)$/);
    if (match) {
      return {
        name: match[1].trim(),
        role: match[2].trim()
      };
    }
    return {
      name: personString,
      role: null
    };
  };

  const personData = typeof person === 'string' ? parsePerson(person) : person;

  return (
    <div className={`glass-morphism rounded-xl p-3 hover:opacity-90 transition-all duration-300 ${className}`}>
      <div className="flex items-center gap-3">
        {/* Profile Picture - matching screenshot style */}
        <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
          {personData.profilePicture ? (
            <img 
              src={personData.profilePicture} 
              alt={personData.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <User className={`w-6 h-6 text-white/60 ${personData.profilePicture ? 'hidden' : 'block'}`} />
        </div>
        
        {/* Person Info - matching screenshot layout */}
        <div className="flex-1 min-w-0">
          {/* Name and Type Badge */}
          <div className="flex items-center gap-2 mb-1">
            <span className="text-white font-medium text-sm truncate" title={personData.name}>
              {personData.name}
            </span>
            {personData.type && (
              <span className={`text-xs px-1 py-0.5 rounded-full flex-shrink-0 ${
                personData.type === 'LTV' ? 'bg-red-600/20 text-red-300' : 'bg-blue-500/20 text-blue-300'
              }`}>
                {personData.type === 'LTV' ? 'LTV' : 'E'}
              </span>
            )}
          </div>
          
          {/* Role/Position */}
          {showRole && (personData.role || personData.position) && (
            <div className="text-xs text-white/80 mb-1 truncate" title={personData.role || personData.position}>
              {personData.role || personData.position}
            </div>
          )}
          
          {/* Department */}
          {showDepartment && personData.department && (
            <div className="text-xs text-white/60 mb-1 truncate">
              {personData.department} Department
            </div>
          )}
          
          {/* Email */}
          {personData.email && (
            <div className="text-xs text-white/60 mb-1 truncate" title={personData.email}>
              {personData.email}
            </div>
          )}
          
          {/* Special Skills */}
          {personData.specialSkills && personData.specialSkills.length > 0 && (
            <div className="text-xs mb-1">
              <span className="text-white/50 font-medium">Skills: </span>
              <span className="text-white/70" title={personData.specialSkills.join(', ')}>
                {personData.specialSkills.slice(0, 2).join(', ')}
                {personData.specialSkills.length > 2 && ` +${personData.specialSkills.length - 2} more`}
              </span>
            </div>
          )}
          
          {/* Languages */}
          {personData.languages && personData.languages.length > 0 && (
            <div className="text-xs">
              <span className="text-white/50 font-medium">Languages: </span>
              <span className="text-white/70" title={personData.languages.join(', ')}>
                {personData.languages.join(', ')}
              </span>
            </div>
          )}
        </div>

        {/* LinkedIn Link */}
        {personData.linkedin && (
          <a 
            href={personData.linkedin} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-white/60 hover:text-white transition-colors flex-shrink-0"
            title="View LinkedIn Profile"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        )}
      </div>
    </div>
  );
}
