import React from 'react';

/**
 * Highlights matching text within a string
 * @param {string} text - The text to search within
 * @param {string} searchTerm - The term to highlight
 * @param {string} highlightClass - CSS class for highlighted text
 * @returns {JSX.Element} - Text with highlighted matches
 */
export const highlightText = (text, searchTerm, highlightClass = "bg-yellow-400/30 text-yellow-200 px-1 rounded") => {
  if (!searchTerm || !text) return text;

  try {
    const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);

    return (
      <span>
        {parts.map((part, index) => {
          const isMatch = regex.test(part);
          // Reset regex lastIndex to avoid issues with global flag
          regex.lastIndex = 0;
          
          return isMatch ? (
            <span key={index} className={highlightClass}>
              {part}
            </span>
          ) : (
            <span key={index}>{part}</span>
          );
        })}
      </span>
    );
  } catch (error) {
    console.error('Error in highlightText:', error);
    return text;
  }
};

/**
 * Highlights matching text in search results
 * @param {string} text - The text to highlight
 * @param {string} searchTerm - The search term
 * @returns {JSX.Element} - Highlighted text component
 */
export const HighlightedText = ({ text, searchTerm, className = "" }) => {
  if (!searchTerm || !text) {
    return <span className={className}>{text}</span>;
  }

  try {
    const highlightClass = "bg-yellow-400/40 text-yellow-100 px-0.5 rounded-sm font-medium";
    
    // Simple approach: case-insensitive replacement
    const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    
    return (
      <span className={className}>
        {parts.map((part, index) => {
          if (part.toLowerCase() === searchTerm.toLowerCase()) {
            return (
              <span key={index} className={highlightClass}>
                {part}
              </span>
            );
          }
          return part;
        })}
      </span>
    );
  } catch (error) {
    console.error('Error in HighlightedText:', error);
    return <span className={className}>{text}</span>;
  }
};
